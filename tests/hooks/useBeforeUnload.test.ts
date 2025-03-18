import {renderHook} from '@testing-library/react-hooks';
import {useBeforeUnload} from 'src/hooks';
import {mocked} from 'jest-mock';
import {navigateDialog} from 'src/utils';
import {useGetAppSettingData} from 'src/hooks';

jest.mock('src/utils/navigateDialog');
jest.mock('src/hooks/useGetAppSettingData');

const navigateDialogMock = mocked(navigateDialog, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing hook useBeforeUnload', () => {
    let addEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    });

    test('rendered and rerender hook', async () => {
        useGetAppSettingDataMock.mockReturnValue(false);

        const renderHookResult = renderHook(() => useBeforeUnload());
        expect(addEventListenerSpy).toHaveBeenCalledTimes(5);
        renderHookResult.rerender();
        expect(addEventListenerSpy).toHaveBeenCalledTimes(8);

        expect(navigateDialogMock).toHaveBeenCalledTimes(0);
        global.dispatchEvent(new Event('beforeunload'));
        expect(navigateDialogMock).toHaveBeenCalledTimes(1);
    });

});
