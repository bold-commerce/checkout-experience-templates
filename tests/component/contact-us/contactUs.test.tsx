import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {ContactUs} from 'src/components';
import {useGetContactUs} from 'src/hooks';
import {IUseContactUs} from 'src/types';

jest.mock('src/hooks/useGetContactUs');
const useGetContactUsMock = mocked(useGetContactUs, true);

describe('testing ContactUs component', () => {
    window = Object.create(window);
    const hookReturn: IUseContactUs = {
        needHelp: 'Need help?',
        contactUs: 'Contact us',
    };
    const email = 'info@boldcommer.com';

    beforeEach(() => {
        useGetContactUsMock.mockReturnValue(hookReturn);
    });

    test('Rendering ContactUs component', () => {
        window.supportEmail = email;
        const {container} = render(<ContactUs className={'test-class'}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('contact-us').length).toBe(1);
        expect(container.getElementsByClassName('contact-us__need-help').length).toBe(1);
        expect(container.getElementsByClassName('contact-us__contact-link').length).toBe(1);
        expect(container.getElementsByClassName('contact-us__need-help')[0].textContent).toBe('Need help? Contact us');
        const element: HTMLAnchorElement = screen.getByText(hookReturn.contactUs);
        expect(element.href).toBe(`mailto:${email}`);

    });
});
