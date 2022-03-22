import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {deleteBillingAddress as deleteAddress, IApiReturnObject} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {getApplicationStateFromLib} from 'src/library';

export async function deleteBillingAddress(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const response: IApiReturnObject = await deleteAddress();
    handleErrorIfNeeded(response, dispatch, getState);
    await dispatch(getApplicationStateFromLib);
}
