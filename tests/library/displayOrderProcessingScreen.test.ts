import {
    displayOrderProcessingScreen
} from 'src/library';
import {stateMock} from 'src/mocks';
import {SET_OVERLAY_CONTENT} from 'src/action';

describe('testing checkErrorAndProceedToNextPage', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const content = {
        shown: true,
        inverted: true,
        header: 'Processing order... ',
        content: 'This may take a few moments... Please remain on the page until the process is complete.',
    };
    const actionMock = {type: SET_OVERLAY_CONTENT, payload: {content}};

    beforeEach(() => {
        jest.resetAllMocks();
        dispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });

    test('call with language found on state', () => {
        const newAction = {type: SET_OVERLAY_CONTENT, payload: {content: {...content, buttonText: ''}}};

        displayOrderProcessingScreen(dispatch, getState);

        expect(getState).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(newAction);
    });

    test('call without language found on state', () => {
        const noErrorsState = {...stateMock};
        noErrorsState.appSetting.languageIso = 'aa';
        getState.mockReturnValueOnce(noErrorsState);

        displayOrderProcessingScreen(dispatch, getState);
        expect(getState).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledTimes(1);
        expect(dispatch).toHaveBeenCalledWith(actionMock);
    });
});
