import {
    IApplicationState,
    ICountryInformation,
    IGeneralSettings,
    IInitializeEndpointData,
    ISupportedLanguage
} from 'src/types';
import {validateApplicationStateData} from 'src/utils/validateApplicationStateData';

export function getValidatedOrderData(orderData: IInitializeEndpointData): IInitializeEndpointData{

    const countryInfo: Array<ICountryInformation> = orderData.initial_data.country_info;
    const languages: Array<ISupportedLanguage> = orderData.initial_data.supported_languages;
    const settings: IGeneralSettings = orderData.initial_data.general_settings;

    const validatedAppState: IApplicationState = validateApplicationStateData(orderData.application_state);

    const validatedData: IInitializeEndpointData = {
        jwt_token: orderData.jwt_token,
        public_order_id: orderData.public_order_id,
        application_state: validatedAppState,
        initial_data:{
            shop_name: orderData.initial_data.shop_name,
            supported_languages: languages,
            country_info: countryInfo,
            general_settings: settings
        }
    };
    return validatedData;
}
