import {isCustomAnalyticsEnabled, orderCompleteForCustomAnalytics} from 'src/analytics';

describe('testing custom Analytics implementation', () => {

    const dataSet = [
        {name: 'testing with undefined',param: undefined, expectedValue: false},
        {name: 'testing with empty',param: '', expectedValue: false},
        {name: 'testing with true',param: true, expectedValue: true},
        {name: 'testing with 1',param: '1', expectedValue: true},
        {name: 'testing with 0',param: '0', expectedValue: false},
        {name: 'testing with true as string',param:  'true', expectedValue: false},
        {name: 'testing with false as string',param:  'false', expectedValue: false},
        {name: 'testing with anything',param:  '123', expectedValue: false},
    ];

    test.each(dataSet)('$name', ({name, param, expectedValue}) => {
        window['custom_analytics_is_customized'] = param;
        const result = isCustomAnalyticsEnabled();
        expect(result).toBe(expectedValue);

    });

    test('testing orderCompleteForCustomAnalytics function', () => {

        window['custom_analytics_is_customized'] = false;
        window['custom_analytics_order_complete_script'] = '';
        orderCompleteForCustomAnalytics();
        const script = document.getElementById('customScript');
        expect(script).toBe(null);

        const customScript = 'var id = 1;';
        window['custom_analytics_is_customized'] = '1';
        window['custom_analytics_order_complete_script'] = customScript;
        orderCompleteForCustomAnalytics();
        const script2: HTMLScriptElement = document.getElementsByTagName('script')[0];
        expect(script2.text).toBe(customScript);

    });

});

