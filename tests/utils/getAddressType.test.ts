import {getAddressType} from 'src/utils';
import {IApiErrorResponse} from '@boldcommerce/checkout-frontend-library';

describe('Test getAddressType', () => {

    test('testing empty addressType', () => {
        const error: IApiErrorResponse = {
            message: 'some message',
            field: 'some field',
            type: 'some type',
            severity: 'some severity',
            sub_type: 'some sub type'
        };
        expect(getAddressType('', error)).toStrictEqual('');
    });

    test('testing non-empty addressType', () => {
        const error: IApiErrorResponse = {
            message: 'some message',
            field: 'some field',
            type: 'some type',
            severity: 'some severity',
            sub_type: 'some sub type'
        };
        expect(getAddressType('abc', error)).toStrictEqual('abc');
    });


    test('testing empty addressType with shipping address subType', () => {
        const error: IApiErrorResponse = {
            message: 'some message',
            field: 'some field',
            type: 'some type',
            severity: 'some severity',
            sub_type: 'shipping_address'
        };
        expect(getAddressType('', error)).toStrictEqual('shipping');
    });

    test('testing empty addressType with billing address subType', () => {
        const error: IApiErrorResponse = {
            message: 'some message',
            field: 'some field',
            type: 'some type',
            severity: 'some severity',
            sub_type: 'billing_address'
        };
        expect(getAddressType('', error)).toStrictEqual('billing');
    });
});
