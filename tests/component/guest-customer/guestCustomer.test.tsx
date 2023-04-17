import {IUseGuestCustomer} from 'src/types';
import {mocked} from 'jest-mock';
import {useGetCustomerInfoData, useGuestCustomer, useLogin} from 'src/hooks';
import {render} from '@testing-library/react';
import {GuestCustomer} from 'src/components';
import React from 'react';
import {initialDataMock, storeMock} from 'src/mocks';
import {isShopifyPlatform} from 'src/utils';

jest.mock('src/hooks/useGuestCustomer');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useLogin');
jest.mock('src/utils/isShopifyPlatform');
const isShopifyPlatformMock = mocked(isShopifyPlatform, true);
const useGuestCustomerMock = mocked(useGuestCustomer, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useLoginMock = mocked(useLogin, true);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

describe('Testing GuestCustomer component', () => {

    const hooksReturn: IUseGuestCustomer = {
        email: 'test-email',
        getTerm: jest.fn(),
        emailError: '',
        handleChange: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: false,
        acceptMarketingHidden: false
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useLoginMock.mockReturnValue({
            loginUrl: jest.fn(),
            handleCheckboxChange: jest.fn(),
            acceptMarketingChecked: true,
            email: 'test',
            acceptMarketingHidden: false
        });
    });

    test('Rendering the component correctly', () => {
        isShopifyPlatformMock.mockReturnValueOnce(true);
        useGuestCustomerMock.mockReturnValueOnce(hooksReturn);
        const {container} = render(<GuestCustomer/>);
        expect(container.getElementsByClassName('customer-information').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__email').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

    test('Rendering the component with hidden field', () => {
        isShopifyPlatformMock.mockReturnValueOnce(true);
        const tempHooksReturn = {...hooksReturn, acceptMarketingHidden: true};
        useGuestCustomerMock.mockReturnValueOnce(tempHooksReturn);
        const {container} = render(<GuestCustomer/>);
        expect(container.getElementsByClassName('hidden').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

    test('Rendering the component correctly without login link', () => {
        isShopifyPlatformMock.mockReturnValueOnce(false);
        useGuestCustomerMock.mockReturnValueOnce(hooksReturn);
        const {container} = render(<GuestCustomer/>);
        expect(container.getElementsByClassName('customer-information').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__email').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

});
