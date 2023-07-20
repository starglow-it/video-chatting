import { useCallback } from 'react';
import { BaseSchema, ValidationError } from 'yup';

// const
import { hasArrayIndex } from '../const/regexp';

export type ParsedValidationErrors<Values> = {
    [p in keyof Values]?: Partial<ValidationError>[];
};

export type ValidationResult<Values> = {
    values: any;
    errors: ParsedValidationErrors<Values>;
};

type ValidationOptions = {
    reduceArrayErrors?: boolean;
};

export const useYupValidationResolver = <Values>(
    validationSchema: BaseSchema,
    options?: ValidationOptions,
): ((data: Values) => Promise<ValidationResult<Values>>) =>
    useCallback(
        async data => {
            try {
                const values = await validationSchema.validate(data, {
                    abortEarly: false,
                });

                return {
                    values,
                    errors: {},
                };
            } catch (error) {
                if (error instanceof ValidationError) {
                    const err = error?.inner;

                    const initialReduceState: ParsedValidationErrors<Values> =
                        {};

                    return {
                        values: {},
                        errors: err?.reduce((allErrors, currentError) => {
                            let errorKey =
                                `${currentError.path}` as keyof Values;
                            if (
                                hasArrayIndex.test(errorKey as string) &&
                                options?.reduceArrayErrors
                            ) {
                                errorKey = (errorKey as string).replace(
                                    /\[\d*].*/,
                                    '',
                                ) as keyof Values;
                            }

                            const keyErrors = allErrors[
                                errorKey
                            ] as ValidationError[];

                            if (allErrors[errorKey]) {
                                return {
                                    ...allErrors,
                                    [errorKey]: [
                                        ...keyErrors,
                                        {
                                            type:
                                                currentError.type ??
                                                'validation',
                                            message: currentError.message,
                                        },
                                    ],
                                };
                            }

                            return {
                                ...allErrors,
                                [errorKey]: [
                                    {
                                        type: currentError.type ?? 'validation',
                                        message: currentError.message,
                                    },
                                ],
                            };
                        }, initialReduceState),
                    };
                }
                return {
                    values: {},
                    errors: {},
                };
            }
        },
        [validationSchema],
    );
