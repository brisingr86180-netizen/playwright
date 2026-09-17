
const { test, expect } = require('@playwright/test');

async function lireContacts() {
    const contacts = page.locator('.contact-cell__topline');
    const etat = new Map();

    for (let i = 0; i < await contacts.count(); i++) {
        const contact = contacts.nth(i);

        const username = (
            await contact
                .locator('.contact-cell__username')
                .textContent()
        )?.trim() || 'Inconnu';

        const compteurLocator =
            contact.locator('.contact-cell__not-read');

        let compteur = 0;

        if (await compteurLocator.count() > 0) {
            compteur = parseInt(
                (await compteurLocator.first().textContent())?.trim() || '0',
                10
            );
        }

        etat.set(username, compteur);
    }

    return etat;
}


// Première lecture : on mémorise l'état actuel
let anciensContacts = await lireContacts();

console.log('État initial des contacts :');
for (const [username, compteur] of anciensContacts) {
    console.log(`- ${username} : ${compteur}`);
}
while (true) {

    await new Promise(resolve => setTimeout(resolve, 60000));

    const nouveauxContacts = await lireContacts();

    for (const [username, nouveauCompteur] of nouveauxContacts) {

        const ancienCompteur =
            anciensContacts.get(username) ?? 0;

        console.log(
            `${username} : ${ancienCompteur} → ${nouveauCompteur}`
        );

        if (nouveauCompteur > ancienCompteur) {

            const nombre =
                nouveauCompteur - ancienCompteur;

            const texte = nombre === 1
                ? `💬 ${username} vous a envoyé un nouveau message !`
                : `💬 ${username} vous a envoyé ${nombre} nouveaux messages !`;

            console.log('🔔', texte);

            await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
                method: 'POST',
                body: texte,
                headers: {
                    'Title': '💬 Nouveau message',
                    'Priority': 'high',
                    'Click': 'https://www.vends-ta-culotte.com'
                }
            });
        }
    }

    anciensContacts = nouveauxContacts;
}