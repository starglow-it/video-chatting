import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import frontendConfig from '../../../const/config';

import { SocialLogin } from '@library/common/SocialLogin/SocialLogin';
import { CustomTypography } from '@library/custom/CustomTypography/CustomTypography';
import { CustomImage } from 'shared-frontend/library/custom/CustomImage';

import {
	addNotificationEvent
} from '../../../store';

import {
	NotificationType
} from '../../../store/types';

import styles from './SignInGoogle.module.scss';

const GOOGLE_CLIENT_ID = '262625104810-n7svflmq4l9c4oghoaq4j7i45jd7jn3o.apps.googleusercontent.com'
const GOOGLE_JS_SRC = 'https://accounts.google.com/gsi/client'
const GOOGLE_SCRIPT_ID = 'google-login'
const GOOGLE_SCOPE = 'email profile'
const GOOGLE_REDIRECT_URI = '/'
const GOOGLE_PROMPT = 'select_account'

export const SignInGoogle = () => {

  const [isSdkLoaded, setIsSdkLoaded] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

  const checkIsExistsSDKScript = useCallback(() => {
    return !!document.getElementById(GOOGLE_SCRIPT_ID)
  }, [])

  const handleReject = (text: string) => {
    addNotificationEvent({
			type: NotificationType.validationError,
			message: text,
      withErrorIcon: true
		});
  }

  const insertScriptGoogle = useCallback((cb: () => void) => {
    const ggScriptTag: HTMLScriptElement = document.createElement('script')
    ggScriptTag.id = GOOGLE_SCRIPT_ID
    ggScriptTag.src = GOOGLE_JS_SRC
    ggScriptTag.async = true
    ggScriptTag.defer = true
    const scriptNode = document.getElementsByTagName(
      'script',
    )[0] as HTMLScriptElement
    scriptNode &&
      scriptNode.parentNode &&
      scriptNode.parentNode.insertBefore(ggScriptTag, scriptNode)
    ggScriptTag.onload = cb
  }, [])

  const load = useCallback(() => {
    if (checkIsExistsSDKScript()) {
      setIsSdkLoaded(true)
    } else {
      console.log('gapi sdk script not loaded')
      insertScriptGoogle(() => {
        setIsSdkLoaded(true)
        // const paramsGoogle = {
        //   client_id: GOOGLE_CLIENT_ID,
        //   // redirect_uri: GOOGLE_REDIRECT_URI,
        //   // scope: GOOGLE_SCOPE,
        //   // immediate: true,
        //   scope: 'https://www.googleapis.com/auth/calendar.readonly',          
        //   ux_mode: 'popup',
        // }
        // const test = google.accounts.oauth2.initCodeClient
        // // gapi.load('auth2', () => {
        // //   const gapiAuth = gapi.auth2
        // //   !gapiAuth.getAuthInstance()
        // //     ? gapiAuth.init(paramsGoogle).then(() => {
        // //         setIsSdkLoaded(true)
        // //       })
        // //     : handleReject('not exist an instance')
        // // })
      })
    }
  }, [insertScriptGoogle, checkIsExistsSDKScript])

  const loginGoogle = useCallback(() => {
    if (!isSdkLoaded) {
      handleReject('Failed to login to Google. Cookie is required')
      return
    }
    console.log('ssss', isProcessing, google)
    if (isProcessing || !isSdkLoaded) {
      return
    }
    setIsProcessing(true)    
    if (!google) {
      setIsProcessing(false)
      load()
    } else {
      // const auth2 = gapi.auth2.getAuthInstance()
      // const options = {
      //   prompt: GOOGLE_PROMPT,
      //   scope: GOOGLE_SCOPE,
      // }
      // auth2
      //   .signIn(options)
      //   .then(() => {          
      //     const access_token = auth2.currentUser
      //       .get()
      //       .getAuthResponse().access_token
      //       console.log('aa', access_token)    
      //       handleReject(access_token)      
      //   })
      //   .catch((err: Error) => {
      //     setIsProcessing(false)
      //     handleReject(err.message)
      //     return
      //   })
      const client = google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: 'email profile',
        ux_mode: 'popup',
        callback: (res) => {
          console.log(res)
        }
      })
      client.requestAccessToken()
    }
  }, [load, isSdkLoaded, isProcessing])

  useEffect(() => {
    // load()
  }, [])

  return (
    <SocialLogin className={styles.btnGoogle} onClick={loginGoogle}>
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