import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';

import {Footer} from 'src/components';
import {useGetFooter, useGetLifeFields} from 'src/hooks';
import {IUseFooter} from 'src/types';

jest.mock('src/hooks/useGetFooter');
jest.mock('src/hooks/useGetLifeFields');
const useGetFooterMock = mocked(useGetFooter, true);
const useGetLifeFieldsMock = mocked(useGetLifeFields, true);

describe('testing Footer component', () => {
    const hookReturn: IUseFooter = {
        shopAlias: 'shop.test',
        footerRights: 'All rights reserved',
    };

    beforeEach(() => {
        useGetFooterMock.mockReturnValue(hookReturn);
        useGetLifeFieldsMock.mockReturnValue([]);
    });

    test('Rendering Footer component', () => {
        const {container} = render(<Footer />);

        expect(container.getElementsByClassName('footer').length).toBe(1);
        expect(container.getElementsByClassName('footer--border-bottom').length).toBe(1);
        expect(container.getElementsByClassName('footer--disclaimer').length).toBe(1);
        expect(screen.getAllByText('All rights reserved shop.test').length).toBe(1);
    });
});
