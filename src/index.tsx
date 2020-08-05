import React, { useMemo } from 'react';

import { Props } from './types';
import lexers from './lexers';
import themes from './themes';
import { LexerState } from 'moo';
import getCodeLines from './utils/getCodeLines';
import LexerContext from './components/LexerContext';
import Code from './components/Code';
import ThemeContext from './components/ThemeContext';

export default function CodeBlock({
    code,
    lang,
    theme = 'oneDarkPro',
    firstLine = 1,
    showLineNumbers = false,
}: Props) {
    const lexer = typeof lang === 'string' ? lexers[lang] : lang;
    const themeObj = typeof theme === 'string' ? themes[theme] : theme;
    const lineStart = showLineNumbers ? firstLine : 1;

    const codeLines = useMemo(() => getCodeLines(code), [code]);

    // Style override (should I do this?) + default styles
    return (
        <ThemeContext.Provider value={themeObj}>
            <LexerContext.Provider value={lexer}>
                <pre style={{ margin: 0, ...themeObj.default }}>
                    <Code
                        codeLines={codeLines}
                        lineStart={lineStart}
                        showLineNumbers={showLineNumbers}
                    />
                </pre>
            </LexerContext.Provider>
        </ThemeContext.Provider>
    );
}
