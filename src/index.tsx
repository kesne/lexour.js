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
    includeLineNumbers = false,
    lineNumberStart = 1,
}: Props) {
    const lexer = lexers[lang];
    const themeObj = typeof theme === 'string' ? themes[theme] : theme;

    //There may be a better way to split this to include the new line and not pass it in by force later.
    const codeLines = code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');

    // This could be turned into a reduce to keep all the reduce state internal.
    let lexerState = lexer.reset().save();
    const codeComponents = codeLines.map(codeLine => {
        const tokens = Array.from(
            lexer.reset(`${codeLine}\n`, lexerState),
            token => (
                <Token
                    type={token.type || ''}
                    value={token.value}
                    theme={themeObj.styles}
                    key={`${token.line}-${token.col}`}
                />
            ),
        );

        // NEXT LINE annotation can be implemented here by checking tokens at this point.
        lexerState = { ...lexer.save(), line: lexerState.line + 1, col: 1 };

        return <Line key={lexerState.line - 1}>{tokens}</Line>;
    });

    return (
        <div>
            <pre style={{ margin: 0, ...themeObj.default }}>
                {codeComponents}
            </pre>
        </div>
    );
}
