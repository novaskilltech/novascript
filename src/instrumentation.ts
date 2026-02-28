/**
 * Next.js Instrumentation Hook
 * Runs once at server startup — installs the log sanitizer
 * so no sensitive data (API keys, tokens, JWTs) leaks in console logs.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation
 */
export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { installSanitizingLogger } = await import('@/lib/logSanitizer');
        installSanitizingLogger();
    }
}
