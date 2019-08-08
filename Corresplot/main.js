import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

import getDirections from './geography/getDirections.js';
import tripString from './geography/tripString.js'
import googleDirectionsToCorresplotDirections from './geography/googleDirectionsToCorresplotDirections.js'

const html = htm.bind(createElement);

function renderUI({drivers, directions}){
    render(
        html`<${Main} ...${{drivers, directions}} />`, 
        document.body
    )
}

const store = new Store({
    state: {
        drivers: [],
        // directions are keyed on the stringification of a trip
        directions: new Map()
    },
    mutations: {
        addDrivers(state, drivers){
            state.drivers = [...drivers, ...state.drivers]
        },
        addDirections(state, directions){
            state.directions = new Map([...state.directions, ...directions])
        }
    }
})

store.subscribe(state => {
    const {drivers, directions} = state

    renderUI({drivers, directions})
})

console.log(store.state)

// initial render 
renderUI(store.state)

json('/drivers')
.then(drivers => {
    store.mutations.addDrivers(drivers)

    const firstDriver = drivers[0];

    const trip = {
        origin: firstDriver['Départ'],
        destination: firstDriver['Arrivée']
    }

    getDirections(trip)
    .then(directions => {
        store.mutations.addDirections(new Map([[tripString(trip), googleDirectionsToCorresplotDirections(directions)]]))
    })

})
