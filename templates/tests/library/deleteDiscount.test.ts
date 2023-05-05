import {baseReturnObject, deleteDiscount} from '@boldcommerce/checkout-frontend-library';
import {mocked} from 'jest-mock';
import {actionRemoveDiscount, actionSetLoaderAndDisableButton} from 'src/action';
import {deleteDiscounts, getSummaryStateFromLib} from 'src/library';
import {initialDataMock} from 'src/mocks';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/discounts');
jest.mock('src/action');
jest.mock('src/utils');
const addDiscountMock = mocked(deleteDiscount, true);
const actionRemoveDiscountMock = mocked(actionRemoveDiscount, true);
const actionSetLoaderAndDisableButtonMock = mocked(actionSetLoaderAndDisableButton, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing delete Discount Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        returnObject.success = true;
        returnObject.response = {data: {taxes: application_state.taxes, application_state}};
    });

    test('calling delete discount successful', async () => {
        const localReturnObject = {...baseReturnObject};
        localReturnObject.success = true;

        addDiscountMock.mockReturnValue(Promise.resolve(localReturnObject));
        const postDiscount = deleteDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(3);
            expect(dispatchMock).toHaveBeenCalledWith(getSummaryStateFromLib);
            expect(actionRemoveDiscountMock).toHaveBeenCalled();
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        });
    });

    test('calling delete discount failure', async () => {
        const localReturnObject = {...baseReturnObject};
        addDiscountMock.mockReturnValue(Promise.resolve(localReturnObject));
        const postDiscount = deleteDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toHaveBeenCalledWith(getSummaryStateFromLib);
            expect(actionSetLoaderAndDisableButtonMock).toHaveBeenCalled();
        });
    });

});
