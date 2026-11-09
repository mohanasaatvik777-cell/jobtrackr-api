import { callLLM } from './src/services/llm.js'
const result = await callLLM("Do the actions that are told by the user", "say hello in 5 words", 0)
console.log(result)
