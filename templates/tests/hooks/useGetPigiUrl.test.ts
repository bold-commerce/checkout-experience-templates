import {renderHook, act} from '@testing-library/react-hooks';
import {useDispatch} from 'react-redux';
import {mocked} from 'jest-mock';
import {useGetPigiUrl} from 'src/hooks';
import {getPaymentIframe} from 'src/library/paymentIframe';

jest.mock('react-redux');
jest.mock('src/library/paymentIframe');
const useDispatchMock = mocked(useDispatch, true);
const getPaymentIframeMock = mocked(getPaymentIframe, true);

describe('Testing hook useGetPigiUrl', () => {
    const getPaymentIframeThunkMock = jest.fn();
    const dispatchMock = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        useDispatchMock.mockReturnValue(dispatchMock);
        getPaymentIframeMock.mockReturnValue(getPaymentIframeThunkMock);
    });

    test('rendered and re-rendered hook', async () => {
        let renderHookResult;
        const urlReturnMock = 'https://test.url';
        dispatchMock.mockReturnValueOnce(Promise.resolve(urlReturnMock));

        await act(async () => {
            /* Since the Hook has an useEffect that ReRenders the hook after an async
            dispatch, await for 'act' with the render inside is required. */
            renderHookResult = renderHook(() => useGetPigiUrl());

            // await for hook to update before assert values
            await renderHookResult.waitForNextUpdate();

            expect(renderHookResult.result.current).toBe(urlReturnMock);
            expect(useDispatchMock).toHaveBeenCalledTimes(2);
        });

        // Manually rerender and assert the useEffect was called only once.
        renderHookResult.rerender();

        expect(useDispatchMock).toHaveBeenCalledTimes(3);
        expect(dispatchMock).toHaveBeenCalledTimes(1);
        expect(getPaymentIframeMock).toHaveBeenCalledTimes(1);
    });
});
