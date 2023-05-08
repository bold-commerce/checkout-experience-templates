import {baseReturnObject, initialize} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import { actionSetSessionInitialized } from 'src/action';
import {initializeSession} from 'src/library';
import {initialDataMock, stateMock} from 'src/mocks';
import {displayFatalErrorFromTranslation, handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/initialize');
jest.mock('src/utils');
const initializedMock = mocked(initialize, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);

describe('testing initializeSession', () => {
    const returnObject = {...baseReturnObject};
    const shopIdentifier = 'test.shop.com';
    const environment = {type: 'test'};
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
        getState.mockReturnValue(stateMock);
        window.shopIdentifier = shopIdentifier;
        window.environment = environment;
    });

    test('calling initialized endpoint with success false', async () => {
        initializedMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await initializeSession(dispatch, getState).then(() => {
            expect(initializedMock).toHaveBeenCalledTimes(1);
            expect(initializedMock).toHaveBeenCalledWith(initialDataMock, shopIdentifier, environment);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(returnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledWith(stateMock, dispatch);
            expect(dispatch).not.toHaveBeenCalledWith(actionSetSessionInitialized(true));
        });
    });

    test('calling initialized endpoint with success true', async () => {
        const successReturnObject = {...baseReturnObject, success: true};
        initializedMock.mockReturnValueOnce(Promise.resolve(successReturnObject));

        await initializeSession(dispatch, getState).then(() => {
            expect(initializedMock).toHaveBeenCalledTimes(1);
            expect(initializedMock).toHaveBeenCalledWith(initialDataMock, shopIdentifier, environment);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(successReturnObject, dispatch, getState);
            expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(0);
            expect(dispatch).toHaveBeenCalledWith(actionSetSessionInitialized(true));
        });
    });
});
