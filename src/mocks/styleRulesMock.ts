import {
    ICssRule,
    ICssStylingPaymentIframeRequest,
    ICssStylingPaymentIframeResponse,
    IMediaRule,
    IStyleSheet
} from '@boldcommerce/checkout-frontend-library';

export const cssRuleApiMock1: ICssRule = {
    cssText: 'html {font-size: 14px;}',
};

export const cssRuleApiMock2: ICssRule = {
    cssText: '.Button:focus {outline: none;}',
};

export const cssRulesApiMock = [cssRuleApiMock1, cssRuleApiMock2];

export const mediaRuleApiMock1: IMediaRule = {
    conditionText: 'only screen and (max-width: 999px)',
    cssRules: cssRulesApiMock,
};

export const mediaRuleApiMock2: IMediaRule = {
    conditionText: 'only screen and (min-width: 1000px)',
    cssRules: cssRulesApiMock,
};

export const mediasRulesApiMock = [mediaRuleApiMock1, mediaRuleApiMock2];

export const styleSheetApiMock: IStyleSheet = {
    cssRules: cssRulesApiMock,
    mediaRules: mediasRulesApiMock
};

export const cssStylingPaymentIframeRequestMock: ICssStylingPaymentIframeRequest = {
    css_rules: cssRulesApiMock,
    media_rules: mediasRulesApiMock
};

export const cssStylingPaymentIframeApiMock: ICssStylingPaymentIframeResponse = {
    style_sheet: styleSheetApiMock
};

export const styleContentTextMock = `
#iframe-payment-gateway html {font-size: 14px;}
#iframe-payment-gateway .Button:focus {outline: none;}

@media only screen and (max-width: 999px) {
    #iframe-payment-gateway html {font-size: 14px;}
    #iframe-payment-gateway .Button:focus {outline: none;}
}

@media only screen and (min-width: 1000px) {
    #iframe-payment-gateway html {font-size: 14px;}
    #iframe-payment-gateway .Button:focus {outline: none;}
}
`;
