import {mocked} from 'jest-mock';
import {onUpdateVisuals} from 'src/eps';
import {actionShowHideOverlayContent} from 'src/action';

jest.mock('src/action/overlayAction');
const actionShowHideOverlayContentMock = mocked(actionShowHideOverlayContent, true);

describe('testing onUpdateVisuals', () => {

    const dispatchMock = jest.fn();
    beforeEach(() => {
        jest.resetAllMocks();
    });

    test('testing onUpdateVisuals with fullscreen', async () => {
        await onUpdateVisuals(dispatchMock, {fullscreen: true});
        expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(1);
    });

    test('testing onUpdateVisuals with not fullscreen', async () => {
        await onUpdateVisuals(dispatchMock, {fullscreen: false});
        expect(actionShowHideOverlayContentMock).toHaveBeenCalledTimes(0);
    });
});