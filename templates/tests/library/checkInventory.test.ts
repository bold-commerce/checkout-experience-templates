import {checkInventory} from 'src/library';
import {mocked} from 'jest-mock';
import {getCheckoutUrl, getHook, handleErrorIfNeeded} from 'src/utils';
import {actionSetOverlayContent, actionShowHideOverlayContent} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {
    checkInventory as checkInventoryLib,
    baseReturnObject,
    checkInventoryStage,
} from '@boldcommerce/checkout-frontend-library';
import {stateMock} from 'src/mocks';

jest.mock('@boldcommerce/checkout-frontend-library/lib/order');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/utils/standaloneHooks');
jest.mock('src/action', () => ({
    ...jest.requireActual('src/action'),
    actionSetOverlayContent: jest.fn()
}));

const checkInventoryLibMock = mocked(checkInventoryLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const getHookMock = mocked(getHook, true);

describe('testing checkLoadPigiErrors', () => {
    const dispatch = jest.fn(() => Promise.resolve());
    const getState = jest.fn();
    const historyMock = {replace: jest.fn()} as HistoryLocationState;

    beforeEach(() => {
        jest.resetAllMocks();
        getHookMock.mockReturnValue(historyMock);
    });

    test('calling checkInventory successfully with overlay shown', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;
        localReturnObject.response = {data: {inventory_check: {result: 'pass'}, application_state: stateMock.data.application_state}};
        checkInventoryLibMock.mockReturnValueOnce(Promise.resolve(localReturnObject));

        const inventory = checkInventory(checkInventoryStage.initial);
        await inventory(dispatch, getState).then(() => {
            expect(dispatch).toBeCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionSetOverlayContent({shown: true, inverted: true, header: '', content: ''}));
            expect(checkInventoryLibMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionShowHideOverlayContent(false));

        });
    });

    test('calling checkInventory successfully with overlay hidden', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;
        localReturnObject.response = {data: {inventory_check: {result: 'pass'}, application_state: stateMock.data.application_state}};
        checkInventoryLibMock.mockReturnValueOnce(Promise.resolve(localReturnObject));

        const inventory = checkInventory(checkInventoryStage.initial, false);
        await inventory(dispatch, getState).then(() => {
            expect(dispatch).toBeCalledTimes(0);
            expect(dispatch).not.toHaveBeenCalledWith(actionSetOverlayContent(expect.anything()));
            expect(checkInventoryLibMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).not.toHaveBeenCalledWith(actionShowHideOverlayContent(expect.anything()));

        });
    });

    test('calling checkInventory successfully with inventory issue', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;
        localReturnObject.response = {data: {inventory_check: {result: 'fail'}, application_state: stateMock.data.application_state}};
        checkInventoryLibMock.mockReturnValueOnce(Promise.resolve(localReturnObject));

        const inventory = checkInventory(checkInventoryStage.initial);
        await inventory(dispatch, getState).then(() => {
            expect(dispatch).toBeCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionSetOverlayContent({shown: true, inverted: true, header: '', content: ''}));
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionShowHideOverlayContent(false));
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('out_of_stock'));
        });
    });
});
