import {mocked} from 'jest-mock';
import {baseReturnObject, updateLineItemQuantity as updateLineItemQuantityAPI} from '@boldcommerce/checkout-frontend-library';
import {getApplicationStateFromLib, updateLineItemQuantity} from 'src/library';
import {actionSetLoaderAndDisableButton} from 'src/action';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/items');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('src/action', () => ({
    ...jest.requireActual('src/action'),
    actionSetLoaderAndDisableButton: jest.fn()
}));

const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);
const updateLineItemQuantityAPIMock = mocked(updateLineItemQuantityAPI, true);

describe('testing updateLineItemQuantity', () => {
    const returnObject = {...baseReturnObject};
    const dispatch = jest.fn(() => Promise.resolve());
    const getState = jest.fn();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('calling function successfully', async () => {
        returnObject.success = true;
        updateLineItemQuantityAPIMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await updateLineItemQuantity('123', 3)(dispatch, getState);

        expect(dispatch).toBeCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButton('updateLineItemQuantity', true));
        expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButton('updateLineItemQuantity', false));
        expect(dispatch).toHaveBeenCalledWith(getApplicationStateFromLib);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });


    test('calling function with response success false', async () => {
        returnObject.success = false;
        updateLineItemQuantityAPIMock.mockReturnValueOnce(Promise.resolve(returnObject));

        await updateLineItemQuantity('123', 3)(dispatch, getState);

        expect(dispatch).toBeCalledTimes(3);
        expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButton('updateLineItemQuantity', true));
        expect(dispatch).toHaveBeenCalledWith(actionSetLoaderAndDisableButton('updateLineItemQuantity', false));
        expect(dispatch).toHaveBeenCalledWith(getApplicationStateFromLib);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
    });
});

