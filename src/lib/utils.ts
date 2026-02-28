/**
 * Extract variable names from a prompt template.
 * Variables are enclosed in curly braces: {variableName}
 * Returns unique variable names in order of first appearance.
 */
export function extractVariables(template: string): string[] {
    const regex = /\{(\w+)\}/g;
    const variables: string[] = [];
    const seen = new Set<string>();
    let match;

    while ((match = regex.exec(template)) !== null) {
        const varName = match[1];
        if (!seen.has(varName)) {
            seen.add(varName);
            variables.push(varName);
        }
    }

    return variables;
}

/**
 * Replace variables in a prompt template with provided values.
 */
export function fillTemplate(
    template: string,
    variables: Record<string, string>
): string {
    return template.replace(/\{(\w+)\}/g, (match, varName) => {
        return variables[varName] !== undefined ? variables[varName] : match;
    });
}

/**
 * Format a date string for display.
 */
export function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Parse tags from JSON string safely.
 */
export function parseTags(tagsJson: string): string[] {
    try {
        const parsed = JSON.parse(tagsJson);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}
