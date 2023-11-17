

export function CocWorldCupScoreByPlace(place:number):number {
    if (place === 1) {return 100;}
    else if (place === 2) {return 95;}
    else if (place === 3) {return 92;}
    else {
        return place <= 94 ? 94-place : 0;
    }
}