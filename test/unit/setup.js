import 'aurelia-polyfills';
import { initialize } from 'aurelia-pal-browser';

initialize();


function values(obj) {
    var vals = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            vals.push(obj[key]);
        }
    }
    return vals;
};


if (typeof Object.values !== 'function') {
    Object.values = values;
}

