import React from 'react'
import ReactDOM from 'react-dom'
import htm from 'htm'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

const html = htm.bind(React.createElement);



json('/drivers').then(drivers => {
    console.log('drivers', drivers)

    ReactDOM.render(
        html`<${Main} drivers=${drivers}/>`, 
        document.body.querySelector('main')
    )
})