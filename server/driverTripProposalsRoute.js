import getDrivers from '../spreadsheetDatabase/getDrivers.js'

export default function(makeDriverObject){

    return (req, res) => {
        getDrivers()
        .then(function cleanupDriverTripProposals(driverTripProposals) {
            for (const driverTripProposal of driverTripProposals) {
                driverTripProposal['Départ'] = driverTripProposal['Départ'].trim()
                driverTripProposal['Arrivée'] = driverTripProposal['Arrivée'].trim()
            }
            return driverTripProposals
        })
        .then(function driverTripProposalsToTripProposals(driverTripProposals) {
            const tripProposals = []

            for (const driverTripProposal of driverTripProposals) {
                const {
                    Départ,
                    Arrivée,
                    Trajet,
                    Jours,
                    'Heure départ': HeureDépart,
                    'Heure retour': HeureRetour
                } = driverTripProposal

                const driver = Object.freeze(makeDriverObject(driverTripProposal))

                tripProposals.push({
                    Départ,
                    Arrivée,
                    Trajet,
                    Jours,
                    'Heure départ': HeureDépart,
                    driver
                })

                if (HeureRetour && HeureRetour.trim() !== '') {
                    tripProposals.push({
                        Départ: Arrivée,
                        Arrivée: Départ,
                        Trajet: undefined, // should be the reverse Trajet. Will this ever matter?
                        Jours,
                        'Heure départ': HeureRetour,
                        driver
                    })
                }
            }

            res.json(tripProposals)
        })
    }
}
