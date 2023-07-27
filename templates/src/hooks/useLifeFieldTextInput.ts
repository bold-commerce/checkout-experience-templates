import {useDebounceLifeField, useGetErrorByField, useGetNoteAttributes, useGetLifeFieldErrorMessage} from 'src/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldInput} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeField} from 'src/library';
import {ICartParameters} from '@boldcommerce/checkout-frontend-library';

export function useLifeFieldTextInput(lifeField: ILifeField): ILifeFieldInput {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const id = lifeField.public_id;
    const label = lifeField.input_label ?? '';
    const placeHolder = lifeField.input_placeholder ?? '';
    const errorMessage = useGetErrorByField(lifeField.meta_data_field, '');

    const inputDefault = lifeField.input_default ?? '';
    const defaultValue = lifeField.meta_data_field in noteAttributes ? noteAttributes[lifeField.meta_data_field] : inputDefault;
    const [inputValue, setInputValue] = useState(defaultValue);
    const debounceApiCall = useDebounceLifeField();
    const defaultError = useGetLifeFieldErrorMessage();

    const handleChange = useCallback(e => {

        const inputValue = e.target.value;

        if (errorMessage) {
            dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));
        }

        if (inputValue) {
            setInputValue(inputValue);
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, inputValue));
            dispatch(debounceApiCall);
        } else {
            setInputValue(inputValue);
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, inputValue));
            dispatch(actionAddError({
                ...defaultError,
                field: lifeField.meta_data_field,
                message: `${lifeField.input_label}${defaultError.message}`
            }));
        }
    }, [errorMessage]);

    useEffect(() => {
        if (defaultValue.length > 0 && !(lifeField.meta_data_field in noteAttributes)) {
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, defaultValue));
            dispatch(patchLifeField({[lifeField.meta_data_field]: defaultValue} as ICartParameters));
        }
    }, []);

    return {
        inputValue,
        label,
        placeHolder,
        id,
        errorMessage,
        handleChange
    };
}
