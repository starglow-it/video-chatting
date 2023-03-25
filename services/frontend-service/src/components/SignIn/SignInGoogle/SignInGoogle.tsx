import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import frontendConfig from '../../../const/config';
import clsx from 'clsx';

import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import {
	addNotificationEvent, googleVeirfyFx
} from '../../../store';

import {
	NotificationType
} from '../../../store/types';

import styles from './SignInGoogle.module.scss';
import { ConditionalRender } from 'shared-frontend/library/common/ConditionalRender';
import { CustomLoader } from 'shared-frontend/library/custom/CustomLoader';

const GOOGLE_CLIENT_ID = frontendConfig.googleClientId //'262625104810-n7svflmq4l9c4oghoaq4j7i45jd7jn3o.apps.googleusercontent.com'

export const SignInGoogle = () => {
  const [isProcessing, setIsProcessing] = useState(false)
  const handleReject = (text: string) => {
    setIsProcessing(false)
    addNotificationEvent({
			type: NotificationType.validationError,
			message: text,
      withErrorIcon: true
		});
  }

  const handleSuccess = (token: string) => {
    console.log('done', token)
    googleVeirfyFx({
      token
    }).then((res) => {
      console.log('res',res)
      setIsProcessing(false)
    })
  }

  const loginGoogle = useCallback(() => {
    if (isProcessing) {
      return
    }
    setIsProcessing(true)    
    if (window) {           
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        callback: (res) => {
          handleSuccess(res.access_token)
        },
        error_callback: (err) => {          
          handleReject(err.message)
        }
      })      
      client.requestAccessToken()
    }else{
      handleReject('Failed to login to Google')
    }
  }, [isProcessing])


  return (
    <SocialLogin
      className={clsx(styles.btnGoogle, { [styles.btnProcessing]: isProcessing })}
      onClick={loginGoogle}
    >
      <ConditionalRender condition={isProcessing}>
        <CustomLoader />
      </ConditionalRender>
      <ConditionalRender condition={!isProcessing}>
        <CustomImage
            src="/images/logo_google.svg"
            width="28px"
            height="27px"
        />
        <CustomTypography
            nameSpace="common"
            translation="buttons.loginGoggle"
        />
      </ConditionalRender>
    </SocialLogin>
  )
}