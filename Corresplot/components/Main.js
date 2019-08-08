import React from 'react'
import htm from 'htm'

import DriversList from './DriverList.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({drivers, directions}){
    return html`
        <h1>Lotocar</h1>
        <main>
            <${Map} directions=${directions}/>
            <!-- <${DriversList} drivers=${drivers}/> -->
        </main>
    `
}