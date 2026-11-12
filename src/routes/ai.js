import { Router } from 'express'
import { callLLM } from '../services/llm.js'
import { loadPrompt } from '../services/prompts.js'
import { validateText, validateTone } from '../utils/validate.js'
import { protect } from '../middleware/auth.js'
import { extractchecker } from '../utils/extract.js'
import { logUsage } from '../services/usage.js'
import AiUsage from '../models/AiUsage.js'
import mongoose from 'mongoose'

const router = Router()

router.use(protect)
router.post("/summarize", async (req, res) => {
    const { jobDescription } = req.body
    const result = validateText(jobDescription, "jobDescription")
    if (result !== null) {
        return res.status(400).json({ error: result })
    }
    try {
        const system_prompt = await loadPrompt("summarize.system.txt")
        const response = await callLLM(system_prompt, jobDescription, 0)
        await logUsage(req.user.id, "summarize", response)
        res.json({ summary: response.text })

    } catch (err) {
        console.log(err)
        return res.status(502).json({ error: "AI service failed, try again" })

    }
})
router.post("/rewrite", async (req, res) => {
    const { text, tone } = req.body
    const text_result = validateText(text, "text")
    const tone_result = validateTone(tone)
    const error = text_result ?? tone_result

    if (text_result !== null || tone_result !== null) {
        if (error !== null) {
            return res.status(400).json({ error })
        }
    }

    try {
        const system_prompt = await loadPrompt("rewrite.fewshot.system.txt")
        const user_message = `Tone: ${tone}\nLine: ${text}`
        const result = await callLLM(system_prompt, user_message, 0.7)
        await logUsage(req.user.id, "rewrite", result)
        res.json({ rewritten: result.text })
    } catch (err) {
        console.log(err)
        return res.status(502).json({ error: "AI service failed, try again" })
    }

})
router.post("/extract", async (req, res) => {
    const { jobDescription } = req.body
    const job_res = validateText(jobDescription, "jobDescription")
    if (job_res !== null) {
        return res.status(400).json({ error: job_res })
    }
    try {
        const system_prompt = await loadPrompt("extract.system.txt")
        for (let i = 1; i <= 2; i++) {
            const result = await callLLM(system_prompt, jobDescription, 0, true)
            const final_result = extractchecker(result.text)
            if (typeof final_result === "object") {
                return res.status(200).json(final_result)
            }
        }
        await logUsage(req.user.id, "extract", result)
        return res.status(502).json({ error: "The AI returned invalid data. Please try again" })


    } catch (err) {
        console.log(err)
        return res.status(502).json({ error: "AI service failed, try again" })
    }
})
router.get("/usage", async (req, res) => {
    try {
        const startdate = new Date()
        startdate.setHours(0, 0, 0, 0)
        const records = await AiUsage.find({
            user: req.user.id,
            createdAt: mongoose.trusted({ $gte: startdate })
        })
        let total_amount = 0;
        let total_input_tokens = 0;
        let total_output_tokens = 0;
        for (let i = 0; i < records.length; i++) {
            total_amount += records[i].cost;
            total_input_tokens += records[i].inputTokens;
            total_output_tokens += records[i].outputTokens;

        }
        res.json({
            date: new Date().toLocaleDateString('en-CA'),
            calls: records.length,
            inputTokens: total_input_tokens,
            outputTokens: total_output_tokens,
            totalTokens: total_input_tokens + total_output_tokens,
            cost: Number(total_amount.toFixed(6)),
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Could not load usage" })
    }


})
export default router