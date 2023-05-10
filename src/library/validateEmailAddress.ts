import {IApiReturnObject, getCustomer, validateEmail, ICustomer} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {postGuestCustomer} from 'src/library';
import {API_RETRY} from 'src/constants';

export async function validateEmailAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void>{
    const {data: {application_state: {customer}}} = getState();
    let callPostAPI = false;
    const prevCustomer: ICustomer = getCustomer();
    const prevEmail = prevCustomer.email_address;

    if(!isObjectEquals(prevCustomer, customer)){
        callPostAPI = true;
    }

    if (customer.email_address === '' || prevEmail !== customer.email_address) {
        const response:IApiReturnObject = await validateEmail(customer.email_address, API_RETRY);
        handleErrorIfNeeded(response, dispatch, getState);

        if(response.success){
            callPostAPI = true;
        }
    }

    if (callPostAPI){
        await postGuestCustomer(dispatch, getState);
    }
}
