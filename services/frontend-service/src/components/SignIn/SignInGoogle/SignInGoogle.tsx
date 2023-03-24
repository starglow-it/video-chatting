import React, { memo, useCallback, useEffect, useMemo } from 'react';

import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import styles from './SignInGoogle.module.scss';

export const SignInGoogle = () => {
  return (
    <SocialLogin className={styles.btnGoogle}>
      <CustomImage
          src="/images/logo_google.svg"
          width="28px"
          height="27px"
      />
      <CustomTypography
          nameSpace="common"
          translation="buttons.loginGoggle"
      />
    </SocialLogin>
  )
}