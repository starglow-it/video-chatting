import { memo, useRef } from 'react';
import { useToggle } from 'shared-frontend/hooks/useToggle';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';
import { CustomVideoPlayer } from 'shared-frontend/library/custom/CustomVideoPlayer';
import { ICommonTemplate } from 'shared-types';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { Fade, Menu, MenuItem } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { EllipsisIcon } from 'shared-frontend/icons/OtherIcons/EllipsisIcon';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import { Translation } from '@components/Translation/Translation';
import styles from './FeaturedItem.module.scss';

const Component = ({
    template,
    onDelete,
    onEdit,
}: {
    template: ICommonTemplate;
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
}) => {
    const actionButtonRef = useRef<HTMLButtonElement | null>(null);

    const {
        value: isHover,
        onSwitchOn: showHover,
        onSwitchOff: hideHover,
    } = useToggle(false);

    const {
        value: isMenuOpen,
        onSwitchOn: onShowMenu,
        onSwitchOff: onHideMenu,
    } = useToggle(false);

    const { url, id, mediaLink } = template;

    const renderMedia = () => {
        if (mediaLink)
            return (
                <CustomImage
                    src={mediaLink.thumb}
                    width={250}
                    height={150}
                    className={styles.image}
                    loading="eager"
                    alt="media-item"
                />
            );
        if (!url) return null;
        switch (template.templateType) {
            case 'image':
                return (
                    <CustomImage
                        src={url}
                        width={250}
                        height={150}
                        className={styles.image}
                        loading="eager"
                        alt="media-item"
                    />
                );
            case 'video':
                return (
                    <CustomVideoPlayer
                        src={url}
                        volume={0}
                        isPlaying
                        isMuted={false}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <CustomGrid
            className={styles.wrapper}
            onMouseEnter={showHover}
            onMouseLeave={hideHover}
        >
            <CustomGrid
                container
                flexDirection="row"
                alignItems="center"
                height="100%"
            >
                {renderMedia()}
            </CustomGrid>
            <Fade in={isHover}>
                <CustomGrid
                    container
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.blur}
                >
                    <ActionButton
                        ref={actionButtonRef}
                        variant="transparent"
                        onAction={onShowMenu}
                        className={styles.menuButton}
                        Icon={<EllipsisIcon width="20px" height="20px" />}
                    />
                    <Menu
                        open={isMenuOpen}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        anchorEl={actionButtonRef?.current}
                        classes={{ paper: styles.menu }}
                        onClose={onHideMenu}
                    >
                        <MenuItem
                            onClick={() => onEdit(id)}
                            className={styles.item}
                        >
                            <CustomTypography>
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.edit"
                                />
                            </CustomTypography>
                        </MenuItem>
                        <MenuItem
                            onClick={() => onDelete(id)}
                            className={styles.item}
                        >
                            <CustomTypography>
                                <Translation
                                    nameSpace="common"
                                    translation="buttons.delete"
                                />
                            </CustomTypography>
                        </MenuItem>
                    </Menu>
                </CustomGrid>
            </Fade>
        </CustomGrid>
    );
};
export const FeaturedItem = memo(Component);
