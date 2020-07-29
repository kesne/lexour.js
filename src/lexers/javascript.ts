import moo from 'moo';

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
        PUNCTUATION_misc: /[\(\)\,\[\]\;]/,

        KEYWORD: [
            'if',
            'else',
            'for',
            'while',
            'do',
            'export',
            'default',
            'return',
        ],
        KEYWORD_vardec_constant: { match: 'const', push: 'vardecConstant' },
        KEYWORD_vardec_variable: {
            match: ['let', 'var'],
            push: 'vardecVariable',
        },
        KEYWORD_vardec_function: {
            match: /function\*?/,
            push: 'vardecFunction',
        },
        BOOLISH: ['null', 'undefined', 'true', 'false'],

        VARIABLE_unknown: /[_$A-Za-z][_$A-Za-z0-9]*/,
        NUMBER: /[\d\.]+?/,
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
    // This works for now, but does create some unnecessary token breaks
    // (but non-noticeable/problematic breaks)
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
    vardecConstant: {
        WHITESPACE: /[ \t]+/,
        // This is potentially not the best strategy
        PUNCTUATION_destructuringStart: ['{', '['],
        CONSTANT_name: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
    vardecVariable: {
        WHITESPACE: /[ \t]+/,
        // This is (again) potentially not the best strategy
        PUNCTUATION_destructuringStart: ['{', '['],
        VARIABLE_name: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
    vardecFunction: {
        WHITESPACE: /[ \t]+/,
        FUNCTION_name: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
});
