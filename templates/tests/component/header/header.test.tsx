import {render} from '@testing-library/react';
import {Header} from 'src/components';
import {mocked} from 'ts-jest/utils';
import {useGetShopUrlFromShopAlias, useSupportedLanguages} from 'src/hooks';

jest.mock('src/hooks/useSupportedLanguages');
jest.mock('src/hooks/useGetShopUrlFromShopAlias');
const useSupportedLanguagesMock = mocked(useSupportedLanguages, true);
const useGetShopUrlFromShopAliasMock = mocked(useGetShopUrlFromShopAlias, true);


describe('Testing GuestCustomer component', () => {

    beforeEach(() => {
        useSupportedLanguagesMock.mockReturnValue({languagesOptions: [], value: '', handleChange: jest.fn()});
        useGetShopUrlFromShopAliasMock.mockReturnValue('https://google.com');
    });

    test('Rendering the component with isMobile = false', () => {
        const {container} = render(<Header isMobile={false}/>);
        expect(container.getElementsByClassName('header-mobile').length).toBe(0);
        expect(container.getElementsByClassName('header').length).toBe(1);

    });

    test('Rendering the component with isMobile = true', () => {
        const {container} = render(<Header isMobile={true}/>);
        expect(container.getElementsByClassName('header-mobile').length).toBe(1);
        expect(container.getElementsByClassName('header').length).toBe(0);

    });
});