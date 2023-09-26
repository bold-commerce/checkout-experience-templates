import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {patchLifeFields} from 'src/library';
import {LifeInputTypeConstants} from 'src/constants';

export function useOnLoadDefaultLifeFields(lifeFields: Array<ILifeField>): void {
    const dispatch = useDispatch();

    useEffect(() => {
        const defaultLifeFields = lifeFields.filter(
            lifeField => (lifeField.input_default && (lifeField.input_type === LifeInputTypeConstants.TEXT || lifeField.input_type === LifeInputTypeConstants.TEXTAREA || lifeField.input_type === LifeInputTypeConstants.DATEPICKER)) ||
            lifeField.input_type === LifeInputTypeConstants.CHECKBOX);
        if (defaultLifeFields.length > 0) {
            dispatch(patchLifeFields);
        }
    }, []);
}
