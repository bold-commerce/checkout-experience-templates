import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {useAppSelector, useGetErrorFallback} from 'src/hooks';
import {displayFatalErrorFromTranslation, getNeuroIdPageName, neuroIdSubmit} from 'src/utils';
import {stateMock} from 'src/mocks';

const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(stateMock)),
    useDispatch: jest.fn().mockImplementation(() => dispatchMock)
}));
jest.mock('src/hooks/rootHooks');
jest.mock('src/utils');
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);
const neuroIdSubmitMock = mocked(neuroIdSubmit, true);
const getNeuroIdPageNameMock = mocked(getNeuroIdPageName, true);

describe('Testing hook useGetErrorFallback', () => {
    const pageName = 'page_name';

    beforeEach(() => {
        jest.clearAllMocks();
        getNeuroIdPageNameMock.mockReturnValue(pageName);
    });

    test('rendering the hook properly', () => {

        const renderHookResult = renderHook(() => useGetErrorFallback());

        expect(useAppSelector).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledWith(stateMock, dispatchMock);
        expect(neuroIdSubmitMock).toHaveBeenCalledTimes(1);
        expect(neuroIdSubmitMock).toHaveBeenCalledWith(pageName);

        renderHookResult.rerender();

        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
    });
});
