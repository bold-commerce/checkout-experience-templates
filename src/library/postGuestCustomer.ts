import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {IApiReturnObject, addGuestCustomer, getCustomer, ICustomer} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEmpty} from 'src/utils';
import {getCustomerFromLib, updateCustomer} from 'src/library';
import {API_RETRY} from 'src/constants';

export async function postGuestCustomer(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const state = getState();
    const {data: {application_state: {customer}}} = state;
    const prevCustomer: ICustomer = getCustomer();
    const previous = {email_address: prevCustomer.email_address, first_name: prevCustomer.first_name , last_name: prevCustomer.last_name};

    if (isObjectEmpty(previous)){
        const response: IApiReturnObject = await addGuestCustomer(customer.first_name,
            customer.last_name,
            customer.email_address,
            customer.accepts_marketing,
            API_RETRY);

        handleErrorIfNeeded(response, dispatch, getState);

        if (response.success) {
            await dispatch(getCustomerFromLib);
        }
    } else {
        await dispatch(updateCustomer);
    }
}
