import {IApiReturnObject, IApiSuccessResponse, IPatchOrderMetaDataRequest, IPatchOrderMetaDataResponse, patchOrderMetaData as patchOrderMetaDataLib} from '@boldcommerce/checkout-frontend-library';
import {handleErrorIfNeeded} from 'src/utils';
import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {actionOrderMetaData} from 'src/action';

export function patchOrderMetaData(payload: IPatchOrderMetaDataRequest) {
    return async function addTaxExemptionNoteAttributeThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        const respObj: IApiReturnObject = await patchOrderMetaDataLib(payload);
        handleErrorIfNeeded(respObj, dispatch, getState);

        if (respObj.success && (respObj.response as IApiSuccessResponse)?.data) {
            const resp  = (respObj.response as IApiSuccessResponse).data as IPatchOrderMetaDataResponse;
            if (resp.order_meta_data) {
                dispatch(actionOrderMetaData(resp.order_meta_data));
            }
        }
    };
}
