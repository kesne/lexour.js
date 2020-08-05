import { useContext } from 'react';
import ThemeContext from '../ThemeContext';

export default function KeepAnnotation({ text }: { text: string }) {
    const theme = useContext(ThemeContext);

    const style = theme.tokens ? theme.tokens['COMMENT'] : undefined;
    return <span style={style}>{text.replace('KEEP ', '')}</span>;
}
