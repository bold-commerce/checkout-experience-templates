import {mocked} from 'jest-mock';
import {deleteDiscounts, postDiscounts, validateDiscount, validateDiscounts} from 'src/library';
import {stateMock} from 'src/mocks';
import {baseReturnObject, IDiscount} from '@boldcommerce/checkout-frontend-library';
import {actionAddError} from 'src/action';
import {IError} from 'src/types';
import {errorFields, errorSeverities, errorSubTypes, errorTypes, PLUGIN_BACKEND_DISCOUNT_SOURCE} from 'src/constants';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
jest.mock('src/library/deleteDiscounts');
jest.mock('src/library/postDiscounts');
jest.mock('src/library/validateDiscount');
jest.mock('src/action');
const validateDiscountMock = mocked(validateDiscount, true);
const postDiscountsMock = mocked(postDiscounts, true);
const deleteDiscountsMock = mocked(deleteDiscounts, true);
const actionAddErrorMock = mocked(actionAddError, true);


describe('testing validateDiscounts', () => {
    const getState = jest.fn();
    const returnObject = {...baseReturnObject};

    const discount: IDiscount = {
        code: 'test',
        text: 'test',
        value: 10,
        valid: true,
    };

    const error : IError = {
        message: 'One or more discount codes have been removed because they are not valid for this email address',
        type: errorTypes.validation,
        field: errorFields.discountsFlash,
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.discounts,
        address_type: '',
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('tests calling validate Discounts with all valid discounts', async  () => {

        returnObject.success = true;
        mockDispatch
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve(returnObject))
            .mockReturnValueOnce(Promise.resolve());
        const state = {...stateMock};
        state.data.application_state.discounts = [discount];
        getState.mockReturnValueOnce(state);

        await validateDiscounts(mockDispatch, getState);
        expect(deleteDiscountsMock).toHaveBeenCalledTimes(1);
        expect(validateDiscountMock).toHaveBeenCalledTimes(1);
        expect(postDiscountsMock).toHaveBeenCalledTimes(1);
        expect(mockDispatch).not.toHaveBeenCalledWith(actionAddErrorMock);
    });

    test('tests calling validate Discounts with all cart level discounts', async  () => {
        const cartDiscount = {...discount, source: PLUGIN_BACKEND_DISCOUNT_SOURCE}
        returnObject.success = true;
        mockDispatch
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve(returnObject))
            .mockReturnValueOnce(Promise.resolve());
        const state = {...stateMock};
        state.data.application_state.discounts = [cartDiscount];
        getState.mockReturnValueOnce(state);

        await validateDiscounts(mockDispatch, getState);
        expect(deleteDiscountsMock).toHaveBeenCalledTimes(0);
        expect(validateDiscountMock).toHaveBeenCalledTimes(0);
        expect(postDiscountsMock).toHaveBeenCalledTimes(0);
        expect(mockDispatch).not.toHaveBeenCalledWith(actionAddErrorMock);
    });

    test('tests calling validate Discounts with all invalid discounts', async  () => {

        returnObject.success = false;
        mockDispatch
            .mockReturnValueOnce(Promise.resolve())
            .mockReturnValueOnce(Promise.resolve(returnObject))
            .mockReturnValueOnce(Promise.resolve());
        const state = {...stateMock};
        state.data.application_state.discounts = [discount];
        getState.mockReturnValueOnce(state);

        await validateDiscounts(mockDispatch, getState);
        expect(deleteDiscountsMock).toHaveBeenCalledTimes(1);
        expect(validateDiscountMock).toHaveBeenCalledTimes(1);
        expect(postDiscountsMock).toHaveBeenCalledTimes(0);
        expect(actionAddErrorMock).toBeCalled();
        expect(actionAddErrorMock).toBeCalledWith(error);
    });


});
