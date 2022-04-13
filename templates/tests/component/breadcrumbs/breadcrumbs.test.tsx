import {mocked} from 'jest-mock';
import {getBreadcrumbs} from 'src/utils';
import {IBreadcrumb} from 'src/types';
import {render} from '@testing-library/react';
import {Breadcrumbs} from 'src/components';


jest.mock('src/utils/getBreadcrumbs');
const getBreadcrumbsMock = mocked(getBreadcrumbs, true);

describe('Testing Breadcrumbs component', () => {

    const breadcrumbsArray: Array<IBreadcrumb> = [
        {
            name: 'option1',
            text: 'option1',
            status: 'completed',
            onClick: jest.fn()
        },
        {
            name: 'option2',
            text: 'option2',
            status: 'active',
            onClick: jest.fn()
        },
        {

            name: 'option3',
            text: 'option3',
            status: 'next',
            onClick: jest.fn()
        },
        {

            name: 'option4',
            text: 'option4',
            status: 'upcoming',
            onClick: jest.fn()
        }
    ];

    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('rendering the component successfully', () => {
        getBreadcrumbsMock.mockReturnValueOnce(breadcrumbsArray);
        const {container} = render(<Breadcrumbs active={1}/>);
        expect(container.getElementsByClassName('Breadcrumb').length).toBe(1);

        expect(container.getElementsByClassName('Breadcrumb__Item--active').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--next').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb__Item--upcoming').length).toBe(1);
        expect(container.getElementsByClassName('Breadcrumb_Item_Divider').length).toBe(breadcrumbsArray.length -1);

    });

});
