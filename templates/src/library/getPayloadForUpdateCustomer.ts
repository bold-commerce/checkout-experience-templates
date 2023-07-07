import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    IBatchableRequest,
    ICustomer,
    getCustomer, apiTypeKeys
} from '@boldcommerce/checkout-frontend-library';
import {isObjectEquals} from 'src/utils';


export function getPayloadForUpdateCustomer(dispatch: Dispatch, getState: () => IOrderInitialization): IBatchableRequest | null {
    const {data: {application_state: {customer}}} = getState();
    const prevCustomer: ICustomer = getCustomer();

    if(!isObjectEquals(customer, prevCustomer)){
        return {apiType: apiTypeKeys.updateCustomer, payload: {
            first_name: customer.first_name,
            last_name: customer.last_name,
            email_address: customer.email_address,
            accepts_marketing: customer.accepts_marketing}};
    }
    return null;
}
