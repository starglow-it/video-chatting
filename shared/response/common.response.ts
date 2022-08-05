type SuccessType<T> = {
    success: true;
    result: T;
}

type FailedType = {
    message?: string;
    success: false;
}

export type ResponseSumType<T> = SuccessType<T> | FailedType;