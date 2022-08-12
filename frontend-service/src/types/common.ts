export type PropsWithClassName<T> = T & { className?: string };
export type ActionProps = { onAction?: (() => void) | undefined };
export type CustomMediaStream = MediaStream | null | undefined;
