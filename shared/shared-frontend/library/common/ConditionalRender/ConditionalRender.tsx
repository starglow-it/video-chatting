import React, { memo } from 'react';

type ComponentProps = React.PropsWithChildren<{
    condition: boolean;
}>;

const Component = ({ condition, children }: ComponentProps) => (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>{condition ? children : null}</>
);

const ConditionalRender = memo<ComponentProps>(Component);

export default ConditionalRender;
