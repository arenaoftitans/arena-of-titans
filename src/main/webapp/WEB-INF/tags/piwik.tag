<%--
    Document   : piwik
    Created on : Mar 4, 2015, 5:45:00 PM
    Author     : jenselme
--%>

<%@tag description="piwik tracking code" pageEncoding="UTF-8"%>

<!-- Piwik -->
<script type="text/javascript">
    if (/.*arenaoftitans\.(com|fr)/.test(window.location.host)) {
        var _paq = _paq || [];
        _paq.push(["setDomains", ["*.www.arenaoftitans.fr", "*.www.arenaoftitans.com"]]);
        _paq.push(['trackPageView']);
        _paq.push(['enableLinkTracking']);
        (function () {
            var u = "//piwik.jujens.eu/";
            _paq.push(['setTrackerUrl', u + 'piwik.php']);
            _paq.push(['setSiteId', 3]);
            var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
            g.type = 'text/javascript';
            g.async = true;
            g.defer = true;
            g.src = u + 'piwik.js';
            s.parentNode.insertBefore(g, s);
        })();
    }
</script>
<noscript><p><img src="//piwik.jujens.eu/piwik.php?idsite=3" style="border:0;" alt="" /></p></noscript>
<!-- End Piwik Code -->