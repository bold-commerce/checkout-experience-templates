import {
    useGetErrorByField,
    useGetNoteAttributes,
    useGetLifeFieldErrorMessage,
    useGetAppSettingData
} from 'src/hooks';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldDatePicker} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeFields} from 'src/library';
export function useLifeFieldDatePicker(lifeField: ILifeField): ILifeFieldDatePicker {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const id = lifeField.public_id;
    const placeHolder = lifeField.input_placeholder ?? '';
    const errorMessage = useGetErrorByField(lifeField.meta_data_field, '');
    const languageIso = useGetAppSettingData('languageIso') as string;

    const defaultValue = lifeField.meta_data_field in noteAttributes ? noteAttributes[lifeField.meta_data_field] : '';
    const [value, setValue] = useState(defaultValue);
    const defaultRequiredError = useGetLifeFieldErrorMessage('life_element_required');
    const date = lifeField.input_default;

    const handleChange = useCallback(date => {

        dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));

        if (date) {
            const selectedDate = date.toLocaleDateString(languageIso, {year: 'numeric', month: 'long', day: 'numeric'});
            setValue(selectedDate);
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, selectedDate));
            dispatch(patchLifeFields);
        } else {
            dispatch(actionAddError({
                ...defaultRequiredError,
                field: lifeField.meta_data_field,
                message: `${lifeField.input_label}${defaultRequiredError.message}`
            }));
        }
    }, [errorMessage, languageIso]);

    return {
        date,
        value,
        placeHolder,
        id,
        errorMessage,
        handleChange
    };
}
