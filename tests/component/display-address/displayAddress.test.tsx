import {IAddress} from 'src/types';
import {render, screen} from '@testing-library/react';
import {DisplayAddress} from 'src/components';


describe('Testing DisplayAddress component', () => {
    const props: IAddress = {
        first_name: 'John',
        last_name: 'Doe',
        address_line_1: '50 Fultz Boulevard',
        address_line_2: '',
        country: 'Canada',
        city: 'Winnipeg',
        province: 'Manitoba',
        country_code: 'CA',
        province_code: 'MB',
        postal_code: 'R3Y 0L6',
        business_name: 'test',
        phone_number: '1234567890'
    };

    test('rendering the component successfully', () => {
        const {container} = render(<DisplayAddress {...props}/>);
        expect(container.getElementsByClassName('display-address-container').length).toBe(1);
        expect(container.getElementsByClassName('display-address-row').length).toBe(5);

        expect(screen.getAllByText(`${props.first_name} ${props.last_name}`).length).toBe(1);
        expect(screen.getAllByText(props.business_name).length).toBe(1);
        expect(screen.getAllByText(props.address_line_1).length).toBe(1);
        expect(screen.getAllByText(`${props.city} ${props.province_code} ${props.postal_code}`).length).toBe(1);
        expect(screen.getAllByText(props.country).length).toBe(1);

    });

});
