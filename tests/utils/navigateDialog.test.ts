import {navigateDialog} from 'src/utils';


describe('testing navigateDialog function', () => {
    const preventDefaultMock = jest.fn();
    const blockedEventMock = {
        target: {
            activeElement: {
                hash: '#test',
            },
        },
        preventDefault: preventDefaultMock,
    } as unknown as BeforeUnloadEvent & {target: {activeElement: Location}};
    const unBlockedEventMock = {
        target: {
            activeElement: {
                hash: '#login',
            },
        },
        preventDefault: preventDefaultMock,
    } as unknown as BeforeUnloadEvent & {target: {activeElement: Location}};
    const NoActiveElementEventMock = {
        target: {},
        preventDefault: preventDefaultMock,
    } as unknown as BeforeUnloadEvent & {target: {activeElement: Location}};

    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('navigateDialog called', () => {
        const unBlockedResult = navigateDialog(unBlockedEventMock);
        expect(preventDefaultMock).toHaveBeenCalledTimes(0);
        expect(unBlockedResult).toBeUndefined();

        const noActiveElementResult = navigateDialog(NoActiveElementEventMock);
        expect(preventDefaultMock).toHaveBeenCalledTimes(1);
        expect(noActiveElementResult).toStrictEqual('');

        const blockedResult = navigateDialog(blockedEventMock);
        expect(preventDefaultMock).toHaveBeenCalledTimes(2);
        expect(blockedResult).toStrictEqual('');

        const emptyResult = navigateDialog({preventDefault: preventDefaultMock} as unknown as BeforeUnloadEvent & {target: {activeElement: Location}});
        expect(preventDefaultMock).toHaveBeenCalledTimes(3);
        expect(emptyResult).toStrictEqual('');

        const nullResult = navigateDialog(null);
        expect(preventDefaultMock).toHaveBeenCalledTimes(3);
        expect(nullResult).toBeUndefined();
    });

});
