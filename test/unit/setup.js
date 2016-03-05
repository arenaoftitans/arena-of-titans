import 'aurelia-polyfills';


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

