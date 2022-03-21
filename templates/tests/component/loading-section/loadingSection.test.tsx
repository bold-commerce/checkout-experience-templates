import {ILoadingSectionProps} from 'src/types';
import {render} from '@testing-library/react';
import {LoadingSection} from 'src/components';

describe('Testing LoadingSection component', () => {

    const props: ILoadingSectionProps = {
        className: 'test',
        isLoading: true
    };

    test('Rendering the component correctly with loading true', () => {
        const {container} = render(<LoadingSection {...props}/>);
        expect(container.getElementsByClassName('test').length).toBe(1);
    });

    test('Rendering the component correctly with loading true', () => {
        const localProps = {...props};
        localProps.isLoading = false;
        const {container} = render(<LoadingSection {...localProps}/>);
        expect(container.getElementsByClassName('test').length).toBe(0);
    });

});
