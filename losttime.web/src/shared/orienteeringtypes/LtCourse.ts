export class LtCourse {
    name: string
    controls?: number
    distance_km?: number
    climb?: number

    constructor(name: string, controls?: number, distance?: number,  climb?: number) {
        this.name = name
        this.controls = controls
        this.distance_km = distance
        this.climb = climb
    }
}