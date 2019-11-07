import React from 'react'
import htm from 'htm'
import classNames from 'classnames'
import styled from 'styled-components'

const html = htm.bind(React.createElement)

const KM = 1000 // meters
const AVERAGE_SPEED = 60 / 60 // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.4

function TripProposal({
	tripProposal,
	tripDetails,
	isDisplayed,
	onDriverClick
}) {
	const {
		Départ,
		Arrivée,
		Jours,
		'Heure départ': heureDépart,
		driver: { Prénom, Nom, 'N° de téléphone': phone, 'Adresse e-mail': email }
	} = tripProposal

	const phoneLink = phone ? `tel:${phone.trim()}` : undefined
	const emailLink =
		email && email.includes('@') ? `mailto:${email.trim()}` : undefined

	let originalDistance,
		distanceWithDetour,
		detourClassName,
		additionalDistanceKM

	if (tripDetails) {
		originalDistance = tripDetails.originalDistance
		distanceWithDetour = tripDetails.distanceWithDetour

		additionalDistanceKM =
			((distanceWithDetour - originalDistance) *
				STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO) /
			KM

		detourClassName =
			additionalDistanceKM <= 5 * AVERAGE_SPEED
				? 'minor-detour'
				: additionalDistanceKM <= 15 * AVERAGE_SPEED
				? 'medium-detour'
				: 'major-detour'
	}

	// in minutes, assuming average 60km/h
	const additionalTime = additionalDistanceKM * AVERAGE_SPEED

	return html`
		<${styled.li`
			display: flex;
			flex-direction: row;
			justify-content: left;
			align-items: center;
			padding: 0.5em;
			background: #8fc7ed33;
			margin: 1rem;
			border-radius: 1rem;
			box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
				0 1px 2px rgba(41, 117, 209, 0.24);
		`}
			className=${classNames('driver', { displayed: isDisplayed })}
			onClick=${onDriverClick}
		>
		<${Detour} ...${{ detourClassName, tripDetails, additionalTime }} />
			<section>
				<span className="name">${Prénom} ${Nom}</span>
				<span className="proposed-trip">
					${Départ} - ${Arrivée}
					${Jours &&
						html`
							<div className="datetime">🗓️ ${Jours}</div>
						`}				
					<div className="datetime">⌚ ${heureDépart}</div>
				</span>
				<${StandardContact} />
			</section>
		</li>
	`
}

const StandardContact = ({}) => {
	const tel = '0531600903'
	return html`
		<${styled.a`
			display: inline-block;
			margin-top: 0.4rem;
			background: rgba(147, 196, 125, 1);
			padding: 0.1rem 0.4rem;
			border-radius: 0.3rem;
			color: white;
		`} href="tel:${tel}">Lotocar (${tel})</a>
	`
}

export default function DriversList({
	tripProposalsByTrip,
	validTripRequest,
	tripDetailsByTrip,
	displayedDriverTrips,
	onTripClick
}) {
	const orderedTrips = [...tripProposalsByTrip.keys()].sort((trip1, trip2) => {
		const details1 = tripDetailsByTrip.get(trip1) || {
			originalDistance: 0,
			distanceWithDetour: Infinity
		}
		const details2 = tripDetailsByTrip.get(trip2) || {
			originalDistance: 0,
			distanceWithDetour: Infinity
		}

		const detour1 = details1.distanceWithDetour - details1.originalDistance
		const detour2 = details2.distanceWithDetour - details2.originalDistance

		return detour1 - detour2
	})

	if (!orderedTrips.length) return null
	if (!validTripRequest)
		return html`
			<div style=${{ textAlign: 'center', marginTop: '2rem' }}>
				<p style=${{ marginBottom: '0rem' }}>
					${orderedTrips.length} trajets disponibles sur Lotocar
				</p>
				<a href="http://bit.ly/inscription-conducteur"
					>J'ai une voiture et je veux aider</a
				>
			</div>
		`
	return html`
		<${styled.h2`
			margin-top: 1rem;
			text-align: center;
		`} key="h2">Conducteur.rice.s</h2>
		<${styled.ul`
			margin: 0 auto;
			max-width: 30rem;
			margin-bottom: 3rem;
		`} key="ul" className="drivers-list">
			${orderedTrips.slice(0, 10).map(trip => {
				const tripProposals = tripProposalsByTrip.get(trip)
				const tripDetails = tripDetailsByTrip.get(trip)

				return tripProposals.map((tripProposal, j) => {
					return html`
						<${TripProposal}
							key=${JSON.stringify(tripProposal)}
							tripProposal=${tripProposal}
							tripDetails=${tripDetails}
							isDisplayed=${displayedDriverTrips.has(trip)}
							onDriverClick=${() => onTripClick(trip)}
						/>
					`
				})
			})}
		</ul>
	`
}

const Detour = ({ detourClassName, tripDetails, additionalTime }) =>
	html`
		<section className="${detourClassName} trip-details">
			${additionalTime === 0
				? html`
						<span>Pas de détour</span>
				  `
				: html`
						<span>
							${tripDetails && 'détour'}
							<br />${tripDetails
								? `${Math.ceil(additionalTime)}mins`
								: undefined}
						</span>
				  `}
		</section>
	`
