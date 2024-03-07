import { isPrimitive } from './isPrimitiveType';

export const replaceItemInArray = <T = any>(
  arr: T[],
  searchItem: T,
  replaceItem: T,
) => {
  let index = arr.indexOf(searchItem);
  if (!isPrimitive(searchItem, true)) {
    index = arr.findIndex(
      (object) => JSON.stringify(object) === JSON.stringify(searchItem),
    );
  }

  const isReplaceItemExist = arr.indexOf(replaceItem);

  if (index !== -1 && ( replaceItem === null || isReplaceItemExist === -1 )) {
    arr[index] = replaceItem;
  }

  return index;
};
