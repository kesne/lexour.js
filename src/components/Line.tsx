import React from 'react';

type Props = {
    children: React.ReactNodeArray;
    lineNumber: number;
};

export default function Line({ children, lineNumber }: Props) {
    // This isn't an optimal solution to spacing numbers right
    // Maybe find the highest line number and space accordingly
    const lineNumberString = lineNumber.toString(10);
    const lineNumComp = lineNumber ? (
        <span style={{ margin: '0 1rem 0 0.25rem' }}>
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
