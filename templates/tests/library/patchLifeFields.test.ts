import {mocked} from 'jest-mock';
import {patchLifeFields, patchOrderMetaData} from 'src/library';
import {stateMock} from 'src/mocks/stateMock';
import {getOrderMetaData, ICartParameters, IOrderMetaData} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/library/patchOrderMetaData');
jest.mock('@boldcommerce/checkout-frontend-library/lib/state');
const getOrderDataMock = mocked(getOrderMetaData, true);
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);

describe('testing patchLifeFields', () => {
    const dispatch = jest.fn();
    const getState = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('not calling patch order api when note attributes are empty', async () => {
        getState.mockReturnValue(stateMock);
        const fakeEmptyNoteAttributes: IOrderMetaData = {
            cart_parameters: {},
            note_attributes: {},
            notes: '',
            tags: [],
        };
        getOrderDataMock.mockReturnValueOnce(fakeEmptyNoteAttributes);
        await patchLifeFields(dispatch, getState).then(() => {
            expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(0);
        });
    });

    test('not calling patch order api when there is no change', async () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field: '123456',
        };
        const newMock = {...stateMock};
        newMock.data.application_state.order_meta_data.note_attributes = noteAttributes;
        getState.mockReturnValue(newMock);

        const fakeNoChangeNoteAttributes: IOrderMetaData = {
            cart_parameters: {},
            note_attributes: {
                ['test_meta_data_field']: '123456',
            } as ICartParameters,
            notes: '',
            tags: [],
        };
        getOrderDataMock.mockReturnValueOnce(fakeNoChangeNoteAttributes);

        await patchLifeFields(dispatch, getState).then(() => {
            expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(0);
        });
    });

    test('calling patch order api when there is a change', async () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field: '1234567',
        };
        const newMock = {...stateMock};
        newMock.data.application_state.order_meta_data.note_attributes = noteAttributes;
        getState.mockReturnValue(newMock);

        const fakeChangedNoteAttributes: IOrderMetaData = {
            cart_parameters: {},
            note_attributes: {
                ['test_meta_data_field']: '123456',
            } as ICartParameters,
            notes: '',
            tags: [],
        };
        getOrderDataMock.mockReturnValueOnce(fakeChangedNoteAttributes);

        await patchLifeFields(dispatch, getState).then(() => {
            expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(1);
        });
    });

    test('calling patch order api when there is a new field', async () => {
        const noteAttributes: Record<string, string> = {
            test_meta_data_field: '1234567',
        };
        const newMock = {...stateMock};
        newMock.data.application_state.order_meta_data.note_attributes = noteAttributes;
        getState.mockReturnValue(newMock);

        const fakeEmptyNoteAttributes: IOrderMetaData = {
            cart_parameters: {},
            note_attributes: {},
            notes: '',
            tags: [],
        };
        getOrderDataMock.mockReturnValueOnce(fakeEmptyNoteAttributes);

        await patchLifeFields(dispatch, getState).then(() => {
            expect(patchOrderMetaDataMock).toHaveBeenCalledTimes(1);
        });
    });
});
