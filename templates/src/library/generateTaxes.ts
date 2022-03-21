import {IApiReturnObject, setTaxes} from '@bold-commerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {getSummaryStateFromLib} from 'src/library';

export async function generateTaxes(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void>{
    const response:IApiReturnObject = await setTaxes();
    handleErrorIfNeeded(response, dispatch, getState);
    dispatch(getSummaryStateFromLib);
}
