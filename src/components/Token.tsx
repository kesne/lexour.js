import React from 'react';
import { Token } from 'moo';

type Props = { data: Token };

export default function Token({ data }: Props) {
    return <span>{data.text}</span>;
}
