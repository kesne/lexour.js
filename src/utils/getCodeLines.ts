export default function getCodeLines(code: string): string[] {
    // There may be a better way to split this to include the new line and not pass it in by force later.
    return code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');
}
