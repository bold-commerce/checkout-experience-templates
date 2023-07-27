import {Dispatch} from 'redux';
import {
    getApplicationState,
    getBillingAddress,
    getCustomer,
    getDiscounts,
    getFees,
    getLineItems,
    getOrderMetaData,
    getPayments,
    getRefreshedApplicationState,
    getShipping,
    getShippingAddress,
    getTaxes,
    IApiReturnObject
} from '@boldcommerce/checkout-frontend-library';
import {
    actionOrderTotal,
    actionUpdateAddress,
    actionUpdateAvailableShippingLines,
    actionUpdateCartParameters,
    actionUpdateCustomer,
    actionUpdateDiscounts,
    actionUpdateFees,
    actionUpdateIsProcessedOrder,
    actionUpdateLineItem,
    actionUpdateNotes,
    actionUpdatePayments,
    actionUpdateSelectedShippingLine,
    actionUpdateShippingLinesDiscount,
    actionUpdateShippingLinesTaxes,
    actionUpdateTags,
    actionUpdateTaxes
} from 'src/action';
import {Constants, defaultAddressState} from 'src/constants';
import {IOrderInitialization} from 'src/types';
import {handleErrorIfNeeded, isObjectEquals} from 'src/utils';

export async function getUpdatedApplicationState(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const response: IApiReturnObject = await getRefreshedApplicationState();
    handleErrorIfNeeded(response, dispatch, getState);
    dispatch(getApplicationStateFromLib);
}

export async function getApplicationStateFromLib(dispatch: Dispatch): Promise<void> {
    dispatch(getSummaryStateFromLib);
    dispatch(getCustomerFromLib);
    dispatch(getAddressesFromLib);
    dispatch(getShippingFromLib);
    dispatch(getLineItemsFromLib);
    dispatch(getPaymentsFromLib);
    dispatch(getIsOrderProcessFromLib);
}

export async function getAddressesFromLib(dispatch: Dispatch): Promise<void> {
    dispatch(getShippingAddressFromLib);
    dispatch(getBillingAddressFromLib);
}

export async function getBillingAddressFromLib(dispatch: Dispatch): Promise<void> {
    let billing = getBillingAddress();
    if (!billing || Object.keys(billing).length <= 0) {
        billing = defaultAddressState;
    }
    dispatch(actionUpdateAddress(Constants.BILLING, billing));
}

export async function getCustomerFromLib(dispatch: Dispatch): Promise<void> {
    const customer = getCustomer();
    dispatch(actionUpdateCustomer(customer));
}

export async function getFeesFromLib(dispatch: Dispatch): Promise<void> {
    const fees = getFees();
    dispatch(actionUpdateFees(fees));
}

export async function getDiscountsFromLib(dispatch: Dispatch): Promise<void> {
    const discounts = getDiscounts();
    dispatch(actionUpdateDiscounts(discounts));
}

export async function getLineItemsFromLib(dispatch: Dispatch): Promise<void> {
    const lineItems = getLineItems();
    dispatch(actionUpdateLineItem(lineItems));
}

export async function getOrderMetaDataFromLib(dispatch: Dispatch): Promise<void> {
    const orderMetaData = getOrderMetaData();
    dispatch(actionUpdateCartParameters(orderMetaData.cart_parameters));
    dispatch(actionUpdateNotes(orderMetaData.notes));
    dispatch(actionUpdateTags(orderMetaData.tags));
}

export async function getOrderTotalFromLib(dispatch: Dispatch): Promise<void> {
    const {order_total: orderTotal} = getApplicationState(); // TODO: Implement getOrderTotal() in the Library state gets
    dispatch(actionOrderTotal(orderTotal));
}

export async function getIsOrderProcessFromLib(dispatch: Dispatch): Promise<void> {
    const {is_processed: isProcessed} = getApplicationState();
    dispatch(actionUpdateIsProcessedOrder(isProcessed));
}

export async function getPaymentsFromLib(dispatch: Dispatch): Promise<void> {
    const payments = getPayments();
    dispatch(actionUpdatePayments(payments));
}

export async function getShippingFromLib(dispatch: Dispatch): Promise<void> {
    const shipping = getShipping();
    let {selected_shipping: selectedShippingLine} = shipping;
    if (!selectedShippingLine || Object.keys(selectedShippingLine).length <= 0) {
        selectedShippingLine = {
            id: '',
            description: '',
            amount: 0
        };
    }
    dispatch(actionUpdateSelectedShippingLine(selectedShippingLine));
    dispatch(actionUpdateAvailableShippingLines(shipping.available_shipping_lines));
    dispatch(actionUpdateShippingLinesTaxes(shipping.taxes));
    dispatch(actionUpdateShippingLinesDiscount(shipping.discounts));
}

export async function getShippingAddressFromLib(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    let libShipping = getShippingAddress();
    const state = getState();
    const stateShipping = state.data.application_state.addresses.shipping;

    // adjust properties so we can do a direct compare
    const stateShippingSimple = {
        ...stateShipping,
        country: '',
        country_code: '',
    };

    delete stateShippingSimple.id;

    if (!libShipping || Object.keys(libShipping).length <= 0) {
        libShipping = defaultAddressState;
    }

    // only update address if lib and state shipping match
    // prevents clobbering of state actively being set
    if (isObjectEquals(libShipping, stateShippingSimple)) {
        dispatch(actionUpdateAddress(Constants.SHIPPING, libShipping));
    }
}

export async function getSummaryStateFromLib(dispatch: Dispatch): Promise<void> {
    dispatch(getLineItemsFromLib);
    dispatch(getOrderTotalFromLib);
    dispatch(getOrderMetaDataFromLib);
    dispatch(getDiscountsFromLib);
    dispatch(getTaxesFromLib);
    dispatch(getFeesFromLib);
}

export async function getTaxesFromLib(dispatch: Dispatch): Promise<void> {
    const taxes = getTaxes();
    dispatch(actionUpdateTaxes(taxes));
}
