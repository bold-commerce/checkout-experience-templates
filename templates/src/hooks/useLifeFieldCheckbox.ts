import {useGetNoteAttributes} from 'src/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldCheckbox} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeFields, patchLifeField} from 'src/library';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';

export function useLifeFieldCheckbox(lifeField: ILifeField): ILifeFieldCheckbox {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const id = lifeField.public_id;
    const label = lifeField.input_label ?? '';
    const helpText = lifeField.input_placeholder ?? '';

    const inputDefault  = lifeField.input_default !== null && lifeField.input_default.length > 0 && lifeField.input_default === 'true';
    const defaultValue = lifeField.meta_data_field in noteAttributes ? Boolean(noteAttributes[lifeField.meta_data_field]) : inputDefault;
    const [checked, setChecked] = useState(defaultValue);

    const handleChange = useCallback(e => {

        const {checked} = e.target;
        setChecked(checked);
        dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, checked));
        dispatch(patchLifeFields);
    }, []);

    useEffect(() => {
        if (lifeField.input_default !== null && lifeField.input_default.length > 0 && !(lifeField.meta_data_field in noteAttributes)) {
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, inputDefault));
            dispatch(patchLifeField({[lifeField.meta_data_field]: inputDefault} as ICartParameters));
        } else if (!(lifeField.meta_data_field in noteAttributes) && lifeField.input_required) {
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, false));
            dispatch(patchLifeField({[lifeField.meta_data_field]: false} as ICartParameters));
        }
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
