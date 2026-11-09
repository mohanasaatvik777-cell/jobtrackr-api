export const MAX_CHARS = 6000;
export const TONES = ['formal', 'confident', 'concise'];

// Returns an error message string if the value is bad, or null if it is fine.
export function validateText(value, fieldName) {
    if (typeof value !== "string") {
        return `${fieldName} must be a string`
    }
    if (value.trim() === "") {
        return `${fieldName} is required`
    }
    if (value.length > MAX_CHARS) {
        return "The maximum is 6,000 characters"
    }
    return null
}

export function validateTone(tone) {
    if (!TONES.includes(tone)) {
        return "List the allowed tones in formal, confident or casual"

    }
    return null
}