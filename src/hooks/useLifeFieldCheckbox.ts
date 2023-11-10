import {useGetErrorByField, useGetLifeFieldErrorMessage, useGetNoteAttributes} from 'src/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldCheckbox} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeField} from 'src/library';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';

export function useLifeFieldCheckbox(lifeField: ILifeField): ILifeFieldCheckbox {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const id = lifeField.public_id;
    const label = lifeField.input_label ?? '';
    const helpText = lifeField.input_placeholder ?? '';

    const inputDefault  = lifeField.input_default !== null && lifeField.input_default.length > 0 && lifeField.input_default === 'true';
    const defaultValue = lifeField.meta_data_field in noteAttributes ? Boolean(noteAttributes[lifeField.meta_data_field]) : inputDefault;
    const defaultRequiredError = useGetLifeFieldErrorMessage('life_element_required');
    const errorMessage = useGetErrorByField(lifeField.meta_data_field, '');
    const [checked, setChecked] = useState(defaultValue);

    const handleChange = useCallback(e => {

        const {checked} = e.target;
        if (errorMessage) {
            dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));
        }

        setChecked(checked);
        dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, checked));
        if(!checked && lifeField.input_required) {
            dispatch(actionAddError({
                ...defaultRequiredError,
                field: lifeField.meta_data_field,
                message: `${lifeField.input_label}${defaultRequiredError.message}`
            }));
        } else {
            dispatch(patchLifeField({[lifeField.meta_data_field]: checked} as ICartParameters));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (lifeField.input_default !== null && lifeField.input_default.length > 0 && !(lifeField.meta_data_field in noteAttributes)) {
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, inputDefault));
        }
    }, []);

    return {
        checked,
        value: String(checked),
        label,
        helpText,
        id,
        errorMessage,
        handleChange
    };
}
