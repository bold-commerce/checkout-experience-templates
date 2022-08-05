import {useGetErrorByField} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {errorFields, errorSeverities, errorShowType, errorSubTypes, errorTypes} from 'src/constants';

const store = {
    data: initialDataMock,
    appSetting: {languageIso: 'en'},
    errors: [],
};

const errors = [
    {
        type: errorTypes.validation,
        field: errorFields.email_address,
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.email_address,
        show_type: errorShowType.field,
        section: 'core_info',
        term: 'enter_email',
        address_type: 'test',
        message: 'test',
    },
    {
        field: errorFields.email_address,
        section: 'core_info',
        term: 'enter_email',
        address_type: 'test2',
        message: 'test',
    },
    {
        field: '',
        type: errorTypes.discount_code_validation,
        section: '',
        term: '',
        address_type: '',
        message: 'discount code is invalid',
    }
];
const shippingAddressError = [
    {
        field: errorFields.discounts,
        type: errorTypes.discount_code_validation,
        section: 'discount_code',
        term: 'require_shipping_page',
        address_type: '',
        message: 'Cannot apply discount without a shipping address',
    }
];
const shippingRateError = [
    {
        field: errorFields.discounts,
        type: errorTypes.discount_code_validation,
        section: 'discount_code',
        term: 'require_shipping_page',
        address_type: '',
        message: 'Cannot apply discount without a shipping rate',
    }
];
const emptyMessageError = [
    {
        field: errorFields.discounts,
        type: errorTypes.discount_code_validation,
        section: 'discount_code',
        term: 'require_shipping_page',
        address_type: '',
        message: null,
    }
];

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetErrorByField', () => {
    const hookData = [
        {errors: errors, field: errorFields.email_address, addressType: 'test', type: '', expected: 'Please enter a valid email'},
        {errors: errors, field: errorFields.email_address, addressType: 'test2',type: '', expected: 'test'},
        {errors: errors, field: errorFields.email_address, addressType: '', type: '', expected: ''},
        {errors: errors, field: '', addressType: 'test', type: '', expected: ''},
        {errors: errors, field: '', addressType: '', type: errorTypes.discount_code_validation, expected: 'discount code is invalid'},
        {errors: shippingAddressError, field: errorFields.discounts, addressType: '', type: errorTypes.discount_code_validation, expected: 'Please proceed to shipping page to reapply this discount code'},
        {errors: shippingRateError, field: errorFields.discounts, addressType: '', type: errorTypes.discount_code_validation, expected: 'Please proceed to shipping page to reapply this discount code'},
        {errors: emptyMessageError, field: errorFields.discounts, addressType: '', type: errorTypes.discount_code_validation, expected: null},
        {errors: errors, field: '', addressType: 'test', type: errorTypes.discount_code_validation, expected: ''},

    ];

    test.each(hookData)(
        'rendering the hook properly ($field, $addressType, $expected)',
        ({errors, field, addressType, type, expected}) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            store.errors = errors;

            const {result} = renderHook(() => useGetErrorByField(field, addressType,type));
            expect(result.current).toStrictEqual(expected);
        });

    test('testing with default value', () => {

        const tempError = [{
            type: errorTypes.validation,
            field: errorFields.email_address,
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.email_address,
            show_type: errorShowType.field,
            section: 'core_info',
            term: 'enter_email',
            address_type: '',
        }];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        store.errors = tempError;
        const {result} = renderHook(() => useGetErrorByField(errorFields.email_address));
        expect(result.current).toStrictEqual('Please enter a valid email');
    });
});
