import moo from 'moo';
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar

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
        ],
        CONSTANT_declarationName: /(?<=const[\[\{\t, _$A-Za-z]+?)[_$A-Za-z](?:[_$A-Za-z0-9]+)?/,
        VARIABLE_declarationName: /(?<=(?:let|var)[\[\{\t, _$A-Za-z]+?)[_$A-Za-z](?:[_$A-Za-z0-9]+)?/,
        KEYWORD_declare_function: {
            match: /function\*?/,
            push: 'declareFunction',
        },
        KEYWORD_declare_class: {
            match: 'class',
            push: 'declareClass',
        },
        BOOLISH: ['null', 'undefined', 'true', 'false'],
        CONSTANT_this: 'this',

        // FUNCTION_declarationArrow: /[_$A-Za-z][_$A-Za-z0-9]*(?=[ \t]*?\=[ \t]*?\(.*?\)[ \t]/,
        VARIABLE_unknown: /[_$A-Za-z][_$A-Za-z0-9]*/,
        FUNCTION_unknown: /[_$A-Za-z][_$A-Za-z0-9]*(?=[ \t]*\(.*?)/,
        NUMBER: /[\d]+(?:\.[\d]+)?/,
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

    // all declare states can be integrated into main with a lookback
    declareFunction: {
        WHITESPACE: /[ \t]+/,
        FUNCTION_name: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
    // TO DO
    declareClass: {
        WHITESPACE: /[ \t]+/,
        CONSTANT_classname: { match: /[_$A-Za-z][_$A-Za-z0-9]+/, pop: 1 },
    },
});
