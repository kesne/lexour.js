import React from 'react';

type Props = {
    children: React.ReactNodeArray;
    lineNumber: number;
};

export default function Line({ children, lineNumber }: Props) {
    // This isn't an optimal solution to spacing numbers right
    // Would be better if I found the highest number and spaced accordingly
    const test = `${' '.repeat(4 - lineNumber.toString().length)}${lineNumber}`;
    const lineNumComp = lineNumber ? (
        <span style={{ margin: '0 1rem 0 0.25rem' }}>{test}</span>
    ) : null;
    return (
        <div>
            {lineNumComp}
            {children}
        </div>
    );
}
