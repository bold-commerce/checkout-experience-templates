import {BreadcrumbsStatus} from 'src/constants';

export function getBreadcrumbStatus(index: number, active: number): string {
    const statusValue = index - active;
    if (statusValue < 0) {
        return BreadcrumbsStatus.COMPLETED;
    }
    switch (statusValue) {
        case 0:
            return BreadcrumbsStatus.ACTIVE;
        case 1:
            return BreadcrumbsStatus.NEXT;
        default:
            return BreadcrumbsStatus.NEXT;
    }
}
