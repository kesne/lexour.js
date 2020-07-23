import React from 'react';
import { Token } from 'moo';
import { Theme } from '../types';

type Props = {
    type: string;
    value: string;
    theme: any;
};

export default function Token({ type, value, theme }: Props) {
    if (type === 'NEWLINE' || !type) return null;
    console.log(type, value);

    // This style grab solution sucks, do it better
    const styles = theme[type.split('_')[0]] || undefined;
    return <span style={styles}>{value}</span>;
}
