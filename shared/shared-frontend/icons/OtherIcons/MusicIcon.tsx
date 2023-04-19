import { memo } from "react";
import { SvgIconWrapper } from "../SvgIconWrapper";
import { CommonIconProps } from "../types";

const Component = ({
  width,
  height,
  className,
  onClick,
  isActive,
}: CommonIconProps) =>
  isActive ? (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      viewBox="0 0 24 24"
      fill="#ffffff"
    >
      <path
        d="M9.15889 6.56808L17.73 5.00628C18.1578 4.94381 18.5 5.35769 18.5 5.78718V15.486C18.5 17.0009 17.2789 18.2191 15.7778 18.2191C14.2767 18.2191 13.0556 17.0009 13.0556 15.486C13.0556 13.9788 14.2767 12.7528 15.7778 12.7528C16.1978 12.7528 16.5867 12.8621 16.9444 13.0261V8.12988L9.94444 9.69168V16.6573C9.75778 17.9848 8.59111 19 7.22222 19C5.72111 19 4.5 17.7818 4.5 16.2669C4.5 14.7597 5.72111 13.5337 7.22222 13.5337C7.64222 13.5337 8.03111 13.643 8.38889 13.807V7.34898C8.38889 6.91948 8.73111 6.63836 9.15889 6.56808Z"
        fill="currentColor"
      />
    </SvgIconWrapper>
  ) : (
    <SvgIconWrapper
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M9.15889 6.56808L17.73 5.00628C18.1578 4.94381 18.5 5.35769 18.5 5.78718V15.486C18.5 17.0009 17.2789 18.2191 15.7778 18.2191C14.2767 18.2191 13.0556 17.0009 13.0556 15.486C13.0556 13.9788 14.2767 12.7528 15.7778 12.7528C16.1978 12.7528 16.5867 12.8621 16.9444 13.0261V8.12988L9.94444 9.69168V16.6573C9.75778 17.9848 8.59111 19 7.22222 19C5.72111 19 4.5 17.7818 4.5 16.2669C4.5 14.7597 5.72111 13.5337 7.22222 13.5337C7.64222 13.5337 8.03111 13.643 8.38889 13.807V7.34898C8.38889 6.91948 8.73111 6.63836 9.15889 6.56808Z"
        fill="currentColor"
      />
    </SvgIconWrapper>
  );

export const MusicIcon = memo(Component);
