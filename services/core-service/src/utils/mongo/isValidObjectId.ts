const ObjectId = require('mongoose').Types.ObjectId;

export const isValidObjectId = (id) => {
    if(ObjectId.isValid(id)){
        return (String)(new ObjectId(id)) === id;
    }
    return false;
}