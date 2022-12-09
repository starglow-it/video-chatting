import {
	fork, serialize, Scope, Domain 
} from 'effector';
import {
	useMemo 
} from 'react';

let scope: Scope;

function initializeScope(domain: Domain, initialData: unknown) {
	const innerScope = fork(domain, {
		values: {
			...(scope
				? serialize(scope, {
					onlyChanges: true,
				})
				: {
				}),
			...(typeof initialData === 'object' ? initialData : {
			}),
		},
	});

	if (typeof window !== 'undefined') {
		scope = innerScope;
	}

	return innerScope;
}

export function useScope(domain: Domain, initialState: unknown) {
	return useMemo(
		() => initializeScope(domain, initialState),
		[domain, initialState],
	);
}
