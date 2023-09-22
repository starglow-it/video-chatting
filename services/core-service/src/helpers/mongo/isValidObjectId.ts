import { Types } from 'mongoose';

export const ObjectId = Types.ObjectId;

export const isValidObjectId = (id) => {
  if (ObjectId.isValid(id)) {
    return String(new ObjectId(id)) === id;
  }
  return false;
};
