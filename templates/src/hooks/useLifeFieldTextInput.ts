import {useDebounceLifeField, useGetNoteAttributes} from 'src/hooks';
import {useCallback, useState} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeFieldInput} from 'src/types';
import {ICartParameters, IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

export function useLifeFieldTextInput(lifeField: ILifeField): ILifeFieldInput {
    const dispatch = useDispatch();
    const noteAttributes = useGetNoteAttributes();
    const [inputValue, setInputValue] = useState(noteAttributes[lifeField.meta_data_field]);
    const id = lifeField.public_id;
    const label = lifeField.input_label ?? '';
    const placeHolder = lifeField.input_placeholder ?? '';

    const payload: IPatchOrderMetaDataRequest = {
        note_attributes: {
            [lifeField.meta_data_field]: inputValue,
        } as ICartParameters,
        cart_parameters: null,
        notes: null,
        tags: null,
    };
    const debounceApiCall = useDebounceLifeField(payload);

    const handleChange = useCallback(e => {

        const inputValue = e.target.value;

        setInputValue(inputValue);
        dispatch(debounceApiCall);
    }, []);

    return {
        inputValue,
        label,
        placeHolder,
        id,
        handleChange
    };
}
