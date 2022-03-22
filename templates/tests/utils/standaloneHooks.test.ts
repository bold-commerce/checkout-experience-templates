import {executeHooks, getHook, setHook} from 'src/utils';

describe('Test function standaloneHook', () => {

    test('testing functions', () => {
        const result = jest.fn();
        setHook('test1', jest.fn());
        executeHooks();
        expect(getHook('test1')).toStrictEqual(result());
    });

});
