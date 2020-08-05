import React, { useContext } from 'react';
import LexerContext from './LexerContext';
import { LexerState, Lexer } from 'moo';
import Line from './Line';
import {
    isTypeAnnotation,
    getAnnotationType,
    AnnotationType,
} from '../utils/annotations';
import Text from './CodeParts/Text';
import Empty from './CodeParts/Empty';
import KeepAnnotation from './CodeParts/KeepAnnotation';
import MarkAnnotation from './CodeParts/MarkAnnotation';

type Props = {
    codeLines: string[];
    lineStart: number;
    showLineNumbers?: boolean;
};

export default function Code({ codeLines, lineStart, showLineNumbers }: Props) {
    const lexer = useContext(LexerContext) as Lexer;

    // This could be turned into a reduce to keep all the reduce state internal.
    let lexerState: LexerState = { ...lexer.reset().save(), line: lineStart };

    const codeComponents = codeLines.map(codeLine => {
        const currentLine = lexerState.line;
        let shouldSkipLine = false;

        const tokens = Array.from(
            lexer.reset(`${codeLine}\n`, lexerState),
            ({ type, text, value, col, line }) => {
                // === Handle undefined tokens ===
                if (type === undefined) {
                    throw new TypeError(
                        `Lexer Error: Type of token "${value}" (line ${line}, col ${col}) is undefined!`,
                    );
                }

                // === Handle lexour annotations ===
                if (isTypeAnnotation(type)) {
                    const annotationType = getAnnotationType(value);

                    switch (annotationType) {
                        case AnnotationType.KEEP:
                            return <KeepAnnotation key={col} text={text} />;

                        case AnnotationType.NEXT_LINE:
                            lexerState.line = 5;
                            break;

                        case AnnotationType.MARK:
                            return <MarkAnnotation key={col} value={value} />;

                        default:
                            shouldSkipLine = true;
                            return null;
                    }
                }

                // === Handle empty lines ===
                if (type === 'EMPTYLINE') {
                    // This is kind of a hacky solution, but it'll work for now
                    return <Empty key={col} />;
                }

                return <Text key={col} value={value} type={type} />;
            },
        );

        lexerState = lexer.save();

        if (shouldSkipLine) {
            lexerState.line = currentLine;
            return null;
        }

        return (
            <Line
                lineNumber={showLineNumbers ? currentLine : 0}
                key={currentLine}
            >
                {tokens}
            </Line>
        );
    });

    return <>{codeComponents}</>;
}
