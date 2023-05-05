import {billingReducer, shippingReducer} from 'src/reducer';
import {
    CLEAR_BILLING_INFO,
    UPDATE_BILLING_ADDRESS_FIELD,
    UPDATE_BILLING_SAVED_ADDRESS_FIELD,
    UPDATE_BILLING_TYPE_SAME,
    UPDATE_SHIPPING_ADDRESS_FIELD,
    UPDATE_SHIPPING_SAVED_ADDRESS_FIELD
} from 'src/action';
import {defaultAddressState} from 'src/constants';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

describe('testing shipping Reducer', () => {

    const defaultAddress: Partial<IAddress> = {
        'address_line_1': '50 Fultz Boulevard',
        'city': 'Winnipeg',
        'country': 'Canada',
        'country_code': 'CA',
        'first_name': 'John',
        'last_name': 'Doe',
        'postal_code': 'R3Y 0L6',
        'province': 'Manitoba',
        'province_code': 'MB',
        'address_line_2': '',
        'business_name': 'Bold Commerce',
        'id': null,
        'phone_number': ''
};

    test('should return the initial state ', () => {
        expect(shippingReducer(undefined , {type: ''})).toEqual(
            defaultAddress
        );
    });

    test('should change the field name in state ', () => {

        const name = 'James';
        const state = shippingReducer(undefined ,
            {type: UPDATE_SHIPPING_ADDRESS_FIELD, payload: { field: 'first_name' , value: name} });

        expect(state.first_name).toEqual(name);
    });

    test('should update address from saved addresses ', () => {

        const address = {...defaultAddress};
        address.first_name = 'James';
        const state = shippingReducer(undefined ,
            {type: UPDATE_SHIPPING_SAVED_ADDRESS_FIELD, payload: {data: address} });

        expect(state.first_name).toEqual('James');
    });
});


describe('testing Billing Reducer', () => {

    const defaultAddress: Partial<IAddress> = {
        'address_line_1': '100 Main Street',
        'address_line_2': 'Unit 123',
        'business_name': 'Bold Commerce',
        'city': 'Winnipeg',
        'country': 'Canada',
        'country_code': 'CA',
        'first_name': 'Jane',
        'last_name': 'Doe',
        'postal_code': 'R3Z 4S2',
        'province': 'Manitoba',
        'province_code': 'MB',
        'phone_number': ''
    };

    test('should return the initial state ', () => {
        expect(billingReducer(undefined , {type: ''})).toEqual(
            defaultAddress
        );
    });

    test('should change the field name in state ', () => {

        const name = 'James';
        const state = billingReducer(undefined ,
            {type: UPDATE_BILLING_ADDRESS_FIELD, payload: { field: 'first_name' , value: name} });

        expect(state.first_name).toEqual(name);
    });

    test('should clear the billing address ', () => {

        const state = billingReducer(undefined ,
            {type: CLEAR_BILLING_INFO, payload: {} });

        expect(state).toEqual(defaultAddressState);
    });

    test('should update address from saved addresses ', () => {

        const address = {...defaultAddress};
        address.first_name = 'James';
        const state = billingReducer(undefined ,
            {type: UPDATE_BILLING_SAVED_ADDRESS_FIELD, payload: {data: address} });

        expect(state.first_name).toEqual('James');
    });

    test('should update address address same as shipping ', () => {

        const shippingState = shippingReducer(undefined , {type: ''});
        const billingState = billingReducer(undefined , {type: ''});

        expect(shippingState).not.toEqual(billingState);

        const state = billingReducer(undefined ,
            {type: UPDATE_BILLING_TYPE_SAME, payload: { data: shippingState } });

        expect(state).toEqual(shippingState);
    });
});
