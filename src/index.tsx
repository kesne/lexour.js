import React from 'react';
import lexers from './lexers';
import { Props } from './types';
import Line from './components/Line';
import { LexerState } from 'moo';
import Token from './components/Token';

export default function CodeBlock({
    code,
    lang,
    theme = {},
    includeLineNumbers = false,
    lineNumberStart = 1,
}: Props) {
    const lexer = lexers[lang];
    const codeLines = code.replace(/(?:^\n)|(?:\n$)/g, '').split('\n');

    // This could be turned into a reduce instead of a map to remove this let
    // and keep all the reduce state internal.
    let lexerState = lexer.reset().save();
    const codeComponents = codeLines.map(codeLine => {
        const tokens = Array.from(lexer.reset(codeLine, lexerState), token => (
            <Token data={token} key={`${token.line}-${token.col}`} />
        ));

        // NEXT LINE annotation can be implemented by checking tokens at this point.
        lexerState = { ...lexer.save(), line: lexerState.line + 1, col: 1 };

        return <Line>{tokens}</Line>;
    });

    return (
        <div style={{ background: 'gray' }}>
            <pre>{codeComponents}</pre>
        </div>
    );
}
