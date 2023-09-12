import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export function logger(message: string | Record<string, unknown>, type: 'info' | 'log' | 'error' | 'warn' = 'log', alwaysLog = false): void {
    const {flow_settings: {is_test_mode: isTest}} = checkoutFlow;
    if (isTest || alwaysLog) {
        // eslint-disable-next-line no-console
        console[type](message);
    }

    const debugLogger = document.getElementById('debug-logger');
    if (isTest && debugLogger) {
        const innerText = typeof message === 'string' ? message : JSON.stringify(message, undefined, 4);
        const preChild = document.createElement('pre');
        preChild.className = `debug-logger debug-logger--${type}`;
        preChild.textContent = innerText;
        debugLogger.appendChild(preChild);
    }
}
