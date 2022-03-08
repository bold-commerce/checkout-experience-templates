import {mocked} from 'ts-jest/utils';
import {
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
    getTaxes
} from '@bold-commerce/checkout-frontend-library';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {initialDataMock} from 'src/mocks';
import {
    getAddressesFromLib,
    getApplicationStateFromLib,
    getBillingAddressFromLib,
    getCustomerFromLib,
    getDiscountsFromLib,
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
import * as appAction from 'src/action/appAction';
import * as AppActions from 'src/action/appActionType';
import * as customerAction from 'src/action/customerAction';
import * as CustomerActions from 'src/action/customerActionType';
import {Constants, defaultAddressState} from 'src/constants';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/utils');
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
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing Update Application State Thunk Actions', () => {
    const {application_state} = initialDataMock;
    const {customer, addresses: {billing: billingAddress, shipping: shippingAddress}} = application_state;
    const {line_items, shipping, taxes, discounts, payments, order_meta_data} = application_state;
    const dispatchMock = jest.fn();
    let actionUpdateAddressSpy: jest.SpyInstance;
    let actionUpdateCustomerSpy: jest.SpyInstance;
    let actionUpdateDiscountsSpy: jest.SpyInstance;
    let actionOrderMetaDataSpy: jest.SpyInstance;
    let actionOrderTotalSpy: jest.SpyInstance;
    let actionUpdateAvailableShippingLinesSpy: jest.SpyInstance;
    let actionUpdateLineItemSpy: jest.SpyInstance;
    let actionUpdatePaymentsSpy: jest.SpyInstance;
    let actionUpdateSelectedShippingLineSpy: jest.SpyInstance;
    let actionUpdateShippingLinesDiscountSpy: jest.SpyInstance;
    let actionUpdateShippingLinesTaxesSpy: jest.SpyInstance;
    let actionUpdateTaxesSpy: jest.SpyInstance;

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
        actionUpdateAddressSpy = jest.spyOn(customerAction, 'actionUpdateAddress');
        actionUpdateCustomerSpy = jest.spyOn(customerAction, 'actionUpdateCustomer');
        actionUpdateDiscountsSpy = jest.spyOn(appAction, 'actionUpdateDiscounts');
        actionOrderMetaDataSpy = jest.spyOn(appAction, 'actionOrderMetaData');
        actionOrderTotalSpy = jest.spyOn(appAction, 'actionOrderTotal');
        actionUpdateAvailableShippingLinesSpy = jest.spyOn(appAction, 'actionUpdateAvailableShippingLines');
        actionUpdateLineItemSpy = jest.spyOn(appAction, 'actionUpdateLineItem');
        actionUpdatePaymentsSpy = jest.spyOn(appAction, 'actionUpdatePayments');
        actionUpdateSelectedShippingLineSpy = jest.spyOn(appAction, 'actionUpdateSelectedShippingLine');
        actionUpdateShippingLinesDiscountSpy = jest.spyOn(appAction, 'actionUpdateShippingLinesDiscount');
        actionUpdateShippingLinesTaxesSpy = jest.spyOn(appAction, 'actionUpdateShippingLinesTaxes');
        actionUpdateTaxesSpy = jest.spyOn(appAction, 'actionUpdateTaxes');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling getApplicationStateFromLib', () => {
        getApplicationStateFromLib(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(6);
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
        actionUpdateAddressSpy.mockReturnValueOnce(actionMock);

        getBillingAddressFromLib(dispatchMock);

        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledWith(Constants.BILLING, billingAddress);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getBillingAddressFromLib empty address', () => {
        getBillingAddressMock.mockReturnValueOnce({});
        const actionMock = {
            type: CustomerActions.UPDATE_BILLING_ADDRESS,
            payload: {data: defaultAddressState}
        };
        actionUpdateAddressSpy.mockReturnValueOnce(actionMock);

        getBillingAddressFromLib(dispatchMock);

        expect(getBillingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledWith(Constants.BILLING, defaultAddressState);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getCustomerFromLib', () => {
        const actionMock = {
            type: CustomerActions.UPDATE_CUSTOMER,
            payload: {customer}
        };
        actionUpdateCustomerSpy.mockReturnValueOnce(actionMock);

        getCustomerFromLib(dispatchMock);

        expect(getCustomerMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateCustomerSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateCustomerSpy).toHaveBeenCalledWith(customer);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getDiscountsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_DISCOUNTS,
            payload: {data: discounts}
        };
        actionUpdateDiscountsSpy.mockReturnValueOnce(actionMock);

        getDiscountsFromLib(dispatchMock);

        expect(getDiscountsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateDiscountsSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateDiscountsSpy).toHaveBeenCalledWith(discounts);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getLineItemsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_LINE_ITEMS,
            payload: {line: line_items}
        };
        actionUpdateLineItemSpy.mockReturnValueOnce(actionMock);

        getLineItemsFromLib(dispatchMock);

        expect(getLineItemsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateLineItemSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateLineItemSpy).toHaveBeenCalledWith(line_items);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getOrderMetaDataFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_ORDER_META_DATA,
            payload: {data: order_meta_data}
        };
        actionOrderMetaDataSpy.mockReturnValueOnce(actionMock);

        getOrderMetaDataFromLib(dispatchMock);

        expect(getOrderMetaDataMock).toHaveBeenCalledTimes(1);
        expect(actionOrderMetaDataSpy).toHaveBeenCalledTimes(1);
        expect(actionOrderMetaDataSpy).toHaveBeenCalledWith(order_meta_data);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getOrderTotalFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_ORDER_TOTAL,
            payload: {data: application_state.order_total}
        };
        actionOrderTotalSpy.mockReturnValueOnce(actionMock);

        getOrderTotalFromLib(dispatchMock);

        expect(getApplicationStateMock).toHaveBeenCalledTimes(1);
        expect(actionOrderTotalSpy).toHaveBeenCalledTimes(1);
        expect(actionOrderTotalSpy).toHaveBeenCalledWith(application_state.order_total);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getPaymentsFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_PAYMENT,
            payload: {data: payments}
        };
        actionUpdatePaymentsSpy.mockReturnValueOnce(actionMock);

        getPaymentsFromLib(dispatchMock);

        expect(getPaymentsMock).toHaveBeenCalledTimes(1);
        expect(actionUpdatePaymentsSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdatePaymentsSpy).toHaveBeenCalledWith(payments);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getShippingFromLib filled selected_shipping', () => {
        const actionUpdateSelectedShippingLineMock = {
            type: AppActions.UPDATE_SELECTED_SHIPPING_LINE,
            payload: {data: shipping.selected_shipping}
        };
        actionUpdateSelectedShippingLineSpy.mockReturnValueOnce(actionUpdateSelectedShippingLineMock);

        const actionUpdateAvailableShippingLinesMock = {
            type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
            payload: {data: shipping.available_shipping_lines}
        };
        actionUpdateAvailableShippingLinesSpy.mockReturnValueOnce(actionUpdateAvailableShippingLinesMock);

        const actionUpdateShippingLinesTaxesMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
            payload: {data: shipping.taxes}
        };
        actionUpdateShippingLinesTaxesSpy.mockReturnValueOnce(actionUpdateShippingLinesTaxesMock);

        const actionUpdateShippingLinesDiscountMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
            payload: {data: shipping.discounts}
        };
        actionUpdateShippingLinesDiscountSpy.mockReturnValueOnce(actionUpdateShippingLinesDiscountMock);

        getShippingFromLib(dispatchMock);

        expect(getShippingMock).toHaveBeenCalledTimes(1);

        expect(actionUpdateSelectedShippingLineSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateSelectedShippingLineSpy).toHaveBeenCalledWith(shipping.selected_shipping);

        expect(actionUpdateAvailableShippingLinesSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAvailableShippingLinesSpy).toHaveBeenCalledWith(shipping.available_shipping_lines);

        expect(actionUpdateShippingLinesTaxesSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesTaxesSpy).toHaveBeenCalledWith(shipping.taxes);

        expect(actionUpdateShippingLinesDiscountSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesDiscountSpy).toHaveBeenCalledWith(shipping.discounts);

        expect(dispatchMock).toHaveBeenCalledTimes(4);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateSelectedShippingLineMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateAvailableShippingLinesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesTaxesMock);
        expect(dispatchMock).toHaveBeenCalledWith(actionUpdateShippingLinesDiscountMock);
    });

    test('calling getShippingFromLib empty selected_shipping', () => {
        const shippingMock = {...shipping};
        shippingMock.selected_shipping = {};
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
        actionUpdateSelectedShippingLineSpy.mockReturnValueOnce(actionUpdateSelectedShippingLineMock);

        const actionUpdateAvailableShippingLinesMock = {
            type: AppActions.UPDATE_AVAILABLE_SHIPPING_LINES,
            payload: {data: shippingMock.available_shipping_lines}
        };
        actionUpdateAvailableShippingLinesSpy.mockReturnValueOnce(actionUpdateAvailableShippingLinesMock);

        const actionUpdateShippingLinesTaxesMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_TAXES,
            payload: {data: shippingMock.taxes}
        };
        actionUpdateShippingLinesTaxesSpy.mockReturnValueOnce(actionUpdateShippingLinesTaxesMock);

        const actionUpdateShippingLinesDiscountMock = {
            type: AppActions.UPDATE_SHIPPING_LINES_DISCOUNT,
            payload: {data: shippingMock.discounts}
        };
        actionUpdateShippingLinesDiscountSpy.mockReturnValueOnce(actionUpdateShippingLinesDiscountMock);

        getShippingFromLib(dispatchMock);

        expect(getShippingMock).toHaveBeenCalledTimes(1);

        expect(actionUpdateSelectedShippingLineSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateSelectedShippingLineSpy).toHaveBeenCalledWith(selectedShippingLineMock);

        expect(actionUpdateAvailableShippingLinesSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAvailableShippingLinesSpy).toHaveBeenCalledWith(shippingMock.available_shipping_lines);

        expect(actionUpdateShippingLinesTaxesSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesTaxesSpy).toHaveBeenCalledWith(shippingMock.taxes);

        expect(actionUpdateShippingLinesDiscountSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateShippingLinesDiscountSpy).toHaveBeenCalledWith(shippingMock.discounts);

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
        actionUpdateAddressSpy.mockReturnValueOnce(actionMock);

        getShippingAddressFromLib(dispatchMock);

        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledWith(Constants.SHIPPING, shippingAddress);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getShippingAddressFromLib empty address', () => {
        getShippingAddressMock.mockReturnValueOnce({});
        const actionMock = {
            type: CustomerActions.UPDATE_SHIPPING_ADDRESS,
            payload: {data: defaultAddressState}
        };
        actionUpdateAddressSpy.mockReturnValueOnce(actionMock);

        getShippingAddressFromLib(dispatchMock);

        expect(getShippingAddressMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateAddressSpy).toHaveBeenCalledWith(Constants.SHIPPING, defaultAddressState);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });

    test('calling getSummaryStateFromLib', () => {
        getSummaryStateFromLib(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledTimes(5);
        expect(dispatchMock).toHaveBeenCalledWith(getLineItemsFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getOrderTotalFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getOrderMetaDataFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getDiscountsFromLib);
        expect(dispatchMock).toHaveBeenCalledWith(getTaxesFromLib);
    });

    test('calling getTaxesFromLib', () => {
        const actionMock = {
            type: AppActions.UPDATE_TAXES,
            payload: {data: taxes}
        };
        actionUpdateTaxesSpy.mockReturnValueOnce(actionMock);

        getTaxesFromLib(dispatchMock);

        expect(getTaxesMock).toHaveBeenCalledTimes(1);
        expect(actionUpdateTaxesSpy).toHaveBeenCalledTimes(1);
        expect(actionUpdateTaxesSpy).toHaveBeenCalledWith(taxes);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(dispatchMock).toHaveBeenCalledWith(actionMock);
    });
});
