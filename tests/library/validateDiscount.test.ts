import {baseReturnObject, validateDiscount as validateDiscountLib} from '@boldcommerce/checkout-frontend-library';
import {stateMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {validateDiscount} from 'src/library';
import {handleErrorIfNeeded} from 'src/utils';

jest.mock('@boldcommerce/checkout-frontend-library/lib/discounts');
jest.mock('src/utils');
const validateDiscountLibMock = mocked(validateDiscountLib, true);
const handleErrorIfNeededMock = mocked(handleErrorIfNeeded, true);

describe('testing validateDiscount', () => {
    const getState = jest.fn();
    const mockDispatch = jest.fn();
    const returnObject = {...baseReturnObject};

    beforeEach(() => {
        jest.resetAllMocks();
        mockDispatch.mockReturnValue(Promise.resolve());
        getState.mockReturnValue(stateMock);
    });


    test('tests calling validate Discount', async  () => {
        const newReturnObj = {...returnObject, success: false};
        validateDiscountLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const validate = validateDiscount('TEST');
        const response = await validate(mockDispatch, getState);
        expect(validateDiscountLibMock).toHaveBeenCalledTimes(1);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(1);
        expect(response).toBe(newReturnObj);
    });

    test('tests calling validate Discount without handleError', async  () => {
        const newReturnObj = {...returnObject, success: false};
        validateDiscountLibMock.mockReturnValueOnce(Promise.resolve(newReturnObj));

        const validate = validateDiscount('TEST', false);
        const response = await validate(mockDispatch, getState);
        expect(validateDiscountLibMock).toHaveBeenCalledTimes(1);
        expect(handleErrorIfNeededMock).toHaveBeenCalledTimes(0);
        expect(response).toBe(newReturnObj);
    });

});
