import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';

import {useAppSelector, useGetErrorFallback} from 'src/hooks';
import {displayFatalErrorFromTranslation} from 'src/utils';
import {stateMock} from 'src/mocks';

const dispatchMock = jest.fn();
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(stateMock)),
    useDispatch: jest.fn().mockImplementation(() => dispatchMock)
}));
jest.mock('src/hooks/rootHooks');
jest.mock('src/utils');
const displayFatalErrorFromTranslationMock = mocked(displayFatalErrorFromTranslation, true);

describe('Testing hook useGetErrorFallback', () => {
    const pageName = 'page_name';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('rendering the hook properly', () => {

        const renderHookResult = renderHook(() => useGetErrorFallback());

        expect(useAppSelector).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledWith(stateMock, dispatchMock);

        renderHookResult.rerender();

        expect(displayFatalErrorFromTranslationMock).toHaveBeenCalledTimes(1);
    });
});
