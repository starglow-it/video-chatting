import * as yup from 'yup';
import { unicodeLettersString } from '../const/regexp';

yup.addMethod(yup.string, 'unicodeLettersString', function (errorMessage) {
    return this.test(
        `test-string-unicode-letters`,
        'string.unicodeLetters',
        function (value?: string) {
            const { path, createError } = this;
            if (!unicodeLettersString.test(value ?? '')) {
                return createError({ path, message: errorMessage });
            }
            return true;
        },
    );
});
