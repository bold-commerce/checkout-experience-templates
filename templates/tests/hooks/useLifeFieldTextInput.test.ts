import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetNoteAttributes, useLifeFieldTextInput, useGetErrorByField} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);

describe('Testing hook useLifeFieldTextInput', () => {

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: null,
            input_label: null,
            input_placeholder: null,
            input_required: true,
            input_type: 'text',
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });


    test('rendering the hook properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldTextInput(lifeFields[0]));
        const hookResult = result.current;
        expect(hookResult.inputValue).toBe('default');
        expect(hookResult.label).toBe('label');
        expect(hookResult.placeHolder).toBe('placeholder');
        expect(hookResult.id).toBe('1');
    });

    test('rendering the hook with default value', () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field: 'some input',
        };
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue(noteAttributes);
        const {result} = renderHook(() => useLifeFieldTextInput(lifeFields[0]));
        const hookResult = result.current;

        expect(hookResult.inputValue).toBe('some input');
        expect(hookResult.label).toBe('label');
        expect(hookResult.placeHolder).toBe('placeholder');
        expect(hookResult.id).toBe('1');
    });

    test('rendering the hook with optional values properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldTextInput(lifeFields[1]));
        const hookResult = result.current;
        expect(hookResult.inputValue).toBe('');
        expect(hookResult.label).toBe('');
        expect(hookResult.placeHolder).toBe('');
        expect(hookResult.id).toBe('2');
    });

    test('testing the change handler', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const event = {target: {value: 'test'}};
        const {result} = renderHook(() => useLifeFieldTextInput(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

    test('rendering the hook with error message', () => {
        useGetErrorByFieldMock.mockReturnValue('error message');
        useGetNoteAttributesMock.mockReturnValue({});
        const event = {target: {value: 'test'}};
        const {result} = renderHook(() => useLifeFieldTextInput(lifeFields[1]));
        const hookResult = result.current;        act(() => {
            hookResult.handleChange(event);
        });

        expect(hookResult.inputValue).toBe('');
        expect(hookResult.errorMessage).toBe('error message');
        expect(hookResult.label).toBe('');
        expect(hookResult.placeHolder).toBe('');
        expect(hookResult.id).toBe('2');
        expect(mockDispatch).toHaveBeenCalledTimes(2);
    });

});
