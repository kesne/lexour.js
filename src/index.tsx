import React from 'react';

import { Props } from './types';
import lexers from './lexers';
import themes from './themes';
import Line from './components/Line';
import { LexerState } from 'moo';

export default function CodeBlock({
    code,
    lang,
    theme = 'oneDarkPro',
    firstLine = 0,
}: Props) {
    const lexer = typeof lang === 'string' ? lexers[lang] : lang;
    const themeObj = typeof theme === 'string' ? themes[theme] : theme;
    const shouldRenderLineNumbers = firstLine >= 1;
    const lineStart = shouldRenderLineNumbers ? Math.floor(firstLine) : 1;

    // There may be a better way to split this to include the new line and not pass it in by force later.
    const codeLines = code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');
    // This could be turned into a reduce to keep all the reduce state internal.
    let lexerState: LexerState = { ...lexer.reset().save(), line: lineStart };
    const codeComponents = codeLines.map(codeLine => {
        const currentLine = lexerState.line;
        let shouldSkipLine = false;

        const tokens = Array.from(
            lexer.reset(codeLine.concat('\n'), lexerState),
            ({ type, text, value, col, line }) => {
                // === Handle undefined tokens ===
                if (type === undefined) {
                    throw new TypeError(
                        `Lexer Error: Type of token "${value}" (line ${line}, col ${col}) is undefined!`,
                    );
                }
                // === Handle lexour annotations ===
                if (type.startsWith('_')) {
                    if (/^KEEP[ \t]/.test(value)) {
                        const style = themeObj.tokens
                            ? themeObj.tokens['COMMENT']
                            : undefined;
                        return (
                            <span style={style} key={col}>
                                {text.replace('KEEP ', '')}
                            </span>
                        );
                    }
                    if (/^NEXT LINE[ \t]/.test(value)) {
                        lexerState.line = 5;
                    }
                    if (/^MARK .*? AS .*?$/.test(value)) {
                        const match: any = /^MARK (.*?) AS (.*?)(?=[ \t]*@\*\/)?$/.exec(
                            value,
                        );
                        //@ts-ignore
                        const style = themeObj.tokens[match[2].toUpperCase()];
                        return (
                            <span style={style} key={col}>
                                {match[1]}
                            </span>
                        );
                    }
                    shouldSkipLine = true;
                    return null;
                }
                // === Handle empty lines ===
                if (type === 'EMPTYLINE') {
                    // This is kind of a hacky solution, but it'll work for now
                    return <span key={col}> </span>;
                }

                // === Handle all other token types ===
                const primaryType = type.replace(/(?<=^_?[A-Z]+)_.+/, '');
                // @ts-ignore Will fix when token names and style fetch is reworked
                const style = themeObj.tokens[primaryType];
                return (
                    <span style={style} key={col}>
                        {value}
                    </span>
                );
            },
        );

        lexerState = lexer.save();

        if (shouldSkipLine) {
            lexerState.line = currentLine;
            return null;
        }
        return (
            <Line
                lineNumber={shouldRenderLineNumbers ? currentLine : 0}
                style={themeObj.lineNumbers}
                key={currentLine}
            >
                {tokens}
            </Line>
        );
    });

    // Style override (should I do this?) + default styles
    return (
        <pre style={{ margin: 0, ...themeObj.default }}>{codeComponents}</pre>
    );
}
