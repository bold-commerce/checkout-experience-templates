import {baseReturnObject} from '@bold-commerce/checkout-frontend-library/lib/variables';
import {IOrderInitialization} from 'src/types';
import {stateMock} from 'src/mocks/stateMock';
import {mocked} from 'jest-mock';
import {deleteShippingAddress as deleteAddress} from '@bold-commerce/checkout-frontend-library';
import {deleteShippingAddress} from 'src/library';
import {getApplicationStateFromLib}  from 'src/library/applicationState';
import {handleErrorIfNeeded} from 'src/utils/handleErrorIfNeeded';

const mockDispatch = jest.fn();
jest.mock('@bold-commerce/checkout-frontend-library');
jest.mock('src/library/applicationState');
jest.mock('src/utils/handleErrorIfNeeded');
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));
const deleteShippingAddressMock = mocked(deleteAddress, true);
const handleErrorMock = mocked(handleErrorIfNeeded, true);
const getApplicationStateFromLibMock = mocked(getApplicationStateFromLib, true);

describe('testing delete shipping address', () => {

    const returnObject = {...baseReturnObject};
    let getState: () => IOrderInitialization;

    beforeEach(() => {
        jest.resetAllMocks();
        getState = jest.fn().mockReturnValue(stateMock);
    });


    test('calling delete shipping address with success', async () => {
        returnObject.success = true;
        deleteShippingAddressMock.mockReturnValue(returnObject);

        await deleteShippingAddress(mockDispatch, getState).then(async () => {
            expect(deleteShippingAddressMock).toHaveBeenCalledTimes(1);
            expect(handleErrorMock).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledTimes(1);
            expect(mockDispatch).toHaveBeenCalledWith(getApplicationStateFromLibMock);
        });
    });

});
