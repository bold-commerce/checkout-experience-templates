import {
    useGetErrorByField,
    useGetNoteAttributes,
    useGetLifeFieldErrorMessage,
    useGetAppSettingData
} from 'src/hooks';
import {useCallback, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldDatePicker} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeField} from 'src/library';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';
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
    const isFirstRender = useRef(true);

    const handleChange = useCallback(selectedDate => {

        dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));

        if (selectedDate) {
            const selectedDateString = selectedDate.toLocaleDateString(languageIso, {year: 'numeric', month: 'long', day: 'numeric'});
            setValue(selectedDateString);
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, selectedDateString));

            const defaultDate = new Date(lifeField.input_default ?? '');
            if (!isFirstRender.current || isNaN(defaultDate.getTime())) {
                dispatch(patchLifeField({[lifeField.meta_data_field]: selectedDateString} as ICartParameters));
            }
            isFirstRender.current = false;
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
