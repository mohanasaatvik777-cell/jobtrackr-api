import { Groq } from 'groq-sdk';
import "dotenv/config"


export async function callLLM(system, user, temperature, jsonMode = false) {
    const client = new Groq({ apiKey: process.env.LLM_API_KEY })
    const starttime = new Date()
    const options = {
        model: process.env.LLM_MODEL,
        temperature: temperature,
        max_completion_tokens: 500,
        messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
        ],
    }
    if (jsonMode === true) {
        options.response_format = { type: 'json_object' }
    }
    const completion = await client.chat.completions.create(options)
    const ms = Date.now() - starttime
    return {
        text: completion.choices[0].message.content,
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        ms: ms
    }
}
export async function callChat(system, arraymsg, temperature, max_output_tokens) {
    const client = new Groq({ apiKey: process.env.LLM_API_KEY })
    const starttime = new Date()
    const options = {
        model: process.env.LLM_MODEL,
        temperature: temperature,
        max_completion_tokens: max_output_tokens,
        messages: [
            { role: 'system', content: system },
            ...arraymsg
        ],
    }

    const completion = await client.chat.completions.create(options)
    const ms = Date() - starttime
    return {
        text: completion.choices[0].message.content,
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        ms: ms
    }
}
