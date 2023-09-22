import {mocked} from 'jest-mock';
import {patchOrderMetaData, validateLifeFields} from 'src/library';
import {stateMock} from 'src/mocks/stateMock';
import {actionAddError, actionUpdateNoteAttributeField} from 'src/action';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

jest.mock('src/action');
jest.mock('src/library/patchOrderMetaData');
const actionAddErrorMock = mocked(actionAddError, true);
const actionUpdateNoteAttributeFieldMock = mocked(actionUpdateNoteAttributeField, true);
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);

describe('testing validateLifeFields', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();
    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: null,
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'text',
            input_regex: null,
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        },
        {
            input_default: 'default',
            input_label: null,
            input_placeholder: 'placeholder',
            input_required: false,
            input_type: 'text',
            input_regex: 'ab*c',
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_1',
            order_asc: 2,
            public_id: '2',
        },
        {
            input_default: '<p>some text</p>',
            input_label: null,
            input_placeholder: null,
            input_required: false,
            input_type: 'html',
            input_regex: 'ab*c',
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field_2',
            order_asc: 3,
            public_id: '3',
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('calling validate required life fields with field not exists', async () => {
        getState.mockReturnValue(stateMock);
        const validate = validateLifeFields(lifeFields);
        await validate(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(2);
        expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate empty required life fields', async () => {
        getState.mockReturnValue(stateMock);
        const validate = validateLifeFields([]);
        await validate(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(0);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
        expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate required life fields with empty field', async () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field: ' ',
        };
        const newMock = {...stateMock};
        newMock.data.application_state.order_meta_data.note_attributes = noteAttributes;
        getState.mockReturnValueOnce(newMock);

        const validate = validateLifeFields(lifeFields);
        await validate(dispatch, getState);
        expect(dispatch).toHaveBeenCalledTimes(2);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(2);
        expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(0);
    });

    test('calling validate life fields with fields in thank you page', async () => {
        const thankYouPageLifeFields: Array<ILifeField> = [
            {
                input_default: 'default',
                input_label: null,
                input_placeholder: 'placeholder',
                input_required: true,
                input_type: 'text',
                input_regex: null,
                location: 'order_confirmation',
                meta_data_field: 'test_meta_data_field',
                order_asc: 1,
                public_id: '1',
            },
            {
                input_default: 'false',
                input_label: null,
                input_placeholder: 'placeholder',
                input_required: false,
                input_type: 'checkbox',
                input_regex: null,
                location: 'order_details',
                meta_data_field: 'test_meta_data_field_1',
                order_asc: 2,
                public_id: '2',
            },
            {
                input_default: '2024/01/01',
                input_label: null,
                input_placeholder: null,
                input_required: false,
                input_type: 'datepicker',
                input_regex: null,
                location: 'thank_you_message',
                meta_data_field: 'test_meta_data_field_2',
                order_asc: 3,
                public_id: '3',
            }
        ];
        getState.mockReturnValue(stateMock);
        const validate = validateLifeFields([], thankYouPageLifeFields);
        await validate(dispatch, getState);
        expect(actionUpdateNoteAttributeFieldMock).toHaveBeenCalledTimes(3);
        expect(actionAddErrorMock).toHaveBeenCalledTimes(0);
    });
});
