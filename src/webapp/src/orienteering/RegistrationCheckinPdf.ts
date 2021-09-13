import { LtEntry } from "../lt/Entry";
import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

export function buildCheckInPdf(entries:LtEntry[], files:String[]): pdfMake.TCreatedPdf {
    
    const fonts:TFontDictionary = {
        // download default Roboto font from cdnjs.com
     Roboto: {
       normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
       bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
       italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
       bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
     },
    }
    
    const tablebodyowned: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', 'Emergency Ph.', 'Vehicle']]
    const tablebodyrented: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', 'Emergency Ph.', 'Vehicle']]
    const tablebodyrented2: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', 'Emergency Ph.', 'Vehicle']]
    const ownedepunchentries = entries.filter(entry => entry.Epunch.length > 0).map(buildRegPdfRow);
    const rentalepunchentries = entries.filter(entry => entry.Epunch.length === 0).map(buildRegPdfRow);
    const rentalepunchentries2 = entries.filter(entry => entry.Epunch.length === 0).map(buildRegPdfRow);
    tablebodyowned.push(...ownedepunchentries);
    tablebodyrented.push(...rentalepunchentries);
    tablebodyrented2.push(...rentalepunchentries2);

    function lastNameSort(a:any[any][], b:any[any][]):number {
        if (a[2].text && b[2].text) {
            return a[2].text.localeCompare(b[2].text);
        } else if (a[2].text) {
            return 1;
        } else {
            return -1;
        }
    };

    tablebodyowned.sort(lastNameSort);
    tablebodyrented.sort(lastNameSort);
    tablebodyrented2.sort(lastNameSort);

    function nowtimestring():string {
        const now:Date = new Date();
        const y = now.getFullYear().toString();
        // const m = (now.getMonth() + 1).toString().padStart(2, "0");
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = monthNames[now.getMonth()];
        const d = now.getDate().toString().padStart(2, "0");
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const day = dayNames[now.getDay()];
        const H = now.getHours().toString().padStart(2, "0");
        const M = now.getMinutes().toString().padStart(2, "0");
        return H.concat(':',M,' ',day,' ',d,' ',month,', ',y);
      }

    const docDefinition:TDocumentDefinitions = {
        pageSize: 'LETTER',
        pageOrientation: 'landscape',
        footer: function(currentPage, pageCount) { return({
                columns: [{
                    text: 'Created: ' + nowtimestring(),
                    fontSize: 8,
                    margin: [50,0,0,0]
                    },
                    {
                        text: 'Source File(s): ' + files,
                        fontSize: 8,
                        margin: [0,0,50,0],
                        alignment: 'right'
                    }
                ]
                
            })
        },
        content: [
            {
                text: 'Pre-Registration List: OWNED punches',
                bold: true,
                fontSize: 15,
                margin: [0,0,0,10] // bottom only
            },
            {
                text: [{text: 'Registration Volunteers: ', italics: true, bold: true}, 'Check off each participant in the first column when they arrive. Please verify course assignment, epunch number, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
                margin: [0,0,0,10] // bottom only
            },
            {
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
                    },
                    paddingLeft: function(i, node) { return 4; },
                    paddingRight: function(i, node) { return 4; },
                    paddingTop: function(i, node) { return 6; },
                    paddingBottom: function(i, node) { return 4; },
                    hLineWidth(i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return 0;
                        }
                        return (i === node.table.headerRows) ? 2 : 0;
                    },
                    vLineWidth(i) {
                        return .5;
                    },
                    hLineColor(i) {
                        // return i === 1 ? 'black' : '#aaa';
                        return i === 1 ? 'black' : 'white';
                    },
                    vLineColor(i) {
                        return 'white';
                    }
                },
                table: {
                    headerRows: 1,
                    dontBreakRows: true,
                    body: tablebodyowned
                },
                pageBreak: 'after'
            },


            {
                text: 'Pre-Registration List: RENTAL punches (list A)',
                bold: true,
                fontSize: 15,
                margin: [0,0,0,10] // bottom only
            },
            {
                text: [{text: 'Registration Volunteers: ', italics: true, bold: true}, 'Check off each participant in the first column when they arrive. Write the rental epunch number in the large box but do not check the shaded box. Please verify course assignment, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
                margin: [0,0,0,10] // bottom only
            },
            {
                text: [{text: 'Finish Volunteers: ', italics: true, bold: true}, 'Find any epunch numbers that haven\'t been checked off. Find the corresponding registration in the computer, add the epunch number from this page, and check it off. Return this list to registration.'],
                margin: [0,0,0,10] // bottom only
            },
            {
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
                    },
                    paddingLeft: function(i, node) { return 4; },
                    paddingRight: function(i, node) { return 4; },
                    paddingTop: function(i, node) { return 2; },
                    paddingBottom: function(i, node) { return 2; },
                    hLineWidth(i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return 0;
                        }
                        return (i === node.table.headerRows) ? 2 : 1;
                    },
                    vLineWidth(i) {
                        return 0;
                    },
                    hLineColor(i) {
                        return i === 1 ? 'black' : 'white';
                    },
                },
                table: {
                    headerRows: 1,
                    body: tablebodyrented
                },
                pageBreak: 'after'
            },

            {
                text: 'Pre-Registration List: RENTAL punches (list B)',
                bold: true,
                fontSize: 15,
                margin: [0,0,0,10] // bottom only
            },
            {
                text: [{text: 'Registration Volunteers: ', italics: true, bold: true}, 'Check off each participant in the first column when they arrive. Write the rental epunch number in the large box but do not check the shaded box. Please verify course assignment, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
                margin: [0,0,0,10] // bottom only
            },
            {
                text: [{text: 'Finish Volunteers: ', italics: true, bold: true}, 'Find any epunch numbers that haven\'t been checked off. Find the corresponding registration in the computer, add the epunch number from this page, and check it off. Return this list to registration.'],
                margin: [0,0,0,10] // bottom only
            },
            {
                layout: {
                    fillColor: function (rowIndex, node, columnIndex) {
                        return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
                    },
                    paddingLeft: function(i, node) { return 4; },
                    paddingRight: function(i, node) { return 4; },
                    paddingTop: function(i, node) { return 2; },
                    paddingBottom: function(i, node) { return 2; },
                    hLineWidth(i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return 0;
                        }
                        return (i === node.table.headerRows) ? 2 : 1;
                    },
                    vLineWidth(i) {
                        return 0;
                    },
                    hLineColor(i) {
                        return i === 1 ? 'black' : 'white';
                    },
                },
                table: {
                    headerRows: 1,
                    body: tablebodyrented2
                }
            }

        ]
    };
    return(pdfMake.createPdf(docDefinition, {}, fonts));
}


