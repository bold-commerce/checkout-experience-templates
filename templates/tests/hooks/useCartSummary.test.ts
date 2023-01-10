import {stateMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {useScreenBreakpoints, useGetLineItems, useCartSummary} from 'src/hooks';
import {getTerm, getTotalLineItems} from 'src/utils';
import {mocked} from 'jest-mock';
import {act} from '@testing-library/react';
import {IUseScreenBreakpoints} from 'src/types';

jest.mock('src/hooks/useScreenBreakpoints');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/utils/getTotalLineItems');
jest.mock('src/utils/getTerm');
const useScreenBreakpointsMock = mocked(useScreenBreakpoints, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const getTotalLineItemsMock = mocked(getTotalLineItems, true);
const getTermMock = mocked(getTerm, true);
const mockUseScreenBreakpoints: IUseScreenBreakpoints = {
    isMobile: true,
    isTablet: false,
    isDesktop: false
};

describe('Testing hook useCartSummary', () => {

    test('rendering the hook properly with wide screen', () => {

        useScreenBreakpointsMock.mockReturnValueOnce({...mockUseScreenBreakpoints, isMobile: false, isTablet: true});
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        getTermMock.mockImplementation(i18nKey => i18nKey);
        const {result} = renderHook(() => useCartSummary());
        const hookResult = result.current;

        expect(hookResult.expandSummary).toBe(true);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.totals).toBe(200);
        expect(hookResult.showSummary).toBe(true);

    });

    test('rendering the hook properly with small screen', () => {

        useScreenBreakpointsMock.mockReturnValueOnce(mockUseScreenBreakpoints);
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        getTermMock.mockImplementation(i18nKey => i18nKey);
        const {result} = renderHook(() => useCartSummary());
        const hookResult = result.current;

        expect(hookResult.expandSummary).toBe(false);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.totals).toBe(200);
        expect(hookResult.showSummary).toBe(false);

    });

    test('calling action callback', () => {

        useScreenBreakpointsMock.mockReturnValue(mockUseScreenBreakpoints);
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        getTermMock.mockImplementation(i18nKey => i18nKey);
        const {result, rerender}  = renderHook(() => useCartSummary());

        expect(result.current.expandSummary).toBe(false);
        rerender();
        act(() => {
            result.current.toggleSummary();
        });
        expect(result.current.expandSummary).toBe(true);
    });
});
