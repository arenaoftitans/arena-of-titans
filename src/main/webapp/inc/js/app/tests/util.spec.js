'use strict';

describe('util', function () {
    var url = '/url';

    it('no parameters', function () {
       setUrlParameters(url, {});
       expect(url).toBe(url);
    });

    it('One parameter', function() {
        var params = {param: 'test'};
        var urlWithParameters = setUrlParameters(url, params);
        expect(urlWithParameters).toBe(url + '?param=test');
    });

    it('Two parameters', function () {
        var params = {param1: 'yolo', param2: 'yepee'};
        var urlWithParameters = setUrlParameters(url, params);
        expect(urlWithParameters).toBe(url + '?param1=yolo&param2=yepee');
    });

});