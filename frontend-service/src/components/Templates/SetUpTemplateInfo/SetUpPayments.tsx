import { useCallback, memo } from "react";
import {CustomGrid} from "@library/custom/CustomGrid/CustomGrid";
import {CustomTypography} from "@library/custom/CustomTypography/CustomTypography";
import {SocialLogin} from "@library/common/SocialLogin/SocialLogin";
import {StripeIcon} from "@library/icons/StripeIcon";

const Component = () => {
    const handleSetUpPayments = useCallback(() => {
    }, []);

    return (
        <CustomGrid container direction="column">
            <CustomTypography
                variant="h2bold"
                nameSpace="templates"
                translation="setUpSpace.monetization"
            />
            <SocialLogin
                Icon={StripeIcon}
                nameSpace="templates"
                translation="setUpSpace.stripe"
                onClick={handleSetUpPayments}
            />
        </CustomGrid>
    )
}

export const SetUpPayments = memo(Component);