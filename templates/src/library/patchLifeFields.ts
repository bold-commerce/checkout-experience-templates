import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    getOrderMetaData,
    IPatchOrderMetaDataRequest,
} from '@boldcommerce/checkout-frontend-library';
import {patchOrderMetaData} from 'src/library/patchOrderMetaData';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
export async function patchLifeFields(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
    const noteAttributes = getState().data.application_state.order_meta_data.note_attributes;
    const prevNoteAttributes: ICartParameters = getOrderMetaData().note_attributes;
    const noteAttributesToAdd: ICartParameters = {};
    for (const [key, value] of Object.entries(noteAttributes)) {
        if (key in prevNoteAttributes && prevNoteAttributes[key] !== value) {
            noteAttributesToAdd[key] = value;
        } else if (!(key in prevNoteAttributes)) {
            noteAttributesToAdd[key] = value;
        }
    }

    if (Object.keys(noteAttributesToAdd).length > 0) {
        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: noteAttributesToAdd,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        await dispatch(patchOrderMetaData(payload));
    }
}
