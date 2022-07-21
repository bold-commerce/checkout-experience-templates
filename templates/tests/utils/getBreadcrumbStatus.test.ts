import {getBreadcrumbStatus} from 'src/utils';
import {BreadcrumbsStatus} from 'src/constants';

describe('Test getBreadcrumbStatus function', () => {
    const active = 2;
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    test('Completed state', () => {
        const index = active - 1;
        const returned = getBreadcrumbStatus(index, active);
        expect(returned).toBe(BreadcrumbsStatus.COMPLETED);
    });
    test('Active state', () => {
        const index = active;
        const returned = getBreadcrumbStatus(index, active);
        expect(returned).toBe(BreadcrumbsStatus.ACTIVE);
    });
    test('Next state', () => {
        const index = active + 1;
        const returned = getBreadcrumbStatus(index, active);
        expect(returned).toBe(BreadcrumbsStatus.NEXT);
    });
    test('Upcoming state', () => {
        const index = active + 2;
        const returned = getBreadcrumbStatus(index, active);
        expect(returned).toBe(BreadcrumbsStatus.NEXT);
    });
});
