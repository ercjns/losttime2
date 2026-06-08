import { LtEntry } from "./EntryFileParser";
import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';


function customTableBodyFromColumns(cols:string[]):any[][] {
    let res:any[] = [' '];
    // ORDER HERE MUST STAY IN SYNC WITH ORDER OF COLUMNS ADDED TO DOCUMENT BODY BASED ON THESE FLAGS!
    if (cols.includes('bib')) { res.push('Bib#') }
    if (cols.includes('first')) { res.push('First') }
    if (cols.includes('last')) { res.push('Last') }
    if (cols.includes('club')) { res.push('Club') }
    if (cols.includes('owed')) { res.push('Owed') }
    if (cols.includes('waiver')) { res.push('Waiver') }
    if (cols.includes('class')) { res.push('Class') }
    if (cols.includes('course')) { res.push('Course') }
    if (cols.includes('epunch')) { res.push('SI #') }
    if (cols.includes('start')) { res.push('Start') }
    if (cols.includes('phone')) { res.push('Phone') }
    if (cols.includes('vehicle')) { res.push('Vehicle') }
    if (cols.includes('eContactName')) { res.push({text:'Emerg. Name', noWrap: true}) }
    if (cols.includes('eContactPhone')) { res.push({text:'Emerg. Ph#', noWrap: true}) }
    return [res]
}

