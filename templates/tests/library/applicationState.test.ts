import {
    baseReturnObject,
    getApplicationState,
    getBillingAddress,
    getCustomer,
    getDiscounts,
    getLineItems,
    getOrderMetaData,
    getRefreshedApplicationState,
    getPayments,
    getShipping,
    getShippingAddress,
    getTaxes,
    IAddress,
    IShippingLine,
    getFees
} from '@boldcommerce/checkout-frontend-library';
import {feesMock} from '@boldcommerce/checkout-frontend-library/lib/variables/mocks';
import {mocked} from 'jest-mock';
import {
    actionUpdateAddress,
    actionUpdateCustomer,
    actionUpdateDiscounts,
    actionOrderMetaData,
    actionOrderTotal,
    actionUpdateAvailableShippingLines,
    actionUpdateLineItem,
    actionUpdatePayments,
    actionUpdateSelectedShippingLine,
    actionUpdateShippingLinesDiscount,
    actionUpdateShippingLinesTaxes,
    actionUpdateTaxes,
    actionUpdateIsProcessedOrder,
    actionUpdateFees
} from 'src/action';
import * as CustomerActions from 'src/action/customerActionType';
import * as AppActions from 'src/action/appActionType';
import {Constants, defaultAddressState} from 'src/constants';
import {
    getAddressesFromLib,
    getApplicationStateFromLib,
    getBillingAddressFromLib,
    getCustomerFromLib,
    getDiscountsFromLib,
    getFeesFromLib,
    getIsOrderProcessFromLib,
    getLineItemsFromLib,
    getOrderMetaDataFromLib,
    getOrderTotalFromLib,
    getPaymentsFromLib,
    getShippingAddressFromLib,
    getShippingFromLib,
    getSummaryStateFromLib,
    getTaxesFromLib,
    getUpdatedApplicationState
} from 'src/library';
import {initialDataMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
jest.mock('@boldcommerce/checkout-frontend-library/lib/order');
jest.mock('src/action');
jest.mock('src/utils');
const actionUpdateAddressMock = mocked(actionUpdateAddress, true);
const actionUpdateCustomerMock = mocked(actionUpdateCustomer, true);
const actionUpdateDiscountsMock = mocked(actionUpdateDiscounts, true);
const actionOrderMetaDataMock = mocked(actionOrderMetaData, true);
const actionOrderTotalMock = mocked(actionOrderTotal, true);
const actionUpdateAvailableShippingLinesFuncMock = mocked(actionUpdateAvailableShippingLines, true);
const actionUpdateLineItemMock = mocked(actionUpdateLineItem, true);
const actionUpdatePaymentsMock = mocked(actionUpdatePayments, true);
const actionUpdateSelectedShippingLineFuncMock = mocked(actionUpdateSelectedShippingLine, true);
const actionUpdateShippingLinesDiscountFuncMock = mocked(actionUpdateShippingLinesDiscount, true);
const actionUpdateShippingLinesTaxesFuncMock = mocked(actionUpdateShippingLinesTaxes, true);
const actionUpdateTaxesMock = mocked(actionUpdateTaxes, true);
const actionUpdateIsProcessedOrderMock = mocked(actionUpdateIsProcessedOrder, true);
const actionUpdateFeesMock = mocked(actionUpdateFees, true);
const getApplicationStateMock = mocked(getApplicationState, true);
const getBillingAddressMock = mocked(getBillingAddress, true);
const getCustomerMock = mocked(getCustomer, true);
const getDiscountsMock = mocked(getDiscounts, true);
const getLineItemsMock = mocked(getLineItems, true);
const getOrderMetaDataMock = mocked(getOrderMetaData, true);
const getRefreshedApplicationStateMock = mocked(getRefreshedApplicationState, true);
const getPaymentsMock = mocked(getPayments, true);
const getShippingMock = mocked(getShipping, true);
const getShippingAddressMock = mocked(getShippingAddress, true);
const getTaxesMock = mocked(getTaxes, true);
const getFeesMock = mocked(getFees, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing Update Application State Thunk Actions', () => {
    const {application_state} = initialDataMock;
    const {customer, addresses: {billing: billingAddress, shipping: shippingAddress}} = application_state;
    const {line_items, shipping, taxes, discounts, payments, order_meta_data} = application_state;
    const dispatchMock = jest.fn();

    beforeEach(() => {
        getApplicationStateMock.mockReturnValue(application_state);
        getBillingAddressMock.mockReturnValue(billingAddress);
        getCustomerMock.mockReturnValue(customer);
        getDiscountsMock.mockReturnValue(discounts);
        getLineItemsMock.mockReturnValue(line_items);
        getOrderMetaDataMock.mockReturnValue(order_meta_data);
        getRefreshedApplicationStateMock.mockReturnValue(Promise.resolve(baseReturnObject));
        getPaymentsMock.mockReturnValue(payments);
        getShippingMock.mockReturnValue(shipping);
        getShippingAddressMock.mockReturnValue(shippingAddress);
        getTaxesMock.mockReturnValue(taxes);
        getFeesMock.mockReturnValue([feesMock]);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling getApplicationStateFromLib', () => {
        getApplicationStateFromLib(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(7);
        expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getCustomerFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getAddressesFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getShippingFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getLineItemsFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getPaymentsFromLib);
    });

    test('calling getUpdatedApplicationState', () => {
        const getStateMock = jest.fn();

        getUpdatedApplicationState(dispatchMock, getStateMock).then(()=> {
            expect(getRefreshedApplicationStateMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(baseReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledWith(getApplicationStateFromLib);
        });
    });

    test('calling getAddressesFromLib', () => {
        getAddressesFromLib(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(2);
        expect(dispatchMock).toHaveBeenCalledWith(getShippingAddressFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getBillingAddressFromLib);
    });

    test('calling getBillingAddressFromLib filled address', () => {
        const actionMock = {
            type: CustomerActions.UPDATE_BILLING_ADDRESS,
            payload: {data: billingAddress}
        };
        actionUpdateAddressMock.mockReturnValueOnce(actionMock);

        getBillingAddressFromLib(dispatchMock);

        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledWith(Constants.BILLING, billingAddress);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getBillingAddressFromLib empty address', () => {
        getBillingAddressMock.mockReturnValueOnce({} as IAddress);
        const actionMock = {
            type: CustomerActions.UPDATE_BILLING_ADDRESS,
            payload: {data: defaultAddressState}
        };
        actionUpdateAddressMock.mockReturnValueOnce(actionMock);

        getBillingAddressFromLib(dispatchMock);

        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledWith(Constants.BILLING, defaultAddressState);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getCustomerFromLib', () => {
        const actionMock = {
            type: CustomerActions.UPDATE_CUSTOMER,
            payload: {customer}
        };
        actionUpdateCustomerMock.mockReturnValueOnce(actionMock);

        getCustomerFromLib(dispatchMock);

        expect(getCustomerMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateCustomerMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateCustomerMock).toHaveBeenCalledWith(customer);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getDiscountsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_DISCOUNTS,
            payload: {data: discounts}
        };
        actionUpdateDiscountsMock.mockReturnValueOnce(actionMock);

        getDiscountsFromLib(dispatchMock);

        expect(getDiscountsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateDiscountsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateDiscountsMock).toHaveBeenCalledWith(discounts);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getLineItemsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_LINE_ITEMS,
            payload: {line: line_items}
        };
        actionUpdateLineItemMock.mockReturnValueOnce(actionMock);

        getLineItemsFromLib(dispatchMock);

        expect(getLineItemsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateLineItemMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateLineItemMock).toHaveBeenCalledWith(line_items);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getOrderMetaDataFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_ORDER_META_DATA,
            payload: {data: order_meta_data}
        };
        actionOrderMetaDataMock.mockReturnValueOnce(actionMock);

        getOrderMetaDataFromLib(dispatchMock);

        expect(getOrderMetaDataMock).toHaveBeenCalledTimes(1);
        expect(actionOrderMetaDataMock).toHaveBeenCalledTimes(1);
        expect(actionOrderMetaDataMock).toHaveBeenCalledWith(order_meta_data);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getOrderTotalFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_ORDER_TOTAL,
            payload: {data: application_state.order_total}
        };
        actionOrderTotalMock.mockReturnValueOnce(actionMock);

        getOrderTotalFromLib(dispatchMock);

        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(actionOrderTotalMock).toHaveBeenCalledTimes(1);
        expect(actionOrderTotalMock).toHaveBeenCalledWith(application_state.order_total);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getIsOrderProcessFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_ORDER_PROCESSED,
            payload: {data: true}
        };
        actionUpdateIsProcessedOrderMock.mockReturnValueOnce(actionMock);

        getIsOrderProcessFromLib(dispatchMock);

        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateIsProcessedOrderMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateIsProcessedOrderMock).toHaveBeenCalledWith(application_state.is_processed);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getPaymentsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_PAYMENT,
            payload: {data: payments}
        };
        actionUpdatePaymentsMock.mockReturnValueOnce(actionMock);

        getPaymentsFromLib(dispatchMock);

        expect(getPaymentsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdatePaymentsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdatePaymentsMock).toHaveBeenCalledWith(payments);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getFeesFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_FEES,
            payload: {data: [feesMock]}
        };
        actionUpdateFeesMock.mockReturnValueOnce(actionMock);

        getFeesFromLib(dispatchMock);

        expect(getFeesMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateFeesMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateFeesMock).toHaveBeenCalledWith([feesMock]);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getShippingFromLib filled selected_shipping', () => {
        const actionUpdateSelectedShippingLineMock = {
            type: AppActions.UPDATE_SELECTED_SHIPPING_LINE,
            payload: {data: shipping.selected_shipping}
        };
        actionUpdateSelectedShippingLineFuncMock.mockReturnValueOnce(actionUpdateSelectedShippingLineMock);

        const actionUpdateAvailableShippingLinesMock = {
            type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
            payload: {data: shipping.available_shipping_lines}
        };
        actionUpdateAvailableShippingLinesFuncMock.mockReturnValueOnce(actionUpdateAvailableShippingLinesMock);

        const actionUpdateShippingLinesTaxesMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
            payload: {data: shipping.taxes}
        };
        actionUpdateShippingLinesTaxesFuncMock.mockReturnValueOnce(actionUpdateShippingLinesTaxesMock);

        const actionUpdateShippingLinesDiscountMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
            payload: {data: shipping.discounts}
        };
        actionUpdateShippingLinesDiscountFuncMock.mockReturnValueOnce(actionUpdateShippingLinesDiscountMock);

        getShippingFromLib(dispatchMock);

        expect(getShippingMock).toHaveBeenCalledTimes(1);

        expect(actionUpdateSelectedShippingLineFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateSelectedShippingLineFuncMock).toHaveBeenCalledWith(shipping.selected_shipping);

        expect(actionUpdateAvailableShippingLinesFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAvailableShippingLinesFuncMock).toHaveBeenCalledWith(shipping.available_shipping_lines);

        expect(actionUpdateShippingLinesTaxesFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesTaxesFuncMock).toHaveBeenCalledWith(shipping.taxes);

        expect(actionUpdateShippingLinesDiscountFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesDiscountFuncMock).toHaveBeenCalledWith(shipping.discounts);

        expect(dispatchMock).toHaveBeenCalledTimes(4);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateSelectedShippingLineMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateAvailableShippingLinesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesTaxesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesDiscountMock);
    });

    test('calling getShippingFromLib empty selected_shipping', () => {
        const shippingMock = {...shipping};
        shippingMock.selected_shipping = {} as IShippingLine;
        getShippingMock.mockReturnValueOnce(shippingMock);
        const selectedShippingLineMock = {
            id: '',
            description: '',
            amount: 0
        };

        const actionUpdateSelectedShippingLineMock = {
            type: AppActions.UPDATE_SELECTED_SHIPPING_LINE,
            payload: {data: selectedShippingLineMock}
        };
        actionUpdateSelectedShippingLineFuncMock.mockReturnValueOnce(actionUpdateSelectedShippingLineMock);

        const actionUpdateAvailableShippingLinesMock = {
            type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
            payload: {data: shippingMock.available_shipping_lines}
        };
        actionUpdateAvailableShippingLinesFuncMock.mockReturnValueOnce(actionUpdateAvailableShippingLinesMock);

        const actionUpdateShippingLinesTaxesMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
            payload: {data: shippingMock.taxes}
        };
        actionUpdateShippingLinesTaxesFuncMock.mockReturnValueOnce(actionUpdateShippingLinesTaxesMock);

        const actionUpdateShippingLinesDiscountMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
            payload: {data: shippingMock.discounts}
        };
        actionUpdateShippingLinesDiscountFuncMock.mockReturnValueOnce(actionUpdateShippingLinesDiscountMock);

        getShippingFromLib(dispatchMock);

        expect(getShippingMock).toHaveBeenCalledTimes(1);

        expect(actionUpdateSelectedShippingLineFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateSelectedShippingLineFuncMock).toHaveBeenCalledWith(selectedShippingLineMock);

        expect(actionUpdateAvailableShippingLinesFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAvailableShippingLinesFuncMock).toHaveBeenCalledWith(shippingMock.available_shipping_lines);

        expect(actionUpdateShippingLinesTaxesFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesTaxesFuncMock).toHaveBeenCalledWith(shippingMock.taxes);

        expect(actionUpdateShippingLinesDiscountFuncMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesDiscountFuncMock).toHaveBeenCalledWith(shippingMock.discounts);

        expect(dispatchMock).toHaveBeenCalledTimes(4);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateSelectedShippingLineMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateAvailableShippingLinesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesTaxesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesDiscountMock);
    });

    test('calling getShippingAddressFromLib filled address', () => {
        const actionMock = {
            type: CustomerActions.UPDATE_SHIPPING_ADDRESS,
            payload: {data: shippingAddress}
        };
        actionUpdateAddressMock.mockReturnValueOnce(actionMock);

        getShippingAddressFromLib(dispatchMock);

        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledWith(Constants.SHIPPING, shippingAddress);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getShippingAddressFromLib empty address', () => {
        getShippingAddressMock.mockReturnValueOnce({} as IAddress);
        const actionMock = {
            type: CustomerActions.UPDATE_SHIPPING_ADDRESS,
            payload: {data: defaultAddressState}
        };
        actionUpdateAddressMock.mockReturnValueOnce(actionMock);

        getShippingAddressFromLib(dispatchMock);

        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressMock).toHaveBeenCalledWith(Constants.SHIPPING, defaultAddressState);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getSummaryStateFromLib', () => {
        getSummaryStateFromLib(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(6);
        expect(dispatchMock).toHaveBeenCalledWith(getLineItemsFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getOrderTotalFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getOrderMetaDataFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getDiscountsFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getTaxesFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getFeesFromLib);
    });

    test('calling getTaxesFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_TAXES,
            payload: {data: taxes}
        };
        actionUpdateTaxesMock.mockReturnValueOnce(actionMock);

        getTaxesFromLib(dispatchMock);

        expect(getTaxesMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateTaxesMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateTaxesMock).toHaveBeenCalledWith(taxes);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });
});
