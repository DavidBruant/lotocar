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
		<${styled.main`
			height: 100%;
			display: flex;
			flex-direction: column;

			header,
			footer {
				flex-shrink: 0;
			}
		`}>
			<${styled.header`
				display: flex;
				justify-content: center;
				width: 100%;
				margin-bottom: 2rem;
				img {
					margin: 1rem;
				}
				border-bottom: 1px solid #4682b438;
			`}>
				<img src=${logo} width="79px" height="79px" />
				<img src=${logoLot} width="79px" height="79px" />
			</header>
			<${styled.div`
				flex-grow: 1;
				margin-top: 1rem;
			`}>
			<${TripSelection}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripRequest=${tripRequest}
				tripDetailsByTrip=${tripDetailsByTrip}
				displayedDriverTrips=${displayedDriverTrips}
				onTripRequestChange=${onTripRequestChange}
				onTripClick=${onTripClick}
			/></div>
			<footer>
				<${styled.section`
					background: #4682b4;
					color: white;
					padding: 0.3rem 1rem;
				`}>
				<h2>Nous contacter</h2>
			<div>
				Email : contact@lotocar.fr
			</div><div>
Tél : 05 31 60 09 03</div></section>
			</footer>
		</main>
	`
}

let ExportedApp = Main

if (process.env.NODE_ENV !== 'production') {
	const { hot } = require('react-hot-loader')
	ExportedApp = hot(module)(Main)
}

export default ExportedApp
