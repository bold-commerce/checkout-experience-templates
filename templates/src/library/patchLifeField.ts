import {Dispatch} from 'redux';
import {IPatchOrderMetaDataRequest,} from '@boldcommerce/checkout-frontend-library';
import {patchOrderMetaData} from 'src/library/patchOrderMetaData';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
export function patchLifeField(noteAttributesToAdd: ICartParameters) {
    return async function patchLifeFieldThunk(dispatch: Dispatch): Promise<void> {
        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: noteAttributesToAdd,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        await dispatch(patchOrderMetaData(payload));
    };
}
