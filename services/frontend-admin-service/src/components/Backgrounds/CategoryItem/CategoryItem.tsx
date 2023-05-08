import { memo, useRef, useState } from 'react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from 'shared-frontend/library/custom/CustomTypography';
import styles from './CategoryItem.module.scss';
import { CustomPaper } from 'shared-frontend/library/custom/CustomPaper';
import { CustomDivider } from 'shared-frontend/library/custom/CustomDivider';
import { IBackgroundCategory } from 'src/store/backgrounds/types';
import { ModifyCategoryItem } from '../ModifyCategoryItem/ModifyCategoryItem';
import { Fade } from '@mui/material';
import { ActionButton } from 'shared-frontend/library/common/ActionButton';
import { EditIcon } from 'shared-frontend/icons/OtherIcons/EditIcon';
import { TrashIcon } from 'shared-frontend/icons/OtherIcons/TrashIcon';

const Component = ({ category }: { category: IBackgroundCategory }) => {
    const refModify = useRef(null);
    const [isHover, setIsHover] = useState<boolean>(false);

    const showActions = () => setIsHover(true);

    const hideActions = () => setIsHover(false);
    
    const toggleEdit = () => refModify.current?.open();

    return (
        <>
            <CustomGrid
                className={styles.wrapper}
                flexDirection="row"
                display="flex"
                onMouseEnter={showActions}
                onMouseLeave={hideActions}
            >
                <CustomGrid container flexDirection="row" alignItems="center">
                    <CustomGrid className={styles.emoji}>
                        {String.fromCodePoint('0x1f600')}
                    </CustomGrid>
                    <CustomTypography>{category.value}</CustomTypography>
                </CustomGrid>
                <Fade in={isHover}>
                    <CustomGrid
                        alignItems="center"
                        flexDirection="row"
                        display="flex"
                    >
                        <ActionButton
                            variant="decline"
                            Icon={<EditIcon width="20px" height="20px" />}
                            onAction={toggleEdit}
                        />
                        <ActionButton
                            variant="decline"
                            Icon={<TrashIcon width="20px" height="20px" />}
                        />
                    </CustomGrid>
                </Fade>
                <ModifyCategoryItem ref={refModify} category={category} />
            </CustomGrid>

            <CustomDivider style={{ width: '100%' }} />
        </>
    );
};
export const CategoryItem = memo(Component);
