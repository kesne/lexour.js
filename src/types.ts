export interface Theme {}
export type Lang =
    | 'javascript'
    | 'js' /* | 'typescript' | 'ts' | 'jsx' | 'tsx'*/;

export type Props = {
    code: string;
    lang: Lang;

    theme?: Theme;

    includeLineNumbers?: boolean;
    lineNumberStart?: number;
};
