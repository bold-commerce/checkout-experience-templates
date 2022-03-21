import {render, screen} from '@testing-library/react';

import {GenericMessageSection} from 'src/components';
import {IGenericMessageSectionProps} from 'src/types';

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
        },
        {
            name: 'Rendering GenericMessageSection component - with sectionTitle',
            props: {...props, sectionTitle: 'Section Title Test'},
            counterSectionTitle: 1,
            getAllByText_section_title: 1
        }
    ];

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
        data.getAllByText_section_title && expect(screen.getAllByText('Section Title Test').length).toBe(data.getAllByText_section_title);
    });
});
