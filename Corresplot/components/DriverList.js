import React from 'react'
import htm from 'htm'

const html = htm.bind(React.createElement);

const KM = 1000; // meters
const AVERAGE_SPEED = 60/60; // km/min
const STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO = 1.5;

function Driver({driver, tripDetails, onDriverClick}){
    const {Départ, Arrivée, Jours, 'Heure départ': heureDépart, 'Heure retour': heureRetour, Prénom, Nom, 'N° de téléphone': phone,
    'Adresse e-mail': email} = driver

    const phoneLink = phone ? `tel:${phone.trim()}` : undefined
    const emailLink = email && email.includes('@') ? `mailto:${email.trim()}` : undefined

    let originalDistance, distanceWithDetour, detourClassName, additionalDistanceKM;

    if(tripDetails){
        originalDistance = tripDetails.originalDistance;
        distanceWithDetour = tripDetails.distanceWithDetour;

        additionalDistanceKM = (distanceWithDetour - originalDistance)*STRAIGHT_LINE_TO_ROAD_DISTANCE_RATIO/KM

        detourClassName = additionalDistanceKM <= 5*AVERAGE_SPEED ? 
        'minor-detour' : 
        (additionalDistanceKM <= 15*AVERAGE_SPEED/HOUR ?
            'medium-detour' : 
            'major-detour')
    }

    // in minutes, assuming average 60km/h
    const additionalTime = additionalDistanceKM*AVERAGE_SPEED

    return html`
        <li className="driver" onClick=${onDriverClick}>
            <section className="${detourClassName} trip-details">
                <span>${tripDetails ? `+${Math.ceil(additionalTime)}mins` : undefined}</span>
            </section>
            <section>
                <span className="name">${Prénom} ${Nom}</span>
                <span className="proposed-trip">(${Départ} - ${Arrivée} - ${Jours} - Aller: ${heureDépart} - Retour: ${heureRetour})</span>
                <span className="contact">
                    <a href="${phoneLink}">${phone ? phone.trim() : `(pas de téléphone)`}</a>
                    <a href="${emailLink}">${email && email.includes('@') ? `email` : `(pas d'email)`}</a>
                </span>
            </section>
        </li>`
}

export default function DriversList({driversByTrip, tripRequest, tripDetailsByTrip, onTripClick}){
    const orderedTrips = [...driversByTrip.keys()].sort((trip1, trip2) => {
        const details1 = tripDetailsByTrip.get(trip1) || {originalDistance: 0, distanceWithDetour: Infinity}
        const details2 = tripDetailsByTrip.get(trip2) || {originalDistance: 0, distanceWithDetour: Infinity}

        const detour1 = details1.distanceWithDetour - details1.originalDistance
        const detour2 = details2.distanceWithDetour - details2.originalDistance

        return detour1 - detour2;
    })

    return html`
        <h2 key="h2">Conducteur.rice.s</h2>
        <ul key="ul" className="drivers-list">
            ${
                orderedTrips.map(trip => {
                    const drivers = driversByTrip.get(trip)
                    const tripDetails = tripDetailsByTrip.get(trip)

                    return drivers.map((driver, j) => {
                        return html`<${Driver} driver=${driver} tripDetails=${tripDetails} onDriverClick=${() => onTripClick(trip)}/>`
                    })
                })
            }
        </ul>`
}