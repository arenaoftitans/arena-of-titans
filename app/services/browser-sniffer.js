let ua = navigator.userAgent;
let msie = +((/msie (\d+)/.exec(ua.toLowerCase()) || [])[1]);
if (isNaN(msie)) {
    msie = +((/trident\/.*; rv:(\d+)/.exec(ua.toLowerCase()) || [])[1]);
}
if (isNaN(msie)) {
    msie = +((/edge\/(\d+)\./.exec(ua.toLowerCase()) || [])[1]);
}
if (isNaN(msie)) {
    msie = false;
}

let mac = !msie && /\(Mac/.test(ua);


export const browsers = {
    mac: mac,
    msie: msie,
};
