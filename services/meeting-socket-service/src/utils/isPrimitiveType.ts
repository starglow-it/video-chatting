export const isPrimitive = (value: any, allowNull?: boolean) => {
    const notPrimitiveArr = ['object', 'function'];
    if(!allowNull){
        if(value === null){
            return false;
        }
    }
    if(!notPrimitiveArr.includes(typeof value) || value === null){
        return true;
    }
    return false;
}