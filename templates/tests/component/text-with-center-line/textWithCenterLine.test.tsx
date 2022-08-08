import {render} from '@testing-library/react';
import {TextWithCenterLine} from 'src/components';

describe('Testing TextWithCenterLine Component', () => {
    test('rendering the component', () => {
        const {container} = render(<TextWithCenterLine text={'test'} />);
        expect(container.getElementsByClassName('text-with-center-line').length).toBe(1);
        expect(container.getElementsByClassName('text-with-center-line__content').length).toBe(1);
        expect(container.getElementsByClassName('text-with-center-line__content')[0].textContent).toBe('test');
    });
});
