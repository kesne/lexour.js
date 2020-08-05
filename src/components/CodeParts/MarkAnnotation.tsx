import React, { useContext } from 'react';
import ThemeContext from '../ThemeContext';

export default function MarkAnnotation({ value }: { value: string }) {
    const theme = useContext(ThemeContext);
    const match: any = /^MARK (.*?) AS (.*?)(?=[ \t]*@\*\/)?$/.exec(value);
    // @ts-ignore
    const style = theme.tokens[match[2].toUpperCase()];
    return <span style={style}>{match[1]}</span>;
}
