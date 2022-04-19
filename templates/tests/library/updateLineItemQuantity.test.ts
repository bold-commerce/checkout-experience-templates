import { mocked } from 'jest-mock';
import { fetchAPI, IApiSuccessResponse, IShipping } from '@bold-commerce/checkout-frontend-library';
import { updateLineItemQuantity } from 'src/library';
import { IApplicationState, IApplicationStateCustomer, IApplicationStateOrderMetaData, IProductData } from 'src/types';
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

jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('@bold-commerce/checkout-frontend-library/lib/utils/fetchAPI');
jest.mock('src/action', () => ({
    ...jest.requireActual('src/action'),
    actionUpdateLineItem: jest.fn(),
    actionSetLoaderAndDisableButton: jest.fn(),
    actionUpdateTaxes: jest.fn(),
    actionOrderTotal: jest.fn(),
    actionUpdateShippingLinesTaxes: jest.fn(),
    actionUpdateShippingLinesDiscount: jest.fn(),
    actionUpdateAvailableShippingLines: jest.fn(),
    actionUpdateSelectedShippingLine: jest.fn(),
    actionUpdateDiscounts: jest.fn(),
    actionUpdatePayments: jest.fn(),
    actionOrderMetaData: jest.fn(),
}));

const fetchAPIMock = mocked(fetchAPI, true);
const updateLineItemMock = mocked(actionUpdateLineItem, true);
const setLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const updateTaxesMock = mocked(actionUpdateTaxes, true);
const orderTotalMock = mocked(actionOrderTotal, true);
const updateShippingLinesTaxesMock = mocked(actionUpdateShippingLinesTaxes, true);
const updateShippingLinesDiscountMock = mocked(actionUpdateShippingLinesDiscount, true);
const updateAvailableShippingLinesMock = mocked(actionUpdateAvailableShippingLines, true);
const updateSelectedShippingLineMock = mocked(actionUpdateSelectedShippingLine, true);
const updateDiscountsMock = mocked(actionUpdateDiscounts, true);
const updatePaymentsMock = mocked(actionUpdatePayments, true);
const orderMetaDataMock = mocked(actionOrderMetaData, true);

describe('testing updateLineItemQuantity', () => {
    const dispatch = jest.fn(() => Promise.resolve());
    const getState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('calling function successfully', async () => {
        const lineItemKey = '123';
        const quantity = 3;
        const applicationState: IApplicationState = {
            is_processed: false,
            customer: {} as unknown as IApplicationStateCustomer,
            addresses: {
                shipping: {},
                billing: {},
            },
            created_via: '',
            discounts: [],
            order_meta_data: {} as unknown as IApplicationStateOrderMetaData,
            order_total: 1337 * quantity,
            payments: [],
            resumable_link: 'test_resumable_links',
            shipping: {
                available_shipping_lines: [{
                    id: '123',
                    description: 'test',
                    amount: 1337,
                }],
                taxes: [],
                discounts: [],
                selected_shipping: {
                    id: '123',
                    description: 'test',
                    amount: 1337,
                },
            } as IShipping,
            taxes: [],
            line_items: [
                {
                    product_data: {
                        product_id: 'test_product_id',
                        barcode: 'test_barcode',
                        compare_at_price: 1337,
                        description: 'test_description',
                        id: 'test_id',
                        image_url: 'test_image_url',
                        line_item_key: lineItemKey,
                        price: 1337,
                        properties: {},
                        quantity,
                        requires_shipping: true,
                        sku: 'test_sku',
                        tags: 'test_tag',
                        taxable: true,
                        title: 'test_title',
                        total_price: 1337 * quantity,
                        product_title: 'test_product_title',
                        variant_id: '42',
                        vendor: 'test_vendor',
                        visible: true,
                        weight: 1337,
                        weight_unit: 'grams',
                    },
                    discounts: [],
                    fees: [],
                    taxes: [],
                },
            ],
        };
        fetchAPIMock.mockResolvedValue({
            response: {
                data: {
                    line_item: {} as unknown as IProductData,
                    application_state: applicationState,
                },
            },
            success: true,
        } as IApiSuccessResponse);

        await updateLineItemQuantity(lineItemKey, quantity)(dispatch, getState);

        expect(dispatch).toBeCalledTimes(12);
        expect(setLoaderAndDisableButtonMock.mock.calls).toEqual([
            ['updateLineItemQuantity', true],
            ['updateLineItemQuantity', false],
        ]);
        expect(updateLineItemMock).toBeCalledWith(applicationState.line_items);
        expect(updateTaxesMock).toBeCalledWith(applicationState.taxes);
        expect(orderTotalMock).toBeCalledWith(applicationState.order_total);
        expect(updateShippingLinesTaxesMock).toBeCalledWith(applicationState.shipping.taxes);
        expect(updateShippingLinesDiscountMock).toBeCalledWith(applicationState.shipping.discounts);
        expect(updateAvailableShippingLinesMock).toBeCalledWith(applicationState.shipping.available_shipping_lines);
        expect(updateSelectedShippingLineMock).toBeCalledWith(applicationState.shipping.selected_shipping);
        expect(updateDiscountsMock).toBeCalledWith(applicationState.discounts);
        expect(updatePaymentsMock).toBeCalledWith(applicationState.payments);
        expect(orderMetaDataMock).toBeCalledWith(applicationState.order_meta_data);
    });

    const responseTests = [
        {
            name: 'calling function with response success false',
            response: {success: false, response: null},
        },
        {
            name: 'calling function with undefined response',
            response: undefined,
        },
    ];

    test.each(responseTests)('$name', async ({ response }) => {
        const lineItemKey = '123';
        const quantity = 3;
        fetchAPIMock.mockResolvedValue(response);

        await updateLineItemQuantity(lineItemKey, quantity)(dispatch, getState);
        expect(dispatch).toBeCalledTimes(2);
        expect(setLoaderAndDisableButtonMock.mock.calls).toEqual([
            ['updateLineItemQuantity', true],
            ['updateLineItemQuantity', false],
        ]);
    });
});

