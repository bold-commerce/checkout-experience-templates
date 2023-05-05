import {Constants} from 'src/constants';
import {ICssRule, ICssStylingPaymentIframeRequest, IMediaRule} from '@boldcommerce/checkout-frontend-library';

const pigiIframeId = `#${Constants.PIGI_IFRAME}`;

export function getPigiStylingRules(): ICssStylingPaymentIframeRequest {
    const filteredPigiRules = getCssRulesById(pigiIframeId);
    const cssRules = getProcessStyleRules(filteredPigiRules);
    const mediaRules = getProcessMediaRules(filteredPigiRules);
    return {css_rules: cssRules, media_rules: mediaRules};
}

export function processStyleRules(resultArray: Array<ICssRule>, sourceArray: Array<CSSRule>): void {
    const pigiIframeIdRegex = new RegExp(pigiIframeId, 'g');
    sourceArray.forEach(rule => resultArray.push({cssText: rule.cssText.replace(pigiIframeIdRegex, '').trim()}));
}

export function getCssRulesById(pigiIframeId: string): Array<CSSRule> {
    const filteredPigiRules: Array<CSSRule> = [];
    Array.from(document.styleSheets).forEach( (styleSheet: CSSStyleSheet) => {
        try {
            filteredPigiRules.push(...Array.from(styleSheet.cssRules).filter((rule: CSSRule) => rule.cssText.includes(pigiIframeId)));
        } catch(e){
            // do nothing, if fails, then we don't have access to cssRules from stylesheet
        }
    });
    return filteredPigiRules;
}

export function getProcessStyleRules(filteredPigiRules: Array<CSSRule>): Array<ICssRule> {
    const cssRules: Array<ICssRule> = [];
    processStyleRules(cssRules, filteredPigiRules.filter(rule => rule.type === CSSRule.STYLE_RULE));
    return cssRules;
}

export function getProcessMediaRules(filteredPigiRules: Array<CSSRule>): Array<IMediaRule> {
    const mediaRules: Array<IMediaRule> = [];
    filteredPigiRules.filter(rule => rule.type === CSSRule.MEDIA_RULE).forEach(rule => {
        const mediaCssRules: Array<ICssRule> = [];
        processStyleRules(mediaCssRules, Array.from((rule as CSSMediaRule).cssRules));
        const conditionText = (rule as CSSMediaRule).conditionText ?? (rule as CSSMediaRule).media[0];
        mediaRules.push({conditionText, cssRules: mediaCssRules});
    });
    return mediaRules;
}
