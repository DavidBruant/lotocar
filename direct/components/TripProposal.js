import React, { useState } from 'react'
import htm from 'htm'
import classNames from 'classnames'
import styled from 'styled-components'
import {
	SimpleButton,
	ContactLinkButton as ContactButtonStyle
} from './ButtonStyle'
const html = htm.bind(React.createElement)

export default function TripProposal({
	tripProposal,
	onDriverClick,
	tripRequest
}) {
	const [selected, setSelected] = useState(false)
	const {
		Départ,
		Arrivée,
		Jours,
		'Heure départ': heureDépart,
		driver: { Prénom, Nom, phone, Employeur }
	} = tripProposal

	return html`
		<${styled.li`
			padding: 0.5em;
			background: #8fc7ed33;
			margin: 1rem;
			border-radius: 1rem;
			box-shadow: 0 1px 3px rgba(41, 117, 209, 0.12),
				0 1px 2px rgba(41, 117, 209, 0.24);
		`}
			className=${classNames('driver')}
			onClick=${onDriverClick}
		>
		${html`
        <${styled.div`
					margin: 0.3rem 1rem;
					.quand {
						display: flex;
						align-items: center;
						width: 80%;
					}
					.quand > span {
						margin-right: 0.6rem;
					}
				`}>
				<div className="proposed-trip">
					<strong>🚙 ${Départ} - ${Arrivée}</strong>
					${Employeur &&
			html`
							<div>💼 ${Employeur}</div>
						`}
					${(Jours || heureDépart !== '-') &&
			html`
							<div className="quand">
								<span>🗓️</span
								><span>
									${html`
										<span className="datetime">${Jours}</span>
									`}
									${heureDépart !== '-' &&
				html`
											<span className="datetime"> à ${heureDépart}</span>
										`}
								</span>
							</div>
						`}
				</div>
				<div>👱 ${Prénom} ${Nom}</div>
			</div>`}
			${
		selected
			? html`
						<div>
						${!phone &&
				html`
								<${FormContact}
									from=${tripRequest.origin}
									to=${tripRequest.destination}
									moreInfo=${`
									Conducteur sélectionné: ${Prénom} ${Nom}, de ${Départ} à ${Arrivée}.
								`}
								/>
							`}
						<${TelephoneContact} number=${phone} />
						<${SimpleButton} onClick=${() => setSelected(false)}>Retour</button>
						</div>
				  `
			: html`
			<${ContactButtonStyle} onClick=${() => {
					trackDemande('Faire une demande')
					setSelected(true)
				}}>${
				phone ? '📞 Contact direct' : 'Faire une demande'
				}</${ContactButtonStyle}>`
		}
		</li>
	`
}

const trackDemande = whichButton => {
	if (typeof _paq !== 'undefined')
		_paq.push(['trackEvent', 'trajets', 'demande', whichButton])
}

const TelephoneContact = ({ number }) => {
	const tel = number || '0531600903'
	return html`
		< ${ ContactButtonStyle} href = "tel:${tel}"
			> ${ number ? `` : `Demande via Lotocar`} ${tel}
		</${ ContactButtonStyle}>
		`
}
const FormContact = ({ from, to, moreInfo }) => {
	return html`
		< ${ ContactButtonStyle}
	target = "_blank"
	href = ${ `https://docs.google.com/forms/d/e/1FAIpQLSf-bhTbcJ36S7PQK167zxaEkvaMSBzg8yOwQx0fDUQMd4_pYQ/viewform?entry.227174060=${from}&entry.44825971=${to}&entry.1204459643=${moreInfo}`}>
	📄 Demande en ligne
		</${ ContactButtonStyle}>
		`
}

const Detour = ({ detourClassName, tripDetails, additionalTime }) =>
	html`
		< section className = "${detourClassName} trip-details" >
			${
		additionalTime === 0
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
		</section >
		`
