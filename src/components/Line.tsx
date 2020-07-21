import React from 'react';

type Props = { children: React.ReactNodeArray };

export default function Line({ children }: Props) {
    return <div>{children}</div>;
}
