const { test } = require('@playwright/test');

test('Surveillance VTC', async ({ page }) => {

    await page.goto('https://www.vends-ta-culotte.com');

    // Connexion
    await page.locator('#login_button').click();

    await page.locator('#UsernameID').fill(process.env.VTC_USERNAME);
    await page.locator('#PasswordID').fill(process.env.VTC_PASSWORD);

    await page.getByText('Continuer', { exact: true }).click();

    // Attendre que la connexion soit terminée
    await page.waitForTimeout(3000);

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


    // État initial
    let anciensContacts = await lireContacts();

    console.log('=== État initial ===');

    for (const [username, compteur] of anciensContacts) {
        console.log(`${username} : ${compteur}`);
    }


    // Surveillance permanente
    while (true) {

        await new Promise(resolve =>
            setTimeout(resolve, 60000)
        );

        const nouveauxContacts = await lireContacts();

        for (const [username, nouveauCompteur] of nouveauxContacts) {

            const ancienCompteur =
                anciensContacts.get(username) ?? 0;

            console.log(
                `${username} : ${ancienCompteur} → ${nouveauCompteur}`
            );


            // Nouveau message détecté
            if (nouveauCompteur > ancienCompteur) {

                const nombre =
                    nouveauCompteur - ancienCompteur;

                const texte = nombre === 1
                    ? `💬 ${username} vous a envoyé un nouveau message !`
                    : `💬 ${username} vous a envoyé ${nombre} nouveaux messages !`;

                console.log('🔔', texte);


                // Notification ntfy
                await fetch(
                    `https://ntfy.sh/${process.env.NTFY_TOPIC}`,
                    {
                        method: 'POST',
                        body: texte,
                        headers: {
                            'Title': '💬 Nouveau message',
                            'Priority': 'high',
                            'Click': 'https://www.vends-ta-culotte.com'
                        }
                    }
                );
            }
        }

        anciensContacts = nouveauxContacts;
    }

});