import React from 'react'
import htm from 'htm'

import TripSelection from './TripSelection.js'
import Map from './Map.js'

const html = htm.bind(React.createElement)

export default function({
	tripProposalsByTrip,
	directionsByTrip,
	tripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	positionByPlace,
	onTripRequestChange,
	onTripClick,
	privateMode = false
}) {
	return html`
		<main>
			${privateMode &&
				html`
					<${Map}
						directionsByTrip=${directionsByTrip}
						tripRequest=${tripRequest}
						displayedDriverTrips=${displayedDriverTrips}
						positionByPlace=${positionByPlace}
					/>
				`}
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
