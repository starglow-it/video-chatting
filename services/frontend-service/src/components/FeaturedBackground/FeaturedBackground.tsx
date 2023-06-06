import { memo } from 'react';
import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { $featuredBackgroundStore } from 'src/store';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ICommonTemplate } from 'shared-types';
import styles from './FeaturedBackground.module.scss';
import { CommonTemplateItem } from '../Templates/CommonTemplateItem/CommonTemplateItem';

const Component = () => {
    const { list, count } = useStore($featuredBackgroundStore);

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.featuredWrapper}
        >
            <CustomPaper className={styles.barge}>
                <CustomGrid
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                >
                    <CustomGrid fontSize={20} paddingRight={1}>
                        {parseEmoji(mapEmoji('2728'))}
                    </CustomGrid>
                    <CustomTypography
                        fontSize={15}
                        nameSpace="templates"
                        translation="featuredBackground.title"
                    />
                </CustomGrid>
            </CustomPaper>

            {/* <FeaturedList count={count} list={list} /> */}
            <TemplatesGrid<ICommonTemplate>
                list={list}
                count={count}
                // onPageChange={handleProfileTemplatesPageChange}
                // onChooseTemplate={handleChooseProfileTemplate}
                TemplateComponent={CommonTemplateItem}
            />
        </CustomGrid>
    );
};

export const FeaturedBackground = memo(Component);
