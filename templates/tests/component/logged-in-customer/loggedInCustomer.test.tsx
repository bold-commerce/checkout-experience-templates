import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {useGetSavedAddressOptions, useLogin} from 'src/hooks';
import {LoggedInCustomer} from 'src/components';
import {getTerm, isShopifyPlatform} from 'src/utils';
import React from 'react';
import {storeMock} from 'src/mocks';

jest.mock('src/hooks/useLogin');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetAddressData');
jest.mock('src/utils/isShopifyPlatform');
const isShopifyPlatformMock = mocked(isShopifyPlatform, true);
const useLoginMock = mocked(useLogin, true);
const getTermMock = mocked(getTerm, true);
const useGetSavedAddressOptionsMock = mocked(useGetSavedAddressOptions, true);

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(storeMock)),
    useDispatch: () => mockDispatch
}));

describe('Testing LoggedInCustomer component', () => {
    const hooksReturn = {
        loginUrl: jest.fn(),
        handleCheckboxChange: jest.fn(),
        acceptMarketingChecked: true,
        email: 'test',
        acceptMarketingHidden: false
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock
            .mockReturnValueOnce('customer-info-test')
            .mockReturnValueOnce('not-you-test')
            .mockReturnValueOnce('accepts-marketing-test');
        useGetSavedAddressOptionsMock.mockReturnValue(storeMock.data.application_state.customer.saved_addresses);
    });

    test('Rendering the component correctly', () => {
        isShopifyPlatformMock.mockReturnValueOnce(true);
        useLoginMock.mockReturnValueOnce(hooksReturn);
        const {container} = render(<LoggedInCustomer/>);
        expect(container.getElementsByClassName('customer-information').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__field-section').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__authenticated-email').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
        expect(container.getElementsByClassName('address__saved').length).toBe(1);
        expect(container.getElementsByTagName('a').length).toBe(1);
    });

    test('Rendering the component with hidden field', () => {
        isShopifyPlatformMock.mockReturnValueOnce(true);
        const tempHooksReturn = {...hooksReturn, acceptMarketingHidden: true};
        useLoginMock.mockReturnValueOnce(tempHooksReturn);
        const {container} = render(<LoggedInCustomer/>);
        expect(container.getElementsByClassName('hidden').length).toBe(1);
        expect(container.getElementsByClassName('customer-information__accepts-marketing').length).toBe(1);
    });

});
