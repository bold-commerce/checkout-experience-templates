import * as CustomerActions from 'src/action/customerActionType';
import {AnyAction} from 'redux';
import {Constants} from 'src/constants';
import {IAddress, IApplicationStateCustomer} from 'src/types';

export function actionUpdateCustomerEmail (email:string): AnyAction{
    return {
        type: CustomerActions.UPDATE_CUSTOMER_EMAIL,
        payload: {email}
    };
}

export function actionUpdateCustomerField(field:string, value:string): AnyAction{
    return {
        type: CustomerActions.UPDATE_CUSTOMER_FIELD,
        payload: {field, value}
    };
}

export function actionUpdateCustomer(customer: IApplicationStateCustomer): AnyAction{
    return {
        type: CustomerActions.UPDATE_CUSTOMER,
        payload: {customer}
    };
}

export function actionUpdateCustomerAcceptMarketing(value: boolean): AnyAction{
    return {
        type: CustomerActions.UPDATE_CUSTOMER_ACCEPT_MARKETING,
        payload: {value}
    };
}

export function actionSetDefaultCustomerAcceptMarketing(acceptMarketing: string): AnyAction{
    const value = (acceptMarketing === 'checked');
    return {
        type: CustomerActions.UPDATE_CUSTOMER_ACCEPT_MARKETING,
        payload: {value}
    };
}

export function actionUpdateAddressField (field:string, value:string, type: string ): AnyAction{
    if(type === Constants.SHIPPING){
        return actionUpdateShippingAddressField(field, value);
    }
    else
    {
        return actionUpdateBillingAddressField(field, value);
    }
}

export function actionUpdateShippingAddressField (field:string , value:string): AnyAction{
    return {
        type: CustomerActions.UPDATE_SHIPPING_ADDRESS_FIELD,
        payload: {field , value}
    };
}

export function actionUpdateBillingAddressField (field:string , value:string): AnyAction{
    return {
        type: CustomerActions.UPDATE_BILLING_ADDRESS_FIELD,
        payload: {field , value}
    };
}

export function actionUpdateBillingType(type: string, data?: Partial<IAddress>): AnyAction {
    if (type === Constants.SHIPPING_SAME) {
        return {
            type: CustomerActions.UPDATE_BILLING_TYPE_SAME,
            payload: {data}
        };
    }
    else
    {
        return {
            type: CustomerActions.CLEAR_BILLING_INFO,
        };
    }
}

export function actionUpdateBillingAsShipping(data: Partial<IAddress>): AnyAction {
    return {
        type: CustomerActions.UPDATE_BILLING_AS_SHIPPING,
        payload: {data}
    };
}

export function actionPopulateSavedAddressField(type: string, data: IAddress): AnyAction {
    if (type === Constants.SHIPPING) {
        return {
            type: CustomerActions.UPDATE_SHIPPING_SAVED_ADDRESS_FIELD,
            payload: {data}
        };
    }
    else
    {
        return {
            type: CustomerActions.UPDATE_BILLING_SAVED_ADDRESS_FIELD,
            payload: {data}
        };
    }

}

export function actionUpdateAddress(type: string, data: Partial<IAddress>): AnyAction {
    if (type === Constants.SHIPPING) {
        return {
            type: CustomerActions.UPDATE_SHIPPING_ADDRESS,
            payload: {data}
        };
    }
    else
    {
        return {
            type: CustomerActions.UPDATE_BILLING_ADDRESS,
            payload: {data}
        };
    }

}
