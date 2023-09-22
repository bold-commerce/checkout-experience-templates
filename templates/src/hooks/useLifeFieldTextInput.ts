import {useDebounceLifeField, useGetErrorByField, useGetNoteAttributes, useGetLifeFieldErrorMessage} from 'src/hooks';
import {useCallback, useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldInput} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
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
    const debounceApiCall = useDebounceLifeField({[lifeField.meta_data_field]: inputValue} as ICartParameters);
    const defaultRequiredError = useGetLifeFieldErrorMessage('life_element_required');
    const defaultInvalidError = useGetLifeFieldErrorMessage('life_element_invalid');

    const handleChange = useCallback(e => {

        const inputValue = e.target.value;
        let dispatchDebounceApiCall = true;

        if (errorMessage) {
            dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));
        }

        setInputValue(inputValue);
        dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, inputValue));

        if(!inputValue && lifeField.input_required) {
            dispatch(actionAddError({
                ...defaultRequiredError,
                field: lifeField.meta_data_field,
                message: `${lifeField.input_label}${defaultRequiredError.message}`
            }));
            dispatchDebounceApiCall = false;
        } else if (lifeField.input_regex) {
            const regex = new RegExp(lifeField.input_regex);
            if (!regex.test(inputValue)) {
                dispatch(actionAddError({
                    ...defaultInvalidError,
                    field: lifeField.meta_data_field,
                    message: `${lifeField.input_label}${defaultInvalidError.message}`
                }));
                dispatchDebounceApiCall = false;
            }
        }

        if (dispatchDebounceApiCall) {
            dispatch(debounceApiCall);
        }

    }, [errorMessage]);

    useEffect(() => {
        if (defaultValue.length > 0 && !(lifeField.meta_data_field in noteAttributes)) {
            dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, defaultValue));
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
