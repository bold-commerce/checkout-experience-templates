import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetErrorByField, useGetLifeFieldErrorMessage, useGetNoteAttributes, useLifeFieldCheckbox} from 'src/hooks';
import {patchOrderMetaData} from 'src/library';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';
import {actionAddError, actionRemoveErrorByField, actionUpdateNoteAttributeField} from 'src/action';
import {errorSeverities, errorSubTypes, errorTypes} from 'src/constants';

const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/library/patchOrderMetaData');
jest.mock('src/hooks/useGetLifeFieldErrorMessage');
jest.mock('src/hooks/useGetErrorByField');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);
const useGetLifeFieldErrorMessageMock = mocked(useGetLifeFieldErrorMessage, true);
const useGetErrorByFieldMock = mocked(useGetErrorByField, true);

describe('Testing hook useLifeFieldCheckbox', () => {
    const mockPatchOrder = jest.fn();

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'true',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'checkbox',
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
            input_required: false,
            input_type: 'checkbox',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        },
        {
            input_default: null,
            input_label: null,
            input_placeholder: null,
            input_required: true,
            input_type: 'checkbox',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_2',
            order_asc: 3,
            public_id: '3',
        }
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
        patchOrderMetaDataMock.mockReturnValue(mockPatchOrder);
        useGetLifeFieldErrorMessageMock.mockReturnValue(defaultMessage);
    });


    test('rendering the hook properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[0]));
        const hookResult = result.current;
        expect(hookResult.checked).toBe(true);
        expect(hookResult.value).toBe('true');
        expect(hookResult.label).toBe('label');
        expect(hookResult.helpText).toBe('placeholder');
        expect(hookResult.id).toBe('1');
    });

    test('rendering the hook with already existing note attributes properly', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        const noteAttributes: Record<string, string> = {
            test_meta_data_field_1: 'true',
        };
        useGetNoteAttributesMock.mockReturnValue(noteAttributes);
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[1]));
        const hookResult = result.current;
        expect(hookResult.checked).toBe(true);
        expect(hookResult.value).toBe('true');
        expect(hookResult.label).toBe('');
        expect(hookResult.helpText).toBe('');
        expect(hookResult.id).toBe('2');
    });

    test('rendering the hook with not existing note attributes properly', () => {
        useGetErrorByFieldMock.mockReturnValue('some error');
        useGetNoteAttributesMock.mockReturnValue({});
        const message = {...defaultMessage};
        message.message = lifeFields[2].input_label + defaultMessage.message;
        message.field = lifeFields[2].meta_data_field;
        const event = {target: {checked: false}};
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[2]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });
        expect(hookResult.checked).toBe(false);
        expect(hookResult.value).toBe('false');
        expect(hookResult.label).toBe('');
        expect(hookResult.helpText).toBe('');
        expect(hookResult.id).toBe('3');

        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionAddError(message));
        expect(mockDispatch).toHaveBeenCalledWith(actionRemoveErrorByField(lifeFields[2].meta_data_field, ''));

    });

    test('testing the change handler', () => {
        useGetErrorByFieldMock.mockReturnValue('');
        useGetNoteAttributesMock.mockReturnValue({});
        const event = {target: {checked: true}};
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(3);
        expect(mockDispatch).toHaveBeenCalledWith(actionUpdateNoteAttributeField('test_meta_data_field', true));
    });

});

