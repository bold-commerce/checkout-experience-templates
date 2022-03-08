import {renderHook} from '@testing-library/react-hooks';
import {useGetAvailableShippingLines, useGetShippingLinesData, useCallApiAtOnEvents, useGetSelectShippingLine} from 'src/hooks';
import {mocked} from 'ts-jest/utils';
import {getTerm} from 'src/utils';
import {stateMock} from 'src/mocks';
import {act} from '@testing-library/react';
import {counterNames} from 'src/constants';

jest.mock('src/utils');
jest.mock('src/action');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useDebounceShippingLines');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetAvailableShippingLines');
const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const useGetAvailableShippingLinesMock = mocked(useGetAvailableShippingLines, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const getTermMock = mocked(getTerm, true);
const useCallApiAtOnEventsMock = mocked (useCallApiAtOnEvents, true);

describe('Testing hook useGetShippingLinesData', () => {
    const appStateMock = stateMock.data.application_state;
    const {zero, one, two} = counterNames;
    beforeEach(() => {
        jest.resetAllMocks();
        getTermMock.mockReturnValue('Test');

    });

    test('rendering the hook properly', () => {
        useGetAvailableShippingLinesMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines);
        useGetSelectShippingLineMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines[0]);

        const {result} = renderHook(() => useGetShippingLinesData());
        const hookResult = result.current;
        expect(hookResult.shippingLines).toBe(appStateMock.shipping.available_shipping_lines);
        expect(hookResult.selectedLine).toBe(appStateMock.shipping.available_shipping_lines[0]);
        expect(hookResult.noShippingAreaText).toBe('Test');
        expect(hookResult.shippingLinesLength).toBe(appStateMock.shipping.available_shipping_lines.length);
    });

    test('testing the change handler with callApiAtOnEvents true ', () => {
        const event = {target: {value: 'shipping_id_1'}};
        useGetAvailableShippingLinesMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines);
        useGetSelectShippingLineMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines[0]);
        useCallApiAtOnEventsMock.mockReturnValueOnce(true);

        const {result} = renderHook(() => useGetShippingLinesData());
        const hookResult = result.current;

        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toBeCalledTimes(two);
    });

    test('testing the change handler with callApiAtOnEvents false ', () => {
        const event = {target: {value: 'shipping_id_1'}};
        useGetAvailableShippingLinesMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines);
        useGetSelectShippingLineMock.mockReturnValueOnce(appStateMock.shipping.available_shipping_lines[0]);
        useCallApiAtOnEventsMock.mockReturnValueOnce(false);

        const {result} = renderHook(() => useGetShippingLinesData());
        const hookResult = result.current;

        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toBeCalledTimes(one);
    });

});
