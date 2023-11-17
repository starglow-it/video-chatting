export type TMultiDecorators = <TFunction = any, Y = any>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void;
