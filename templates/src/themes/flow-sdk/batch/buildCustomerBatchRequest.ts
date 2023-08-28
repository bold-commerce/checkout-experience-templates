import {apiTypeKeys, getApplicationState, IBatchableRequest} from '@boldcommerce/checkout-frontend-library';
import {isObjectEmpty, isObjectEquals} from 'src/utils';

export const buildCustomerBatchRequest = (firstName: string, lastName: string, email: string): IBatchableRequest | null => {
    const {addGuestCustomer, updateCustomer} = apiTypeKeys;
    const {customer: prevCustomer} = getApplicationState();
    const previous = {
        email: prevCustomer.email_address,
        firstName: prevCustomer.first_name,
        lastName: prevCustomer.last_name
    };
    const userLogin = !!prevCustomer.platform_id && prevCustomer.platform_id !== '0';
    if (!userLogin) {
        const payload = {
            first_name: firstName,
            last_name: lastName,
            email_address: email,
            accepts_marketing: prevCustomer.accepts_marketing
        };
        if (isObjectEmpty(previous)) {
            return {apiType: addGuestCustomer, payload};
        } else if (!isObjectEquals({firstName, lastName, email}, previous)) {
            return {apiType: updateCustomer, payload};
        }
    }
    return null;
};
