import {IError} from 'src/types';
import {errorFields, errorSeverities, errorTypes} from 'src/constants';

export function isOnlyDiscountCodeError(errors: IError[]): boolean {
    if (errors.length === 1) {
        const errorReturned = errors[0];

        return errorFields.code === errorReturned.field &&
            errorTypes.authorization === errorReturned.type &&
            errorSeverities.validation === errorReturned.severity &&
            '' === errorReturned.sub_type &&
            '' === errorReturned.address_type;
    }

    return false;
}
