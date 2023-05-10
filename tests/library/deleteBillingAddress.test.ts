import {IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks/stateMock';
import {mocked} from 'jest-mock';
import {baseReturnObject, deleteBillingAddress as deleteAddress} from '@boldcommerce/checkout-frontend-library';
import {deleteBillingAddress} from 'src/library';
import {getApplicationStateFromLib} from 'src/library/applicationState';
import {handleErrorIfNeeded} from 'src/utils';

const mockDispatch = jest.fn();
jest.mock('@boldcommerce/checkout-frontend-library/lib/address');
jest.mock('src/library/applicationState');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const deleteBillingAddressMock = mocked(deleteAddress, true);
const handleErrorMock = mocked(handleErrorIfNeeded, true);
const getApplicationStateFromLibMock = mocked(getApplicationStateFromLib, true);

describe('testing deleteBillingAddress', () => {

    const returnObject = {...baseReturnObject};
    let getState: () => IOrderInitialization;

    beforeEach(() => {
        jest.resetAllMocks();
        getState = jest.fn().mockReturnValue(stateMock);
    });


    test('calling delete billing address with success', async () => {
        returnObject.success = true;
        deleteBillingAddressMock.mockReturnValue(Promise.resolve(returnObject));

        await deleteBillingAddress(mockDispatch, getState).then(() => {
            expect(deleteBillingAddressMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith(getApplicationStateFromLibMock);
        });
    });


});
