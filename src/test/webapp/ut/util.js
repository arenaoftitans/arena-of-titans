    function setUrlParameters(url, parameters) {
        url += '?';
        for (var parameter_name in parameters) {
            var parameter_value = parameters[parameter_name];
            url += parameter_name + '=' + parameter_value + '&';
        }
        url = url.substring(0, url.length - 1);

        return url;
    }
