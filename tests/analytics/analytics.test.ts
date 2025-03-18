import {mocked} from 'jest-mock';
import {
    initiateCheckout,
    initiateCheckoutForFacebookPixel,
    orderCompleteAnalytics,
    orderCompleteForCustomAnalytics,
    orderCompleteForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    orderCompleteForGoogleTagManager,
    orderCompleteTrackingVariables,
    sendEventForGoogleAnalytics,
    sendEventForGoogleTagManager,
    sendEvents,
    sendFacebookEvent,
    sendPageView,
    sendPageViewForFacebookPixel,
    sendPageViewForGoogleAnalytics,
    sendPageViewForGoogleTagManager,
} from 'src/analytics';
import {stateMock} from 'src/mocks';
import {ITotals} from 'src/types';

jest.mock('src/analytics/googleAnalytics');
jest.mock('src/analytics/facebookAnalytics');
jest.mock('src/analytics/googleTagManager');
jest.mock('src/analytics/trackingVariables');
jest.mock('src/analytics/customAnalytics');

const sendFacebookEventMock = mocked(sendFacebookEvent, true);
const sendEventForGoogleAnalyticsMock = mocked(sendEventForGoogleAnalytics, true);
const initiateCheckoutForFacebookPixelMock = mocked(initiateCheckoutForFacebookPixel, true);
const sendPageViewForGoogleAnalyticsMock = mocked(sendPageViewForGoogleAnalytics, true);
const sendPageViewForFacebookPixelMock = mocked(sendPageViewForFacebookPixel, true);
const orderCompleteForGoogleAnalyticsMock = mocked(orderCompleteForGoogleAnalytics, true);
const orderCompleteForFacebookPixelMock = mocked(orderCompleteForFacebookPixel, true);
const orderCompleteTrackingVariablesMock = mocked(orderCompleteTrackingVariables, true);
const orderCompleteForGoogleTagManagerMock = mocked(orderCompleteForGoogleTagManager, true);
const sendEventForGoogleTagManagerMock = mocked(sendEventForGoogleTagManager, true);
const sendPageViewForGoogleTagManagerMock = mocked(sendPageViewForGoogleTagManager, true);
const orderCompleteForCustomAnalyticsMock = mocked(orderCompleteForCustomAnalytics, true);

describe('testing Analytics functions', () => {
    const appState = stateMock.data.application_state;
    const totals: ITotals = {
        totalSubtotal: 0,
        totalOrder: 220.99,
        totalAmountDue: 0,
        totalPaid: 0,
        totalFees: 0,
        totalAdditionalFees: 0,
        totalTaxes: 0.10,
        totalDiscounts: 0
    };
    const selectedShippingLine = {
        id: 'shipping_id_1',
        description: 'USPS ground carrier',
        amount: 1999,
        code: '',
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('testing initiateCheckout function', () => {
        const items = appState.line_items;
        const value = appState.order_total;
        const currency = appState.currency.iso_code;
        initiateCheckout(items, value, currency);
        expect(initiateCheckoutForFacebookPixelMock).toHaveBeenCalledTimes(1);
        expect(sendEventForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(sendEventForGoogleTagManagerMock).toHaveBeenCalledTimes(1);
    });

    test('testing sendEvents function', () => {
        sendEvents('initiate');
        expect(sendFacebookEventMock).toHaveBeenCalledTimes(1);
        expect(sendEventForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(sendEventForGoogleTagManagerMock).toHaveBeenCalledTimes(1);
    });

    test('testing sendPageView function', () => {
        sendPageView('initiate', 1);
        expect(sendPageViewForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(sendPageViewForFacebookPixelMock).toHaveBeenCalledTimes(1);
        expect(sendPageViewForGoogleTagManagerMock).toHaveBeenCalledTimes(1);
    });

    test('testing orderCompleteAnalytics function', () => {
        orderCompleteAnalytics(appState.customer, appState.addresses, appState.line_items, 'USD', totals, selectedShippingLine, '1', []);

        expect(orderCompleteForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(orderCompleteForFacebookPixelMock).toHaveBeenCalledTimes(1);
        expect(orderCompleteTrackingVariablesMock).toHaveBeenCalledTimes(1);
        expect(orderCompleteForGoogleTagManagerMock).toHaveBeenCalledTimes(1);
        expect(orderCompleteForCustomAnalyticsMock).toHaveBeenCalledTimes(1);
    });
});
