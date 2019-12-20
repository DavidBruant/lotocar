import { makeTrip } from '../geography/driverToTrip'
import getDirections from '../geography/getDirections.js'
import googleDirectionsToCorresplotDirections from '../geography/googleDirectionsToCorresplotDirections.js'
import getPlacesPosition from '../geography/getPlacesPosition.js'
import {
	ASYNC_STATUS,
	STATUS_PENDING,
	STATUS_ERROR,
	STATUS_VALUE
} from './asyncStatusHelpers'

export default function _actions(store) {
	return {
		setAndPrepareForTripRequest(tripRequest) {
			const { origin, destination, date } = tripRequest
			tripRequest = undefined
			const trip = makeTrip(origin, destination)

			const proposedTrips = [...store.state.tripProposalsByTrip.keys()]

			const positionByPlace = store.state.positionByPlace

			const placesWithoutPositions = new Set([
				...proposedTrips
					.map(({ origin, destination }) => [origin, destination])
					.flat(),
				trip.origin,
				trip.destination
			])
			for (const place of positionByPlace.keys()) {
				placesWithoutPositions.delete(place)
			}

			const newPositionByPlaceP = getPlacesPosition(placesWithoutPositions)
				.then(positionByPlace => {
					store.mutations.addPositions(positionByPlace)

					if (
						!store.state.positionByPlace.has(trip.origin) ||
						!store.state.positionByPlace.has(trip.destination)
					) {
						store.mutations.setTripRequest({
							...store.state.tripRequest,
							date,
							[ASYNC_STATUS]: STATUS_ERROR
						})
					} else {
						store.mutations.setTripRequest({
							...store.state.tripRequest,
							date,
							[ASYNC_STATUS]: STATUS_VALUE
						})
					}
					return positionByPlace
				})
				.catch(console.error)

			store.mutations.setTripRequest({
				...trip,
				date,
				[ASYNC_STATUS]: STATUS_PENDING
			})
		}
	}
}
