export enum AnnotationType {
	UNKNOWN,
    KEEP,
    NEXT_LINE,
    MARK,
}

export function isTypeAnnotation(type: string) {
    return type.startsWith('LEXOUR_');
}

export function getAnnotationType(value: string) {
    if (/^KEEP[ \t]/.test(value)) {
        return AnnotationType.KEEP;
    }
    if (/^NEXT LINE[ \t]/.test(value)) {
        return AnnotationType.NEXT_LINE;
    }
    if (/^MARK .*? AS .*?$/.test(value)) {
        return AnnotationType.MARK;
	}

	return AnnotationType.UNKNOWN;
}
