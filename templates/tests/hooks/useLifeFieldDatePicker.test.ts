import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {
    useGetNoteAttributes,
    useGetErrorByField,
    useGetLifeFieldErrorMessage,
    useLifeFieldDatePicker,
    useGetAppSettingData,
} from 'src/hooks';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {errorSeverities, errorSubTypes, errorTypes} from 'src/constants';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';

const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('src/hooks/useGetAppSettingData');
jest.mock('src/hooks/useGetLifeFieldErrorMessage');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);
const useGetLifeFieldErrorMessageMock = mocked(useGetLifeFieldErrorMessage, true);
const useGetAppSettingDataMock = mocked(useGetAppSettingData, true);

describe('Testing hook useLifeFieldDatePicker', () => {

    const lifeFields: Array<ILifeField> = [
        {
            input_default: '2012/01/12',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'datepicker',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: '2012/01/12',
            input_label: 'label',
            input_placeholder: null,
            input_required: true,
            input_type: 'datepicker',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        }];

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
        useGetAppSettingDataMock.mockReturnValueOnce('en');
    });


    test('rendering the hook properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldDatePicker(lifeFields[0]));
        const hookResult = result.current;
        expect(hookResult.value).toBe('');
        expect(hookResult.date).toBe('2012/01/12');
        expect(hookResult.placeHolder).toBe('placeholder');
        expect(hookResult.id).toBe('1');
    });

    test('testing the change handler empty value', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const message = {...defaultMessage};
        message.message = lifeFields[0].input_label + defaultMessage.message;
        message.field = lifeFields[0].meta_data_field;
        const {result} = renderHook(() => useLifeFieldDatePicker(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(null);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(actionRemoveErrorByField('test_meta_data_field', ''));
        expect(mockDispatch).toHaveBeenCalledWith(actionAddError(message));
    });

    test('testing the change handler non empty value', () => {
        const date = new Date();
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldDatePicker(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(date);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionRemoveErrorByField('test_meta_data_field', ''));
        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateNoteAttributeField('test_meta_data_field', date.toLocaleDateString('en', {year: 'numeric', month: 'long', day: 'numeric'})));
    });

    test('testing the default value', () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field_1: 'September 15, 2023',
        };
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue(noteAttributes);
        const {result} = renderHook(() => useLifeFieldDatePicker(lifeFields[1]));
        const hookResult = result.current;
        expect(hookResult.value).toBe('September 15, 2023');
    });
});
