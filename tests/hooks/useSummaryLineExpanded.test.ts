import {IPaymentsSummaryClasses, ISummaryLineExpanded, IUseGetCurrencyInformation} from 'src/types';
import {actionSetLoaderAndDisableButton, REMOVE_DISCOUNT, REMOVE_PAYMENT} from 'src/action';
import {deleteDiscounts, deletePayment, deleteGiftCardPayment} from 'src/library';
import {renderHook} from '@testing-library/react-hooks';
import {
    useGetCurrencyInformation,
    useGetIsLoading,
    useGetLoaderScreenVariable,
    useGetPaymentType,
    useSummaryLineExpanded
} from 'src/hooks';
import {act} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {stateMock} from 'src/mocks';
import {Constants} from 'src/constants';
import {IPayment} from '@boldcommerce/checkout-frontend-library';
import {getTerm} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/action');
jest.mock('src/library/deleteDiscounts');
jest.mock('src/library/deletePayment');
jest.mock('src/library/deleteGiftCardPayment');
jest.mock('src/hooks/useGetLoaderScreenVariable');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/hooks/useGetCurrencyInformation');
jest.mock('src/hooks/useGetPaymentType');
jest.mock('src/utils/getTerm');
const useGetCurrencyInformationMock = mocked(useGetCurrencyInformation, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const useGetLoaderScreenVariableMock = mocked(useGetLoaderScreenVariable, true);
const useGetPaymentTypeMock = mocked(useGetPaymentType, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const deleteDiscountsMock = mocked(deleteDiscounts, true);
const deletePaymentMock = mocked(deletePayment, true);
const deleteGiftCardPaymentMock = mocked(deleteGiftCardPayment, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useSummaryLineExpanded', () => {
    const paymentMethodText = 'Some Payment Method Text';
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
    const someText = 'some text';

    beforeEach(() => {
        jest.clearAllMocks();
        useGetLoaderScreenVariableMock.mockReturnValue(false);
        useGetIsLoadingMock.mockReturnValue(false);
        useGetCurrencyInformationMock.mockReturnValue(currencyData);
        useGetPaymentTypeMock.mockReturnValue(paymentMethodText);
        getTermMock.mockReturnValue(someText);
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
        const payment = paymentProps.content as IPayment;
        expect(hookResult.itemId).toBe(props.itemId);
        expect(hookResult.textAlign).toBe(props.textAlign);
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.formattedPrice).toBe(currencyData.formattedPrice);
        expect(hookResult.content).toBe(`${payment.brand} ${someText} ${paymentMethodText}`);
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
        expect(hookResult.content).toBe(paymentMethodText);
    });

    test('rendering the hook properly with only mandatory props', () => {
        const {result} = renderHook(() => useSummaryLineExpanded(mandatoryProps));
        const hookResult = result.current;
        expect(hookResult.itemId).toBe('');
        expect(hookResult.textAlign).toBe('right');
        expect(hookResult.eventDeleteName).toBe('');
        expect(hookResult.closeLoading).toBe(false);
        expect(hookResult.deleteElement).toBe(undefined);
    });

    test('rendering the hook with REMOVE_DISCOUNT', () => {
        const localProps = {...mandatoryProps, eventDeleteName: REMOVE_DISCOUNT, itemId: 'TEST_ID'};

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElement();
        });

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(2);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('discountClose');
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('paymentClose');
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('discountClose', true);
        expect(deleteDiscountsMock).toHaveBeenCalled();
        expect(deleteDiscountsMock).toHaveBeenCalledWith('TEST_ID');
    });

    test('rendering the hook with generic REMOVE_PAYMENT', () => {
        const localProps = {
            ...mandatoryProps,
            eventToggleName: Constants.PAYMENTS_TOGGLE,
            eventDeleteName: REMOVE_PAYMENT,
            itemId: 'TEST_ID',
            content: stateMock.data.application_state.payments[0]
        };

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElement();
        });

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(2);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('discountClose');
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('paymentClose');
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', true);
        expect(deleteDiscountsMock).not.toHaveBeenCalled();
        expect(deletePaymentMock).toHaveBeenCalled();
        expect(deleteGiftCardPaymentMock).not.toHaveBeenCalled();
        expect(deletePaymentMock).toHaveBeenCalledWith('TEST_ID');
    });

    test('rendering the hook with gift card REMOVE_PAYMENT', () => {
        const localProps = {
            ...mandatoryProps,
            eventToggleName: Constants.PAYMENTS_TOGGLE,
            eventDeleteName: REMOVE_PAYMENT,
            itemId: 'TEST_ID',
            content: {
                gateway_public_id: '',
                amount: 20000,
                currency: 'CAD',
                type: 'gift_card',
                display_string: '1111',
                id: '1',
                token: 'payment_token',
                retain: false,
                brand: ''
            }
        };

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;
        act(() => {
            hookResult.deleteElement();
        });

        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledTimes(2);
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('discountClose');
        expect(useGetLoaderScreenVariableMock).toHaveBeenCalledWith('paymentClose');
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledWith('paymentClose', true);
        expect(deleteDiscountsMock).not.toHaveBeenCalled();
        expect(deletePaymentMock).not.toHaveBeenCalled();
        expect(deleteGiftCardPaymentMock).toHaveBeenCalled();
        expect(deleteGiftCardPaymentMock).toHaveBeenCalledWith('TEST_ID');
    });

    test('rendering the hook with other event name', () => {
        const localProps = {...mandatoryProps};
        localProps.eventDeleteName = 'test';

        const {result} = renderHook(() => useSummaryLineExpanded(localProps));
        const hookResult = result.current;

        expect(hookResult.deleteElement).toBe(undefined);
        expect(hookResult.closeLoading).toBe(false);
    });

});
