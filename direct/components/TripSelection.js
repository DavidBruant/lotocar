import React from 'react'
import htm from 'htm'

import TripRequestEntry from './TripRequestEntry.js'
import DriverList from './DriverList.js'

const html = htm.bind(React.createElement)

export default function({
	tripProposalsByTrip,
	tripRequest,
	tripDetailsByTrip,
	validPlaceNames,
	onTripRequestChange,
	onTripClick
}) {
	return html`
		<section className="trip-selection">
			<${TripRequestEntry}
				tripRequest=${tripRequest}
				validPlaceNames=${validPlaceNames}
				onTripRequestChange=${onTripRequestChange}
			/>
			<${DriverList}
				tripProposalsByTrip=${tripProposalsByTrip}
				tripDetailsByTrip=${tripDetailsByTrip}
				onTripClick=${onTripClick}
				validTripRequest=${tripRequest.destination !== '' &&
					tripRequest.origin !== ''}
				tripRequest=${tripRequest}
			/>
		</section>
	`
}
