
export function lockUnlockScroll(lock: boolean): void {
    const html = document.querySelector('html');
    if(html) {
        const classNames = html.className.split(' ');
        if(lock) {
            if (classNames.indexOf('loading') === -1) {
                classNames.push('loading');
            }
            html.className = classNames.join(' ');
        } else {
            if (classNames.indexOf('loading') !== -1) {
                classNames.splice(classNames.indexOf('loading'), 1);
            }
            html.className = classNames.join(' ');
        }
    }
}
