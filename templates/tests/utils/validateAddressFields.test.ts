import { Constants } from 'src/constants';
import { validateAddressFields } from 'src/utils';
import { Dispatch } from 'redux';
import { stateMock } from 'src/mocks';


describe('testing validate Address field function', () => {
    const dispatchMock: Dispatch = jest.fn();
    const getStateMock = () => stateMock;

    const dataArray = [
        {
            name: 'call function with proper data',
            validateFields: {first_name: 'joe', last_name: 'smith', address_line_1: '50 fultz', postal_code: 'R2J2X6', province_code: 'MB', country_code: 'CA', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 0,
            expected: true
        },
        {
            name: 'call function with partial incomplete data',
            validateFields: {first_name: '', last_name: '', address_line_1: '50 fultz', postal_code: 'R2J2X6', province_code: 'MB', country_code: 'CA', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 2,
            expected: false
        },
        {
            name: 'call function with incomplete data',
            validateFields: {first_name: '', last_name: '', address_line_1: '', postal_code: '', province_code: '', country_code: '', city: ''},
            type: Constants.SHIPPING,
            called: 7,
            expected: false
        },
        {
            name: 'call function with unsupported country',
            validateFields: {first_name: 'Joe', last_name: 'Smith', address_line_1: '50 fultz', postal_code: 'R2J2X6', province_code: 'MB', country_code: 'IT', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 1,
            expected: false,
        },
        {
            name: 'call function with unsupported province_code',
            validateFields: {first_name: 'Joe', last_name: 'Smith', address_line_1: '50 fultz', postal_code: 'R2J2X6', province_code: 'ZZ', country_code: 'CA', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 1,
            expected: false,
        },
        {
            name: 'call function with undefined data',
            validateFields: {first_name: '', last_name: '', address_line_1: '', postal_code: '', province_code: undefined, country_code: undefined, city: ''},
            type: Constants.SHIPPING,
            called: 6,
            expected: false
        },
    ];

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test.each(dataArray)('$name', async ({validateFields, type, called, expected}) => {
        const result = validateAddressFields(validateFields, type , dispatchMock, getStateMock);

        expect(dispatchMock).toHaveBeenCalledTimes(called);
        expect(result).toBe(expected);
    });

});
