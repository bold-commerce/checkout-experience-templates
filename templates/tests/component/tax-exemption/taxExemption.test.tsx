import {mocked} from 'jest-mock';
import {useGetIsLoadingExceptSections, useTaxExemption} from 'src/hooks';
import {ITaxExemption} from 'src/types';
import {render} from '@testing-library/react';
import {TaxExemption} from 'src/components';

jest.mock('src/hooks/useTaxExemption');
jest.mock('src/hooks/useGetIsLoadingExceptSections');

const useTaxExemptionMock = mocked(useTaxExemption, true);
const useGetIsLoadingExceptSectionsMock = mocked(useGetIsLoadingExceptSections, true);


describe('testing Tax Exemption component', () => {

    const handleChange = jest.fn();

    const hookReturn: ITaxExemption = {
        sectionEnabled:true,
        checked:true,
        value:'true',
        sectionTitle: 'title',
        label: 'label',
        helpText: 'helpText',
        messageText: 'messageText',
        handleChange: handleChange
    }

    beforeEach(() => {
        jest.clearAllMocks();
        useGetIsLoadingExceptSectionsMock.mockReturnValue(false);
    });


    test('Rendering component with section enabled and checkbox checked ', () => {

        useTaxExemptionMock.mockReturnValue(hookReturn);
        const {container} = render(<TaxExemption/>);

        expect(container.getElementsByClassName('tax-exempt').length).toBe(1);
        expect(container.getElementsByClassName('tax-exempt__message').length).toBe(1);

    });

    test('Rendering component with section enabled and checkbox unchecked ', () => {
        const localProps = {...hookReturn};
        localProps.checked = false;
        useTaxExemptionMock.mockReturnValue(localProps);
        const {container} = render(<TaxExemption/>);

        expect(container.getElementsByClassName('tax-exempt').length).toBe(1);
        expect(container.getElementsByClassName('tax-exempt__message').length).toBe(0);

    });

    test('Rendering component with section disable', () => {
        const localProps = {...hookReturn};
        localProps.sectionEnabled = false;
        useTaxExemptionMock.mockReturnValue(localProps);
        const {container} = render(<TaxExemption/>);

        expect(container.getElementsByClassName('tax-exempt').length).toBe(0);
        expect(container.getElementsByClassName('tax-exempt__message').length).toBe(0);

    });

});
