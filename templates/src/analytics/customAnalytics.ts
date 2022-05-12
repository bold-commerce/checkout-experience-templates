

export function isCustomAnalyticsEnabled(): boolean {
    return window['custom_analytics_is_customized'] !== 'undefined' && (window['custom_analytics_is_customized'] === true || window['custom_analytics_is_customized'] === '1' );
}

export function orderCompleteForCustomAnalytics(): void {
    if(isCustomAnalyticsEnabled()){
        const customScript = document.createElement('script');
        customScript.setAttribute('id', 'customScript');
        customScript.type = 'text/javascript';
        customScript.innerHTML = window['custom_analytics_order_complete_script'];
        document.head.appendChild(customScript);
    }

}
