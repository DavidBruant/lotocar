import {createElement} from 'react'
import {render} from 'react-dom'
import htm from 'htm'
import Store from 'baredux'
import {json} from 'd3-fetch'

import Main from './components/Main.js'

const html = htm.bind(createElement);

function renderUI({drivers, positionsByPlace}){
    render(
        html`<${Main} ...${{drivers, positionsByPlace}} />`, 
        document.body
    )
}

const store = new Store({
    state: {
        drivers: [],
        positionsByPlace: new Map()
    },
    mutations: {
        addDrivers(state, drivers){
            console.log('new drivers', drivers)
            state.drivers = [...drivers, ...state.drivers]
        },
        addPositionsByPlace(state, positionsByPlace){
            state.positionByPlace = new Map([...state.positionsByPlace, ...positionsByPlace])
        }
    }
})

store.subscribe(state => {
    const {addDrivers, addPositionsByPlace} = store.mutations
    const {drivers, positionByPlace} = state

    renderUI({drivers, positionByPlace})
})

console.log(store.state)

// initial render 
renderUI(store.state)

json('/drivers')
.then(store.mutations.addDrivers)
