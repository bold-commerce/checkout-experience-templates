import {checkInventory} from 'src/library';
import {mocked} from 'jest-mock';
import {getCheckoutUrl, getHook, handleErrorIfNeeded} from 'src/utils';
import {actionSetOverlayContent, actionShowHideOverlayContent} from 'src/action';
import {HistoryLocationState} from 'react-router';
import {
    checkInventory as checkInventoryLib,
    baseReturnObject,
    checkInventoryStage
} from '@bold-commerce/checkout-frontend-library';


jest.mock('@bold-commerce/checkout-frontend-library/lib/order');
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

    test('calling checkInventory successfully', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;
        localReturnObject.response = {data: {inventory_check: {result: 'Pass'}}};
        checkInventoryLibMock.mockReturnValueOnce(localReturnObject);

        const inventory = checkInventory(checkInventoryStage.initial);
        await inventory(dispatch, getState).then(() => {
            expect(dispatch).toBeCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionSetOverlayContent({shown: true, inverted: true, header: '', content: ''}));
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionShowHideOverlayContent(false));

        });
    });

    test('calling checkInventory successfully with inventory issue', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;
        localReturnObject.response = {data: {inventory_check: {result: 'fail'}}};
        checkInventoryLibMock.mockReturnValueOnce(localReturnObject);

        const inventory = checkInventory(checkInventoryStage.initial);
        await inventory(dispatch, getState).then(() => {
            expect(dispatch).toBeCalledTimes(2);
            expect(dispatch).toHaveBeenCalledWith(actionSetOverlayContent({shown: true, inverted: true, header: '', content: ''}));
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(dispatch).toHaveBeenCalledWith(actionShowHideOverlayContent(false));
            expect(historyMock.replace).toHaveBeenCalledTimes(1);
            expect(historyMock.replace).toHaveBeenCalledWith(getCheckoutUrl('/out_of_stock'));
        });
    });
});
