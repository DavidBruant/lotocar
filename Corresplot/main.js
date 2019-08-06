import React from 'react'
import ReactDOM from 'react-dom'
import htm from 'htm'
import {json} from 'd3-fetch'

const html = htm.bind(React.createElement);

function DriversList({drivers}){
    return html`<ul>
        ${
            drivers.map(
                ({Départ, Arrivée, Horaires}, i) => html`<li>${Départ} => ${Arrivée}. ${Horaires}</li>`
            )
        }
    </ul>`
}

json('/drivers').then(drivers => {
    console.log('drivers', drivers)

    ReactDOM.render(
        html`<${DriversList} drivers=${drivers}/>`, 
        document.body.querySelector('main')
    )
})