// The idea is use this one and it just wraps the jn2024 
// style with the things needed for the page to look nice


import { CompetitionClass } from "../CompetitionClass"
import { stringify_html } from "./stylehelpers";
import { createOutputNode_JN2024 } from "./style_jn2024"
import { pre } from "./jn2024precontent"
import { post } from "./jn2024postcontent"

export function createOutputDoc_JN2024live(data:CompetitionClass[]) {
    const div = document.createElement('div')

    const h2 = document.createElement('h2');
    h2.innerText = "Live Results - Friday Frenchman Coulee";
    div.appendChild(h2);

    const pagecretedstamp = new Date();
    const ts = document.createElement('p');
    ts.innerText = "This page created at "+pagecretedstamp.toString()+". If that's more than 10 minutes ago and folks are still finishing, you may want to refresh.";
    div.appendChild(ts);

    div.appendChild(createOutputNode_JN2024(data));
    return pre+stringify_html(div)+post;
}
