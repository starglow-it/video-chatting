import * as yup from "yup";
import { baseUrlSchema } from "../users";
import { object } from "yup";

export const tagsSchema = () =>
  yup
    .array()
    .of(
      yup.object({
        id: yup.string().optional(),
        key: yup.string().required(),
        value: yup
          .string()
          .max(20, "maxLength.base")
          .unicodeLettersString("tags.unacceptableSymbols")
          .required(),
        color: yup.string().required(),
      })
    )
    .max(6, "tags.max");

export const templatesLinksSchema = () =>
  yup.array().of(
    yup.object().when({
      is: () => true,
      then: object({
        value: baseUrlSchema(),
      }),
    })
  );

export const subdomainLinkSchema = () =>
  yup
    .string()
    .matches(
        /((https?):\/\/)(.*)?chatruume(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)/,
      "url.common"
    )
    .required();
