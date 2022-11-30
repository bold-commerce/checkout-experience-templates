import {render} from '@testing-library/react';
import {LoadSpinner} from 'src/components';


describe('Testing LoadSpinner component', () => {

    test('Rendering the component correctly with loading true', () => {
        const {container} = render(<LoadSpinner/>);
        expect(container.getElementsByClassName('lds-ring').length).toBe(1);
    });

});
