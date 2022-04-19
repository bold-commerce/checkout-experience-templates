import { fetchAPI, getApiOptions, getApiUrl, IApiReturnObject, IApiSuccessResponse, IProductData } from '@bold-commerce/checkout-frontend-library';
import { apiTypes, methods } from '@bold-commerce/checkout-frontend-library/lib/variables';
import { Dispatch } from 'redux';
import {
    actionUpdateLineItem,
    actionSetLoaderAndDisableButton,
    actionUpdateTaxes,
    actionOrderTotal,
    actionUpdateShippingLinesTaxes,
    actionUpdateShippingLinesDiscount,
    actionUpdateAvailableShippingLines,
    actionUpdateSelectedShippingLine,
    actionUpdateDiscounts,
    actionUpdatePayments,
    actionOrderMetaData
} from 'src/action';
import {
    IApplicationState,
    IApplicationStateDiscount,
    IApplicationStateLineItem,
    IApplicationStateOrderMetaData,
    IApplicationStatePayment,
    IApplicationStateSelectShippingLine,
    IApplicationStateTax,
    IOrderInitialization
} from 'src/types';
import { handleErrorIfNeeded } from 'src/utils';

// TODO - this is a temporary solution to update the line item quantity. Eventually this will be built
// into the checkout-frontend-library
apiTypes.updateItem = {
    path: '/items',
    method: methods.PUT,
    useJwt: true,
    keysToTest: apiTypes.appStateKeysToTest,
};

export interface IUpdateLineItemQuantityResponse {
    line_item: IProductData;
    application_state: IApplicationState;
}

export const updateLineItemQuantity = (lineItemKey: string, quantity: number) => async (dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> => {
    const url = getApiUrl('updateItem');
    const options = getApiOptions('updateItem', {
        line_item_key: lineItemKey,
        quantity,
    });

    try {
        dispatch(actionSetLoaderAndDisableButton('updateLineItemQuantity', true));
        const response: IApiReturnObject = await fetchAPI(url, options);
        handleErrorIfNeeded(response, dispatch, getState);
        if (!response?.response || !response.success) { return; }

        const resp = response.response as IApiSuccessResponse;
        const data = resp.data as IUpdateLineItemQuantityResponse;

        const lineItems: IApplicationStateLineItem[] = data.application_state.line_items;
        const taxes: IApplicationStateTax[] = data.application_state.taxes;
        const orderTotal: number = data.application_state.order_total;
        const shippingTaxes: IApplicationStateTax[] = data.application_state.shipping.taxes;
        const shippingDiscounts: IApplicationStateDiscount[] = data.application_state.shipping.discounts;
        const availableShippingLines: IApplicationStateSelectShippingLine[] = data.application_state.shipping.available_shipping_lines;
        const selectedShippingLine: Partial<IApplicationStateSelectShippingLine> = data.application_state.shipping.selected_shipping;
        const discounts: IApplicationStateDiscount[] = data.application_state.discounts;
        const payments: IApplicationStatePayment[] = data.application_state.payments;
        const orderMetadata: IApplicationStateOrderMetaData = data.application_state.order_meta_data;

        await Promise.all([
            dispatch(actionUpdateLineItem(lineItems)),
            dispatch(actionUpdateTaxes(taxes)),
            dispatch(actionOrderTotal(orderTotal)),
            dispatch(actionUpdateShippingLinesTaxes(shippingTaxes)),
            dispatch(actionUpdateShippingLinesDiscount(shippingDiscounts)),
            dispatch(actionUpdateAvailableShippingLines(availableShippingLines)),
            dispatch(actionUpdateSelectedShippingLine(selectedShippingLine)),
            dispatch(actionUpdateDiscounts(discounts)),
            dispatch(actionUpdatePayments(payments)),
            dispatch(actionOrderMetaData(orderMetadata)),
        ]);
    } finally {
        dispatch(actionSetLoaderAndDisableButton('updateLineItemQuantity', false));
    }
};
