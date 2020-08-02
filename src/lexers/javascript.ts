import moo from 'moo';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar

// This may not be exactly perfect, but it's sufficient for now.
const validIdentifier = '[_$A-Za-z][_$A-Za-z0-9]*';
// Strings being able to split over lines is going to take some tricks
const STRINGESCAPE = /(?:\\u[A-Fa-f0-9]{4})|(?:\\.)/;

export default moo.states({
    main: {
        _PACKAGE_ANNOTATION_fullline: {
            match: /\/\/@.*?$/,
            value: s => s.replace(/(?:^\/\/@[ \t]*?)|(?:[ \t]*?$)/g, ''),
        },
        _PACKAGE_ANNOTATION_inline: {
            // This isn't quite working
            match: /\/\*@.*?@\*\//,
            value: s => s.replace(/(?:^\/\*@[ \t]*?)|(?:[ \t]*?@\*\/$)/g, ''),
        },

        COMMENT_block: { match: /\/\*/, push: 'commentBlock' },
        COMMENT_singleline: /\/\/.*?$/,

        // Strings could probably be collapsed to one state entry with regex lookback
        STRING_start: { match: ["'", '"'], push: 'string' },

        TEMPLATELITERAL_start: { match: '`', push: 'templateLiteral' },

        PUNCTUATION_leftBrace: { match: '{', push: 'main' },
        PUNCTUATION_rightBrace: { match: '}', pop: 1 },
        PUNCTUATION_misc: /[\(\)\,\[\]\;\.]/,

        VARIABLE_declaration: new RegExp(
            '(?<=(?:let|var)[\\[{\\t, _$A-Za-z]+?)' + validIdentifier,
        ),
        FUNCTION_declaration: new RegExp(
            '(?<=function\\*?[\\t ]+?)' + validIdentifier,
        ),
        CONSTANT_declaration: new RegExp(
            '(?<=const[[{\\t, _$A-Za-z]+?)' + validIdentifier,
        ),
        CONSTANT_classDeclaration: new RegExp(
            '(?<=class\\*?[\\t ]+?)' + validIdentifier,
        ),
        CONSTANT_this: 'this',
        KEYWORD: [
            'if',
            'else',
            'for',
            'while',
            'do',
            'export',
            'default',
            'return',
            'constructor',
            'const',
            'let',
            'var',
            'function',
            'function*',
        ],
        BOOLISH: ['null', 'undefined', 'true', 'false'],
        NUMBER: /[\d]+(?:\.[\d]+)?/,

        // FUNCTION_declarationArrow: /[_$A-Za-z][_$A-Za-z0-9]*(?=[ \t]*?\=[ \t]*?\(.*?\)[ \t]/,
        VARIABLE_unknownRef: new RegExp(validIdentifier),
        FUNCTION_invocation: /[_$A-Za-z][_$A-Za-z0-9]*(?=[ \t]*\(.*?)/,
        OPERATOR: [
            // Math
            '+',
            '*',
            '/',
            '-',
            '%',

            // Assignment
            '=',
            '+=',
            '-=',
            '*=',
            '/=',
            '**=',
            '<<=',
            '>>=',
            '>>>=',
            '&=',
            '^=',
            '|=',
            '&&=',
            '||=',
            '??=',

            // Ternary (this may need some work)
            '?',
            ':',

            // Incr, decr
            '++',
            '--',

            // Logical
            '&&',
            '||',
            '==',
            '===',

            // Comparison
            '>=',
            '>',
            '<',
            '<=',
        ],
        ARROWFUNCTION: '=>',

        INDENTATION: /^[ \t]+/,
        WHITESPACE: /[ \t]+/,
        NEWLINE: { match: /\n/, lineBreaks: true },
    },
    commentBlock: {
        COMMENT_block_end: { match: /\*\//, pop: 1 },
        COMMENT_content: /.+?(?:(?=\*\/)|(?=\n))/,
        NEWLINE: { match: /\n/, lineBreaks: true },
        INDENTATION: /^[ \t]+/,
    },
    // This works for now, but does create some unnecessary token groups
    // (but non-noticeable/problematic groups)
    string: {
        STRINGESCAPE,
        STRING_content: /(?:[^\\]+?(?="|\\))|(?:[^\\]+?(?='|\\))/,
        STRING_end: { match: /(?:(?<=".+?)")|(?:(?<='.+?)')/, pop: 1 },
    },
    templateLiteral: {
        STRINGESCAPE,
        TEMP_LITERAL_end: { match: '`', pop: 1 },
        TEMP_LITERAL_interpolation_start: { match: '${', push: 'main' },
        NEWLINE: { match: /\n/, lineBreaks: true },
        WHITESPACE: /[ \t]+/,
    },

    // all declare states can be integrated into main with a lookback
    // TO DO
    declareClass: {
        WHITESPACE: /[ \t]+/,
        CONSTANT_classname: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
});