export function buildCheckInPdf(entries: LtEntry[], files: String[], columns:string[], userHeaderText: string = ''): { name: string, doc: pdfMake.TCreatedPdf }[] {

    const fonts: TFontDictionary = {
        // download default Roboto font from cdnjs.com
        Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    }

    const tablebodyowned = customTableBodyFromColumns(columns)
    const tablebodyrented = customTableBodyFromColumns(columns)

    const GroupLeaders = entries.filter(entry => entry.GroupLeader === true);

    const ownedepunchentries = GroupLeaders.filter(entry => entry.Epunch.length > 0 && entry.EpunchRented === false)
    const rentalepunchentries = GroupLeaders.filter(entry => entry.Epunch.length === 0 || entry.EpunchRented === true)

    ownedepunchentries.sort(function (a: LtEntry, b: LtEntry) { return a.LastName.localeCompare(b.LastName) })
    rentalepunchentries.sort(function (a: LtEntry, b: LtEntry) { return a.LastName.localeCompare(b.LastName) })

    for (let leader of ownedepunchentries.filter(entry => entry.GroupId !== null)) {
        let groupmembers = entries.filter(entry => entry.GroupId === leader.GroupId && entry.GroupLeader === false)
        ownedepunchentries.splice(ownedepunchentries.indexOf(leader) + 1, 0, ...groupmembers)
    }
    tablebodyowned.push(...(ownedepunchentries.map((x) => buildRegPdfRow(x,columns))))

    for (let leader of rentalepunchentries.filter(entry => entry.GroupId !== null)) {
        let groupmembers = entries.filter(entry => entry.GroupId === leader.GroupId && entry.GroupLeader === false)
        rentalepunchentries.splice(rentalepunchentries.indexOf(leader) + 1, 0, ...groupmembers)
    }
    tablebodyrented.push(...(rentalepunchentries.map((x) => buildRegPdfRow(x,columns))))


    function docTitle(pageTitle: string): any {
        return ({
            columns: [
                {
                    width: '50%',
                    text: pageTitle,
                },
                {
                    width: '50%',
                    text: userHeaderText,
                }
            ],
            bold: true,
            fontSize: 15,
            margin: [0, 0, 0, 10] // bottom only
        })
    };

    function buildHeader(): any {
        return({
            columns: [{
                text: userHeaderText,
                fontSize: 9,
                margin: [0, 25, 50, 0],
                alignment: 'right'
            }]
        })
    }

    function buildFooter(currentPage: number, pageCount: number): any {
        return ({
            columns: [{
                text: 'Page ' + currentPage.toString() + ' of ' + pageCount + '. Created: ' + nowtimestring(),
                fontSize: 8,
                margin: [50, 0, 0, 0]
            },
            {
                text: 'Source File(s): ' + files,
                fontSize: 8,
                margin: [0, 0, 50, 0],
                alignment: 'right'
            }
            ]
        })
    }

    let instructionsRegOwned: any = () => {
        return ({
            text: [{ text: 'Registration Volunteers: ', italics: true, bold: true }, 'Check off each participant in the first column when they arrive. Please verify course assignment, epunch number, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
            margin: [0, 0, 0, 10] // bottom only
        })
    };

    let instructionsRegRent: any = () => {
        return ({
            text: [{ text: 'Registration Volunteers: ', italics: true, bold: true }, 'Check off each participant in the first column when they arrive. If a number is printed in the box, find that epunch and rent it to the participant. If no number is printed, find any epunch that is not pre-assigned and write the rental number in the large box. Do not check the shaded box. Please verify course assignment, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
            margin: [0, 0, 0, 10] // bottom only
        })
    };

    let instructionsFinishRent: any = () => {
        return ({
            text: [{ text: 'Finish Volunteers: ', italics: true, bold: true }, 'Find any epunch numbers that haven\'t been checked off. Find the corresponding registration in the computer, add the epunch number from this page, and check it off. Return this list to registration.'],
            margin: [0, 0, 0, 10] // bottom only
        })
    };

    let tableLayoutRent: any = () => {
        return (
            {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
                },
                hLineWidth(i: number, node: any) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth() {
                    return 0;
                },
                hLineColor(i: number) {
                    return i === 1 ? 'black' : 'white';
                },
            }
        )
    };

    let tableLayoutOwned: any = () => {
        return (
            {
                fillColor: function (rowIndex: number) {
                    return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
                },
                hLineWidth(i: number, node: any) {
                    if (i === 0 || i === node.table.body.length) {
                        return 0;
                    }
                    return (i === node.table.headerRows) ? 2 : 0;
                },
                vLineWidth() {
                    return .5;
                },
                hLineColor(i: number) {
                    return i === 1 ? 'black' : 'white';
                },
                vLineColor() {
                    return 'white';
                }
            }
        )
    };

    function nowtimestring(): string {
        const now: Date = new Date();
        const y = now.getFullYear().toString();
        // const m = (now.getMonth() + 1).toString().padStart(2, "0");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[now.getMonth()];
        const d = now.getDate().toString().padStart(2, "0");
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = dayNames[now.getDay()];
        const H = now.getHours().toString().padStart(2, "0");
        const M = now.getMinutes().toString().padStart(2, "0");
        return H.concat(':', M, ' ', day, ' ', d, ' ', month, ', ', y);
    }

    const docDefinitionOwned: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        header: buildHeader,
        footer: buildFooter,
        content: [
            docTitle('Pre-Registration List: OWNED punches'),
            instructionsRegOwned(),
            {
                layout: tableLayoutOwned(),
                table: {
                    headerRows: 1,
                    widths: new Array(columns.length + 1).fill('auto'),
                    dontBreakRows: true,
                    body: tablebodyowned
                },
            }
        ]
    }

    const docDefinitionRented1: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        header: buildHeader,
        footer: buildFooter,
        content: [
            docTitle('Pre-Registration List: RENTAL punches (list A)'),
            instructionsRegRent(),
            instructionsFinishRent(),
            {
                layout: tableLayoutRent(),
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    body: tablebodyrented
                },
            },
        ]
    }

    const docDefinitionRented2: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        header: buildHeader,
        footer: buildFooter,
        content: [
            docTitle('Pre-Registration List: RENTAL punches (list B)'),
            instructionsRegRent(),
            instructionsFinishRent(),
            {
                layout: tableLayoutRent(),
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    body: tablebodyrented
                },
            },
        ]
    }

    return ([
        {
            name: "Owned",
            doc: pdfMake.createPdf(docDefinitionOwned, {}, fonts)
        },
        {
            name: "RentalA",
            doc: pdfMake.createPdf(docDefinitionRented1, {}, fonts)
        },
        {
            name: "RentalB",
            doc: pdfMake.createPdf(docDefinitionRented2, {}, fonts)
        }
    ]);
}

function renderCheckbox(entry:LtEntry) {
    if (entry.GroupLeader) {
        return({
            table: {
                widths: [12],
                heights: [10],
                body: [[{
                    text: entry.Owed > 0 ? {
                        text: '$'.concat(entry.Owed.toString()), color: '#999999',
                        fontSize: 7
                    } : " ",
                    border: [true, true, true, true]
                }
                ]]
            }
        })
    } else {
        return({
            text: entry.Owed > 0 ? '$'.concat(entry.Owed.toString()) : "", color: '#999999', fontSize: 7
        })
    }
}

