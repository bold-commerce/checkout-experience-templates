import {useAppSelector, useGetIsOrderProcessing} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import { getLanguageBlob } from 'src/utils';
import { mocked } from 'jest-mock';

jest.mock('src/utils/getLanguageBlob');
jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(data))
}));
const getLanguageBlobMock = mocked(getLanguageBlob, true);

const defaultHeader = 'Processing order... ';
const blobHeader = 'blob mock Header';
const blobMock: any= {
    confirmation_page: { loading_header: blobHeader}
}
const data = {
    overlay: {
        shown: false,
        header: ''
    },
    data: {initial_data: {}},
    appSetting: { languageIso: 'mock'}
}

describe('Testing useGetIsOrderProcessing', () => {
    getLanguageBlobMock.mockReturnValue(blobMock);
    afterEach(() => {
        jest.clearAllMocks();
        data.overlay.shown = false;
        data.overlay.header = '';
    });

    test('Testing useGetIsOrderProcessing properly with header constant', () => {
        data.overlay.shown = true;
        data.overlay.header = blobHeader;

        const {result} = renderHook(() => useGetIsOrderProcessing());
        expect(result.current).toStrictEqual(true);
        expect(useAppSelector).toHaveBeenCalledTimes(3);
    });

    test('Testing useGetIsOrderProcessing properly with default header', () => {
        getLanguageBlobMock.mockReturnValueOnce(null);
        data.overlay.shown = true;
        data.overlay.header = defaultHeader;

        const {result} = renderHook(() => useGetIsOrderProcessing());
        expect(result.current).toStrictEqual(true);
        expect(useAppSelector).toHaveBeenCalledTimes(3);
    });

    test('Testing useGetIsOrderProcessing with empty header', () => {
        data.overlay.shown = true;

        const {result} = renderHook(() => useGetIsOrderProcessing());
        expect(result.current).toStrictEqual(false);
        expect(useAppSelector).toHaveBeenCalledTimes(3);
    });

    test('Testing useGetIsOrderProcessing with overlay not shown', () => {
        const {result} = renderHook(() => useGetIsOrderProcessing());
        expect(result.current).toStrictEqual(false);
        expect(useAppSelector).toHaveBeenCalledTimes(3);
    });
});
