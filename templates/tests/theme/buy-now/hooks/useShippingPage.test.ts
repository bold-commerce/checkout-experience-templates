import { renderHook } from '@testing-library/react-hooks';
import { useGetValidVariable } from 'src/hooks';
import { useGetCloseBuyNow, useShippingPage } from 'src/themes/buy-now/hooks';
import { mocked } from 'ts-jest/utils';

jest.mock('src/hooks/useGetValidVariable');
jest.mock('src/themes/buy-now/hooks/useGetCloseBuyNow');
const useGetValidVariableMock = mocked(useGetValidVariable, true);
const useGetCloseBuyNowMock = mocked(useGetCloseBuyNow, true);

describe('Testing useShippingPage hook', () => {
    const closeBuyNow = jest.fn();

    test('rendering the useShippingPageHook properly', () => {
        useGetValidVariableMock.mockReturnValueOnce(false).mockReturnValue(true);
        useGetCloseBuyNowMock.mockReturnValue(closeBuyNow);
        const { result, rerender } = renderHook(() => useShippingPage());

        expect(result.current.closeBuyNow).toBe(closeBuyNow);
        expect(result.current.flashText).toBe('Finish filling out fields or select a previously saved address');
        expect(result.current.isValidAddress).toBe(false);
        expect(result.current.stopBack).toBe(false);

        rerender();
        expect(result.current.isValidAddress).toBe(true);
    });
});
