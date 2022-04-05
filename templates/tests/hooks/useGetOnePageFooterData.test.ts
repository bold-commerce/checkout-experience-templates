import {useGetIsLoading, useGetOnePageFooterData} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';

jest.mock('src/utils/getTerm');
jest.mock('src/hooks/useGetIsLoading');
const getTermMock = mocked(getTerm, true);
const useGetIsLoadingMock = mocked(useGetIsLoading, true);

describe('Testing hook useGetAddressFieldInputData', () => {
    const getTermValue = 'test-value';
    const eventMock = {preventDefault: jest.fn()};

    beforeEach(() => {
        jest.resetAllMocks();
        window = Object.create(window);
        Object.defineProperty(window, 'location', {
            value: {
                href: 'http://dummy.com'
            }
        });
        window.returnUrl = 'http://test.com';
        getTermMock.mockReturnValue(getTermValue);
        useGetIsLoadingMock.mockReturnValue(false);
    });

    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useGetOnePageFooterData());
        expect(result.current.backLinkText).toStrictEqual('< '+getTermValue);
        expect(result.current.nextButtonText).toStrictEqual(getTermValue);
        expect(result.current.nextButtonLoading).toStrictEqual(false);

        result.current.nextButtonOnClick();
        result.current.backLinkOnClick && result.current.backLinkOnClick(eventMock);
        expect(window.location.href).toEqual(window.returnUrl);
    });

});
