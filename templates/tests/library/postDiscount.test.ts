import {mocked} from 'jest-mock';
import {addDiscount, IAddDiscountResponse, IApiSuccessResponse} from '@bold-commerce/checkout-frontend-library';
import {initialDataMock} from 'src/mocks';
import {getSummaryStateFromLib, postDiscounts} from 'src/library';
import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {stateMock} from 'src/mocks/stateMock';
import {IApplicationState} from '@bold-commerce/checkout-frontend-library/lib/types/apiInterfaces';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/library/applicationState');
jest.mock('src/utils');
const addDiscountMock = mocked(addDiscount, true);
const getSummaryStateFromLibMock = mocked(getSummaryStateFromLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing post Discount Thunk Action', () => {
    const returnObject = {...baseReturnObject};
    const {application_state} = initialDataMock;
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    beforeEach(() => {
        returnObject.success = true;
        returnObject.response = {data: {taxes: application_state.taxes, application_state}};
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('calling post Discount successful', async () => {

        const localReturnObject = {...baseReturnObject};
        const appState = stateMock.data.application_state as IApplicationState;

        const discount: IAddDiscountResponse = {
            discount: {
                code: 'TEST',
                text: 'TEST CODE',
                value: 5,
                valid: true,
            },
            application_state: appState
        };
        const apiSuccess: IApiSuccessResponse = {
            data: discount
        };
        localReturnObject.response = apiSuccess;
        localReturnObject.success = true;


        addDiscountMock.mockReturnValue(localReturnObject);
        const postDiscount = postDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(4);
            expect(dispatchMock).toBeCalledWith(getSummaryStateFromLibMock);
        });
    });

    test('calling post Discount failure', async () => {

        const localReturnObject = {...baseReturnObject};
        addDiscountMock.mockReturnValue(localReturnObject);
        const postDiscount = postDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
            expect(dispatchMock).not.toBeCalledWith(getSummaryStateFromLibMock);
        });
    });

    test('calling post Discount with null discount', async () => {

        const localReturnObject = {...baseReturnObject};
        const appState = stateMock.data.application_state as IApplicationState;

        const discount: IAddDiscountResponse = {
            discount: undefined,
            application_state: appState
        };
        const apiSuccess: IApiSuccessResponse = {
            data: discount
        };
        localReturnObject.response = apiSuccess;
        localReturnObject.success = true;

        addDiscountMock.mockReturnValue(localReturnObject);
        const postDiscount = postDiscounts('TEST');
        await postDiscount(dispatchMock, getStateMock).then(() => {
            expect(addDiscountMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
            expect(handleErrorIfNeededMock).toHaveBeenCalledWith(localReturnObject, dispatchMock, getStateMock);
            expect(dispatchMock).toHaveBeenCalledTimes(1);
        });
    });

});
