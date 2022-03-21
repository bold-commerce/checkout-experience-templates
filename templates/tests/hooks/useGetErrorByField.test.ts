import {useGetErrorByField} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {initialDataMock} from 'src/mocks';
import {errorFields, errorSeverities, errorShowType, errorSubTypes, errorTypes} from 'src/constants';

const store = {
    data: initialDataMock,
    appSetting: {languageIso: 'en'},
    errors: [
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
    ],
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing useGetErrorByField', () => {
    const hookData = [
        {field: errorFields.email_address, addressType: 'test', type: '', expected: 'Please enter a valid email'},
        {field: errorFields.email_address, addressType: 'test2',type: '', expected: 'test'},
        {field: errorFields.email_address, addressType: '', type: '', expected: ''},
        {field: '', addressType: 'test', type: '', expected: ''},
        {field: '', addressType: '', type: errorTypes.discount_code_validation, expected: 'discount code is invalid'},
        {field: '', addressType: 'test', type: errorTypes.discount_code_validation, expected: ''},

    ];

    test.each(hookData)(
        'rendering the hook properly ($field, $addressType, $expected)',
        ({field, addressType, type, expected}) => {

            const {result} = renderHook(() => useGetErrorByField(field, addressType,type));
            expect(result.current).toStrictEqual(expected);
        });
});
