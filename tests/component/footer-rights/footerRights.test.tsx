import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {FooterRights} from 'src/components';
import {useGetFooterRights} from 'src/hooks';
import {IUseFooterRights} from 'src/types';

jest.mock('src/hooks/useGetFooterRights');
const useGetFooterRightsMock = mocked(useGetFooterRights, true);

describe('testing FooterRights component', () => {
    const hookReturn: IUseFooterRights = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };

    beforeEach(() => {
        useGetFooterRightsMock.mockReturnValue(hookReturn);
    });

    test('Rendering FooterRights component', () => {
        const {container} = render(<FooterRights />);

        expect(container.getElementsByClassName('footer__rights').length).toBe(1);
        expect(container.getElementsByClassName('footer__rights--border-bottom').length).toBe(1);
        expect(container.getElementsByClassName('footer__rights-container').length).toBe(1);
        expect(screen.getAllByText('All rights reserved shop.test').length).toBe(1);
    });
});
