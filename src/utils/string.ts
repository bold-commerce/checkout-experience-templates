export function isNonEmptyString(input: unknown): boolean {
    return typeof nonEmptyStringOrNull(input) === 'string';
}

export function nonEmptyStringOrNull(input: unknown): string|null {
    if (typeof input === 'string') {
        if (input.trim().length > 0) {
            return input.trim();
        }
    }
    return null;
}
