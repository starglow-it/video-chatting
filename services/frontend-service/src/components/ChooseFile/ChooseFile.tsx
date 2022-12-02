import React, {
	memo, useCallback, useMemo, useRef 
} from 'react';

import {
	CustomBox 
} from 'shared-frontend/library';

import {
	ChooseFileProps 
} from './types';

import styles from './ChooseFile.module.scss';

const Component = ({
	accept, 
	onChoose, 
	children 
}: ChooseFileProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	const acceptMime = useMemo(() => accept.join(', '), [accept]);

	const handleStartChooseFile = useCallback(() => {
		if (inputRef.current) {
			inputRef.current.value = '';
			inputRef.current.click();
		}
	}, []);

	const handleChooseFile = useCallback(
		({
			target: {
				files 
			} 
		}: React.ChangeEvent<HTMLInputElement>) => {
			if (files?.[0]) {
				onChoose(files?.[0]);
			}
		},
		[],
	);

	return (
		<CustomBox
			className={styles.uploadFileWrapper}
			onClick={handleStartChooseFile}
		>
			<input
				className={styles.input}
				ref={inputRef}
				type="file"
				accept={acceptMime}
				onChange={handleChooseFile}
			/>
			{children}
		</CustomBox>
	);
};

export const ChooseFile = memo(Component);
