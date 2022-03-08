import {IFieldSectionProps} from 'src/types';
import React from 'react';
import {render} from '@testing-library/react';
import {FieldSection} from 'src/components';

describe('Testing FieldSection component', () => {

    const props: React.PropsWithChildren<IFieldSectionProps>= {
        title: 'test-title',
        showTitle: false,
        className: 'test-class',
        children: <div>children</div>
    };

    const one = 1;
    const zero = 0;

    test('Render the FieldSection properly', () => {
        const {container} = render(<FieldSection {...props}/>);
        expect(container.getElementsByClassName('field-section').length).toBe(one);
        expect(container.getElementsByClassName('field-section__header').length).toBe(one);
        expect(container.getElementsByClassName('field-section__heading').length).toBe(one);
        expect(container.getElementsByClassName('field-section__content').length).toBe(one);
        expect(container.getElementsByClassName('field-section__content').length).toBe(one);
    });

    test('Render the FieldSection without accessory', () => {
        const {container} = render(<FieldSection {...props}/>);
        expect(container.getElementsByClassName('field-section__accessory').length).toBe(zero);
    });

    test('Render the FieldSection with accessory', () => {
        const localProps = {...props};
        localProps.accessory = <div></div>;
        const {container} = render(<FieldSection {...localProps}/>);
        expect(container.getElementsByClassName('field-section__accessory').length).toBe(one);
    });

    test('Render the FieldSection with showTitle as false', () => {
        const {container} = render(<FieldSection {...props}/>);
        expect(container.getElementsByClassName('field--Hidden').length).toBe(one);
    });

    test('Render the FieldSection with showTitle as true', () => {
        const localProps = {...props};
        localProps.showTitle = true;
        const {container} = render(<FieldSection {...localProps}/>);
        expect(container.getElementsByClassName('field--Hidden').length).toBe(zero);
    });

});
