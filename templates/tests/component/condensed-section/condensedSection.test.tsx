import { render } from '@testing-library/react';
import { CondensedSection } from 'src/components';
import { ICondensedSectionProps } from 'src/types';

describe('Testing CondensedSection component', () => {
    const condensedSectionPropsValue: ICondensedSectionProps = {
        navigationHeadingProps: {
            text: 'Test Title'
        }
    }

    test('Rendering condensed section component', () => {
        const { container } = render(<CondensedSection {...condensedSectionPropsValue} />);

        expect(container.getElementsByClassName('condensed-section').length).toBe(1);
        expect(container.getElementsByClassName('nav-heading').length).toBe(1);
    });
});
