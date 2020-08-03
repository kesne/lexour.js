import React from 'react';

type Props = {
    lineNumber: number;
    style: React.CSSProperties;
    children: React.ReactNodeArray;
};

export default function Line({ lineNumber, style, children }: Props) {
    // This isn't an optimal solution to spacing numbers correctly
    // Maybe find the highest line number and space accordingly
    const lineNumberString = String(lineNumber);
    const lineNumComp = lineNumber ? (
        <span style={{ margin: '0 1rem 0 0.25rem', ...style }}>
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
