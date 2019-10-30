import React, { useState, useEffect } from 'react'
import htm from 'htm'
import {
	ASYNC_STATUS,
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from '../asyncStatusHelpers'
import { take } from 'lodash-es'

const html = htm.bind(React.createElement)

const searchCity = (input, setOptions) =>
	fetch(
		`https://geo.api.gouv.fr/communes?nom=${input}&fields=nom,code,departement,region&boost=population`
	)
		.then(response => {
			if (!response.ok) return setOptions([])
			return response.json()
		})
		.then(json => setOptions(json))
		.catch(function(error) {
			console.log(
				'Erreur dans la recherche de communes à partir du code postal',
				error
			)
			setOptions([])
		})

export default function TripRequestEntry({ tripRequest, onTripRequestChange }) {
	const [origin, setOrigin] = useState(tripRequest.origin)
	const [destination, setDestination] = useState(tripRequest.destination)
	const [originOptions, setOriginOptions] = useState([])
	const [destinationOptions, setDestinationOptions] = useState([])

	// pass new trip to state if it came from props
	useEffect(() => {
		setOrigin(tripRequest.origin)
	}, [tripRequest.origin])
	useEffect(() => {
		setDestination(tripRequest.destination)
	}, [tripRequest.destination])

	function onSubmit(e) {
		e.preventDefault()
		onTripRequestChange({
			origin,
			destination
		})
	}
	let requestStatus = tripRequest[ASYNC_STATUS]

	return html`
		<h2 key="h2">Demande de trajet</h2>
		<form key="form" className="trip-request-entry" onSubmit=${onSubmit}>
			<section className="geography">
				<label>
					<strong>Départ</strong>
					<input
						className="origin"
						type="text"
						onChange=${e => {
							const value = e.target.value
							if (value.length > 2) searchCity(e.target.value, setOriginOptions)
						}}
					/>
				</label>
				${!origin &&
					html`
						<${Options} options=${originOptions} onClick=${setOrigin} />
					`}
				<label>
					<strong>Arrivée</strong>
					<input
						className="destination"
						type="text"
						onChange=${e => {
							const value = e.target.value
							if (value.length > 2)
								searchCity(e.target.value, setDestinationOptions)
						}}
					/>
				</label>
				${!destination &&
					html`
						<${Options}
							options=${destinationOptions}
							onClick=${setDestination}
						/>
					`}
			</section>
		</form>
	`
}

const Options = ({ options, onClick }) =>
	console.log('incomptop', options) ||
	html`
		<ul>
			${take(
				options.map(
					({ nom, departement }) =>
						html`
							<li onClick=${nom => onClick(nom)}>
								${nom + (departement ? ' (' + departement.nom + ')' : '')}
							</li>
						`
				),
				5
			)}
		</ul>
	`

const RequestStatus = ({ status }) => html`
	<div className="status">
		${status === STATUS_PENDING
			? 'Recherche en cours...'
			: status === STATUS_ERROR
			? html`
					<div
						style=${{
							background: '#ffd8d8',
							padding: '.4rem 1rem',
							borderRadius: '1rem',
							margin: '.6rem'
						}}
					>
						Erreur lors de votre recherche. <br />Êtes-vous sûr que ces villes
						existent ?
					</div>
			  `
			: undefined}
	</div>
`
