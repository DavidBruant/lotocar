import React from 'react'
import htm from 'htm'
import styled from 'styled-components'
import TripProposal from './TripProposal'
import computeDetour from './computeDetour'

const html = htm.bind(React.createElement)

import {
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from '../asyncStatusHelpers'

export default function DriversList({
	tripProposalsByTrip,
	validTripRequest,
	tripRequestAsyncStatus,
	tripDetailsByTrip,
	onTripClick,
	tripRequest
}) {
	const orderedTrips = [...tripProposalsByTrip.keys()]
		.filter(trip => tripDetailsByTrip.has(trip))
		.map(trip => {
			const tripDetails = tripDetailsByTrip.get(trip)
			const { originalDistance = 0, distanceWithDetour = Infinity } = tripDetails
			const detour = computeDetour(originalDistance, distanceWithDetour)
			return [trip, detour]
		})
		.sort(([_1, { additionalTime: a1 }], [_2, { additionalTime: a2 }]) => a1 - a2)

	if (!validTripRequest)
		return html`
			<div style=${{ textAlign: 'center', marginTop: '2rem' }}>
				<p style=${{ marginBottom: '0rem' }}>
					${tripProposalsByTrip.size} trajets disponibles sur Lotocar
				</p>
				<a href="http://bit.ly/inscription-conducteur"
					>J'ai une voiture et je veux aider</a
				>
			</div>
		`
	const tripsByAdditionalTime = request =>
		displayTrips(
			tripProposalsByTrip,
			displayedDriverTrips,
			orderedTrips,
			([, { additionalTime }]) => request(additionalTime)
		)
	return html`
		<${styled.div`
			h2 {
				margin-top: 1rem;
				text-align: center;
			}
			ul {
				margin: 0 auto;
				max-width: 30rem;
				margin-bottom: 3rem;
			}

			small {
				text-align: center;
				display: block;
				margin-bottom: 1.6rem;
			}

			em {
				background: yellow;
				font-style: normal;
			}
		`}>
			<h2 key="détour0">${
		tripRequestAsyncStatus === STATUS_PENDING ?
			`(recherche en cours)`
			: (orderedTrips.length === 0 ? `(aucun résultat)` : `Trajets disponibles`)
		}</h2>
			${tripsByAdditionalTime(time => time < 5)}
			<h2 key="détour0">Trajets indirects</h2>
			<small>Un <em>détour de plus de 5 minutes</em> sera nécessaire pour vous récupérer</small>
			${tripsByAdditionalTime(time => time >= 5 && time < 10)}
			<small>Un <em>détour de plus de 10 minutes</em> sera nécessaire pour vous récupérer</small>
			${tripsByAdditionalTime(time => time >= 10 && time < 15)}
		</div>
	`
}

const displayTrips = (
	tripProposalsByTrip,
	displayedDriverTrips,
	trips,
	filter
) => html`
	<ul className="drivers-list">
		${trips
		.slice(0, 10)
		.filter(trip => true)
		.map(([trip]) => {
			const tripProposals = tripProposalsByTrip.get(trip)

			return tripProposals.map(
				(tripProposal, j) => html`
						<${TripProposal}
							key=${JSON.stringify(tripProposal)}
							tripProposal=${tripProposal}
							onDriverClick=${() => onTripClick(trip)}
							tripRequest=${tripRequest}
						/>
					`
			)
		})}
	</ul>
`
