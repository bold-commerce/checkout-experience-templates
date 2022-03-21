import {useAppSelector, useCallApiAtOnEvents} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';

const store = {
    appSetting: {callApiAtOnEvents: false}
};
const expected = store.appSetting.callApiAtOnEvents;

jest.mock('src/hooks/rootHooks');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));

describe('Testing hook useCallApiAtOnEvents', () => {
    test('test hook properly', () => {
        const {result} = renderHook(() => useCallApiAtOnEvents());
        expect(result.current).toStrictEqual(expected);
        expect(useAppSelector).toHaveBeenCalledTimes(1);
    });
});
