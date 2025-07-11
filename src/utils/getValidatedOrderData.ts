import {validateApplicationStateData} from 'src/utils/validateApplicationStateData';
import {
    IApplicationState,
    ICountryInformation,
    IGeneralSettings,
    IInitializeOrderResponse,
    ISupportedLanguage,
    ILifeField,
    IFraudTool,
} from '@boldcommerce/checkout-frontend-library';

export function getValidatedOrderData(orderData: IInitializeOrderResponse): IInitializeOrderResponse {

    const countryInfo: Array<ICountryInformation> = orderData.initial_data.country_info;
    const languages: Array<ISupportedLanguage> = orderData.initial_data.supported_languages;
    const settings: IGeneralSettings = orderData.initial_data.general_settings;
    const lifeElements: Array<ILifeField> = orderData.initial_data.life_elements;
    const fraudTools: Array<IFraudTool> = orderData.initial_data.fraud_tools;

    const validatedAppState: IApplicationState = validateApplicationStateData(orderData.application_state);

    return {
        jwt_token: orderData.jwt_token,
        public_order_id: orderData.public_order_id,
        application_state: validatedAppState,
        initial_data: {
            shop_name: orderData.initial_data.shop_name,
            supported_languages: languages,
            country_info: countryInfo,
            general_settings: settings,
            external_payment_gateways: orderData.initial_data.external_payment_gateways,
            life_elements: lifeElements,
            fraud_tools: fraudTools,
            flow_settings:orderData.initial_data.flow_settings,
            requires_shipping: orderData.initial_data.requires_shipping,
            eps_gateways: orderData.initial_data.eps_gateways,
        },
        vaulting_enabled: orderData.vaulting_enabled,
    };
}
