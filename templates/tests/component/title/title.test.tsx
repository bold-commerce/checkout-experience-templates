import {render, screen} from '@testing-library/react';
import {Title} from 'src/components';

describe('testing Title component', () => {

    const testData = [
        {
            name: 'shopAlias and customDomain',
            shopAlias: 'test-shop.alias.com',
            customDomain: 'test-shop.custom.com',
            shopName: 'test-shop',
            expected: {domain: 'https://test-shop.custom.com/'}
        },
        {
            name: 'shopAlias and no customDomain',
            shopAlias: 'test-shop.alias.com',
            customDomain: '',
            shopName: 'test-shop',
            expected: {domain: 'https://test-shop.alias.com/'}
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test.each(testData)('Rendering Title component with $name', async (data) => {
        window.shopAlias = data.shopAlias;
        window.customDomain = data.customDomain;
        window.shopName = data.shopName;
        const {container} = render(<Title />);

        const element: HTMLAnchorElement = screen.getByText(data.shopName);

        expect(container.getElementsByClassName('website-title').length).toBe(1);
        expect(element.href).toBe(data.expected.domain);
    });
});
