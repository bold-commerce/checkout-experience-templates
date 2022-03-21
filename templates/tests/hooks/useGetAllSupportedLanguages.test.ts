import {renderHook} from '@testing-library/react-hooks';
import {useAppSelector, useGetAllSupportedLanguages} from 'src/hooks';
import {initialDataMock} from 'src/mocks';

const store = {
    data: initialDataMock
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetAllSupportedLanguages', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('test hook properly', () => {
        const {result} = renderHook(() => useGetAllSupportedLanguages());
        expect(result.current).toStrictEqual(initialDataMock.initial_data.supported_languages);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

});
