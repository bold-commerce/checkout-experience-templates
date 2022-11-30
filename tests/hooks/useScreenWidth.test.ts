import {useAppSelector, useScreenWidth} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    appSetting: {screenWidth: 100}
};

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useScreenWidth', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('render hook properly', () => {
        const {result} = renderHook(() => useScreenWidth());
        expect(result.current).toStrictEqual(store.appSetting.screenWidth);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });


});
