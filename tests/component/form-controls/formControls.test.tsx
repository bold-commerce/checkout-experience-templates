import {render} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {FormControls} from 'src/components';
import {useGetContactUs, useGetFooter} from 'src/hooks';
import {IFormControlsProps, IUseContactUs, IUseFooter} from 'src/types';
import {getTerm} from 'src/utils';

jest.mock('src/hooks/useGetContactUs');
jest.mock('src/hooks/useGetFooter');
jest.mock('src/utils/getTerm');
const useGetContactUsMock = mocked(useGetContactUs, true);
const useGetFooterMock = mocked(useGetFooter, true);
const getTermMock = mocked(getTerm, true);

describe('Testing FormControls component', () => {
    const contactUsHookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const footerRightsHookReturn: IUseFooter = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };
    const props: IFormControlsProps = {
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
        useGetFooterMock.mockReturnValue(footerRightsHookReturn);
        getTermMock.mockImplementation(term => term);
    });

    test('Rendering the component with backLink and contactUs false', () => {
        const {container} = render(<FormControls {...props}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('form-controls').length).toBe(1);
        expect(container.getElementsByClassName('form-controls__button').length).toBe(1);
        expect(container.getElementsByClassName('form-controls__continue-button').length).toBe(1);
        expect(container.getElementsByClassName('btn-checkout').length).toBe(1);

        expect(container.getElementsByClassName('form-controls__back-link').length).toBe(1);
        expect(container.getElementsByClassName('contact-us').length).toBe(0);
    });

    test('Rendering the component without backLink and contactUs true', () => {
        const newProps = {...props, backLinkText: '', backLinkOnClick: undefined, contactUs: true , nextButtonTestDataId: 'test-id'};
        const {container} = render(<FormControls {...newProps}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('form-controls').length).toBe(1);
        expect(container.getElementsByClassName('form-controls__button').length).toBe(1);
        expect(container.getElementsByClassName('form-controls__continue-button').length).toBe(1);
        expect(container.getElementsByClassName('btn-checkout').length).toBe(1);

        expect(container.getElementsByClassName('form-controls__back-link').length).toBe(0);
        expect(container.getElementsByClassName('contact-us').length).toBe(1);
    });

});
