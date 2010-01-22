if (typeof LITTLEROOM === 'undefined') {
    var LITTLEROOM = {};
}
LITTLEROOM.fff = {
    hc: new Hash.Cookie('FFFData', { duration: 365 }),
    lastSearch: '',
    search: function () {
        var string = $('search').getValue().clean().escapeRegExp(), query = LITTLEROOM.fff.hc.get('start') + string, regexp = new RegExp(query, 'i'), count = 0;
        if (query !== LITTLEROOM.fff.lastSearch) {
            LITTLEROOM.fff.lastSearch = query;
            LITTLEROOM.fff.hc.set('search', string);
            for (var i = 0; i < 1638; i += 1) {
                LITTLEROOM.fff.elements[i].className = !string || regexp.test(LITTLEROOM.fff.names[i]) ? (count += 1) % 2 ? 'odd' : 'even' : 'hidden';
            }
            $('count').setText(count);
        }
    },
    parseQuery: function(uri) {
        var obj = {};
        uri.trim().match(/([^?#]*)(#.*)?$/)[1].split('&').each(function (pair) {
            if ((pair = pair.split('='))[0]) {
                obj[decodeURIComponent(pair.shift())] = decodeURIComponent(pair.join('='));
            }
        });
        return obj;
    }
};
window.addEvent('domready', function () {
    LITTLEROOM.fff.elements = $A($('result').getElementsByTagName('li'));
    LITTLEROOM.fff.names = LITTLEROOM.fff.elements.map(function (el, i) {
        return el.setStyle('background-position', '0px -' + (i * 16) + 'px').getText();
    });
    if (!LITTLEROOM.fff.hc.get('start')) {
        LITTLEROOM.fff.hc.set('start', '');
    }
    $('option_start').setProperty('checked', !!LITTLEROOM.fff.hc.get('start')).addEvent('change', function () {
        LITTLEROOM.fff.hc.set('start', this.getValue() ? '^' : '');
        LITTLEROOM.fff.search();
    });
    $('search').addEvents({
        focus: function () { LITTLEROOM.fff.focused = true; },
        blur: function () { LITTLEROOM.fff.focused = false; },
        keyup: LITTLEROOM.fff.search
    }).setProperty('value', LITTLEROOM.fff.parseQuery(location.href).search || LITTLEROOM.fff.hc.get('search') || '').focus();
    window.addEvent('keyup', function (e) {
        if (!LITTLEROOM.fff.focused) {
            e = new Event(e);
            if (e.key === 'f') {
                $('search').focus();
            }
        }
    });
    LITTLEROOM.fff.search();
});