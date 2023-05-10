import axios, { Method, CancelToken, ResponseType } from 'axios';

interface IArgs {
  method: Method;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, any>;
  cancelToken?: CancelToken;
  responseType?: ResponseType
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
}

export const sendHttpRequest = (args: IArgs) => {
  const {
    url,
    method,
    data,
    params,
    headers,
    cancelToken,
    onUploadProgress,
    onDownloadProgress,
    responseType
  } = args;
  return axios({
    url,
    method,
    data,
    params,
    headers,
    cancelToken,
    onUploadProgress,
    onDownloadProgress,
    responseType
  });
};
