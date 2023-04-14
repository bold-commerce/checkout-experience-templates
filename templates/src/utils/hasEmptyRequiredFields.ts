import {isObjectEmpty} from 'src/utils';

/* 
    return true if the object is null or undefined
    return true if any of the objects required fields are empty null or undefined 
*/

export const hasEmptyRequiredFields = (requiredFields: string[], object: Record<string, unknown> | null | undefined): boolean => {
    if(object === null || object === undefined) {
        return true;
    }
    return requiredFields.filter(key => isObjectEmpty(object[key] as string)).length !== 0;
};