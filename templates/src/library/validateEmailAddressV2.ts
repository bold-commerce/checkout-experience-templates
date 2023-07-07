import {
    IBatchableRequest,
    getCustomer,
    ICustomer,
    apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';
import {isObjectEquals} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getPayloadForPostGuestCustomer} from 'src/library';

export function validateEmailAddressV2(dispatch: Dispatch, getState: () => IOrderInitialization): Array<IBatchableRequest> {
    const {data: {application_state: {customer}}} = getState();
    const batch : Array<IBatchableRequest> = [];
    let callPostAPI = false;
    const prevCustomer: ICustomer = getCustomer();
    const prevEmail = prevCustomer.email_address;

    if(!isObjectEquals(prevCustomer, customer)){
        callPostAPI = true;
    }

    if (customer.email_address === '' || prevEmail !== customer.email_address) {
        batch.push({apiType: apiTypeKeys.validateEmail, payload:{email_address: customer.email_address}});
    }

    if (callPostAPI){
        const postGuestCustomerBatch = getPayloadForPostGuestCustomer(dispatch, getState);
        if (postGuestCustomerBatch) {
            batch.push(postGuestCustomerBatch);
        }
    }
    return batch;
}
