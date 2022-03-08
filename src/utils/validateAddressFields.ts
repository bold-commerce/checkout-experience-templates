import {IAddress, IError} from 'src/types';
import {errorFields, errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {actionAddError} from 'src/action';
import {Dispatch} from 'redux';

export function validateAddressFields(validationFields: Partial<IAddress>, type: string, dispatch: Dispatch): boolean{
    const isEmptyArray = Object.values(validationFields).filter(x => x === null || x === '');
    let isValidated = true;
    if(isEmptyArray.length > 0){
        const error : IError = {
            message: '',
            type: errorTypes.address,
            field: errorFields.province,
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.empty,
            address_type: type
        };
        Object.entries(validationFields).forEach(([key, value]) => {
            if(value === ''){
                isValidated = false;
                const e = {...error};
                e.field = key;
                dispatch(actionAddError(e));
            }
        });
    }
    return isValidated;
}
