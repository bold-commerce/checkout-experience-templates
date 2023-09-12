import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetNoteAttributes,
    useGetErrorByField,
    useGetLifeFieldErrorMessage,
    useLifeFieldSelect,
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {actionAddError, actionUpdateNoteAttributeField} from 'src/action';

const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetLifeFieldErrorMessage');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetLifeFieldErrorMessageMock = mocked(useGetLifeFieldErrorMessage, true);

describe('Testing hook useLifeFieldSelect', () => {

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'test1,test2,test3',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'dropdown',
            input_regex: null,
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
            input_type: 'dropdown',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        },
    ];

    const defaultMessage = {
        message: 'some message',
        type: errorTypes.life_elements,
        field: '',
        severity: errorSeverities.validation,
        sub_type: errorSubTypes.empty,
        address_type: '',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetLifeFieldErrorMessageMock.mockReturnValue(defaultMessage);
    });


    test('rendering the hook properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldSelect(lifeFields[0]));
        const hookResult = result.current;
        expect(hookResult.inputValue).toBe('');
        expect(hookResult.label).toBe('label');
        expect(hookResult.placeholder).toBe('placeholder');
        expect(hookResult.options).toStrictEqual([{name: 'test1', value: 'test1'}, {name: 'test2', value: 'test2'}, {name: 'test3', value: 'test3'}]);
        expect(hookResult.id).toBe('1');
    });

    test('rendering the hook with optional values properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({'test_meta_data_field_1': 'test1'});
        const {result} = renderHook(() => useLifeFieldSelect(lifeFields[1]));
        const hookResult = result.current;
        expect(hookResult.inputValue).toBe('test1');
        expect(hookResult.label).toBe('');
        expect(hookResult.placeholder).toBe('');
        expect(hookResult.options).toStrictEqual([{name: '', value: ''}]);
        expect(hookResult.id).toBe('2');
    });

    test('testing the change handler and non-empty value', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const event = {target: {value: 'test2'}};
        const {result} = renderHook(() => useLifeFieldSelect(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateNoteAttributeField('test_meta_data_field', 'test2'));
    });

    test('testing the change handler empty value', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const message = {...defaultMessage};
        message.message = lifeFields[0].input_label + defaultMessage.message;
        message.field = lifeFields[0].meta_data_field;
        const event = {target: {value: ''}};
        const {result} = renderHook(() => useLifeFieldSelect(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateNoteAttributeField('test_meta_data_field', ''));
        expect(mockDispatch).toHaveBeenCalledWith(actionAddError(message));
    });

    test('rendering the hook with error message', () => {
        useGetErrorByFieldMock.mockReturnValue('error message');
        useGetNoteAttributesMock.mockReturnValue({});
        const event = {target: {value: 'test1'}};
        const {result} = renderHook(() => useLifeFieldSelect(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(hookResult.inputValue).toBe('');
        expect(hookResult.errorMessage).toBe('error message');
        expect(hookResult.label).toBe('label');
        expect(hookResult.placeholder).toBe('placeholder');
        expect(hookResult.id).toBe('1');
        expect(mockDispatch).toHaveBeenCalledTimes(3);
    });

});
