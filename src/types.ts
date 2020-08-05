import { Lexer } from 'moo';
import { CSSProperties } from 'react';

type BuiltInTheme = 'oneDarkPro';
export interface ThemeObject {
    default: CSSProperties;
    lineNumbers?: CSSProperties;
    tokens?: {
        [tokenName: string]: CSSProperties;
    };
}
export type Theme = BuiltInTheme | ThemeObject;

type BuiltInLang =
    | 'javascript'
    | 'js' /* | 'typescript' | 'ts' | 'jsx' | 'tsx'*/;
export type Lang = BuiltInLang | Lexer;

export type Props = {
    code: string;
    lang: Lang;

    theme?: Theme;
    firstLine?: number;
    showLineNumbers?: boolean;
};
