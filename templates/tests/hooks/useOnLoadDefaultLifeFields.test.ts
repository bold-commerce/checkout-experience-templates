import {renderHook} from '@testing-library/react-hooks';
import {useOnLoadDefaultLifeFields} from 'src/hooks';
import {ILifeField} from '@boldcommerce/checkout-frontend-library/lib/types/apiInterfaces';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch
}));

describe('Testing hook useOnLoadDefaultLifeFields', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('render hook with text element', async () => {
        const lifeFields: Array<ILifeField> = [
            {
                input_default: 'some text',
                input_label: 'label',
                input_placeholder: 'placeholder',
                input_required: true,
                input_type: 'text',
                input_regex: null,
                location: 'customer_info',
                meta_data_field: 'test_meta_data_field',
                order_asc: 1,
                public_id: '1',
            },
        ];
        renderHook(() => useOnLoadDefaultLifeFields(lifeFields));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('render hook with checkbox element', async () => {
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
        ];
        renderHook(() => useOnLoadDefaultLifeFields(lifeFields));
        expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    test('render hook with dropdown element', async () => {
        const lifeFields: Array<ILifeField> = [
            {
                input_default: '<p>some text</p>',
                input_label: 'label',
                input_placeholder: 'placeholder',
                input_required: true,
                input_type: 'html',
                input_regex: null,
                location: 'customer_info',
                meta_data_field: 'test_meta_data_field',
                order_asc: 1,
                public_id: '1',
            },
        ];
        renderHook(() => useOnLoadDefaultLifeFields(lifeFields));
        expect(mockDispatch).toHaveBeenCalledTimes(0);
    });
});
