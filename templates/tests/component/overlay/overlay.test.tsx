import * as lockUnlockScroll from 'src/utils/lockUnlockScroll';
import * as useGetOverlay from 'src/hooks/useGetOverlay';
import {IOverlay} from 'src/types';
import {render, screen} from '@testing-library/react';
import {Overlay} from 'src/components';

describe('Testing Overlay component', () => {

    let lockUnlockScrollSpy: jest.SpyInstance;
    let overlaySpy: jest.SpyInstance;

    const overlay: IOverlay ={
        shown: true,
        inverted: false,
        header: 'This is header issue',
        subHeader: 'This is sub-header issue',
        buttonText: 'back'
    };
    const one = 1;

    beforeEach(() => {
        lockUnlockScrollSpy = jest.spyOn(lockUnlockScroll, 'lockUnlockScroll');
    });

    test('Render the Overlay properly', () => {
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(overlay);
        const {container} = render(<Overlay />);
        expect(container.getElementsByClassName('overlay__header').length).toBe(one);
        expect(container.getElementsByClassName('overlay__subheader').length).toBe(one);
        expect(container.getElementsByClassName('overlay__content').length).toBe(one);
        expect(container.getElementsByClassName('overlay__button-container').length).toBe(one);
        expect(container.getElementsByClassName('overlay__content-span').length).toBe(one);
    });

    test('check the overlay ID on basis of inverted = false', () => {
        const props = {...overlay};
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.id).toBe('overlay');
    });

    test('check the overlay ID on basis of inverted = true', () => {
        const props = {...overlay};
        props.inverted = true;
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.id).toBe('overlay-inverted');
    });

    test('Should not render if the shown parameter is false', () => {
        const props = {...overlay};
        props.shown = false;
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-div');
        expect(element.className.includes('overlay-hidden')).toBe(true);
    });

    test('Should not render the button if the inverted is true', () => {
        const props = {...overlay};
        props.inverted = true;
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-button');
        expect(element.className.includes('overlay-hidden')).toBe(false);
    });

    test('check the icon when inverted = true', () => {
        const props = {...overlay};
        props.inverted = true;
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(true);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(false);
    });

    test('check the icon when inverted = false', () => {
        const props = {...overlay};
        props.inverted = false;
        overlaySpy = jest.spyOn(useGetOverlay, 'useGetOverlay').mockReturnValue(props);
        render(<Overlay />);
        const element = screen.getByTestId('overlay-icon');
        expect(element.className.includes('overlay__loader')).toBe(false);
        expect(element.className.includes('overlay__icon-error-triangle')).toBe(true);
    });

});
