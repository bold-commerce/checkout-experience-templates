import {renderHook} from '@testing-library/react-hooks';
import {useHistory} from 'react-router';
import {mocked} from 'jest-mock';
import {Constants} from 'src/constants';
import {usePaymentPage} from 'src/themes/paypal/hooks';
import {getTerm} from 'src/utils';

jest.mock('react-redux');
jest.mock('react-router');
jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetIsOrderProcessed');

const useHistoryMock = mocked(useHistory, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook usePaymentPage', () => {
    const historyMock = {replace: jest.fn()};
    const shopAliasMock = 'test-shop.alias.com';
    const backLinkTextMock = 'Back Link';
    const backLinkTextExpectation = 'Back Link';
    const nextButtonTextMock = '';
    const titleMock = 'Title';
    const eventMock = {preventDefault: jest.fn()};

    beforeEach(() => {
        jest.resetAllMocks();
        window = Object.create(window);
        window.shopAlias = shopAliasMock;
        window.platformType = 'shopify';
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
        useHistoryMock.mockReturnValue(historyMock);
    });

    test('Render the hook properly', async () => {
        getTermMock
            .mockReturnValueOnce(titleMock)
            .mockReturnValueOnce(backLinkTextMock);

        const {result} = renderHook(() => usePaymentPage());

        expect(useHistoryMock).toHaveBeenCalledTimes(1);
        expect(getTermMock).toHaveBeenCalledTimes(2);
        expect(getTermMock).toHaveBeenCalledWith('payment_method_title', Constants.GLOBAL_INFO, undefined, 'Checkout form, payment method');
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
        expect(result.current.backLinkText).toBe(backLinkTextExpectation);
        expect(result.current.nextButtonText).toBe(nextButtonTextMock);
        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(historyMock.replace).toHaveBeenCalledTimes(0);
    });
});
