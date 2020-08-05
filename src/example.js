import React from 'react';
import { render } from 'react-dom';
import CodeBlock from '.';

render(
    <CodeBlock
        code={`let x = await {
			then: () => await {
				then: () => await {
					then: () => await {
						then() {
							((x = [...j]) => {})()
						}
					}
				}
			}
		}`}
        lang="js"
        showLineNumbers
    />,
    document.getElementById('root'),
);
