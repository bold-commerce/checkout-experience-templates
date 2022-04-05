import {counterNames} from 'src/constants';
import {stateMock} from 'src/mocks';
import {renderHook} from '@testing-library/react-hooks';
import {useScreenWidth, useGetLineItems, useCartSummary} from 'src/hooks';
import {getTotalLineItems} from 'src/utils';
import {mocked} from 'jest-mock';
import {act} from "@testing-library/react";

jest.mock('src/hooks/useScreenWidth');
jest.mock('src/hooks/useGetLineItems');
jest.mock('src/utils/getTotalLineItems');
const useScreenWidthMock = mocked(useScreenWidth, true);
const useGetLineItemsMock = mocked(useGetLineItems, true);
const getTotalLineItemsMock = mocked(getTotalLineItems, true);

describe('Testing hook useCartSummary', () => {

    test('rendering the hook properly with wide screen', () => {

        useScreenWidthMock.mockReturnValueOnce(900);
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        const {result} = renderHook(() => useCartSummary());
        const hookResult = result.current;

        expect(hookResult.expandSummary).toBe(true);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.totals).toBe(200);
        expect(hookResult.showSummary).toBe(true);

    });

    test('rendering the hook properly with small screen', () => {

        useScreenWidthMock.mockReturnValueOnce(500);
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        const {result} = renderHook(() => useCartSummary());
        const hookResult = result.current;

        expect(hookResult.expandSummary).toBe(false);
        expect(hookResult.lineItems).toBe(stateMock.data.application_state.line_items);
        expect(hookResult.totals).toBe(200);
        expect(hookResult.showSummary).toBe(false);

    });

    test('calling action callback', () => {

        useScreenWidthMock.mockReturnValueOnce(500);
        useGetLineItemsMock.mockReturnValueOnce(stateMock.data.application_state.line_items);
        getTotalLineItemsMock.mockReturnValueOnce(200);
        const {result, rerender}  = renderHook(() => useCartSummary());

        expect(result.current.expandSummary).toBe(false);
        rerender();
        act(() => {
            result.current.toggleSummary();
        });
        expect(result.current.expandSummary).toBe(true);
    });
});
