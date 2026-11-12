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
    const ms = Date.now() - starttime
    return {
        text: completion.choices[0].message.content,
        inputTokens: completion.usage.prompt_tokens,
        outputTokens: completion.usage.completion_tokens,
        ms: ms
    }
}

const MAX_MESSAGES = 12
export async function callChatStream(system, arraymsg, temperature, max_output_tokens, signal) {
    const client = new Groq({ apiKey: process.env.LLM_API_KEY })
    let history = arraymsg.slice(-MAX_MESSAGES)
    while (history.length > 1 && history[0].role !== "user") {
        history = history.slice(1)
    }
    const options = {
        model: process.env.LLM_MODEL,
        temperature: temperature,
        max_completion_tokens: max_output_tokens,
        messages: [
            { role: 'system', content: system },
            ...history
        ],
        stream: true,
        stream_options: { include_usage: true }
    }
    const completion = await client.chat.completions.create(options, { signal })
    return completion
}

export async function summarizeMessages(previousSummary, oldMessages) {
    const transcript = oldMessages
        .map((m) => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.content}`)
        .join("\n")

    const system = `You are a text processing system. Summarize the mock interview transcript for the interviewer's memory.
Output exactly 3 bullet points, in this order:
- Topics covered: the questions already asked and the topics they cover
- Strengths: what the candidate answered well
- Weaknesses: what the candidate answered poorly or missed
Rules:
- Rely only on what is in the transcript. Do not assume or guess.
- If a category has nothing, write "Not mentioned".
- Merge the previous summary with the new transcript into one updated summary.
- Keep it under 150 words.
- Output only the 3 bullet points, with no introduction or closing remarks.`

    const user =
        `Previous summary:\n${previousSummary || "(none)"}\n\n` +
        `New transcript to add:\n${transcript}`

    return callLLM(system, user, 0.2)
}