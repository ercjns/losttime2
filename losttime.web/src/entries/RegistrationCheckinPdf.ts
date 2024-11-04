import { LtEntry } from "./EntryFileParser";
import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

export function buildCheckInPdf(entries: LtEntry[], files: String[], userHeaderText: string = ''): { name: string, doc: pdfMake.TCreatedPdf }[] {

    const fonts: TFontDictionary = {
        // download default Roboto font from cdnjs.com
        Roboto: {
            normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
            bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
            italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
            bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
        }
    }

    const tablebodyowned: any[][] = [[' ', 'First', 'Last', 'Owed', 'Waiver', 'Course', 'Epunch', 'Club', 'Phone', { text: 'Emerg. Ph.', noWrap: true }, 'Vehicle']]
    const tablebodyrented: any[][] = [[' ', 'First', 'Last', 'Owed', 'Waiver', 'Course', 'Epunch', 'Club', 'Phone', { text: 'Emerg. Ph.', noWrap: true }, 'Vehicle']]

    const GroupLeaders = entries.filter(entry => entry.GroupLeader === true);

    const ownedepunchentries = GroupLeaders.filter(entry => entry.Epunch.length > 0 && entry.EpunchRented === false)
    const rentalepunchentries = GroupLeaders.filter(entry => entry.Epunch.length === 0 || entry.EpunchRented === true)

    ownedepunchentries.sort(function (a: LtEntry, b: LtEntry) { return a.LastName.localeCompare(b.LastName) })
    rentalepunchentries.sort(function (a: LtEntry, b: LtEntry) { return a.LastName.localeCompare(b.LastName) })

    for (let leader of ownedepunchentries.filter(entry => entry.GroupId !== null)) {
        let groupmembers = entries.filter(entry => entry.GroupId === leader.GroupId && entry.GroupLeader === false)
        ownedepunchentries.splice(ownedepunchentries.indexOf(leader) + 1, 0, ...groupmembers)
    }
    tablebodyowned.push(...(ownedepunchentries.map(buildRegPdfRow)))

    for (let leader of rentalepunchentries.filter(entry => entry.GroupId !== null)) {
        let groupmembers = entries.filter(entry => entry.GroupId === leader.GroupId && entry.GroupLeader === false)
        rentalepunchentries.splice(rentalepunchentries.indexOf(leader) + 1, 0, ...groupmembers)
    }
    tablebodyrented.push(...(rentalepunchentries.map(buildRegPdfRow)))


    function header(pageTitle: string): any {
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

    function buildfooter(currentPage: number, pageCount: number): any {
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
        footer: buildfooter,
        content: [
            header('Pre-Registration List: OWNED punches'),
            instructionsRegOwned(),
            {
                layout: tableLayoutOwned(),
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    body: tablebodyowned
                },
            }
        ]
    }

    const docDefinitionRented1: TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        footer: buildfooter,
        content: [
            header('Pre-Registration List: RENTAL punches (list A)'),
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
        footer: buildfooter,
        content: [
            header('Pre-Registration List: RENTAL punches (list B)'),
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


function buildRegPdfRow(entry: LtEntry): any[] {
    const row = [
        // checkbox
        entry.GroupLeader === true ? {
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
        } : { text: entry.Owed > 0 ? '$'.concat(entry.Owed.toString()) : "", color: '#999999', fontSize: 7 },
        // first
        entry.GroupLeader === true ? { text: entry.FirstName, fontSize: 11 } : { text: "+ " + entry.FirstName, fontSize: 10, italics: true, noWrap: true },
        // last
        entry.GroupLeader === true ?
            entry.GroupId === null ? { text: entry.LastName, fontSize: 11 } :
                { text: [{ text: entry.LastName.replace('_Group', ''), fontSize: 11 }, { text: " GROUP", bold: true, fontSize: 11 }] } :
            { text: entry.LastName, fontSize: 10, italics: true },
        // owed
        entry.Owed > 0 ? { text: '$'.concat(entry.Owed.toString()), fontSize: 11, bold: true } : "",
        // waiver
        entry.SignedWaiver === true ? {text: "On File", fontSize: 9} : {
            table: {body: [[{text: "waiver", fontSize:7, color: '#999999'}]]}
        },
        // class/course
        entry.GroupLeader === true ? { text: entry.ClassId, fontSize: 11 } : "",
        // epunch number
        entry.EpunchRented === true ? 
            // Group Member Rental Punch
            entry.GroupLeader === false ? { text: "(group)", fontSize: 10, italics: true } :
            // Group Leader or Solo Rental Punch
            {
                table: {
                    widths: [100],
                    heights: [25],
                    body: [[{
                        columns: [
                            {
                                width: '*',
                                text: entry.Epunch ? entry.Epunch : ' '
                            },
                            {
                                width: 'auto',
                                text: '     ',
                                lineHeight: 1.45,
                                background: '#CCCCCC'
                            }
                        ],
                    }]]
                },
                layout: {
                    hLineWidth() {
                        return 1.5;
                    },
                    vLineWidth() {
                        return 1.5;
                    },
                    hLineColor() {
                        return 'black';
                    },
                    vLineColor() {
                        return 'black';
                    },
                    paddingTop() {
                        return 2;
                    },
                    paddingBottom() {
                        return -2;
                    },
                    paddingRight() {
                        return 2;
                    }
                }
            } :
            // Group Member Owned Punch
            entry.GroupLeader === false ? { text: "(group)", fontSize: 10, italics: true } :
            // Group Leader or Solo Owned Punch
                { text: entry.Epunch, fontSize: 11, alignment: 'right' },

        // Club
        { text: entry.Club, fontSize: 11 },
        // Phone
        { text: formatPhoneNumber(entry.Phone), fontSize: 10, noWrap: true },
        // Emergency Phone
        { text: formatPhoneNumber(entry.EmergencyPhone), fontSize: 10, noWrap: true },
        // Vehicle
        { text: entry.CarLicense, fontSize: 8 }
    ]
    return (row);
}

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript/41318684
function formatPhoneNumber(phoneNumberString: string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return cleaned;
}