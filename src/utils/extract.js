export function extractchecker(modeltext) {
    let parsed;
    try {
        parsed = JSON.parse(modeltext)
    } catch {
        return null
    }

    if (parsed === null || Array.isArray(parsed) || typeof parsed !== 'object') {
        return null
    }
    const each_field = ["company", "role", "location", "salaryRange"]
    for (let i = 0; i < each_field.length; i++) {
        const value = parsed[each_field[i]]
        if (value !== undefined && value !== null && typeof value !== 'string') {
            return null
        }

    }
    const minYears = parsed.minYears
    if (minYears !== undefined && minYears !== null && typeof minYears !== 'number') {
        return null
    }
    const skills = parsed.skills;
    if (skills !== undefined && skills !== null) {
        if (!Array.isArray(skills)) {
            return null;
        }
        for (const item of skills) {
            if (typeof item !== 'string') {
                return null;
            }
        }
    }

    return {
        company: parsed.company !== undefined ? parsed.company : null,
        role: parsed.role !== undefined ? parsed.role : null,
        location: parsed.location !== undefined ? parsed.location : null,
        salaryRange: parsed.salaryRange !== undefined ? parsed.salaryRange : null,
        minYears: parsed.minYears !== undefined ? parsed.minYears : null,
        skills: Array.isArray(parsed.skills) ? parsed.skills : []
    };
}