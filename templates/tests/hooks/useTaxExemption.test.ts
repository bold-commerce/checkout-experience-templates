import {initialDataMock} from 'src/mocks';
import {mocked} from 'jest-mock';
import {useGetNoteAttributes, useGetGeneralSettingCheckoutFields} from 'src/hooks';
import {} from 'src/hooks';
import {patchOrderMetaData} from 'src/library';
import {renderHook} from '@testing-library/react-hooks';
import {useTaxExemption} from 'src/hooks/useTaxExemption';
import {act} from '@testing-library/react';
import {ICartParameters, IPatchOrderMetaDataRequest} from '@boldcommerce/checkout-frontend-library';


const store = {
    data: initialDataMock,
    isValid: {},
};

const mockDispatch = jest.fn();
jest.mock('src/hooks/rootHooks');
jest.mock('src/hooks/useGetGeneralSettingCheckoutFields');
jest.mock('src/hooks/useGetNoteAttributes');
jest.mock('src/library/patchOrderMetaData');
jest.mock('react-redux', () => ({
    useSelector: jest.fn().mockImplementation(func => func(store)),
    useDispatch: () => mockDispatch
}));


const useGetGeneralSettingCheckoutFieldsMock = mocked(useGetGeneralSettingCheckoutFields, true);
const useGetNoteAttributesMock = mocked(useGetNoteAttributes, true);
const patchOrderMetaDataMock = mocked(patchOrderMetaData, true);


describe('Testing hook useGetShippingLinesData', () => {
    const mockPatchOrder = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        useGetGeneralSettingCheckoutFieldsMock.mockReturnValue( true);
        useGetNoteAttributesMock.mockReturnValue({});
        patchOrderMetaDataMock.mockReturnValue(mockPatchOrder);
    });


    test('rendering the hook properly', () => {
        const {result} = renderHook(() => useTaxExemption());
        const hookResult = result.current;
        expect(hookResult.sectionEnabled).toBe(true);
        expect(hookResult.checked).toBe(false);
        expect(hookResult.value).toBe('false');
        expect(hookResult.sectionTitle).toBe('Tax exemption');
        expect(hookResult.label).toBe('Tax exempt customer');
        expect(hookResult.helpText).toBe('Indicate if you are tax exempt in order for us to contact you for verification and reimbursement');
        expect(hookResult.messageText).toBe('You will be contacted to verify your tax exempt status.  Upon successful verification, the payment method used will be reimbursed.');

    });

    test('testing the change handler', () => {
        const event = {target: {checked: true}};
        const payload: IPatchOrderMetaDataRequest = {
            note_attributes: {
                ['_tax_exempt_checkbox_selected']: true,
            } as ICartParameters,
            cart_parameters: null,
            notes: null,
            tags: null,
        };
        const {result} = renderHook(() => useTaxExemption());
        const hookResult = result.current;
        act(() => {
            hookResult.handleChange(event);
        });

        expect(mockDispatch).toHaveBeenCalledTimes(1);
        expect(mockDispatch).toHaveBeenCalledWith(patchOrderMetaDataMock(payload));

    });

});
