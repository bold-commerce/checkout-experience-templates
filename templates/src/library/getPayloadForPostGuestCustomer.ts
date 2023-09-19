import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IBatchableRequest,
    getCustomer,
    ICustomer,
    apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';
import {isObjectEmpty} from 'src/utils';
import {getPayloadForUpdateCustomer} from 'src/library';

export function getPayloadForPostGuestCustomer(dispatch: Dispatch, getState: () => IOrderInitialization): IBatchableRequest | null{
    const state = getState();
    const {data: {application_state: {customer}}} = state;
    const prevCustomer: ICustomer = getCustomer();
    const previous = {email_address: prevCustomer.email_address, first_name: prevCustomer.first_name , last_name: prevCustomer.last_name};

    if (isObjectEmpty(previous)){
        return {apiType: apiTypeKeys.addGuestCustomer, payload: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            email_address: customer.email_address,
            accepts_marketing: customer.accepts_marketing}};
    } else {
        const updateCustomerBatch = dispatch(getPayloadForUpdateCustomer);
        if (updateCustomerBatch) {
            return updateCustomerBatch;
        } else {
            return null;
        }
    }
}
