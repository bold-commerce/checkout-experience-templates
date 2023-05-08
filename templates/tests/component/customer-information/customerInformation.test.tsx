import {mocked} from 'jest-mock';
import {
    useGetCustomerInfoData,
    useGetSavedAddressData,
    useGetSavedAddressOptions,
    useIsUserAuthenticated,
    useLogin
} from 'src/hooks';
import {render} from '@testing-library/react';
import {CustomerInformation} from 'src/components';
import React from 'react';
import {initialDataMock, storeMock} from 'src/mocks';
import {ISavedAddressHookProps} from 'src/types';
import {IAddress} from '@boldcommerce/checkout-frontend-library';
import {isShopifyPlatform} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));
jest.mock('src/utils/isShopifyPlatform');
const isShopifyPlatformMock = mocked(isShopifyPlatform, true);

jest.mock('src/hooks');

const useLoginMock = mocked(useLogin, true);
const useIsUserAuthenticatedMock = mocked(useIsUserAuthenticated, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);
const useGetSavedAddressDataMock = mocked(useGetSavedAddressData, true);

describe('Testing CustomerInformation component', () => {

    const savedAddresses: Array<IAddress> = [
        {...initialDataMock.application_state.addresses.shipping, id: '1'} as IAddress,
        {...initialDataMock.application_state.addresses.billing, id: '2'} as IAddress
    ];
    const savedAddressData: ISavedAddressHookProps = {
        placeholder: 'test',
        title: 'test',
        label: 'test-label',
        selectedOptionId: undefined,
        id: 'test-id',
        options: [],
        savedAddresses: savedAddresses,
        handleChange: jest.fn()
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useGetSavedAddressOptionsMock.mockReturnValue(initialDataMock.application_state.customer.saved_addresses);
        useLoginMock.mockReturnValue({
            loginUrl: jest.fn(),
            handleCheckboxChange: jest.fn(),
            acceptMarketingChecked: true,
            email: 'test',
            acceptMarketingHidden: false
        });
        useGetSavedAddressDataMock.mockReturnValue(savedAddressData);
    });

    test('customer information component - authenticated user - any platform but custom', () => {
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        isShopifyPlatformMock.mockReturnValue(true);
        const {container} = render(<CustomerInformation/>);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated-not-you').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);

    });

    test('customer information component - authenticated user - bold_platform', () => {
        useIsUserAuthenticatedMock.mockReturnValueOnce(true);
        isShopifyPlatformMock.mockReturnValue(false);
        const {container} = render(<CustomerInformation/>);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated-not-you').length).toBe(0);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);

    });

    test('customer information component - guest user', () => {
        useIsUserAuthenticatedMock.mockReturnValueOnce(false);

        const {container} = render(<CustomerInformation/>);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(0);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
    });

});
