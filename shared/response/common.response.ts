type SuccessType<T> = {
    success: true;
    result: T;
}

type FailedType = {
    message?: string;
    success: false;
}

type ResponseSumType<T> = SuccessType<T> | FailedType;

export {
    ResponseSumType
}