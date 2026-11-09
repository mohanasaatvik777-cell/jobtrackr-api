import { Router } from 'express'
import { callLLM } from '../services/llm.js'
import { loadPrompt } from '../services/prompts.js'
import { validateText, validateTone } from '../utils/validate.js'
import { protect } from '../middleware/auth.js'
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
        res.json({ rewritten: result.text })
    } catch (err) {
        console.log(err)
        return res.status(502).json({ error: "AI service failed, try again" })
    }

})
export default router