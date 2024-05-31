import { memo } from 'react';
import clsx from 'clsx';
import { useBrowserDetect } from '@hooks/useBrowserDetect';

// custom
import { CustomBox } from 'shared-frontend/library/custom/CustomBox';
import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

// types
import { TemplateGridProps } from './types';

// styles
import styles from './TemplatesGrid.module.scss';

const Component = <TemplateType extends { id: string }>({
    TemplateComponent,
    list,
    onChooseTemplate,
    outerClassName,
    innerClassName,
    allowCreate = false,
    onCreate,
    isCustomElementCreate = false,
    ElementCreate = (
        <CustomGrid
            id="templateCreate"
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="flex-start"
            className={styles.templateCreateWrapper}
        >
            <CustomBox className={styles.image}>
                <CustomImage
                    width="29"
                    height="29"
                    src="/images/stars.webp"
                    alt="stars"
                />
            </CustomBox>
            <CustomTypography nameSpace="templates" translation="createRoom" className={styles.title} />
        </CustomGrid>
    ),
}: TemplateGridProps<TemplateType>) => {
    const { isMobile } = useBrowserDetect();

    const renderTemplates = () => {
        const initialTemplatesRender = list?.map(template => ({
            id: template.id,
            component: (
                <TemplateComponent
                    key={template.id}
                    template={template}
                    onChooseTemplate={onChooseTemplate}
                />
            ),
        }));

        if (allowCreate) {
            initialTemplatesRender.unshift({
                id: 'create',
                component: (
                    <CustomGrid
                        className={clsx(styles.addItem, { [styles.addItemMobile]: isMobile })}
                        container
                        alignItems="center"
                        flexDirection="column"
                        onClick={onCreate}
                        key="create-a-template"
                    >
                        {ElementCreate}
                        {!isCustomElementCreate && (
                            <>
                                <CustomGrid
                                    item
                                    container
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    className={styles.descriptionWrapper}
                                >
                                    <CustomGrid
                                        item
                                        container
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <CustomBox className={styles.image}>
                                            <CustomImage
                                                width="25"
                                                height="25"
                                                src="/images/immersion.png"
                                                alt="immersion"
                                            />
                                        </CustomBox>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            justifyContent="center"
                                            className={styles.descCreateRoom}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.customizeTheImmersionTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.customizeTheImmersionDesc"
                                                textAlign="left"
                                                lineHeight="17px"
                                                fontSize={10}
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />
                                        </CustomGrid>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            justifyContent="center"
                                            className={styles.descCreateRoomResponsive}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.customizeTheImmersionTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.customizeTheImmersionDescResponsive"
                                                textAlign="left"
                                                lineHeight="17px"
                                                fontSize={10}
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                </CustomGrid>
                                <CustomGrid
                                    item
                                    container
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    className={styles.descriptionWrapper}
                                >
                                    <CustomGrid
                                        item
                                        container
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <CustomBox className={styles.image}>
                                            <CustomImage
                                                width="25"
                                                height="25"
                                                src="/images/white-link.png"
                                                alt="white link"
                                            />
                                        </CustomBox>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            className={styles.descCreateRoom}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.addYourLinksTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.addYourLinksDesc"
                                                textAlign="left"
                                                fontSize={10}
                                                lineHeight="17px"
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />
                                        </CustomGrid>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            className={styles.descCreateRoomResponsive}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.addYourLinksTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.addYourLinksDescResponsive"
                                                textAlign="left"
                                                fontSize={10}
                                                lineHeight="17px"
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                </CustomGrid>
                                <CustomGrid
                                    item
                                    container
                                    flexDirection="column"
                                    alignItems="flex-start"
                                    className={styles.descriptionWrapper}
                                >
                                    <CustomGrid
                                        item
                                        container
                                        justifyContent="flex-start"
                                        alignItems="center"
                                    >
                                        <CustomBox className={styles.image}>
                                            <CustomImage
                                                width="25"
                                                height="25"
                                                src="/images/creditCard.png"
                                                alt="credit card"
                                            />
                                        </CustomBox>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            className={clsx(styles.descCreateRoom)}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.monetizeAttendanceTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.monetizeAttendanceDesc"
                                                textAlign="left"
                                                fontSize={10}
                                                lineHeight="17px"
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />

                                        </CustomGrid>
                                        <CustomGrid
                                            item
                                            container
                                            flexDirection="column"
                                            className={clsx(styles.descCreateRoomResponsive)}
                                        >
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.monetizeAttendanceTitle"
                                                textAlign="left"
                                                fontSize={12}
                                                lineHeight="17px"
                                                className={styles.createRoomTitle}
                                            />
                                            <CustomTypography
                                                nameSpace="templates"
                                                translation="descCreateRoom.monetizeAttendanceDescResponsive"
                                                textAlign="left"
                                                fontSize={10}
                                                lineHeight="17px"
                                                color="#BEBEBE"
                                                className={styles.createRoomDesc}
                                            />
                                        </CustomGrid>
                                    </CustomGrid>
                                </CustomGrid>
                            </>
                        )}
                    </CustomGrid>
                ),
            });
        }

        return initialTemplatesRender.map(element => element.component);
    };

    return (
        <CustomGrid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            className={outerClassName || styles.templatesWrapper}
        >
            <CustomBox className={innerClassName || styles.templatesContent}>
                <CustomGrid container gap={3} justifyContent="flex-start" flexDirection={isMobile ? "column" : "row"}>
                    {renderTemplates()}
                </CustomGrid>
            </CustomBox>
        </CustomGrid>
    );
};

export const TemplatesGrid = memo(Component) as typeof Component;
