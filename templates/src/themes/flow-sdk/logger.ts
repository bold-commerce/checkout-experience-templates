import {checkoutFlow} from 'src/themes/flow-sdk/flowState';

export function logger(message: string, type: 'info' | 'log' | 'error' | 'warn' = 'log', alwaysLog = false): void {
    const {flow_settings: {is_test_mode: isTest}} = checkoutFlow;
    if (isTest || alwaysLog) {
        // eslint-disable-next-line no-console
        console[type](message);
    }

    const debugLogger = document.getElementById('debug-logger');
    if (isTest && debugLogger) {
        const preChild = document.createElement('pre');
        preChild.className = `debug-logger debug-logger--${type}`;
        preChild.innerText = message;
        debugLogger.appendChild(preChild);
    }
}
