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
    lineNumberStart = 0,
}: Props) {
    const lexer = lexers[lang];
    // Type of theme will be expanded to be either a string for the built-in
    // themes, or a JSON object of the same format.
    const themeObj = typeof theme === 'string' ? themes[theme] : theme;
    const line = lineNumberStart < 1 ? 0 : Math.floor(lineNumberStart);

    //There may be a better way to split this to include the new line and not pass it in by force later.
    const codeLines = code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');
    // This could be turned into a reduce to keep all the reduce state internal.
    let lexerState = { ...lexer.reset().save(), line };
    const codeComponents = codeLines.map(codeLine => {
        const currentLineNum = lexer.save().line;
        const tokens = Array.from(
            lexer.reset(codeLine.concat('\n'), lexerState),
            token => {
                return (
                    <Token
                        type={token.type}
                        value={token.value}
                        theme={themeObj.styles}
                        key={token.col}
                    />
                );
            },
        );

        lexerState = { ...lexer.save(), line: currentLineNum + 1, col: 1 };

        return (
            <Line lineNumber={line ? currentLineNum : 0} key={currentLineNum}>
                {tokens}
            </Line>
        );
    });

    return (
        <div>
            <pre style={{ margin: 0, ...themeObj.default }}>
                {codeComponents}
            </pre>
        </div>
    );
}
