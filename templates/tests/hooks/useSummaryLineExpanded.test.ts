import {IPaymentsSummaryClasses, ISummaryLineExpanded, IUseGetCurrencyInformation} from 'src/types';
import {actionSetLoaderAndDisableButton, REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action';
import * as appAction from 'src/action/appAction';
import * as appStateAction from 'src/action/applicationStateActions';
import * as deleteDiscounts from 'src/library/deleteDiscounts';
import {renderHook} from '@testing-library/react-hooks';
import {
    useGetCurrencyInformation,
    useGetIsLoading,
    useGetLoaderScreenVariable,
    useSummaryLineExpanded
} from 'src/hooks';
import {act} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetCurrencyInformation');
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);


describe('Testing hook useSummaryLineExpanded', () => {
    let actionSetLoaderAndDisableButtonSpy: jest.SpyInstance;
    let deleteDiscountsSpy: jest.SpyInstance;
    let actionDeleteElementSpy: jest.SpyInstance;

    const classes: IPaymentsSummaryClasses =  {
        container: 'TEST',
        title: {
            container: 'TEST',
            arrow: 'TEST',
            text: 'TEST',
            price: 'TEST'
        },
        list: {
            ul: 'TEST',
            li: 'TEST',
            text: 'TEST',
            price: 'TEST',
            delete: 'TEST',
            loading: 'TEST',
            loadingSpan: 'TEST'
        }
    };

    const props: ISummaryLineExpanded = {
        eventDeleteName: REMOVE_DISCOUNT,
        amount: 5,
        content: 'TEST',
        id: 'TEST_ID',
        classes: classes,
        textAlign: 'center',
        hasDeleteButton: true,
        itemId: 'TEST_ID',
    };

    const mandatoryProps: ISummaryLineExpanded = {
        amount: 5,
        content: 'TEST',
        id: 'TEST_ID',
        classes: classes,
    };

    const currencyData: IUseGetCurrencyInformation = {
        currency: 'CAD',
        currencySymbol: '$',
        formattedPrice: '${{amount}}'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetIsLoadingMock.mockReturnValue(false);
        actionSetLoaderAndDisableButtonSpy = jest.spyOn(appAction, 'actionSetLoaderAndDisableButton');
        deleteDiscountsSpy = jest.spyOn(deleteDiscounts, 'deleteDiscounts');
        actionDeleteElementSpy = jest.spyOn(appStateAction, 'actionDeleteElement');
        useGetCurrencyInformationMock.mockReturnValue(currencyData);

    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useSummaryLineExpanded(props));
        const hookResult = result.current;
        expect(hookResult.itemId).toBe(props.itemId);
        expect(hookResult.textAlign).toBe(props.textAlign);
        expect(hookResult.eventDeleteName).toBe(props.eventDeleteName);
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.formattedPrice).toBe(currencyData.formattedPrice);

    });

    test('rendering the hook properly with only mandatory props', () => {
        const {result} = renderHook(() => useSummaryLineExpanded(mandatoryProps));
        const hookResult = result.current;
        expect(hookResult.itemId).toBe('');
        expect(hookResult.textAlign).toBe('right');
        expect(hookResult.eventDeleteName).toBe('');
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.deleteElementFromState).toBe(undefined);
    });

    test('rendering the hook with REMOVE_DISCOUNT', () => {
        const localProps = {...mandatoryProps};
        localProps.eventDeleteName = REMOVE_DISCOUNT;

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElementFromState('TEST', 'TEST_ID');
        });

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalled();
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('discountClose');
        expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalledWith('discountClose', true);
        expect(deleteDiscountsSpy).toHaveBeenCalled();
        expect(deleteDiscountsSpy).toHaveBeenCalledWith('TEST_ID');
    });

    test('rendering the hook with REMOVE_PAYMENT', () => {
        const localProps = {...mandatoryProps};
        localProps.eventDeleteName = REMOVE_PAYMENT;

        useGetLoaderScreenVariableMock.mockReturnValueOnce(false);
        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElementFromState('TEST', 'TEST_ID');
        });

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalled();
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('paymentClose');
        expect(actionDeleteElementSpy).toHaveBeenCalled();
        expect(actionDeleteElementSpy).toHaveBeenCalledWith('TEST', 'TEST_ID');

    });

    test('rendering the hook with other event name', () => {
        const localProps = {...mandatoryProps};
        localProps.eventDeleteName = 'test';

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;

        expect(hookResult.deleteElementFromState).toBe(undefined);
        expect(hookResult.closeLoading).toBe(false);
    });

});