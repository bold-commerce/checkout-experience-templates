import {render} from '@testing-library/react';
import {LockedSection} from 'src/components';
import {ILockedSectionProps} from 'src/types';

describe('Testing LockedSection component', () => {

    const props: ILockedSectionProps = {
        classNameSection: 'test-class',
        className: 'test',
        text: 'test-text'
    };
    
    test('Rendering the component correctly with loading true', () => {
        const {container} = render(<LockedSection {...props}/>);
        expect(container.getElementsByClassName(props.className).length).toBe(1);
        expect(container.getElementsByClassName(props.classNameSection).length).toBe(1);
    });

});
