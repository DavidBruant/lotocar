import React from 'react'
import htm from 'htm'

import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet'


const html = htm.bind(React.createElement);

const CAHORS_POSITION = [44.4491, 1.43663];

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZGF2aWRicnVhbnQiLCJhIjoiY2p5enA0MHNmMDNwbTNsdW9taDA4aWI3dCJ9.3P_tPQT5h2qvjrQYjAQSFQ';

const id = 'mapbox.streets';

const tileLayerURL = `https://api.tiles.mapbox.com/v4/${id}/{z}/{x}/{y}.png?access_token=${MAPBOX_ACCESS_TOKEN}`
const attribution = `Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>, Directions by GoogleMaps`

const zoom = 10;

export default function CorresplotMap({directions}){
    return html`
        <${Map} id="yo" className="map" center=${CAHORS_POSITION} zoom=${zoom}>
            <${TileLayer}
                attribution=${attribution}
                url=${tileLayerURL}
            />
            ${
                [...directions].map(([tripString, direction]) => {
                    return html`
                        <${GeoJSON} key=${tripString} data=${direction.geoJSON}>
                            <${Popup}>${tripString}<//>
                        <//>`
                })
            }
        <//>`
}