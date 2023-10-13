import {
    IBatchableRequest,
    getCustomer,
    ICustomer,
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

    if(!isObjectEquals(prevCustomer, customer)){
        callPostAPI = true;
    }

    if (callPostAPI){
        const postGuestCustomerBatch = getPayloadForPostGuestCustomer(dispatch, getState);
        if (postGuestCustomerBatch) {
            batch.push(postGuestCustomerBatch);
        }
    }
    return batch;
}
