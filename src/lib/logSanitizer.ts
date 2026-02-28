/**
 * logSanitizer.ts
 * Redacts sensitive values (API keys, tokens, passwords, JWTs) from log strings.
 * Port of log_sanitizer.py for the Next.js/Node.js runtime.
 */

const REPLACEMENT = '[REDACTED]';

interface SanitizeRule {
    name: string;
    pattern: RegExp;
    replace: (match: RegExpMatchArray) => string;
}

const DEFAULT_RULES: SanitizeRule[] = [
    // Authorization headers: keep scheme, redact credential
    {
        name: 'auth_header',
        pattern: /(authorization\s*:\s*)(bearer|basic|token)\s+([^\s,;]+)/gi,
        replace: (m) => `${m[1]}${m[2]} ${REPLACEMENT}`,
    },
    // key=value / key: value — keep key, redact value
    {
        name: 'api_key_kv',
        pattern: /\b(api[_-]?key|token|secret|password|passwd|pwd)\b\s*[:=]\s*(["']?)([^"'\s]{8,})\2/gi,
        replace: (m) => `${m[1]}: ${REPLACEMENT}`,
    },
    // URL query params: keep param name, redact value
    {
        name: 'api_key_qs',
        pattern: /([?&](api[_-]?key|token|access[_-]?token|secret)=)([^&\s]+)/gi,
        replace: (m) => `${m[1]}${REPLACEMENT}`,
    },
    // JWT-like strings: fully redact
    {
        name: 'jwt',
        pattern: /\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b/g,
        replace: () => REPLACEMENT,
    },
];

/**
 * Sanitizes a string by redacting sensitive patterns.
 */
export function sanitizeText(text: string, rules: SanitizeRule[] = DEFAULT_RULES): string {
    if (!text) return text;

    let out = text;
    for (const rule of rules) {
        // Reset lastIndex for global regexes
        rule.pattern.lastIndex = 0;
        out = out.replace(rule.pattern, (...args) => {
            // args: full match, ...groups, offset, string
            const groups = args.slice(0, -2);
            return rule.replace(groups as RegExpMatchArray);
        });
    }
    return out;
}

/**
 * Wraps console methods to sanitize output.
 * Call once at app startup (e.g., in next.config.ts instrumentation or middleware).
 */
export function installSanitizingLogger(): void {
    const methods = ['log', 'warn', 'error', 'info', 'debug'] as const;

    for (const method of methods) {
        const original = console[method].bind(console);
        (console[method] as (...args: unknown[]) => void) = (...args: unknown[]) => {
            const sanitized = args.map((arg) =>
                typeof arg === 'string' ? sanitizeText(arg) : arg
            );
            original(...sanitized);
        };
    }
}
