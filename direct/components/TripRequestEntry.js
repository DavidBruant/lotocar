import React from 'react'
import htm from 'htm'
import styled from 'styled-components'

const html = htm.bind(React.createElement)

const Input = styled.input`
	margin: 0 0.6rem 0 0.6rem;
	border: 3px solid steelblue;
	border-radius: 0.3rem;
	padding: 0.2rem 0.3rem;
	font-size: 110%;
`

const Strong = styled.strong`
	display: inline-block;
	width: 4.5rem;
`

const DATALIST_ID = "valid-place-names";

export default function TripRequestEntry({ tripRequest, validPlaceNames, onTripRequestChange }) {

	const originRef = React.createRef();
	const destinationRef = React.createRef();

	return html`
		<${styled.h2`
			text-align: center;
			margin: 0 0 1.5rem;
		`} key="h2">Où allez-vous ?</h2>
		<form key="form" className="trip-request-entry" onSubmit=${e => {
			const origin = originRef.current.value;
			const destination = destinationRef.current.value;

			e.preventDefault();
			onTripRequestChange({
				origin,
				destination
			})

			if (_paq){
				_paq.push([
					'trackEvent',
					'trajets',
					'recherche',
					origin + ' | ' + destination
				])
			}

		}}>
			<datalist id=${DATALIST_ID}>
				${
					validPlaceNames.map(validPlaceName => {
						return html`<option key=${validPlaceName} value=${validPlaceName} />`
					})
				}
			</datalist>
			<section className="geography">
				<label>
					<${Strong}>Départ</strong>
					<${Input}
						type="text"
						list=${DATALIST_ID}
						defaultValue=${tripRequest.origin}
						ref=${originRef}
					/>
				</label>
				<label>
					<${Strong}>Arrivée</strong>
					<${Input}
						type="text"
						list=${DATALIST_ID}
						defaultValue=${tripRequest.destination}
						ref=${destinationRef}
					/>
				</label>
			</section>
			<button type="submit">Rechercher</button>
		</form>
	`
}
