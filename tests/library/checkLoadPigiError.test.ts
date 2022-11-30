import {stateMock} from 'src/mocks';
import {checkLoadPigiErrors} from 'src/library';

describe('testing checkLoadPigiErrors', () => {

    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    const pigiSetStateFunction = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        dispatchMock.mockReturnValue(Promise.resolve());
    });

    test('checkLoadPigiErrors called with error', async () => {
        const actionSetPigiIframeLoader = {'payload': {'pigiIframeLoader': false}, 'type': 'SET_PIGI_IFRAME_LOADER'};
        const actionSetButtonDisable = {'payload': {'field': 'paymentPageButton', 'value': true}, 'type': 'SET_BUTTON_DISABLE'};

        getStateMock.mockReturnValue(stateMock);
        const setPigiListenerThunk = await checkLoadPigiErrors(pigiSetStateFunction);
        await setPigiListenerThunk(dispatchMock, getStateMock).then(() => {
            expect(pigiSetStateFunction).toHaveBeenCalledTimes(1);
            expect(dispatchMock).toHaveBeenCalledTimes(2);
            expect(dispatchMock).toHaveBeenCalledWith(actionSetPigiIframeLoader);
            expect(dispatchMock).toHaveBeenCalledWith(actionSetButtonDisable);
        });
    });

    test('checkLoadPigiErrors called withput error', async () => {
        const state = {...stateMock};
        state.isValid.pigi = true;
        getStateMock.mockReturnValue(state);
        const setPigiListenerThunk = await checkLoadPigiErrors(pigiSetStateFunction);
        await setPigiListenerThunk(dispatchMock, getStateMock).then(() => {
            expect(pigiSetStateFunction).toHaveBeenCalledTimes(0);
            expect(dispatchMock).toHaveBeenCalledTimes(0);
        });
    });
});
