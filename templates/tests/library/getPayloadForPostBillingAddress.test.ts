import {
    baseReturnObject, getBillingAddress,
    getShippingAddress, IAddress,
    setShippingAddress,
    updateShippingAddress
} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionSetAppStateValid, SET_VALID} from 'src/action';
import {API_RETRY, defaultAddressState} from 'src/constants';
import {
    getPayloadForPostBillingAddress,
    getPayloadForPostShippingAddress,
    postShippingAddress,
    setShippingAddressAsValid
} from 'src/library';
import {addressMock, stateMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';
import {AnyAction} from 'redux';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('src/action');
jest.mock('src/utils/handleErrorIfNeeded');
const getAddressesMock = mocked(getBillingAddress, true);
const actionSetAppStateValidMock = mocked(actionSetAppStateValid, true);

describe('testing getPayloadForPostBillingAddress', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const actionReturnMock: AnyAction = {type: SET_VALID};
    const newBillingAddressMock : IAddress = {
        id: null,
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '51 Fultz Boulevard',
        country: 'Canada',
        city: 'Winnipeg',
        province: 'Manitoba',
        country_code: 'CA',
        province_code: 'MB',
        postal_code: 'R3Y 0L6',
        business_name: 'Bold Commerce',
        address_line_2: '',
        phone_number: ''
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        actionSetAppStateValidMock.mockReturnValue(actionReturnMock);
        getAddressesMock.mockReturnValue(stateMock.data.application_state.addresses.billing);
    });

    test('calling getPayloadForPostBillingAddress with same shipping address returns null', async () => {
        const postBillingPayload = getPayloadForPostBillingAddress(dispatch, getState);
        expect(postBillingPayload).toStrictEqual(null);
    });

    test('calling getPayloadForPostShippingAddress with new shipping address returns payload', async () => {
        getAddressesMock.mockReturnValue(newBillingAddressMock);
        const postBillingPayload = getPayloadForPostBillingAddress(dispatch, getState);
        expect(postBillingPayload).toStrictEqual({
            'apiType': 'setBillingAddress',
            'payload': {
                'address_line_1': '100 Main Street',
                'address_line_2': 'Unit 123',
                'business_name': 'Bold Commerce',
                'city': 'Winnipeg',
                'country': 'Canada',
                'country_code': 'CA',
                'first_name': 'Jane',
                'last_name': 'Doe',
                'phone_number': '',
                'postal_code': 'R3Z 4S2',
                'province': 'Manitoba',
                'province_code': 'MB'
            }
        });
    });
});
