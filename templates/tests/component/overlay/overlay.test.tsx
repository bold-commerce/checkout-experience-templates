import {render, screen} from '@testing-library/react';
import {mocked} from 'jest-mock';
import {Overlay} from 'src/components';
import {useGetOverlay} from 'src/hooks';
import {IOverlay} from 'src/types';

jest.mock('src/hooks');
jest.mock('src/utils');
const useGetOverlayMock = mocked(useGetOverlay, true);
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
        const props = {...overlay};
        props.inverted = true;
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.id).toBe('overlay-inverted');
    });

    test('Should not render if the shown parameter is false', () => {
        const props = {...overlay};
        props.shown = false;
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.className.includes('overlay-hidden')).toBe(true);
    });

    test('Should not render the button if the inverted is true', () => {
        const props = {...overlay};
        props.inverted = true;
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-button');
        expect(element.className.includes('overlay-hidden')).toBe(false);
    });

    test('check the icon when inverted = true', () => {
        const props = {...overlay};
        props.inverted = true;
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(true);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(false);
    });

    test('check the icon when inverted = false', () => {
        const props = {...overlay};
        props.inverted = false;
        useGetOverlayMock.mockReturnValueOnce(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(false);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(true);
    });

    test('Render the Overlay with custom content', () => {
        const props = {...overlay};
        props.showCustomContent = true;
        useGetOverlayMock.mockReturnValue(props);
        const {container} = render(<Overlay><div className="customContent"/></Overlay>);
        expect(container.getElementsByClassName('customContent').length).toBe(1);
        expect(container.getElementsByClassName('overlay__header').length).toBe(1);
        expect(container.getElementsByClassName('overlay__subheader').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content').length).toBe(1);
        expect(container.getElementsByClassName('overlay__button-container').length).toBe(1);
        expect(container.getElementsByClassName('overlay__content-span').length).toBe(1);
    });

});
