import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    updateCustomer as putGuestCustomer,
    IApiReturnObject,
    ICustomer,
    getCustomer
} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {getCustomerFromLib, validateDiscounts} from 'src/library';


export async function updateCustomer(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const {data: {application_state: {customer}}} = getState();
    const prevCustomer: ICustomer = getCustomer();

    if(!isObjectEquals(customer, prevCustomer)){
        const response: IApiReturnObject = await putGuestCustomer(customer.first_name,
            customer.last_name,
            customer.email_address,
            customer.accepts_marketing);

        handleErrorIfNeeded(response, dispatch, getState);

        if (response.success) {
            await dispatch(getCustomerFromLib);
            await dispatch(validateDiscounts);
        }
    }
}
