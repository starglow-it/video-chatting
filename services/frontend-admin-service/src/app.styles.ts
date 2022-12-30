export default theme => ({
	WebkitFontSmoothing: 'antialiased',
	MozOsxFontSmoothing: 'grayscale',
	boxSizing: 'border-box',
	WebkitTextSizeAdjust: '100%',
	colorScheme: theme?.palette?.mode,
	body: {
		margin: 0,
		color: (theme?.vars || theme)?.palette?.text?.primary,
		...theme?.typography?.body1,
		backgroundColor: (theme?.vars || theme)?.palette?.background?.default,
		'@media print': {
			// Save printer ink.
			backgroundColor: (theme.vars || theme)?.palette?.common?.white,
		},
		'&::backdrop': {
			backgroundColor: (theme.vars || theme).palette?.background?.default,
		},
		height: '100vh',
		display: 'flex',
		background: theme?.background?.default,
	},
});
