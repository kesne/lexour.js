import moo from 'moo';

const STRING_escapes = {
    STRING_unicodeEscape: /\\u[a-fA-F0-9]{4}/,
    STRING_characterEscape: /\\./,
};

export default moo.states({
    main: {
        _PACKAGE_ANNOTATION_fullline: /\/\/\@.*?$/,
        _PACKAGE_ANNOTATION_inline: /\/\*\@.*?\@\*\//,

        // [^]+? is "don't match no characters" - double check that this isn't an antipattern
        // Something to this effect is needed to capture linebreaks within the comment
        COMMENT_multiline: { match: /\/\*[^]+?\*\//, lineBreaks: true },
        COMMENT_singleline: /\/\/.*?$/,

        // Strings could and should probably be collapsed to one state entry with positive lookback
        STRING_SINGLE_start: { match: "'", push: 'stringSingle' },
        STRING_DOUBLE_start: { match: '"', push: 'stringDouble' },

        // Template literal has additional rules
        TEMPL_LITERAL_start: { match: /\`.*?\`/, push: 'templateLiteral' },

        LEFT_BRACE: { match: '{', push: 'main' },
        RIGHT_BRACE: { match: '}', pop: 1 },

        LINE_BREAK: { match: /\n/, lineBreaks: true },
        INDENTATION: /^[ \t]+/,

        // This should be unnecessary now, but keep an eye for anything that matches it.
        WHITESPACE: /[ \t]+/,
    },
    stringSingle: {
        ...STRING_escapes,
        STRING_SINGLE_end: { match: "'", pop: 1 },
        STRING_SINGLE_content: /[^'\n]+/,
    },
    stringDouble: {
        ...STRING_escapes,
        STRING_DOUBLE_end: { match: '"', pop: 1 },
        STRING_DOUBLE_content: /[^"\n]+/,
    },
    templateLiteral: {
        ...STRING_escapes,
        TEMP_LITERAL_end: { match: '`', pop: 1 },
        TEMP_LITERAL_interpolation_start: { match: '${', push: 'main' },
        LINE_BREAK: { match: /\n/, lineBreaks: true },
        WHITESPACE: /[ \t]+/,
    },
});
