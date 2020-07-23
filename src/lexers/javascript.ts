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

        // [^]+? is "don't match no characters" - double check that this isn't an antipattern
        // Something to this effect is needed to capture linebreaks within the comment
        COMMENT_block: { match: /\/\*/, push: 'commentBlock' },
        COMMENT_singleline: /\/\/.*?$/,

        // Strings could and should probably be collapsed to one state entry with regex lookback
        STRING_singleStart: { match: "'", push: 'stringSingle' },
        STRING_doubleStart: { match: '"', push: 'stringDouble' },

        // Template literal has additional rules
        TEMPLATELITERAL_start: { match: /\`.*?\`/, push: 'templateLiteral' },

        PUNCTUATION_leftBrace: { match: '{', push: 'main' },
        PUNCTUATION_rightBrace: { match: '}', pop: 1 },

        NEWLINE: { match: /\n/, lineBreaks: true },
        INDENTATION: /^[ \t]+/,
    },
    commentBlock: {
        COMMENT_block_end: { match: /\*\//, pop: 1 },
        INDENTATION: /^[ \t]+/,
        NEWLINE: { match: /\n/, lineBreaks: true },
        COMMENT_content: /.+/,
    },
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
});
