
export function TimeStringToSeconds(time:string):number {
    const HHMMSS = /\d+:\d{2}:\d{2}(\.\d*)?/
    const MMMSS = /\d+:\d{2}(\.\d*)?/

    if (HHMMSS.test(time)) { return HHMMSStoSeconds(time)}
    if (MMMSS.test(time)) { return MMMSStoSeconds(time)}

    return NaN
}

function HHMMSStoSeconds(HHMMSS:string):number {
    const [hours, minutes, seconds] = HHMMSS.split(":",3)
    const timeInSeconds = parseInt(hours)*60*60 + parseInt(minutes)*60 + parseInt(seconds)
    return timeInSeconds
}

function MMMSStoSeconds(MMMSS:string):number {
    const [minutes, seconds] = MMMSS.split(":",2)
    const timeInSeconds = parseInt(minutes)*60 + parseInt(seconds)
    return timeInSeconds
}