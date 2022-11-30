import { renderHook } from '@testing-library/react-hooks';
import { mocked } from 'jest-mock';

import { Constants } from 'src/constants';
import { useGetThankYou, useGetCustomerInfoData, useGetValidVariable, useGetShopUrlFromShopAlias } from 'src/hooks';
import { initialDataMock } from 'src/mocks';
import { IUseGetThankYou } from 'src/types';
import { getTerm, getShopDomain } from 'src/utils';

jest.mock('src/utils');
jest.mock('src/hooks/useGetCustomerInformation');
jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');

const getTermMock = mocked(getTerm, true);
const useGetCustomerInfoDataMock = mocked(useGetCustomerInfoData, true);
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);
const getShopDomainMock = mocked(getShopDomain, true);

describe('Testing hook useGetThankYou', () => {

    const shopAlias = 'test-shop.alias.com';
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

    const testData = [
        {
            name: "rendering the hook with customer first_name and custom domain",
            customer: { ...initialDataMock.application_state.customer },
            terms: { ...mockResponse.terms },
            shopAlias: shopAlias,
            customDomain: 'test-shop.custom.com',
            expected: { returnUrl: 'https://test-shop.custom.com', thankYouTitle: mockResponse.thankYouTitle, terms: mockResponse.terms }
        },
        {
            name: "rendering the hook with customer first_name and no custom domain",
            customer: { ...initialDataMock.application_state.customer },
            terms: { ...mockResponse.terms },
            shopAlias: shopAlias,
            customDomain: '',
            expected: { returnUrl: 'https://test-shop.alias.com', thankYouTitle: mockResponse.thankYouTitle, terms: mockResponse.terms }
        },
        {
            name: "rendering the hook without customer first_name",
            customer: { ...initialDataMock.application_state.customer, first_name: '' },
            terms: { ...mockResponse.terms },
            shopAlias: shopAlias,
            customDomain: '',
            expected: { returnUrl: 'https://test-shop.alias.com', thankYouTitle: "Thank you!", terms: mockResponse.terms }
        },
        {
            name: "rendering the hook without orderProcessed",
            customer: { ...initialDataMock.application_state.customer },
            terms: { ...mockResponse.terms },
            shopAlias: shopAlias,
            customDomain: '',
            expected: { returnUrl: 'https://test-shop.alias.com', thankYouTitle: mockResponse.thankYouTitle }
        },
        {
            name: 'rendering the hook without customer',
            customer: null,
            terms: { ...mockResponse.terms },
            shopAlias: shopAlias,
            customDomain: '',
            expected: { returnUrl: 'https://test-shop.alias.com', thankYouTitle: "Thank you!" }
        }
    ]

    beforeEach(() => {
        jest.clearAllMocks();
       
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

    test.each(testData)('$name', (data) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        useGetCustomerInfoDataMock.mockReturnValueOnce(data.customer);
        window.shopAlias = data.shopAlias;
        window.customDomain = data.customDomain;
        
        useGetShopUrlFromShopAliasMock.mockReturnValue(data.expected.returnUrl);
      
        getTermMock
            .mockReturnValueOnce(data.terms.thankYou)
            .mockReturnValueOnce(data.terms.orderConfirmed)
            .mockReturnValueOnce(data.terms.orderConfirmedText)
            .mockReturnValueOnce(data.terms.keepShopping);

        const { result } = renderHook(() => useGetThankYou());
        
        expect(result.current.thankYouTitle).toEqual(data.expected.thankYouTitle);
        expect(result.current.terms).toStrictEqual(data.terms);
        expect(getShopDomainMock).toHaveBeenCalledTimes(1);
        expect(useGetCustomerInfoDataMock).toHaveBeenCalledTimes(1);
        expect(useGetValidVariableMock).toHaveBeenCalledWith('orderProcessed');
        expect(getTermMock).toHaveBeenCalledTimes(4)
        expect(getTermMock).toHaveBeenCalledWith('thank_you', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed', Constants.CONFIRMATION_PAGE_INFO);
        expect(getTermMock).toHaveBeenCalledWith('order_confirmed_text', Constants.CONFIRMATION_PAGE_INFO);
      
        result.current.returnUrl();
       
        expect(window.location.href).toEqual(data.expected.returnUrl);
    })

 
});
