import {mocked} from 'jest-mock';
import {baseReturnObject, deleteDiscount} from '@bold-commerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';
import {deleteDiscounts} from 'src/library';
import * as HandleError from 'src/utils/handleErrorIfNeeded';
import * as AppActions from 'src/action/appAction';
import * as appState from 'src/library/applicationState';

jest.mock('@bold-commerce/checkout-frontend-library/lib/discounts');
const addDiscountMock = mocked(deleteDiscount, true);

describe('testing delete Discount Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();
    let handleErrorIfNeededSpy: jest.SpyInstance;
    let actionRemoveDiscountSpy: jest.SpyInstance;
    let actionSetLoaderAndDisableButtonSpy: jest.SpyInstance;
    let getSummaryStateFromLibSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        returnObject.success = true;
        returnObject.response = {data: {taxes: application_state.taxes, application_state}};
        handleErrorIfNeededSpy = jest.spyOn(HandleError, 'handleErrorIfNeeded');
        actionRemoveDiscountSpy = jest.spyOn(AppActions , 'actionRemoveDiscount');
        actionSetLoaderAndDisableButtonSpy = jest.spyOn(AppActions , 'actionSetLoaderAndDisableButton');
        getSummaryStateFromLibSpy = jest.spyOn(appState , 'getSummaryStateFromLib');
    });

    test('calling delete discount successful', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;

        addDiscountMock.mockReturnValue(Promise.resolve(localReturnObject));
        const postDiscount = deleteDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLibSpy);
            expect(actionRemoveDiscountSpy).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalled();
        });
    });

    test('calling delete discount failure', async () => {
        const localReturnObject = {...baseReturnObject};
        addDiscountMock.mockReturnValue(Promise.resolve(localReturnObject));
        const postDiscount = deleteDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededSpy).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(getSummaryStateFromLibSpy);
            expect(actionSetLoaderAndDisableButtonSpy).toHaveBeenCalled();
        });
    });

});
