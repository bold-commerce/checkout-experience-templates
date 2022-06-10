import { render } from '@testing-library/react';
import { NavigationHeading } from 'src/components';
import { INavigationHeadingProps } from 'src/types';

describe('Testing navigationHeader component', () => {
    const titleValue = 'Test Title';
    const propsWithNavigation: INavigationHeadingProps = {
        text: titleValue,
        navigation: jest.fn()
    }
    const propsTitleOnly:INavigationHeadingProps = {
        text: titleValue
    }

    test('rendering the component successfully with navigation', () => {
        const { container } = render( <NavigationHeading {...propsWithNavigation} />);
    
        expect(container.getElementsByClassName('nav-heading').length).toBe(1);
        expect(container.getElementsByClassName('nav-heading__navigation').length).toBe(1);
    });
    
    test('rendering the component successfully without navigation', () => {
        const { container } = render( <NavigationHeading {...propsTitleOnly} />);
    
        expect(container.getElementsByClassName('nav-heading').length).toBe(1);
        expect(container.getElementsByClassName('nav-heading__navigation').length).toBe(0);
    });
});
