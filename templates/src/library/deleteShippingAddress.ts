import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {deleteShippingAddress as deleteAddress, IApiReturnObject} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getApplicationStateFromLib} from 'src/library';
import {API_RETRY} from 'src/constants';

export async function deleteShippingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const response: IApiReturnObject = await deleteAddress(API_RETRY);
    handleErrorIfNeeded(response, dispatch, getState);
    await dispatch(getApplicationStateFromLib);
}
