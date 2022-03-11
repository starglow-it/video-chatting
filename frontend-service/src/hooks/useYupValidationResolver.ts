import { useCallback } from 'react';
import { BaseSchema, ValidationError } from 'yup';

export type ParsedValidationErrors<Values> = {
    [p in keyof Values]?: Partial<ValidationError>[];
};

type ValidationValues<Values> = {
    [p in keyof Values]?: Values[p];
};

export type ValidationResult<Values> = {
    values: any;
    errors: ParsedValidationErrors<Values>;
};

export const useYupValidationResolver = <Values>(
    validationSchema: BaseSchema,
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

                    const initialReduceState: ParsedValidationErrors<Values> = {};

                    return {
                        values: {},
                        errors: err?.reduce((allErrors, currentError) => {
                            const errorKey = `${currentError.path}` as keyof Values;
                            const keyErrors = allErrors[errorKey] as ValidationError[];

                            if (allErrors[errorKey]) {
                                return {
                                    ...allErrors,
                                    [errorKey]: [
                                        ...keyErrors,
                                        {
                                            type: currentError.type ?? 'validation',
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
                } else {
                    return {
                        values: {},
                        errors: {},
                    };
                }
            }
        },
        [validationSchema],
    );
