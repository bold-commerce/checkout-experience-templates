import {getPigiIframe} from 'src/utils';

export function updatePigiHeight(height: string): void{
    const element = getPigiIframe();
    if(element) {
        element.style.height = height;
    }
}
