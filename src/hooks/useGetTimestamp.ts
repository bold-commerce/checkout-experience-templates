export function useGetTimestamp(): string {
    const dt = new Date();
    const year = dt.getUTCFullYear();
    const month = '0' + (dt.getUTCMonth()+1); // Months index is starting at 0! So '04' is May, not April!
    const day = '0' + dt.getUTCDate();
    const hours = '0' + dt.getUTCHours();
    const minutes = '0' + dt.getUTCMinutes();
    const seconds = '0' + dt.getUTCSeconds();
    const milli = '0' + dt.getUTCMilliseconds();
    return year + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' +
        hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + '.' + milli.substr(Math.max(dt.getUTCMilliseconds().toString().length * -1, -6));
}
