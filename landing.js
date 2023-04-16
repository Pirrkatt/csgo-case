var cases = document.querySelectorAll('.case');

cases.forEach(el => {
    el.onclick = function() {
        var path = el.childNodes[1].currentSrc
        path = path.replace(/^.*[\\\/]/, '');
        path = path.replace('.png', '')

        var origin_link = document.location.origin
        var page_link = "/csgo/open/" + path + ".html"
        return window.location.href = origin_link + page_link;
    }
})