import {IApiReturnObject, setTaxes} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getSummaryStateFromLib} from 'src/library';
import {API_RETRY} from 'src/constants';

export async function generateTaxes(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void>{
    const response:IApiReturnObject = await setTaxes(API_RETRY);
    handleErrorIfNeeded(response, dispatch, getState);
    dispatch(getSummaryStateFromLib);
}
