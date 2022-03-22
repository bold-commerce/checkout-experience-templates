import {render} from '@testing-library/react';
import {HeaderLogo} from 'src/components';

describe('Testing GuestCustomer component', () => {
    window = Object.create(window);
    window.shopAlias = 'test-shop.alias.com';

    test('Rendering the component without logo', () => {
        window.headerLogoUrl = '';
        const {container} = render(<HeaderLogo />);
        expect(container.getElementsByClassName('website-title-logo-clickable').length).toBe(1);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);

    });

    test('Rendering the component with logo', () => {
        window.headerLogoUrl = 'https://google.com';
        const {container} = render(<HeaderLogo />);
        expect(container.getElementsByClassName('website-title-logo-clickable').length).toBe(1);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(1);

    });

});
