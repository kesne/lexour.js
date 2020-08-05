import React, { useContext } from 'react';
import ThemeContext from '../ThemeContext';

export default function Text({ type, value }: { type: string, value: string }) {
	const theme = useContext(ThemeContext);
	 // === Handle all other token types ===
	 const primaryType = type.replace(/(?<=^_?[A-Z]+)_.+/, '');
	//  @ts-ignore Will fix when token names and style fetch is reworked
	 const style = theme.tokens[primaryType];

	 return (
		 <span style={style}>
			 {value}
		 </span>
	 );
}
