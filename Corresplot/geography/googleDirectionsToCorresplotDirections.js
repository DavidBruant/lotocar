import polyline from '@mapbox/polyline'

export default function googleDirectionsToCorresplotDirections(googleDirections){
    const route = googleDirections.routes[0]
    if(route){
        const leg = route.legs[0]

        return {
            distance: leg.distance.value,
            duration: leg.duration.value,
            origin: {
                text: leg.start_address,
                position: leg.start_location
            },
            destination: {
                text: leg.end_address,
                position: leg.end_location
            },
            geoJSON : polyline.toGeoJSON(route.overview_polyline.points)
        }
    }
    else{
        return undefined
    }
    
}