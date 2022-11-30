export function scrollToElement(className : string): void {
    const elements = document.getElementsByClassName(className);
    if (elements && elements.length > 0) {
        elements[0].scrollIntoView();
    }
}