import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    apiTypeKeys,
    getBillingAddress,
    IBatchableRequest,
} from '@boldcommerce/checkout-frontend-library';
import {Constants} from 'src/constants';
import {validateAddressFunctionV2} from 'src/library';
import {actionRemoveErrorByAddressType, actionUpdateBillingAsShipping} from 'src/action';

export function validateBillingAddressV2(dispatch: Dispatch, getState: () => IOrderInitialization):  Array<IBatchableRequest> {
    const currentState = getState();
    const batch : Array<IBatchableRequest> = [];
    const billingType = currentState.appSetting.billingType;
    const shipping = currentState.data.application_state.addresses.shipping;
    dispatch(actionRemoveErrorByAddressType(Constants.BILLING));

    if(billingType === Constants.SHIPPING_SAME){
        dispatch(actionUpdateBillingAsShipping(shipping));
        batch.push({apiType: apiTypeKeys.setBillingAddress, payload: shipping});
    } else{
        const address = getState().data.application_state.addresses.billing;
        const libraryAddress = getBillingAddress();
        const validateBillingPayload = dispatch(validateAddressFunctionV2(Constants.BILLING, address, libraryAddress));
        batch.push(...validateBillingPayload);
    }
    return batch;
}
