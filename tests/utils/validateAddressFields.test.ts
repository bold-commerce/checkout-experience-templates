import {Constants} from 'src/constants';
import {validateAddressFields} from 'src/utils';
import {Dispatch} from 'redux';


describe('testing validate Address field function', () => {
    let dispatchMock: Dispatch;
    const dataArray = [
        {
            name: 'call function with proper data',
            validateFields: {first_name: 'joe', last_name: 'smith', address_line_1: '50 fultz', postal_code: 'R2J2X6', province: 'MB', country_code: 'CA', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 0,
            expected: true
        },
        {
            name: 'call function with partial incomplete data',
            validateFields: {first_name: '', last_name: '', address_line_1: '50 fultz', postal_code: 'R2J2X6', province: 'MB', country_code: 'CA', city: 'Winnipeg'},
            type: Constants.SHIPPING,
            called: 2,
            expected: false
        },
        {
            name: 'call function with incomplete data',
            validateFields: {first_name: '', last_name: '', address_line_1: '', postal_code: '', province: '', country_code: '', city: ''},
            type: Constants.SHIPPING,
            called: 7,
            expected: false
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock = jest.fn();
    });

    test.each(dataArray)( '$name', async ({validateFields, type, called, expected}) => {
        const result = validateAddressFields(validateFields, type , dispatchMock);
        expect(dispatchMock).toHaveBeenCalledTimes(called);
        expect(result).toBe(expected);
    });

});