function buildRegPdfRow(entry:LtEntry): any[]{
    const row = [
        {
            table: {
                widths: [12],
                heights: [10],
                body: [[{
                    text: entry.Owed > 0? {
                        text:'$'.concat(entry.Owed.toString()), color:'#999999',
                        fontSize: 7}: " ", 
                    border: [true, true, true, true]}
                ]]
            }
        },
        {text: entry.FirstName, fontSize: 11},
        {text: entry.LastName, fontSize: 11},
        entry.Owed > 0? {text:'$'.concat(entry.Owed.toString()), fontSize: 11, bold:true}: "",
        {text: entry.ClassId, fontSize: 11},
        entry.Epunch.length === 0 ? 
            {
                table: {
                    widths: [100],
                    heights: [25],
                    body: [[{
                        border: [true, true, true, true],
                        alignment: 'right',
                        columns: [
                            {
                                width: '*',
                                text: ' '
                            },
                            {
                                width: 'auto',
                                table: {
                                    widths: [4],
                                    heights: [4],
                                    body: [[{
                                        text: " ",
                                        border: [false, false, false, false]
                                    }]]
                                },
                                layout: {
                                    fillColor: '#CCCCCC'
                                }
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
                    }
                }
            }:
            {text: entry.Epunch, fontSize: 11, alignment:'right'},
        {text: entry.Club, fontSize: 11},
        {text: formatPhoneNumber(entry.Phone), fontSize: 11},
        {text: formatPhoneNumber(entry.EmergencyPhone), fontSize: 11},
        {text: entry.CarLicense, fontSize: 8}
    ]
    return(row);
}

// https://stackoverflow.com/questions/8358084/regular-expression-to-reformat-a-us-phone-number-in-javascript/41318684
function formatPhoneNumber(phoneNumberString:string) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return ['(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return cleaned;
  }
  