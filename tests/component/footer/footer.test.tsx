import {render} from '@testing-library/react';
import {mocked} from 'ts-jest/utils';

import {Footer} from 'src/components';
import {useGetContactUs, useGetFooterRights} from 'src/hooks';
import {IFooterProps, IUseContactUs, IUseFooterRights} from 'src/types';

jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooterRights');
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterRightsMock = mocked(useGetFooterRights, true);

describe('Testing Footer component', () => {
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooterRights = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const props: IFooterProps = {
        className: 'test-class',
        backLinkOnClick: jest.fn(),
        backLinkText: 'back-link',
        nextButtonText: 'next-button',
        nextButtonOnClick: jest.fn(),
        nextButtonLoading: false,
        nextButtonDisable: false,
        contactUs: false
    };

    beforeEach(() => {
        jest.resetAllMocks();
        useGetContactUsMock.mockReturnValue(contactUsHookReturn);
        useGetFooterRightsMock.mockReturnValue(footerRightsHookReturn);
    });

    test('Rendering the component with backLink and contactUs false', () => {
        const {container} = render(<Footer {...props}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('footer').length).toBe(1);
        expect(container.getElementsByClassName('footer__button-container').length).toBe(1);
        expect(container.getElementsByClassName('footer__button').length).toBe(1);
        expect(container.getElementsByClassName('footer__continue-button').length).toBe(1);
        expect(container.getElementsByClassName('btn-checkout').length).toBe(1);
        expect(container.getElementsByClassName('footer__rights').length).toBe(1);

        expect(container.getElementsByClassName('footer__back-link').length).toBe(1);
        expect(container.getElementsByClassName('contact-us').length).toBe(0);
    });

    test('Rendering the component without backLink and contactUs true', () => {
        const newProps = {...props, backLinkText: '', backLinkOnClick: undefined, contactUs: true};
        const {container} = render(<Footer {...newProps}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('footer').length).toBe(1);
        expect(container.getElementsByClassName('footer__button-container').length).toBe(1);
        expect(container.getElementsByClassName('footer__button').length).toBe(1);
        expect(container.getElementsByClassName('footer__continue-button').length).toBe(1);
        expect(container.getElementsByClassName('btn-checkout').length).toBe(1);
        expect(container.getElementsByClassName('footer__rights').length).toBe(1);

        expect(container.getElementsByClassName('footer__back-link').length).toBe(0);
        expect(container.getElementsByClassName('contact-us').length).toBe(1);
    });

});
