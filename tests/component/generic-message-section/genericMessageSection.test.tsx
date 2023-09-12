import {render, screen} from '@testing-library/react';

import {GenericMessageSection} from 'src/components';
import {IGenericMessageSectionProps} from 'src/types';
import {mocked} from 'jest-mock';
import {useGetLifeFields} from 'src/hooks';
import {ILifeField} from '@boldcommerce/checkout-frontend-library';

jest.mock('src/hooks/useGetLifeFields');
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);

describe('testing GenericMessageSection component', () => {
    const props: IGenericMessageSectionProps = {
        className: 'test-class',
        messageTitle: 'Title test',
        messageText: 'Message test',
    };

    const dataArray = [
        {
            name: 'Rendering GenericMessageSection component - No sectionTitle',
            props: {...props, sectionTitle: ''},
            counterSectionTitle: 0,
            lifeElementCount: 0,
        },
        {
            name: 'Rendering GenericMessageSection component - with sectionTitle',
            props: {...props, sectionTitle: 'Section Title Test'},
            counterSectionTitle: 1,
            getAllByText_section_title: 1,
            lifeElementCount: 0,
        },
        {
            name: 'Rendering GenericMessageSection component - with sectionTitle',
            props: {...props, orderConfirmation: true},
            counterSectionTitle: 0,
            lifeElementCount: 1,
        },
    ];

    const lifeFields: Array<ILifeField> = [
        {
            input_default: '<p>Some text<p>',
            input_label: 'label',
            input_placeholder: 'placeholder',
            input_required: false,
            input_type: 'html',
            input_regex: null,
            location: 'thank_you_message',
            meta_data_field: 'test_meta_data_field',
            order_asc: 1,
            public_id: '1',
        }
    ];

    beforeEach(() => {
        jest.resetAllMocks();
        useGetLifeFieldsMock.mockReturnValue(lifeFields);
    });

    test.each(dataArray)('$name', (data) => {
        const {container} = render(<GenericMessageSection {...data.props} />);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section__message-container').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section__message-title').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section__message-text').length).toBe(1);
        expect(screen.getAllByText('Title test').length).toBe(1);
        expect(screen.getAllByText('Message test').length).toBe(1);
        expect(container.getElementsByClassName('generic-message-section__section-title').length).toBe(data.counterSectionTitle);
        props.orderConfirmation && expect(screen.getAllByText('Some text').length).toBe(data.lifeElementCount);
        data.getAllByText_section_title && expect(screen.getAllByText('Section Title Test').length).toBe(data.getAllByText_section_title);
    });
});
