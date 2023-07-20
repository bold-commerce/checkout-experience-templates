import {useGetNoteAttributes} from 'src/hooks';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldCheckbox} from 'src/types';
import {ICartParameters, IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {patchOrderMetaData} from 'src/library';

export function useLifeFieldCheckbox(lifeField: ILifeField): ILifeFieldCheckbox {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const [checked, setChecked] = useState(Boolean(noteAttributes[lifeField.meta_data_field]));
    const id = lifeField.public_id;
    const label = lifeField.input_label ?? '';
    const helpText = lifeField.input_placeholder ?? '';

    const handleChange = useCallback(e => {

        const {checked} = e.target;

        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: {
                [lifeField.meta_data_field]: checked,
            } as ICartParameters,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        setChecked(checked);
        dispatch(patchOrderMetaData(payload));
    }, []);

    return {
        checked,
        value: String(checked),
        label,
        helpText,
        id,
        handleChange
    };
}
