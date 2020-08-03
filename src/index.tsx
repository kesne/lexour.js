import React from 'react';

import { Props } from './types';
import lexers from './lexers';
import themes from './themes';
import Line from './components/Line';
import Token from './components/Token';

export default function CodeBlock({
    code,
    lang,
    theme = 'oneDarkPro',
    firstLine = 0,
}: Props) {
    const lexer = lexers[lang];
    // Type of theme will be expanded to be either a string for the built-in
    // themes, or a JSON object of the same format.
    const themeObj = typeof theme === 'string' ? themes[theme] : theme;
    const shouldRenderLineNumbers = firstLine >= 1;
    const lineStart = shouldRenderLineNumbers ? Math.floor(firstLine) : 1;

    // There may be a better way to split this to include the new line and not pass it in by force later.
    const codeLines = code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');
    // This could be turned into a reduce to keep all the reduce state internal.
    let lexerState = { ...lexer.reset().save(), line: lineStart };
    const codeComponents = codeLines.map(codeLine => {
        const tokens = Array.from(
            lexer.reset(codeLine.concat('\n'), lexerState),
            ({ type, value, text, col }) => {
                if (type === 'NEWLINE' || !type) {
                    return null;
                }
                const primaryType = type.replace(/(?<=^_?[A-Z]+)_.+/, '');
                // @ts-ignore FIX ME LATER
                const styles = themeObj.tokens[primaryType] || undefined;
                return (
                    <Token type={type} value={value} style={styles} key={col} />
                );
            },
        );

        const currentLine = lexerState.line;
        lexerState = { ...lexer.save() };
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
