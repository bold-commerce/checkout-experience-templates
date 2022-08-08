import {validateApplicationStateData} from 'src/utils/validateApplicationStateData';
import {
    IApplicationState,
    ICountryInformation,
    IGeneralSettings,
    IInitializeOrderResponse,
    ISupportedLanguage
} from '@bold-commerce/checkout-frontend-library';

export function getValidatedOrderData(orderData: IInitializeOrderResponse): IInitializeOrderResponse{

    const countryInfo: Array<ICountryInformation> = orderData.initial_data.country_info;
    const languages: Array<ISupportedLanguage> = orderData.initial_data.supported_languages;
    const settings: IGeneralSettings = orderData.initial_data.general_settings;

    const validatedAppState: IApplicationState = validateApplicationStateData(orderData.application_state);

    const validatedData: IInitializeOrderResponse = {
        jwt_token: orderData.jwt_token,
        public_order_id: orderData.public_order_id,
        application_state: validatedAppState,
        initial_data:{
            shop_name: orderData.initial_data.shop_name,
            supported_languages: languages,
            country_info: countryInfo,
            general_settings: settings,
            alternate_payment_methods: orderData.initial_data.alternate_payment_methods
        }
    };
    return validatedData;
}
