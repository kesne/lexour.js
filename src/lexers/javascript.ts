import moo from 'moo';

// Strings being able to split over lines is going to take some tricks
const STRING_escapes = {
    STRINGESCAPE_unicode: /\\u[a-fA-F0-9]{4}/,
    STRINGESCAPE_character: /\\./,
};

export default moo.states({
    main: {
        _PACKAGE_ANNOTATION_fullline: /\/\/\@.*?$/,
        _PACKAGE_ANNOTATION_inline: /\/\*\@.*?\@\*\//,

        COMMENT_block: { match: /\/\*/, push: 'commentBlock' },
        COMMENT_singleline: /\/\/.*?$/,

        // Strings could probably be collapsed to one state entry with regex lookback
        STRING_singleStart: { match: "'", push: 'stringSingle' },
        STRING_doubleStart: { match: '"', push: 'stringDouble' },

        TEMPLATELITERAL_start: { match: /\`.*?\`/, push: 'templateLiteral' },

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
        VARIABLE_unknown: /[_$A-Za-z][_$A-Za-z0-9]*/,

        NUMBER: /[\d\.]+?/,
        BOOLISH: ['null', 'undefined', 'true', 'false'],
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
        ],
        ARROWFUNCTION: '=>',

        WHITESPACE: /[ \t]+/,
        NEWLINE: { match: /\n/, lineBreaks: true },
        INDENTATION: /^[ \t]+/,
    },
    commentBlock: {
        COMMENT_block_end: { match: /\*\//, pop: 1 },
        INDENTATION: /^[ \t]+/,
        NEWLINE: { match: /\n/, lineBreaks: true },
        COMMENT_content: /.+/,
    },
    // Strings use greedy quantifiers, try another strategy in the future
    stringSingle: {
        ...STRING_escapes,
        STRING_singleEnd: { match: "'", pop: 1 },
        STRING_singleContent: /[^'\n]+/,
    },
    stringDouble: {
        ...STRING_escapes,
        STRING_doubleEnd: { match: '"', pop: 1 },
        STRING_doubleContent: /[^"\n]+/,
    },
    templateLiteral: {
        ...STRING_escapes,
        TEMP_LITERAL_end: { match: '`', pop: 1 },
        TEMP_LITERAL_interpolation_start: { match: '${', push: 'main' },
        NEWLINE: { match: /\n/, lineBreaks: true },
        WHITESPACE: /[ \t]+/,
    },
    vardecConstant: {
        WHITESPACE: /[ \t]+/,
        // This is potentially not the best strategy
        PUNCTUATION_destructuringStart: ['{', '['],
        CONSTANT_name: { match: /[_$A-Za-z][_$A-Za-z0-9]*/, pop: 1 },
    },
    vardecVariable: {
        WHITESPACE: /[ \t]+/,
        // This is (again) potentially not the best strategy
        PUNCTUATION_destructuringStart: ['{', '['],
        VARIABLE_name: { match: /[_$A-Za-z][_$A-Za-z0-9]*/, pop: 1 },
    },
    vardecFunction: {
        WHITESPACE: /[ \t]+/,
        FUNCTION_name: { match: /[_$A-Za-z][_$A-Za-z0-9]*/, pop: 1 },
    },
});
