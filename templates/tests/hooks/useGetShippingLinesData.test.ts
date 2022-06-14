import {renderHook} from '@testing-library/react-hooks';
import {useGetAvailableShippingLines, useGetShippingLinesData, useGetSelectShippingLine} from 'src/hooks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
import {stateMock} from 'src/mocks';
import {act} from '@testing-library/react';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock,
    isValid: {},
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

jest.mock('src/utils');
jest.mock('src/action');
jest.mock('src/hooks/useCallApiAtOnEvents');
jest.mock('src/hooks/useDebounceShippingLines');
jest.mock('src/hooks/useGetSelectShippingLine');
jest.mock('src/hooks/useGetAvailableShippingLines');
const mockDispatch = jest.fn();

const useGetAvailableShippingLinesMock = mocked(useGetAvailableShippingLines, true);
const useGetSelectShippingLineMock = mocked(useGetSelectShippingLine, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const getTermMock = mocked(getTerm, true);

describe('Testing hook useGetShippingLinesData', () => {
    const appStateMock = stateMock.data.application_state;
    const actionSetLoaderAndDisableButtonFunctionMock = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        getTermMock.mockReturnValue('Test');
        actionSetLoaderAndDisableButtonFunctionMock.mockName('actionSetLoaderAndDisableButton');
        actionSetLoaderAndDisableButtonMock.mockReturnValue(actionSetLoaderAndDisableButtonFunctionMock);
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

        const {result} = renderHook(() => useGetShippingLinesData());
        const hookResult = result.current;

        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toBeCalledTimes(3);
        expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalledTimes(1);

    });

});
