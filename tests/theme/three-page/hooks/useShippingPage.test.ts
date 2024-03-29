import {renderHook} from '@testing-library/react-hooks';
import {
    useGetButtonDisableVariable,
    useGetIsLoading,
    useGetIsOrderProcessed,
    useLifeFieldsByLocations,
    useGetCurrencyInformation,
    useGetLineItems,
    useGetSelectShippingLine,
} from 'src/hooks';
import {mocked} from 'jest-mock';
import {useDispatch} from 'react-redux';
import {getCheckoutUrl, getTerm, isShippingLineSelectedValid} from 'src/utils';
import {useHistory} from 'react-router';
import {callShippingLinesPageApi} from 'src/library';
import {useShippingPage} from 'src/themes/three-page/hooks';
import {actionClearErrors} from 'src/action';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {lineItemMock, selectShippingLineMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/utils/isShippingLineSelectedValid');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetButtonDisableVariable');
jest.mock('src/hooks/useGetLifeFields');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/hooks/useGetCurrencyInformation');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/library/callShippingLinesPageApi');
jest.mock('src/hooks/useGetIsOrderProcessed');
const useDispatchMock = mocked(useDispatch, true);
const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetButtonDisableVariableMock = mocked(useGetButtonDisableVariable, true);
const callShippingLinesPageApiMock = mocked(callShippingLinesPageApi, true);
const useGetIsOrderProcessedMock = mocked(useGetIsOrderProcessed, true);
const isShippingLineSelectedValidMock = mocked(isShippingLineSelectedValid, true);
const useGetRequiredLifeFieldsByLocationsMock = mocked(useLifeFieldsByLocations, true);
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);

describe('Testing hook useShippingPage', () => {
    const mockDispatch = jest.fn();
    const mockCallShippingLinesPageApi = jest.fn();
    const getTermValue = 'test-value';
    const historyMock = {replace: jest.fn()};
    const eventMock = {preventDefault: jest.fn()};
    const currencyMock = {
        currency: 'CAD',
        currencySymbol: '$',
        formattedPrice: '${price}',
    };
    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(mockDispatch);
        useHistoryMock.mockReturnValue(historyMock);
        getTermMock.mockReturnValue(getTermValue);
        useGetIsLoadingMock.mockReturnValue(false);
        useGetRequiredLifeFieldsByLocationsMock.mockReturnValue(lifeFields);
        useGetButtonDisableVariableMock.mockReturnValue(false);
        callShippingLinesPageApiMock.mockReturnValue(mockCallShippingLinesPageApi);
        useGetCurrencyInformationMock.mockReturnValue(currencyMock);
        useGetLineItemsMock.mockReturnValue([lineItemMock]);
        useGetSelectShippingLineMock.mockReturnValue(selectShippingLineMock);
    });

    test('rendering the hook properly', () => {
        isShippingLineSelectedValidMock.mockReturnValue(true);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook properly with shipping incorrect AND useGetButtonDisableVariable returns FALSE', () => {
        useGetIsOrderProcessedMock.mockReturnValue(false);
        isShippingLineSelectedValidMock.mockReturnValue(false);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(false);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook properly with shipping incorrect AND useGetButtonDisableVariable returns TRUE', () => {
        useGetIsOrderProcessedMock.mockReturnValue(false);
        isShippingLineSelectedValidMock.mockReturnValue(false);
        useGetButtonDisableVariableMock.mockReturnValue(true);

        const {result} = renderHook(() => useShippingPage());
        const hookResult = result.current;
        expect(useDispatchMock).toHaveBeenCalledTimes(1);
        expect(hookResult.backLinkText).toBe(getTermValue);
        expect(hookResult.nextButtonText).toBe(getTermValue);
        expect(hookResult.nextButtonDisable).toBe(true);
        expect(hookResult.active).toBe(2);
        expect(hookResult.nextButtonLoading).toBe(false);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);

        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(1);

        result.current.nextButtonOnClick();
        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionClearErrors());
        expect(mockDispatch).toHaveBeenCalledWith(mockCallShippingLinesPageApi);
    });

    test('rendering the hook with complete order', () => {
        useGetIsOrderProcessedMock.mockReturnValue(true);
        isShippingLineSelectedValidMock.mockReturnValue(true);

        renderHook(() => useShippingPage());
        expect(historyMock.replace).toHaveBeenCalledTimes(1);
        expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('thank_you'));
    });
});
