import React, { useContext } from 'react';
import ThemeContext from './ThemeContext';

type Props = {
    lineNumber: number;
    children: React.ReactNodeArray;
};

export default function Line({ lineNumber, children }: Props) {
    const theme = useContext(ThemeContext);

    // This isn't an optimal solution to spacing numbers correctly
    // Maybe find the highest line number and space accordingly
    const lineNumberString = String(lineNumber);

    const lineNumComp = lineNumber ? (
        <span style={{ margin: '0 1rem 0 0.25rem', ...theme.lineNumbers }}>
            {' '.repeat(4 - lineNumberString.length).concat(lineNumberString)}
        </span>
    ) : null;

    return (
        <div>
            {lineNumComp}
            {children}
        </div>
    );
}
