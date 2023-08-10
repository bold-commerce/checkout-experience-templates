import {logger} from "src/themes/flow-sdk/logger";
import {checkoutFlow} from "src/themes/flow-sdk/flowState";

const consoleLogSpy = jest.spyOn(console, 'log');

describe('logger', () => {
    const stringMessage = 'test';
    const objectMessage = {test: 'test'};
    const stringifyObjectMessage = JSON.stringify(objectMessage, undefined, 4);

    beforeEach(() => {
        jest.clearAllMocks();
        consoleLogSpy.mockImplementation(() => {/*Silence expected console*/});
        document.body.innerHTML = `<div id="debug-logger"></div>`;
        checkoutFlow.flow_settings.is_test_mode = true;
    });

    it('should console.log string message in test mode', () => {
        logger(stringMessage);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(stringMessage);
        expect(document.getElementsByClassName('debug-logger--log').length).toEqual(1);
        expect(document.getElementsByClassName('debug-logger--log')[0].textContent).toEqual(stringMessage);
    });

    it('should console.log object message in test mode', () => {
        logger(objectMessage);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(objectMessage);
        expect(document.getElementsByClassName('debug-logger--log').length).toEqual(1);
        expect(document.getElementsByClassName('debug-logger--log')[0].textContent).toEqual(stringifyObjectMessage);
    });

    it('should console.log message off test mode with alwaysLog enabled', () => {
        checkoutFlow.flow_settings.is_test_mode = false;

        logger(objectMessage, 'log', true);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(objectMessage);
        expect(document.getElementsByClassName('debug-logger--log').length).toEqual(0);
    });

    it('should not console.log message off test mode', () => {
        checkoutFlow.flow_settings.is_test_mode = false;

        logger(stringMessage);

        expect(consoleLogSpy).toHaveBeenCalledTimes(0);
        expect(document.getElementsByClassName('debug-logger--log').length).toEqual(0);
    });

    it('should console.log and no debug-logger html element', () => {
        document.body.innerHTML = `<div id="another-element"></div>`;

        logger(objectMessage);

        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy).toHaveBeenCalledWith(objectMessage);
        expect(document.getElementsByClassName('debug-logger--log').length).toEqual(0);
    });
})