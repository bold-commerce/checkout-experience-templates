import { render, screen } from '@testing-library/react';
import { HeaderLogo } from 'src/components';

describe('Testing HeaderLogo Component', () => {

    const testData = [
        {
            name: 'Rendering the component with logo shopAlias and customDomain',
            headerLogoUrl: 'test-shop.custom.com',
            shopAlias: 'test-shop.alias.com',
            customDomain: 'test-shop.custom.com',
            expected: { domain: 'https://test-shop.custom.com/', elementsLength: 1 }
        },
        {
            name: 'Rendering the component with logo and shopAlias and no customDomain',
            headerLogoUrl: 'test-shop.custom.com',
            shopAlias: 'test-shop.alias.com',
            customDomain: '',
            expected: { domain: 'https://test-shop.alias.com/', elementsLength: 1 }
        },
    ]

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(testData)('$name', async (data) => {
        window.shopAlias = data.shopAlias;
        window.customDomain = data.customDomain;
        window.headerLogoUrl = data.headerLogoUrl;
        const { container } = render(<HeaderLogo />);

        const element: HTMLAnchorElement = screen.getByRole('link');
        expect(element.href).toBe(data.expected.domain);


        expect(container.getElementsByClassName('website-title-logo-clickable').length).toBe(data.expected.elementsLength);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(data.expected.elementsLength);
    });

    test('Rendering the component without logo and no shopAlias and no customDomain', () => {
        window.headerLogoUrl = '';
        const { container } = render(<HeaderLogo />);

        expect(container.getElementsByClassName('website-title-logo-clickable').length).toBe(0);
        expect(container.getElementsByClassName('website-title-logo').length).toBe(0);
    });

});
