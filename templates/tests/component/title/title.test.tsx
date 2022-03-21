import {render} from '@testing-library/react';
import {Title} from 'src/components';

describe('testing Title component', () => {
    window.shopAlias = 'test-shop.alias.com';

    test('Rendering Title component ', () => {
        const {container} = render(<Title />);

        expect(container.getElementsByClassName('website-title').length).toBe(1);
        expect(container.getElementsByClassName('website-title-clickable').length).toBe(1);
        expect(container.getElementsByClassName('website-title-clickable__site-name').length).toBe(1);

    });
});
