import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {Constants} from 'src/constants';
import {useGetThankYou, useGetCustomerInfoData, useGetValidVariable} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {IUseGetThankYou} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/utils');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetValidVariable');
const getTermMock = mocked(getTerm, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);

describe('Testing hook useGetThankYou', () => {
    const shopUrl = 'test-shop.alias.com';
    const mockResponse: IUseGetThankYou = {
        returnUrl: jest.fn(),
        thankYouTitle: `Thank you, ${initialDataMock.application_state.customer.first_name}!`,
        terms: {
            thankYou: 'Thank you',
            orderConfirmed: 'Order confirmed',
            orderConfirmedText: 'Order confirmed text',
            keepShopping: 'Keep shopping'
        },
        isGeneric: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
        window.shopAlias = shopUrl;
        getTermMock.mockReturnValue('');
        useGetCustomerInfoDataMock.mockReturnValue(initialDataMock.application_state.customer);
        useGetValidVariableMock.mockReturnValue(true);

        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
    });

    test('rendering the hook with customer first_name', () => {
        getTermMock
            .mockReturnValueOnce(mockResponse.terms.thankYou)
            .mockReturnValueOnce(mockResponse.terms.orderConfirmed)
            .mockReturnValueOnce(mockResponse.terms.orderConfirmedText)
            .mockReturnValueOnce(mockResponse.terms.keepShopping);

        const {result} = renderHook(() => useGetThankYou());
        result.current.returnUrl();
        expect(window.location.href).toEqual(`https://${shopUrl}`);
        expect(result.current.thankYouTitle).toEqual(mockResponse.thankYouTitle);
        expect(result.current.terms).toStrictEqual(mockResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetValidVariableMock).toHaveBeenCalledWith('orderProcessed');
        expect(getTermMock).toHaveBeenCalledTimes(4);
        expect(getTermMock).toHaveBeenCalledWith('thank_you', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('keep_shopping', Constants.CONFIRMATION_PAGE_INFO);
    });

    test('rendering the hook without customer first_name', () => {
        const newCustomer = {...initialDataMock.application_state.customer, first_name: ''};
        const newMockResponse = {...mockResponse, thankYouTitle: 'Thank you!'};
        useGetCustomerInfoDataMock.mockReturnValueOnce(newCustomer);
        getTermMock
            .mockReturnValueOnce(newMockResponse.terms.thankYou)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmed)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmedText)
            .mockReturnValueOnce(newMockResponse.terms.keepShopping);

        const {result} = renderHook(() => useGetThankYou());
        result.current.returnUrl();
        expect(window.location.href).toEqual(`https://${shopUrl}`);
        expect(result.current.thankYouTitle).toEqual(newMockResponse.thankYouTitle);
        expect(result.current.terms).toStrictEqual(newMockResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetValidVariableMock).toHaveBeenCalledWith('orderProcessed');
        expect(getTermMock).toHaveBeenCalledTimes(4);
        expect(getTermMock).toHaveBeenCalledWith('thank_you', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('keep_shopping', Constants.CONFIRMATION_PAGE_INFO);
    });

    test('rendering the hook without orderProcessed', () => {
        const newMockResponse = {...mockResponse, thankYouTitle: 'Thank you!'};
        useGetValidVariableMock.mockReturnValueOnce(false);
        getTermMock
            .mockReturnValueOnce(newMockResponse.terms.thankYou)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmed)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmedText)
            .mockReturnValueOnce(newMockResponse.terms.keepShopping);

        const {result} = renderHook(() => useGetThankYou());
        result.current.returnUrl();
        expect(window.location.href).toEqual(`https://${shopUrl}`);
        expect(result.current.thankYouTitle).toEqual(newMockResponse.thankYouTitle);
        expect(result.current.terms).toStrictEqual(newMockResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetValidVariableMock).toHaveBeenCalledWith('orderProcessed');
        expect(getTermMock).toHaveBeenCalledTimes(4);
        expect(getTermMock).toHaveBeenCalledWith('thank_you', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('keep_shopping', Constants.CONFIRMATION_PAGE_INFO);
    });

    test('rendering the hook without customer', () => {
        const newMockResponse = {...mockResponse, thankYouTitle: 'Thank you!'};
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useGetCustomerInfoDataMock.mockReturnValueOnce(null);
        getTermMock
            .mockReturnValueOnce(newMockResponse.terms.thankYou)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmed)
            .mockReturnValueOnce(newMockResponse.terms.orderConfirmedText)
            .mockReturnValueOnce(newMockResponse.terms.keepShopping);

        const {result} = renderHook(() => useGetThankYou());
        result.current.returnUrl();
        expect(window.location.href).toEqual(`https://${shopUrl}`);
        expect(result.current.thankYouTitle).toEqual(newMockResponse.thankYouTitle);
        expect(result.current.terms).toStrictEqual(newMockResponse.terms);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetValidVariableMock).toHaveBeenCalledWith('orderProcessed');
        expect(getTermMock).toHaveBeenCalledTimes(4);
        expect(getTermMock).toHaveBeenCalledWith('thank_you', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('keep_shopping', Constants.CONFIRMATION_PAGE_INFO);
    });
});
