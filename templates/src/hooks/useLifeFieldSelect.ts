import {ILifeFieldSelect} from 'src/types';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {useCallback, useState} from 'react';
import {useGetErrorByField, useGetLifeFieldErrorMessage, useGetNoteAttributes} from 'src/hooks';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {patchLifeFields} from 'src/library';
import {useDispatch} from 'react-redux';

export function useLifeFieldSelect(lifeField: ILifeField): ILifeFieldSelect {
    const dispatch = useDispatch();
    const id = lifeField.public_id;
    const inputDefault = lifeField.input_default ?? '';
    const placeholder = lifeField.input_placeholder?? '';
    const optionsArray = inputDefault.split(',');
    const label = lifeField.input_label ?? '';
    const options = optionsArray.map((option) => ({value: option, name: option}));

    const noteAttributes = useGetNoteAttributes();
    const defaultValue = lifeField.meta_data_field in noteAttributes ? noteAttributes[lifeField.meta_data_field] : '';
    const [inputValue, setInputValue] = useState(defaultValue);

    const errorMessage = useGetErrorByField(lifeField.meta_data_field, '');
    const defaultError = useGetLifeFieldErrorMessage();

    const handleChange = useCallback(e => {

        const {value} = e.target;

        if (errorMessage) {
            dispatch(actionRemoveErrorByField(lifeField.meta_data_field, ''));
        }

        setInputValue(value);
        dispatch(actionUpdateNoteAttributeField(lifeField.meta_data_field, value));

        if(!value && lifeField.input_required) {
            dispatch(actionAddError({
                ...defaultError,
                field: lifeField.meta_data_field,
                message: `${lifeField.input_label}${defaultError.message}`
            }));
        } else {
            dispatch(patchLifeFields);
        }
    }, [errorMessage]);

    return {
        inputValue,
        label,
        placeholder,
        options,
        id,
        errorMessage,
        handleChange,
    };
}
