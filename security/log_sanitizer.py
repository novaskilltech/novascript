# log_sanitizer.py
import logging
import re
from typing import Pattern, List, Tuple

REPLACEMENT = "[REDACTED]"

DEFAULT_RULES: List[Tuple[str, Pattern[str]]] = [
    # Authorization headers (Bearer, Basic, Token)
    ("auth_header", re.compile(r"(?i)(authorization\s*:\s*)(bearer|basic|token)\s+([^\s,;]+)")),
    # Common key/value patterns
    ("api_key_kv", re.compile(r"(?i)\b(api[_-]?key|token|secret|password|passwd|pwd)\b\s*[:=]\s*([\"']?)([^\"'\s]{8,})(\2)")),
    # URL query params
    ("api_key_qs", re.compile(r"(?i)([?&](api[_-]?key|token|access[_-]?token|secret)=)([^&\s]+)")),
    # JWT-like strings (very common in logs)
    ("jwt", re.compile(r"\beyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}\b")),
]

def sanitize_text(text: str, rules=DEFAULT_RULES) -> str:
    if not text:
        return text

    out = text

    # Authorization header: keep scheme, redact credential
    out = DEFAULT_RULES[0][1].sub(lambda m: f"{m.group(1)}{m.group(2)} {REPLACEMENT}", out)

    # key=value (keep key, redact value)
    out = DEFAULT_RULES[1][1].sub(lambda m: f"{m.group(1)}: {REPLACEMENT}", out)

    # query string: keep param name, redact value
    out = DEFAULT_RULES[2][1].sub(lambda m: f"{m.group(1)}{REPLACEMENT}", out)

    # jwt: fully redact
    out = DEFAULT_RULES[3][1].sub(REPLACEMENT, out)

    return out

class SanitizingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        msg = super().format(record)
        return sanitize_text(msg)

def install_sanitizing_formatter(logger_name: str = "", level=logging.INFO) -> None:
    """
    Installs sanitizer on root logger by default.
    """
    logger = logging.getLogger(logger_name)
    logger.setLevel(level)

    for handler in logger.handlers:
        fmt = handler.formatter or logging.Formatter("%(asctime)s %(levelname)s %(name)s %(message)s")
        handler.setFormatter(SanitizingFormatter(fmt._fmt))

# Example usage:
# import logging
# from log_sanitizer import install_sanitizing_formatter
# logging.basicConfig(level=logging.INFO)
# install_sanitizing_formatter()
# logging.info("Authorization: Bearer abcdef123456")
