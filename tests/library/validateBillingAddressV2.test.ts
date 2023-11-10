import {
    validateAddressFunctionV2,
    validateBillingAddressV2,
} from 'src/library';
import {stateMock} from 'src/mocks';

describe('testing validateBillingAddressFunctionV2', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        dispatchMock.mockImplementation(fun => {
            switch (fun) {
                case validateAddressFunctionV2:
                    return [];
                default:
                    return Promise.resolve();
            }
        });
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling validate billing address v2 with same', async () => {
        getStateMock.mockReturnValue(stateMock);

        const validateBillingAddressPayload = validateBillingAddressV2(dispatchMock, getStateMock);
        expect(validateBillingAddressPayload).toStrictEqual([
            {
                apiType: 'setBillingAddress',
                payload: {
                    id: null,
                    first_name: 'John',
                    last_name: 'Doe',
                    address_line_1: '50 Fultz Boulevard',
                    country: 'Canada',
                    city: 'Winnipeg',
                    province: 'Manitoba',
                    country_code: 'CA',
                    province_code: 'MB',
                    postal_code: 'R3Y 0L6',
                    business_name: 'Bold Commerce',
                    address_line_2: '',
                    phone_number: ''
                }
            }
        ]);
    });
});
