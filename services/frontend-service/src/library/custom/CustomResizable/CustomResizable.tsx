import { ForwardedRef, forwardRef, memo, useState } from 'react';
import { Resizable } from 'react-resizable';
import clsx from 'clsx';
import { CustomResizableProps } from './type';
import styles from './CustomResizable.module.scss';

const MyHandleComponent = ({
    handleAxis,
    innerRef,
    disabled,
    ...restProps
}: {
    handleAxis: string;
    innerRef: ForwardedRef<HTMLInputElement>;
    disabled: boolean;
}) => (
    <div
        ref={innerRef}
        className={clsx(
            styles['react-resizable-handle'],
            styles[`react-resizable-handle-${handleAxis}`],
            { [styles.disabled]: disabled },
        )}
        {...restProps}
    />
);

const MyHandle = forwardRef(
    (props: any, ref: ForwardedRef<HTMLInputElement>) => (
        <MyHandleComponent innerRef={ref} {...props} />
    ),
);

const Component = ({
    width = 75,
    height = 75,
    disabled = false,
    children,
    ...restProps
}: CustomResizableProps) => {
    const [offsetParent, setOffsetParent] = useState<HTMLElement | null>(null);
  
    return (
      <Resizable
        width={width}
        height={height}
        lockAspectRatio
        axis="x"
        draggableOpts={{
          disabled,
          offsetParent,
        }}
        className={styles['react-resizable']}
        handle={
          <MyHandle
            handleAxis="x"
            disabled={disabled}
            ref={(handleRef) => {
              if (handleRef) {
                setOffsetParent(handleRef.parentElement);
              }
            }}
          />
        }
        {...restProps}
      >
        {children}
      </Resizable>
    );
  };
export const CustomResizable = memo(Component);
