import {IError} from 'src/types';
import {errorFields, errorSeverities, errorShowType, errorsTerms, errorTypes} from 'src/constants';

export function isOnlyDiscountCodeError(errors: IError[]): boolean {
    if (errors.length === 1) {
        const errorReturned = errors[0];

        const isDiscountCodeError = errorFields.code === errorReturned.field &&
            errorTypes.authorization === errorReturned.type &&
            errorSeverities.validation === errorReturned.severity &&
            '' === errorReturned.sub_type &&
            '' === errorReturned.address_type;
        const isDiscountFlashError = errorsTerms.find(e =>
            e.type === errorReturned.type &&
            e.field === errorReturned.field &&
            e.severity === errorReturned.severity &&
            e.subType === errorReturned.sub_type &&
            e.showType === errorShowType.discountFlash);
        return isDiscountCodeError || !!isDiscountFlashError;
    }

    return false;
}
