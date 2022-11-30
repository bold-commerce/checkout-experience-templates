import {getPigiStylingRules, getProcessMediaRules} from 'src/utils';
import {cssRulesApiMock, mediasRulesApiMock, styleContentTextMock} from 'src/mocks';

describe('Test getPigiStylingRules functions', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        const style = document.createElement('style');
        style.textContent = styleContentTextMock;
        document.head.appendChild(style);
    });

    test('call getPigiStylingRules', () => {
        const returned = getPigiStylingRules();
        expect(returned.css_rules).toStrictEqual(cssRulesApiMock);
        expect(returned.media_rules).toStrictEqual(mediasRulesApiMock);
    });

    test('call getProcessMediaRules', () => {
        const expectedRule1 = 'mediaTest';
        const expectedRule2 = 'conditionText';
        const mediaList = new MediaList();
        mediaList.appendMedium(expectedRule1);
        const cssRule = {
            cssText: 'test',
            parentRule: null,
            parentStyleSheet: null,
            type: CSSRule.MEDIA_RULE,
            cssRules: {} as CSSRuleList,
            media: mediaList,
        } as CSSMediaRule;
        const cssRule2  = {
            cssText: 'test',
            parentRule: null,
            parentStyleSheet: null,
            type: CSSRule.MEDIA_RULE,
            cssRules: {} as CSSRuleList,
            media: mediaList,
            conditionText: expectedRule2,
        } as CSSMediaRule;
        const filteredRules = [cssRule, cssRule2];

        const returned = getProcessMediaRules(filteredRules);
        expect(returned[0].conditionText).toStrictEqual(expectedRule1);
        expect(returned[1].conditionText).toStrictEqual(expectedRule2);
    });
});
