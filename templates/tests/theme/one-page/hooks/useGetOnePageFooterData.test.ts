import {useGetIsLoading} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {callProcessOrder, getTerm, getTotalsFromState} from 'src/utils';
import {ITotals} from 'src/types';
import {useGetOnePageFooterData} from 'src/themes/one-page/hooks';
import {initializeExpressPay} from 'src/library';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/utils/getTerm');
jest.mock('src/utils/getTotalsFromState');
jest.mock('src/utils/callProcessOrder');
jest.mock('src/hooks/useGetIsLoading');
jest.mock('src/library/initializeExpressPay');
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);
const getTotalsFromStateMock = mocked(getTotalsFromState, true);
const callProcessOrderMock = mocked(callProcessOrder, true);
const initializeExpressPayMock = mocked(initializeExpressPay, true);

describe('Testing hook useGetAddressFieldInputData', () => {
    const getTermValue = 'test-value';
    const eventMock = {preventDefault: jest.fn()};
    const total: ITotals = {
        totalSubtotal: 2999,
        totalFees:0,
        totalTaxes:0,
        totalAdditionalFees:0,
        totalOrder:0,
        totalPaid:0,
        totalDiscounts:0,
        totalAmountDue:2999
    };

    beforeEach(() => {
        jest.resetAllMocks();
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
        getTermMock.mockReturnValue(getTermValue);
        useGetIsLoadingMock.mockReturnValue(false);
        getTotalsFromStateMock.mockReturnValue(total);
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetOnePageFooterData());
        expect(result.current.backLinkText).toStrictEqual(getTermValue);
        expect(result.current.nextButtonText).toStrictEqual(getTermValue);
        expect(result.current.nextButtonLoading).toStrictEqual(false);
        expect(mockDispatch).toHaveBeenCalledWith(initializeExpressPayMock);

        result.current.nextButtonOnClick();
        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(window.location.href).toEqual(window.returnUrl);

        result.current.nextButtonOnClick();
        expect(callProcessOrderMock).toBeCalled();
    });

});
