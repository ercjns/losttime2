import { LtEntry } from "../lt/Entry";
import * as pdfMake from "pdfmake/build/pdfmake";
import { TDocumentDefinitions, TFontDictionary } from 'pdfmake/interfaces';

export function buildCheckInPdf(entries:LtEntry[], files:String[], userHeaderText:string=''): {name:string, doc:pdfMake.TCreatedPdf}[] {
    
    const fonts:TFontDictionary = {
        // download default Roboto font from cdnjs.com
     Roboto: {
       normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
       bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
       italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
       bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
     },
    }
    
    const tablebodyowned: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', {text:'Emergency. Ph.', noWrap:true}, 'Vehicle']]
    const tablebodyrented: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', {text:'Emergency. Ph.', noWrap:true}, 'Vehicle']]
    const tablebodyrented2: any[][] = [[' ', 'First', 'Last', 'Owed', 'Course', 'Epunch', 'Club', 'Phone', {text:'Emergency. Ph.', noWrap:true}, 'Vehicle']]

    const GroupLeaders = entries.filter(entry => entry.GroupLeader === true);

    const ownedepunchentries = GroupLeaders.filter(entry => entry.Epunch.length > 0).map(buildRegPdfRow);
    const rentalepunchentries = GroupLeaders.filter(entry => entry.Epunch.length === 0).map(buildRegPdfRow);
    const rentalepunchentries2 = GroupLeaders.filter(entry => entry.Epunch.length === 0).map(buildRegPdfRow);

    tablebodyowned.push(...ownedepunchentries);
    tablebodyrented.push(...rentalepunchentries);
    tablebodyrented2.push(...rentalepunchentries2);

    tablebodyowned.sort(lastNameSort);
    tablebodyrented.sort(lastNameSort);
    tablebodyrented2.sort(lastNameSort);

    function lastNameSort(a:any[any][], b:any[any][]):number {
        if (a[2].text && b[2].text) {
            return a[2].text.localeCompare(b[2].text);
        } else if (a[2].text) {
            return 1;
        } else {
            return -1;
        }
    };

    function header(pageTitle:string):any {
        return({
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
            margin: [0,0,0,10] // bottom only
        })
    };

    function buildfooter(currentPage:number, pageCount:number):any {
        return({
            columns: [{
                text: 'Page ' + currentPage.toString() + ' of ' + pageCount + '. Created: ' + nowtimestring(),
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
    }

    let instructionsRegOwned:any = () => {return({
        text: [{text: 'Registration Volunteers: ', italics: true, bold: true}, 'Check off each participant in the first column when they arrive. Please verify course assignment, epunch number, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
        margin: [0,0,0,10] // bottom only
    })};

    let instructionsRegRent:any = () => {return({
        text: [{text: 'Registration Volunteers: ', italics: true, bold: true}, 'Check off each participant in the first column when they arrive. Write the rental epunch number in the large box but do not check the shaded box. Please verify course assignment, contact, and vehicle information. Collect any money owed and cross out in the owed column when paid.'],
        margin: [0,0,0,10] // bottom only
    })};
    
    let instructionsFinishRent:any = () => {return({
        text: [{text: 'Finish Volunteers: ', italics: true, bold: true}, 'Find any epunch numbers that haven\'t been checked off. Find the corresponding registration in the computer, add the epunch number from this page, and check it off. Return this list to registration.'],
        margin: [0,0,0,10] // bottom only
    })};

    let tableLayoutRent:any = () => {return(
        {
            fillColor: function (rowIndex:number) {
                return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
            },
            paddingLeft: function() { return 4; },
            paddingRight: function() { return 4; },
            paddingTop: function() { return 2; },
            paddingBottom: function() { return 2; },
            hLineWidth(i:number, node:any) {
                if (i === 0 || i === node.table.body.length) {
                    return 0;
                }
                return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth() {
                return 0;
            },
            hLineColor(i:number) {
                return i === 1 ? 'black' : 'white';
            },
        }
    )};

    let tableLayoutOwned:any = () => {return(
        {
            fillColor: function (rowIndex:number) {
                return (rowIndex % 2 === 1) ? '#EEEEEE' : null;
            },
            paddingLeft: function() { return 4; },
            paddingRight: function() { return 4; },
            paddingTop: function() { return 6; },
            paddingBottom: function() { return 4; },
            hLineWidth(i:number, node:any) {
                if (i === 0 || i === node.table.body.length) {
                    return 0;
                }
                return (i === node.table.headerRows) ? 2 : 0;
            },
            vLineWidth() {
                return .5;
            },
            hLineColor(i:number) {
                return i === 1 ? 'black' : 'white';
            },
            vLineColor() {
                return 'white';
            }
        }
    )};

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

    const docDefinitionOwned:TDocumentDefinitions = {
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

    const docDefinitionRented1:TDocumentDefinitions = {
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
                    body: tablebodyrented
                },
            },
        ]
    }

    const docDefinitionRented2:TDocumentDefinitions = {
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
                    body: tablebodyrented2
                },
            },
        ]
    }

    return([
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
                        columns: [
                            {
                                width: '*',
                                text: ' '
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
            }:
            {text: entry.Epunch, fontSize: 11, alignment:'right'},
        {text: entry.Club, fontSize: 11},
        {text: formatPhoneNumber(entry.Phone), fontSize: 11, noWrap:true},
        {text: formatPhoneNumber(entry.EmergencyPhone), fontSize: 11, noWrap:true  },
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