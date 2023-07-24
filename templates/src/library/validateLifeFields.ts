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

export function validateLifeFields(requiredLifeFields: Array<ILifeField>) {
    return async function validateLifeFieldsThunk(dispatch: Dispatch, getState: () => IOrderInitialization): Promise<void> {
        let callPatchAPI = true;
        const language = findLanguageDataByIsoCode(getState().data.initial_data.supported_languages, getState().appSetting.languageIso);
        let languageErrorBlob;
        if (language) {
            languageErrorBlob = getLanguageBlob(language, Constants.LANGUAGE_BLOB_ERROR_TYPE) as Array<Array<string>>;
        }
        const errorMessage = getErrorTerm('life_element_required', 'life_elements', languageErrorBlob);

        const defaultError = {
            message: errorMessage,
            type: errorTypes.life_elements,
            field: '',
            severity: errorSeverities.validation,
            sub_type: errorSubTypes.empty,
            address_type: '',
        };

        const noteAttributes = getState().data.application_state.order_meta_data.note_attributes;
        for (const requiredLifeField  of requiredLifeFields) {
            if(!noteAttributes[requiredLifeField.meta_data_field]) {
                dispatch(actionAddError({
                    ...defaultError,
                    field: requiredLifeField.meta_data_field,
                    message: `${requiredLifeField.input_label}${errorMessage}`
                }));
                callPatchAPI = false;
            } else if (noteAttributes[requiredLifeField.meta_data_field] && noteAttributes[requiredLifeField.meta_data_field].trim() === '') {
                dispatch(actionAddError({
                    ...defaultError,
                    field: requiredLifeField.meta_data_field,
                    message: `${requiredLifeField.input_label}${errorMessage}`
                }));
                callPatchAPI = false;
            }
        }

        if (callPatchAPI) {
            await patchLifeFields(dispatch, getState);
        }
    };
}
