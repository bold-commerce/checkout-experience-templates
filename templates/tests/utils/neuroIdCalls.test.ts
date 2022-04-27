import {neuroIdInit, neuroIdSubmit, getNeuroIdPageName} from 'src/utils';
import SpyInstance = jest.SpyInstance;

describe('Testing functions related to Neuro ID', () => {
    let nidSpy: SpyInstance;
    const neuroIdPageNameValue = 'experience';
    const neuroIdPageNameResumeValue = 'resume';
    const neuroIdPageNameExpected = 'new_experience_experience';

    beforeEach(() => {
        jest.clearAllMocks();
        window = Object.create(window);
        window['nid'] = jest.fn();
        window['shopAlias'] = 'shop-alias';
        nidSpy = jest.spyOn((window as any), 'nid');
    });

    test('Function getNeuroIdPageName', () => {
        const result = getNeuroIdPageName(neuroIdPageNameValue);
        expect(result).toBe(neuroIdPageNameExpected);
    });

    test('Function getNeuroIdPageName - resume location', () => {
        const result = getNeuroIdPageName(neuroIdPageNameResumeValue);
        expect(result).toBe(neuroIdPageNameExpected);
    });

    test('Function neuroIdInit', () => {
        neuroIdInit(neuroIdPageNameExpected);
        expect(nidSpy).toHaveBeenCalledTimes(2);
        expect(nidSpy).toHaveBeenCalledWith('start', [neuroIdPageNameExpected]);
        expect(nidSpy).toHaveBeenCalledWith('setUserId', [window.shopAlias]);
    });

    test('Function neuroIdInit not existing', () => {
        window['nid'] = false;
        neuroIdInit(neuroIdPageNameExpected);
        expect(nidSpy).toHaveBeenCalledTimes(0);
    });

    test('Function neuroIdSubmit', () => {
        neuroIdSubmit(neuroIdPageNameExpected);
        expect(nidSpy).toHaveBeenCalledTimes(2);
        expect(nidSpy).toHaveBeenCalledWith('applicationSubmit', [neuroIdPageNameExpected]);
        expect(nidSpy).toHaveBeenCalledWith('sendData');
    });

    test('Function neuroIdSubmit not existing', () => {
        window['nid'] = false;
        neuroIdSubmit(neuroIdPageNameExpected);
        expect(nidSpy).toHaveBeenCalledTimes(0);
    });
});
