import {Dispatch} from 'redux';
import {IOrderInitialization} from 'src/types';
import {
    Constants,
    errorSeverities,
    errorSubTypes,
    errorTypes,
} from 'src/constants';
import {actionAddError} from 'src/action';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';
import {findLanguageDataByIsoCode, getErrorTerm, getLanguageBlob} from 'src/utils';
import {patchLifeFields} from 'src/library/patchLifeFields';
import {LifeInputTypeConstants} from 'src/constants';

export function validateLifeFields(lifeFields: Array<ILifeField>) {
    return async function validateLifeFieldsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        let callPatchAPI = true;
        const language = findLanguageDataByIsoCode(getState().data.initial_data.supported_languages, getState().appSetting.languageIso);
        let languageErrorBlob;
        if (language) {
            languageErrorBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
        }

        const requiredErrorMessage = getErrorTerm('life_element_required', 'life_elements', languageErrorBlob);
        const invalidErrorMessage = getErrorTerm('life_element_invalid', 'life_elements', languageErrorBlob);

        const defaultError = {
            message: '',
            type: errorTypes.life_elements,
            field: '',
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.empty,
            address_type: '',
        };

        const requiredLifeFields = lifeFields.filter(lifeField => lifeField.input_required);
        const regexLifeFields = lifeFields.filter(lifeField => lifeField.input_regex && (lifeField.input_type === LifeInputTypeConstants.TEXT || lifeField.input_type === LifeInputTypeConstants.TEXTAREA));

        const noteAttributes = getState().data.application_state.order_meta_data.note_attributes;
        for (const requiredLifeField  of requiredLifeFields) {
            if(!noteAttributes[requiredLifeField.meta_data_field]) {
                callPatchAPI = false;
                dispatch(actionAddError({
                    ...defaultError,
                    field: requiredLifeField.meta_data_field,
                    message: `${requiredLifeField.input_label}${requiredErrorMessage}`
                }));
            } else if (noteAttributes[requiredLifeField.meta_data_field] && noteAttributes[requiredLifeField.meta_data_field].trim() === '') {
                callPatchAPI = false;
                dispatch(actionAddError({
                    ...defaultError,
                    field: requiredLifeField.meta_data_field,
                    message: `${requiredLifeField.input_label}${requiredErrorMessage}`
                }));
            }
        }

        for (const regexLifeField of regexLifeFields) {
            if (regexLifeField.input_regex) {
                const regex = new RegExp(regexLifeField.input_regex);
                if(!regex.test(noteAttributes[regexLifeField.meta_data_field])) {
                    callPatchAPI = false;
                    dispatch(actionAddError({
                        ...defaultError,
                        field: regexLifeField.meta_data_field,
                        message: `${regexLifeField.input_label}${invalidErrorMessage}`
                    }));
                }
            }
        }

        if (callPatchAPI) {
            await patchLifeFields(dispatch, getState);
        }
    };
}
