import {useAppSelector, useGetAppSettingData} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    appSetting: {
        test: 'test',
        test2: false
    }
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useGetAppSettingData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const data = [
        {name: 'test with string', input: 'test', output: 'test'},
        {name: 'test with boolean', input: 'test2', output: false}
    ];

    test.each(data)('$name', ({name, input, output}) => {
        const {result} = renderHook(() => useGetAppSettingData(input));
        expect(result.current).toStrictEqual(output);
        expect(useAppSelector).toHaveBeenCalledTimes(1);

    });

});
