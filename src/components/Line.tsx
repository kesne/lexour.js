import React from 'react';

type Props = {
    children: React.ReactNodeArray;
    includeLineNumbers: boolean;
    lineNumber: number;
};

export default function Line({
    children,
    includeLineNumbers,
    lineNumber,
}: Props) {
    const lineNumComp = includeLineNumbers ? (
        <span style={{ margin: '0 1rem 0 0.5rem' }}>{lineNumber}</span>
    ) : null;
    return (
        <div>
            {lineNumComp}
            {children}
        </div>
    );
}
