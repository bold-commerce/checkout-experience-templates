import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {Overlay} from 'src/components';
import {useGetOverlay} from 'src/hooks';
import {IOverlay} from 'src/types';
import {getReturnToCartTermAndLink} from 'src/utils';

jest.mock('src/hooks');
jest.mock('src/utils');
const useGetOverlayMock = mocked(useGetOverlay, true);
const getReturnToCartTermAndLinkMock = mocked(getReturnToCartTermAndLink, true);
describe('Testing Overlay component', () => {

    const overlay: IOverlay ={
        shown: true,
        inverted: false,
        header: 'This is header issue',
        subHeader: 'This is sub-header issue',
        buttonText: 'back'
    };

    beforeEach(() => {
        jest.resetAllMocks();
        getReturnToCartTermAndLinkMock.mockReturnValue({term: 'return_to_cart', link: 'https://test.com'});
    });

    test('Render the Overlay properly', () => {
        useGetOverlayMock.mockReturnValueOnce(overlay);
        const {container} = render(<Overlay />);
        expect(container.getElementsByClassName('overlay__header').length).toBe(1);
        expect(container.getElementsByClassName('overlay__subheader').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content').length).toBe(1);
        expect(container.getElementsByClassName('overlay__button-container').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content-span').length).toBe(1);
    });

    test('check the overlay ID on basis of inverted = false', () => {
        const props = {...overlay};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.id).toBe('overlay');
    });

    test('check the overlay ID on basis of inverted = true', () => {
        const props = {...overlay, inverted: true};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.id).toBe('overlay-inverted');
    });

    test('Should not render if the shown parameter is false', () => {
        const props = {...overlay, shown: false};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.className.includes('overlay-hidden')).toBe(true);
    });

    test('Should not render the button if the inverted is true', () => {
        const props = {...overlay, inverted: true};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-button');
        expect(element.className.includes('overlay-hidden')).toBe(false);
    });

    test('check the icon when inverted = true', () => {
        const props = {...overlay, inverted: true};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(true);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(false);
    });

    test('check the icon when inverted = false', () => {
        const props = {...overlay, inverted: false};
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(false);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(true);
    });

    test('Render the Overlay with custom content', () => {
        const props = {...overlay, showCustomContent: true};
        useGetOverlayMock.mockReturnValue(props);
        const {container} = render(<Overlay><div className="customContent"/></Overlay>);
        expect(container.getElementsByClassName('customContent').length).toBe(1);
        expect(container.getElementsByClassName('overlay__header').length).toBe(1);
        expect(container.getElementsByClassName('overlay__subheader').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content').length).toBe(1);
        expect(container.getElementsByClassName('overlay__button-container').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content-span').length).toBe(1);
    });

    test.each([
        ['overlay__header'],
        ['overlay__content-span'],
    ])('When overlay is shown, aria-live for %s is "polite"', (elementClassName) => {
        const props = {...overlay, showCustomContent: true};
        useGetOverlayMock.mockReturnValue(props);
        const {container} = render(<Overlay><div className="customContent"/></Overlay>);
        expect(container.getElementsByClassName(elementClassName)[0]?.getAttribute('aria-live'))
            .toBe('polite');
    });

    test.each([
        ['overlay__header'],
        ['overlay__content-span'],
    ])('When overlay is not shown, aria-live for %s is "off"', (elementClassName) => {
        const props = {...overlay, shown: false, showCustomContent: true};
        useGetOverlayMock.mockReturnValue(props);
        const {container} = render(<Overlay><div className="customContent"/></Overlay>);
        expect(container.getElementsByClassName(elementClassName)[0]?.getAttribute('aria-live'))
            .toBe('off');
    });
});
