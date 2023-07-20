import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetNoteAttributes, useLifeFieldCheckbox} from 'src/hooks';
import {patchOrderMetaData} from 'src/library';
import {renderHook} from '@testing-library/react-hooks';
import {act} from '@testing-library/react';
import {ICartParameters, IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';


const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/library/patchOrderMetaData');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));

const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);

describe('Testing hook useLifeFieldCheckbox', () => {
    const mockPatchOrder = jest.fn();

    const lifeFields: Array<ILifeField> = [
        {
            input_default: 'default',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: true,
            input_type: 'checkbox',
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
            input_type: 'checkbox',
            location: 'customer_info',
            meta_data_field: 'test_meta_data_field',
            order_asc: 2,
            public_id: '2',
        }
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        useGetNoteAttributesMock.mockReturnValue({});
        patchOrderMetaDataMock.mockReturnValue(mockPatchOrder);
    });


    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[0]));
        const hookResult = result.current;
        expect(hookResult.checked).toBe(false);
        expect(hookResult.value).toBe('false');
        expect(hookResult.label).toBe('label');
        expect(hookResult.helpText).toBe('placeholder');
        expect(hookResult.id).toBe('1');
    });

    test('rendering the hook with optional values properly', () => {
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[1]));
        const hookResult = result.current;
        expect(hookResult.checked).toBe(false);
        expect(hookResult.value).toBe('false');
        expect(hookResult.label).toBe('');
        expect(hookResult.helpText).toBe('');
        expect(hookResult.id).toBe('2');
    });

    test('testing the change handler', () => {
        const event = {target: {checked: true}};
        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: {
                ['test_meta_data_field']: true,
            } as ICartParameters,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        const {result} = renderHook(() => useLifeFieldCheckbox(lifeFields[0]));
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(patchOrderMetaDataMock(payload));

    });

});

