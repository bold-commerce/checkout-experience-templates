import {render} from '@testing-library/react';

import {RecapDisplayItem} from 'src/components';
import {IOrderRecapDisplayItemProps} from 'src/types';

describe('testing RecapDisplayItem component', () => {
    const props: IOrderRecapDisplayItemProps = {
        className: 'test-class',
        testDataId: 'test-id',
        title: 'Title test',
        children: 'Children test'
    };

    test('Rendering RecapDisplayItem component', () => {
        const {container} = render(<RecapDisplayItem className={props.className} title={props.title} children={props.children} testDataId={props.testDataId}/>);

        expect(container.getElementsByClassName('test-class').length).toBe(1);
        expect(container.getElementsByClassName('recap-display-item').length).toBe(1);
        expect(container.getElementsByClassName('recap-display-item__title').length).toBe(1);
        expect(container.getElementsByClassName('recap-display-item__content').length).toBe(1);
        expect(container.getElementsByClassName('recap-display-item__title')[0].textContent).toBe('Title test');
        expect(container.getElementsByClassName('recap-display-item__content')[0].textContent).toBe('Children test');
    });
});
