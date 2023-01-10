import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {Footer} from 'src/components';
import {useGetFooter} from 'src/hooks';
import {IUseFooter} from 'src/types';

jest.mock('src/hooks/useGetFooter');
const useGetFooterMock = mocked(useGetFooter, true);

describe('testing Footer component', () => {
    const hookReturn: IUseFooter = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };

    beforeEach(() => {
        useGetFooterMock.mockReturnValue(hookReturn);
    });

    test('Rendering Footer component', () => {
        const {container} = render(<Footer />);

        expect(container.getElementsByClassName('footer').length).toBe(1);
        expect(container.getElementsByClassName('footer--border-bottom').length).toBe(1);
        expect(container.getElementsByClassName('footer--disclaimer').length).toBe(1);
        expect(screen.getAllByText('All rights reserved shop.test').length).toBe(1);
    });
});
