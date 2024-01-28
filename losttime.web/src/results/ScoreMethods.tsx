

export function CocWorldCupScoreByPlace(place:number):number {
    if (place === 1) {return 100;}
    else if (place === 2) {return 95;}
    else if (place === 3) {return 92;}
    else {
        return place <= 94 ? 94-place : 0;
    }
}



function OusaAwt_FindAwt():number {
    return 0;
}


export function OusaAwtScore(time:number, class_awt:number, default_score:number):number {
    // a. For each Individual Intercollegiate/Interscholastic class, define AWT (the average winning time) as the average of the
    // times of the top three individual competitors in that class (for Championships use only times from Team
    // Championship-eligible competitors). In the event that there are fewer than three eligible competitors with a
    // valid time in any intercollegiate class, the AWT shall be calculated as the average of the times of all
    // eligible competitors with a valid time.

    // b. For each competitor in each Individual Intercollegiate/Interscholastic class with a valid result, their score is computed as
    // 60*(competitor’s time)/ (AWT for the class).

    // c. For competitors with an OVT, MSP, DNF or DSQ result, their score shall be the larger of 10+[60*(course
    // time limit)/ (AWT for the male class)] and 10+[60*(course time limit)/ (AWT for the female class)] for
    // their team level (Varsity, JV, Intermediate, or Primary).
    

    return 0
}

