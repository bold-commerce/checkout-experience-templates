import {renderHook} from '@testing-library/react-hooks';
import {useGetDatePickerLanguage} from 'src/hooks';
import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {getTerm} from 'src/utils';
const store = {
    data: initialDataMock
};

jest.mock('src/utils');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store))
}));
const getTermMock = mocked(getTerm, true);

describe('Testing useGetDatePickerLanguage', () => {

    test('Rendering the hook properly', () => {
        getTermMock.mockReturnValue('');
        const {result} = renderHook(() => useGetDatePickerLanguage());
        expect(result.current.days.length).toEqual(7);
        expect(result.current.months.length).toEqual(12);
    });
});
