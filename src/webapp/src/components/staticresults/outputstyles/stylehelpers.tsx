import { html_beautify } from 'js-beautify';

export function stringify_html(html:HTMLDivElement) {
    const wrap = document.createElement("div");
    wrap.appendChild(html);
    return html_beautify(wrap.innerHTML);
}