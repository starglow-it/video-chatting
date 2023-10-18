import { memo } from 'react';
import { useStore } from 'effector-react';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { $featuredBackgroundStore } from 'src/store';
import { CustomPaper } from '@library/custom/CustomPaper/CustomPaper';
import { mapEmoji, parseEmoji } from 'shared-utils';
import { TemplatesGrid } from '@components/Templates/TemplatesGrid/TemplatesGrid';
import { ICommonTemplate } from 'shared-types';
import { CommonTemplateItem } from '@components/Templates/CommonTemplateItem/CommonTemplateItem';
import styles from './FeaturedBackground.module.scss';

const Component = ({
    onChooseTemplate,
}: {
    onChooseTemplate: (templateId: string) => void;
}) => {
    const { list, count } = useStore($featuredBackgroundStore);

    if (!list.length) return null;

    return (
        <CustomGrid
            container
            direction="column"
            className={styles.featuredWrapper}
            sx={{
                marginTop: { xs: '55px', sm: '30px', md: '30px', xl: '30px' },
            }}
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
                        fontSize={14}
                        nameSpace="templates"
                        translation="featuredRooms.title"
                    />
                </CustomGrid>
            </CustomPaper>
            <TemplatesGrid<ICommonTemplate>
                list={list}
                count={count}
                onChooseTemplate={onChooseTemplate}
                TemplateComponent={CommonTemplateItem}
            />
        </CustomGrid>
    );
};

export const FeaturedBackground = memo(Component);
