import { renderHook } from '@testing-library/react-hooks';
import { useGetValidVariable } from 'src/hooks';
import { useGetCloseBuyNow, useShippingPage } from 'src/themes/buy-now/hooks';
import { mocked } from 'jest-mock';
import { getTerm } from 'src/utils';
import { IUseGetCloseBuyNow } from 'src/themes/buy-now/types';

jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/themes/buy-now/hooks/useGetCloseBuyNow');
jest.mock('src/utils/getTerm');
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);
const getTermMock = mocked(getTerm, true);

describe('Testing useShippingPage hook', () => {
    const closeModalMock: IUseGetCloseBuyNow = {
        closeBuyNow: jest.fn(),
        websiteName: 'websiteName',
        terms: {},
        loginUrl: jest.fn()
    };
    const getTermValue = 'test term';

    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue(getTermValue);
    });

    test('rendering the useShippingPageHook properly', () => {
        useGetValidVariableMock.mockReturnValueOnce(false).mockReturnValue(true);
        useGetCloseBuyNowMock.mockReturnValue(closeModalMock);

        const { result, rerender } = renderHook(() => useShippingPage());

        expect(result.current.closeBuyNow).toBe(closeModalMock.closeBuyNow);
        expect(result.current.flashText).toBe(getTermValue);
        expect(result.current.isValidAddress).toBe(false);
        expect(result.current.stopBack).toBe(false);

        rerender();
        expect(result.current.isValidAddress).toBe(true);
    });
});
