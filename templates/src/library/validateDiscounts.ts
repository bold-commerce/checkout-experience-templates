import {Dispatch} from 'redux';
import {IError, IOrderInitialization} from 'src/types';
import {deleteDiscounts, postDiscounts, validateDiscount} from 'src/library';
import {errorFields, errorSeverities, errorSubTypes, errorTypes, PLUGIN_BACKEND_DISCOUNT_SOURCE} from 'src/constants';
import {actionAddError} from 'src/action';

export async function validateDiscounts(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const {data: {application_state: {discounts}}} = getState();
    let isValidCode = true;
    for (const discount of discounts) {
        if(discount.source !== PLUGIN_BACKEND_DISCOUNT_SOURCE) {
            await dispatch(deleteDiscounts(discount.code));
            const response = await dispatch(validateDiscount(discount.code, false));
            if (response.success) {
                await dispatch(postDiscounts(discount.code));
            } else {
                isValidCode = false;
            }
        }
    }

    if (!isValidCode){
        const error : IError = {
            message: 'One or more discount codes have been removed because they are not valid for this email address',
            type: errorTypes.validation,
            field: errorFields.discountsFlash,
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.discounts,
            address_type: '',
        };
        await dispatch(actionAddError(error));
    }
}
