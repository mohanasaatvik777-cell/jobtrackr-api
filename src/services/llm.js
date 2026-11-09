import { Groq } from 'groq-sdk';
import "dotenv/config"


export async function callLLM(system, user, temperature) {
    const client = new Groq({ apiKey: process.env.LLM_API_KEY })
    const starttime = new Date()
    const completion = await client.chat.completions.create({
        model: process.env.LLM_MODEL,
        temperature: temperature,
        max_completion_tokens: 500,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],

    })
    const ms = Date.now() - starttime
    return {
        text: completion.choices[0].message.content,
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        ms: ms
    }
}

