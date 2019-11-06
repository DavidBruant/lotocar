import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import logo from '../logo.png'
import logoLot from '../logo-lot.png'
import styled from 'styled-components'

const html = htm.bind(React.createElement)

let Main = function({
	tripProposalsByTrip,
	tripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	positionByPlace,
	onTripRequestChange,
	onTripClick
}) {
	return html`
		<main>
			<${styled.header`
				display: flex;
				justify-content: center;
				width: 100%;
				margin-bottom: 1rem;
				img {
					margin: 1rem;
				}
			`}>
				<img src=${logo} width="79px" height="79px" />
				<img src=${logoLot} width="79px" height="79px" />
			</header>
			<${TripSelection}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripRequest=${tripRequest}
				tripDetailsByTrip=${tripDetailsByTrip}
				displayedDriverTrips=${displayedDriverTrips}
				onTripRequestChange=${onTripRequestChange}
				onTripClick=${onTripClick}
			/>
		</main>
	`
}

let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
