import {useAppSelector, useGetAppSettingData} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    appSetting: {test: 'test'}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetAppSettingData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('test hook properly', () => {
        const field = 'test';

        const {result} = renderHook(() => useGetAppSettingData(field));
        expect(result.current).toStrictEqual(field);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });

});
