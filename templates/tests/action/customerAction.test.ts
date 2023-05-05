import {
    actionPopulateSavedAddressField, actionSetDefaultCustomerAcceptMarketing, actionUpdateAddress,
    actionUpdateAddressField, actionUpdateBillingAddressField, actionUpdateBillingAsShipping, actionUpdateBillingType,
    actionUpdateCustomer,
    actionUpdateCustomerAcceptMarketing,
    actionUpdateCustomerEmail,
    actionUpdateCustomerField, actionUpdateShippingAddressField
} from 'src/action';
import * as CustomerActions from 'src/action/customerActionType';
import {initialDataMock} from 'src/mocks';
import {Constants} from 'src/constants';
import {IAddress} from '@boldcommerce/checkout-frontend-library';

describe('Testing Customer Actions', () => {

    test('actionUpdateCustomerEmail', () => {
        const email = 'test@bold.com';
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_CUSTOMER_EMAIL,
            payload: {email}
        };

        const result = actionUpdateCustomerEmail(email);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateCustomerField', () => {
        const field = 'test';
        const value = 'value';
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_CUSTOMER_FIELD,
            payload: {field, value}
        };

        const result = actionUpdateCustomerField(field, value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateCustomer', () => {
        const customer = initialDataMock.application_state.customer;
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_CUSTOMER,
            payload: {customer}
        };

        const result = actionUpdateCustomer(customer);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateCustomerAcceptMarketing', () => {
        const value = true;
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_CUSTOMER_ACCEPT_MARKETING,
            payload: {value}
        };

        const result = actionUpdateCustomerAcceptMarketing(value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    const actionUpdateAddressFieldData = [
        {actionType: CustomerActions.UPDATE_SHIPPING_ADDRESS_FIELD, type: Constants.SHIPPING, field: 'test', value: 'value'},
        {actionType: CustomerActions.UPDATE_BILLING_ADDRESS_FIELD, type: Constants.BILLING, field: 'test', value: 'value'}
    ];

    test.each(actionUpdateAddressFieldData)(
        'actionUpdateAddressField ($type, $field, $value)',
        ({actionType, type, field, value}) => {
            const actionReturnExpectation = {
                type: actionType,
                payload: {field, value}
            };

            const result = actionUpdateAddressField(field, value, type);

            expect(result).toStrictEqual(actionReturnExpectation);
        });

    test('actionUpdateShippingAddressField', () => {
        const field = 'test';
        const value = 'value';
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_SHIPPING_ADDRESS_FIELD,
            payload: {field, value}
        };

        const result = actionUpdateShippingAddressField(field, value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    test('actionUpdateBillingAddressField', () => {
        const field = 'test';
        const value = 'value';
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_BILLING_ADDRESS_FIELD,
            payload: {field, value}
        };

        const result = actionUpdateBillingAddressField(field, value);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    const actionUpdateBillingTypeData = [
        {actionType: CustomerActions.UPDATE_BILLING_TYPE_SAME, type: Constants.SHIPPING_SAME, data: initialDataMock.application_state.addresses.shipping as IAddress},
        {actionType: CustomerActions.CLEAR_BILLING_INFO, type: ''},
    ];

    test.each(actionUpdateBillingTypeData)(
        'actionUpdateBillingType ($actionType, $type)',
        ({actionType, type, data }) => {
            const actionReturnExpectation = {
                type: actionType,
                ...(data && {payload: {data}}),
            };
            const result = actionUpdateBillingType(type, data);

            expect(result).toStrictEqual(actionReturnExpectation);
        });

    test('actionUpdateBillingAsShipping', () => {
        const data = initialDataMock.application_state.addresses.billing;
        const actionReturnExpectation = {
            type: CustomerActions.UPDATE_BILLING_AS_SHIPPING,
            payload: {data}
        };

        const result = actionUpdateBillingAsShipping(data);

        expect(result).toStrictEqual(actionReturnExpectation);
    });

    const actionPopulateSavedAddressFieldData = [
        {actionType: CustomerActions.UPDATE_SHIPPING_SAVED_ADDRESS_FIELD, type: Constants.SHIPPING, data: initialDataMock.application_state.addresses.billing as IAddress},
        {actionType: CustomerActions.UPDATE_BILLING_SAVED_ADDRESS_FIELD, type: Constants.BILLING, data: initialDataMock.application_state.addresses.billing as IAddress},
    ];

    test.each(actionPopulateSavedAddressFieldData)(
        'actionPopulateSavedAddressField ($actionType, $type)',
        ({actionType, type, data}) => {
            const actionReturnExpectation = {
                type: actionType,
                payload: {data}
            };

            const result = actionPopulateSavedAddressField(type, data);

            expect(result).toStrictEqual(actionReturnExpectation);
        });

    const actionUpdateAddressData = [
        {actionType: CustomerActions.UPDATE_SHIPPING_ADDRESS, type: Constants.SHIPPING, data: initialDataMock.application_state.addresses.shipping},
        {actionType: CustomerActions.UPDATE_BILLING_ADDRESS, type: Constants.BILLING, data: initialDataMock.application_state.addresses.billing},
    ];

    test.each(actionUpdateAddressData)(
        'actionUpdateAddress ($actionType, $type)',
        ({actionType, type, data}) => {

            const resultData = {...data};
            delete resultData.id;
            const actionReturnExpectation = {
                type: actionType,
                payload: {data: resultData}
            };

            const result = actionUpdateAddress(type, data);

            expect(result).toStrictEqual(actionReturnExpectation);
        });

    const actionSetDefaultCustomerAcceptMarketingData = [
        {acceptMarketing: 'hidden', value: false},
        {acceptMarketing: 'checked', value: true},
    ];

    test.each(actionSetDefaultCustomerAcceptMarketingData)(
        'actionUpdateAddress ($actionType, $type)',
        ({acceptMarketing, value}) => {
            const actionReturnExpectation = {
                type: CustomerActions.UPDATE_CUSTOMER_ACCEPT_MARKETING,
                payload: {value}
            };

            const result = actionSetDefaultCustomerAcceptMarketing(acceptMarketing);

            expect(result).toStrictEqual(actionReturnExpectation);
        });
});
