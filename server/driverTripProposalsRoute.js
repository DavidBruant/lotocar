import getDrivers from '../spreadsheetDatabase/getDrivers.js'

export const PASSAGER_CONTACT_DIRECT_ACCEPT = true;
export const PASSAGER_CONTACT_DIRECT_REFUSE = false;
const PASSAGER_CONTACT_DIRECT_NO_ANSWER = PASSAGER_CONTACT_DIRECT_REFUSE; // qui ne dit mot... ne consent pas

function removeExpiredDriverTripProposals(driverTripProposals){
    const now = Date.now();

    return driverTripProposals.filter(({DateExpiration, 'Heure départ': HeureDépart}) => {
        if(!DateExpiration) // no expiration date means no expiration
            return true;

        const [day, month, year] = DateExpiration.split('/')
        const [hour, minute, seconds] = HeureDépart.split(':')

        return (new Date(year, month-1, day, hour, minute, seconds)).getTime() > now
    })
}

export default function(makeDriverObject){

    return (req, res) => {
        getDrivers()
        .then(function cleanupDriverTripProposals(driverTripProposals) {
            for (const driverTripProposal of driverTripProposals) {
                driverTripProposal['Départ'] = driverTripProposal['Départ'].trim()
                driverTripProposal['Arrivée'] = driverTripProposal['Arrivée'].trim()
                
                const passagerDirectValue = driverTripProposal['Contact direct passager'] && driverTripProposal['Contact direct passager'].trim() || '';
                
                driverTripProposal['Contact direct passager'] = passagerDirectValue === 'Oui' ?
                    PASSAGER_CONTACT_DIRECT_ACCEPT : 
                    (passagerDirectValue.startsWith('Non') ? 
                        PASSAGER_CONTACT_DIRECT_REFUSE : 
                        PASSAGER_CONTACT_DIRECT_NO_ANSWER)
            }
            return driverTripProposals
        })
        .then(removeExpiredDriverTripProposals)
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
