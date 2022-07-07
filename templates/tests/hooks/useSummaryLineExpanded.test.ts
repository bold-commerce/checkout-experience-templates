import {IPaymentsSummaryClasses, ISummaryLineExpanded, IUseGetCurrencyInformation} from 'src/types';
import {REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action';
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
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {Constants} from 'src/constants';
import {IPayment} from '@bold-commerce/checkout-frontend-library';

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
        eventToggleName: Constants.TAXES_TOGGLE,
        content: stateMock.data.application_state.taxes[0],
        id: 'TEST_ID',
        classes: classes,
        textAlign: 'center',
        hasDeleteButton: true,
        itemId: 'TEST_ID',
    };

    const paymentProps: ISummaryLineExpanded = {
        eventDeleteName: REMOVE_PAYMENT,
        amount: 5,
        eventToggleName: Constants.PAYMENTS_TOGGLE,
        content: stateMock.data.application_state.payments[0],
        id: 'TEST_ID',
        classes: classes,
        textAlign: 'center',
        hasDeleteButton: true,
        itemId: 'TEST_ID',
    };

    const mandatoryProps: ISummaryLineExpanded = {
        amount: 5,
        eventToggleName: Constants.TAXES_TOGGLE,
        content: stateMock.data.application_state.taxes[0],
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
        expect(hookResult.content).toBe('test tax');

    });

    test('rendering the hook properly for payment', () => {
        const {result} = renderHook(() => useSummaryLineExpanded(paymentProps));
        const hookResult = result.current;
        expect(hookResult.itemId).toBe(props.itemId);
        expect(hookResult.textAlign).toBe(props.textAlign);
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.formattedPrice).toBe(currencyData.formattedPrice);
        expect(hookResult.content).toBe('Visa: •••• •••• •••• 1111');
    });

    test('rendering the hook properly for payment with no payment method name', () => {
        const localContent: IPayment = {
            gateway_public_id: 'test',
            amount: 200,
            currency: 'CAD',
            type: 'credit',
            display_string: '1111',
            id: 'test',
            token: 'test',
            retain: true,
            value: 200
        };
        const localPaymentProps = {...paymentProps, content: localContent};
        const {result} = renderHook(() => useSummaryLineExpanded(localPaymentProps));
        const hookResult = result.current;
        expect(hookResult.itemId).toBe(props.itemId);
        expect(hookResult.textAlign).toBe(props.textAlign);
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.formattedPrice).toBe(currencyData.formattedPrice);
        expect(hookResult.content).toBe('1111');
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
