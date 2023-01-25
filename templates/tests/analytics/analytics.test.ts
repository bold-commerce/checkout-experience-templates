import {mocked} from 'jest-mock';
import {
    initiateCheckout,
    initiateCheckoutForFacebookPixel,
    orderCompleteAnalytics,
    orderCompletedForFacebookPixel,
    orderCompleteForGoogleAnalytics,
    sendEventForGoogleAnalytics,
    sendEvents,
    sendFacebookEvent,
    sendPageView,
    sendPageViewForFacebookPixel,
    sendPageViewForGoogleAnalytics
} from 'src/analytics';
import {stateMock} from 'src/mocks';
import {ITotals} from 'src/types';

jest.mock('src/analytics/googleAnalytics');
jest.mock('src/analytics/facebookAnalytics');

const sendFacebookEventMock = mocked(sendFacebookEvent, true);
const sendEventForGoogleAnalyticsMock = mocked(sendEventForGoogleAnalytics, true);
const initiateCheckoutForFacebookPixelMock = mocked(initiateCheckoutForFacebookPixel, true);
const sendPageViewForGoogleAnalyticsMock = mocked(sendPageViewForGoogleAnalytics, true);
const sendPageViewForFacebookPixelMock = mocked(sendPageViewForFacebookPixel, true);
const orderCompleteForGoogleAnalyticsMock = mocked(orderCompleteForGoogleAnalytics, true);
const orderCompletedForFacebookPixelMock = mocked(orderCompletedForFacebookPixel, true);

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
        amount: 1999
    };

    test('testing initiateCheckout function', () => {
        initiateCheckout();
        expect(initiateCheckoutForFacebookPixelMock).toHaveBeenCalledTimes(1);
    });

    test('testing sendEvents function', () => {
        sendEvents('initiate');
        expect(sendFacebookEventMock).toHaveBeenCalledTimes(1);
        expect(sendEventForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
    });

    test('testing sendPageView function', () => {
        sendPageView('initiate', 1);
        expect(sendPageViewForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(sendPageViewForFacebookPixelMock).toHaveBeenCalledTimes(1);
    });

    test('testing orderCompleteAnalytics function', () => {
        orderCompleteAnalytics(appState.line_items, 'USD', totals, selectedShippingLine, '1', []);
        expect(orderCompleteForGoogleAnalyticsMock).toHaveBeenCalledTimes(1);
        expect(orderCompletedForFacebookPixelMock).toHaveBeenCalledTimes(1);
    });
});
