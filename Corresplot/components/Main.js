import React from 'react'
import htm from 'htm'

import DriversList from './DriverList.js';
import Map from './Map.js'

const html = htm.bind(React.createElement);

export default function({drivers}){
    return html`<${Map}/><${DriversList} drivers=${drivers}/>`
}