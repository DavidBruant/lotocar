import {json} from 'd3-fetch'

export default function getDirections({origin, destination}){
    const url = `/directions?origin=${origin}&destination=${destination}`

    console.log('getDirections', url)

    return json(url)
}