import React from 'react';
import { Token } from 'moo';
import { Theme } from '../types';

type Props = {
    type: string;
    value: string;
    style?: React.CSSProperties;
};

export default function Token({ type, value, style }: Props) {
    // This is kind of a hacky solution, but it'll work for now
    if (type === 'EMPTYLINE') return <span> </span>;
    return <span style={style}>{value}</span>;
}
