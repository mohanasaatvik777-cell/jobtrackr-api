import AiUsage from '../models/AiUsage.js'
import 'dotenv/config'
export async function logUsage(userId, endpoint, result) {
    try {
        const input = Number(process.env.LLM_PRICE_INPUT_PER_M)
        const output = Number(process.env.LLM_PRICE_OUTPUT_PER_M)
        const price = (result.inputTokens / 1000000) * input + (result.outputTokens / 1000000) * output
        await AiUsage.create({
            user: userId,
            endpoint,
            model: process.env.LLM_MODEL,
            inputTokens: result.inputTokens,
            outputTokens: result.outputTokens,
            ms: result.ms,
            cost: price
        })

    } catch (err) {
        console.log(err)

    }
}