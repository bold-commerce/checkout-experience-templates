import {mocked} from 'jest-mock';
import {updatePigiHeight, getPigiIframe} from 'src/utils';

jest.mock('src/utils/getPigiIframe');
const getPigiIframeMock = mocked(getPigiIframe, true);

describe('Test helpers for PIGI iFrame', () => {
    const pigiHeightUpdate = '40px';
    let pigiIFrameElementMock: HTMLElement;

    beforeEach(() => {
        jest.resetAllMocks();
        pigiIFrameElementMock = document.createElement('iframe');
        getPigiIframeMock.mockReturnValue(pigiIFrameElementMock);
    });

    test('call updatePigiHeight when element missing', () => {
        getPigiIframeMock.mockReturnValueOnce(null);

        updatePigiHeight(pigiHeightUpdate);

        expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
        expect(pigiIFrameElementMock.style.height).not.toBe(pigiHeightUpdate);
    });

    test('call updatePigiHeight when element exists', () => {
        updatePigiHeight(pigiHeightUpdate);

        expect(getPigiIframeMock).toHaveBeenCalledTimes(1);
        expect(pigiIFrameElementMock.style.height).toBe(pigiHeightUpdate);
    });
});
