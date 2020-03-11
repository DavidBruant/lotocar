import React from 'react'
import htm from 'htm'
import styled from 'styled-components'
import { isEqual, parse, format } from 'date-fns'
import { fr } from 'date-fns/locale'

import TripProposal from './TripProposal'
import computeDetour from './computeDetour'

const html = htm.bind(React.createElement)

import {
	STATUS_PENDING,
} from '../asyncStatusHelpers'

export default function DriversList({
	tripProposalsByTrip,
	validTripRequest,
	tripRequestAsyncStatus,
	tripDetailsByTrip,
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

	const directTrips = orderedTrips
		.filter(([_, { additionalTime: time }]) => time < 5)
		.slice(0, 20);
	
	const trips10 = orderedTrips
		.filter(([_, { additionalTime: time }]) => time >= 10 && time < 20)
		.slice(0, 20);

	const trips20 = orderedTrips
		.filter(([_, { additionalTime: time }]) => time >= 20 && time < 45)
		.slice(0, 20);

	const relevantTripsFound = directTrips.length + trips10.length + trips20.length >= 1

	return html`
		<${styled.div`
			h2,
			h3 {
				margin-top: 1rem;
				text-align: center;
			}
			ul {
				margin: 0 auto;
				max-width: 30rem;
				margin-bottom: 3rem;
			}

			> small {
				text-align: center;
				display: block;
				margin-bottom: 1.6rem;
			}

			em {
				background: yellow;
				font-style: normal;
			}
		`}>
			<h2 key="détour0">
				${
					tripRequestAsyncStatus === STATUS_PENDING && !relevantTripsFound ?
						`(recherche en cours)`
						: (!relevantTripsFound ? `(aucun résultat)` : `Trajets disponibles`)
				}
			</h2>
			${TripList(tripProposalsByTrip, directTrips, tripRequest)}
			${
				(trips10.length >= 1 || trips20.length >= 1) &&
				html`
					<h3 key="détour0">Trajets indirects</h3>
				`
			}
			${
				trips10.length >= 1 &&
				html`
					<small>Un <em>détour de plus de 10 minutes</em> sera nécessaire pour vous
						récupérer :</small
					>
					${TripList(tripProposalsByTrip, trips10, tripRequest)}
				
				`
			}
			${
				trips20.length >= 1 &&
				html`
					<small
						>Un <em>détour conséquent (entre 20 et 45 minutes)</em> sera
						nécessaire pour vous récupérer :</small
					>
					${TripList(tripProposalsByTrip, trips20, tripRequest)}
				`}
		</div>
	`
}


const JOURS_LOWERCASE = new Set(['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'])
function getJoursSet(JoursString){
	const L_ESPACE = ' '; // l'ultime frontière
	return new Set(
		JoursString.replace(/,/g, L_ESPACE).replace(/\s+/g, L_ESPACE)
			.split(L_ESPACE)
			.map(j => j.trim().toLowerCase())
			.filter(j => JOURS_LOWERCASE.has(j))
	)
}

const TripList = (
	tripProposalsByTrip,
	trips,
	tripRequest
) => {
	const TripProposalComponents = trips
		.map(([trip]) => {
			const tripProposals = tripProposalsByTrip.get(trip)

			return tripProposals
			.filter(function datesMatch({DateProposée, Jours}){
				const backupDate = new Date()

				const tripRequestDate = tripRequest.date && parse(tripRequest.date, 'yyyy-MM-dd', backupDate);

				return !tripRequest.date || 
					(DateProposée && isEqual( parse(DateProposée, 'dd/MM/yyyy', backupDate), tripRequestDate )) ||
					(Jours && getJoursSet(Jours).has( format(tripRequestDate, 'EEEE', {locale: fr}).toLowerCase() ))
			})
			.map(
				(tripProposal) => html`
					<${TripProposal}
						key=${JSON.stringify(tripProposal)}
						tripProposal=${tripProposal}
						tripRequest=${tripRequest}
					/>
				`
			)
		})
	
	return TripProposalComponents.length === 0 ? undefined : html`
		<ul className="drivers-list">
			${TripProposalComponents}
		</ul>
	`
}
