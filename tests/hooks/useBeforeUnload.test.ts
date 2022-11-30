import {renderHook} from '@testing-library/react-hooks';
import {useBeforeUnload} from 'src/hooks';
import {mocked} from 'jest-mock';
import {navigateDialog} from 'src/utils';

jest.mock('src/utils/navigateDialog');
const navigateDialogMock = mocked(navigateDialog, true);

describe('Testing hook useBeforeUnload', () => {
    let addEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    });

    test('rendered and rerender hook', async () => {
        const renderHookResult = renderHook(() => useBeforeUnload());
        expect(addEventListenerSpy).toHaveBeenCalledTimes(5);
        renderHookResult.rerender();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(11);

        expect(navigateDialogMock).toHaveBeenCalledTimes(0);
        global.dispatchEvent(new Event('beforeunload'));
        expect(navigateDialogMock).toHaveBeenCalledTimes(1);
    });

});