function renderEpunch(entry:LtEntry) {
    if (entry.EpunchRented === false) {
        return({ text: entry.Epunch, fontSize: 11, alignment: 'right' })
    } 
    if (entry.GroupLeader === false) {
        return({ text: "(group)", fontSize: 10, italics: true })
    }
    return ({
        table: { 
            widths: [100], 
            heights: [25], 
            body: [[{
                columns: [
                    { width: '*', text: entry.Epunch ? entry.Epunch : ' ' },
                    { width: 'auto', text: '     ', lineHeight: 1.45, background: '#CCCCCC' }
                ],
                }]]
            },
        layout: {
            hLineWidth() { return 1.5; },
            vLineWidth() { return 1.5; },
            hLineColor() { return 'black'; },
            vLineColor() { return 'black'; },
            paddingTop() { return 2; },
            paddingBottom() { return -2; },
            paddingRight() { return 2; }
        }
    })
}


function buildRegPdfRow(entry: LtEntry, columns: string[]): any[] {
    // ORDER HERE MUST STAY IN SYNC WITH ORDER OF COLUMNS SPECIFIED!!
    let row:any[] = []
    // columns.includes('checkbox')
        row.push(renderCheckbox(entry))
    if (columns.includes('bib')) {
        row.push({ text: entry.StartNo, fontSize: 10 })
    }
    if (columns.includes('first')) {
        row.push(
            entry.GroupLeader === true ? { text: entry.FirstName, fontSize: 11 } : { text: "+ " + entry.FirstName, fontSize: 10, italics: true, noWrap: true }
        )
    }
    if (columns.includes('last')) {
        row.push(
            entry.GroupLeader === true ?
                entry.GroupId === null ? { text: entry.LastName, fontSize: 11 } :
                    { text: [{ text: entry.LastName.replace('_Group', ''), fontSize: 11 }, { text: " GROUP", bold: true, fontSize: 11 }] } :
                { text: entry.LastName, fontSize: 10, italics: true }
        )
    }
    if (columns.includes('club')) {
        row.push(
            { text: entry.Club.slice(0,7), fontSize: 10 }
        )
    }
    if (columns.includes('owed')) {
        row.push(
            entry.Owed > 0 ? { text: '$'.concat(entry.Owed.toString()), fontSize: 11, bold: true } : "",
        )
    }
    if (columns.includes('waiver')) {
        row.push(
            entry.SignedWaiver === true ? {text: "On File", fontSize: 9} : 
                { table: {body: [[{text: "waiver", fontSize:7, color: '#999999'}]]}}
        )
    }
    if (columns.includes('class')) {
        row.push(
            entry.GroupLeader === true ? { text: entry.ClassId, fontSize: 11 } : "",
        )
    }
    if (columns.includes('course')) {
        row.push(
            entry.GroupLeader === true ? { text: entry.Course, fontSize: 11 } : "",
        )
    }
    if (columns.includes('epunch')) {
        row.push(renderEpunch(entry))
    }
    if (columns.includes('start')) {
        row.push(
            { text: entry.StartTime, fontSize: 10, noWrap: true }
        )
    }
    if (columns.includes('phone')) {
        row.push(
            { text: formatPhoneNumber(entry.Phone), fontSize: 8, noWrap: true },
        )
    }
    if (columns.includes('eContactName')) {
        row.push(
            { text: entry.EmergencyName, fontSize: 9 }
        )
    }
    if (columns.includes('eContactPhone')) {
        row.push(
            { text: formatPhoneNumber(entry.EmergencyPhone), fontSize: 8 },
        )
    }
    if (columns.includes('vehicle')) {
        row.push(
            { text: entry.CarLicense, fontSize: 8 }
        )
    }

    return (row);
}

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript/41318684
function formatPhoneNumber(phoneNumberString: string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    if (cleaned.length === 20) {
        return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6,10)} (${cleaned.slice(11,14)}) ${cleaned.slice(14,17)}-${cleaned.slice(17,21)}`;
    }
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return cleaned;
}