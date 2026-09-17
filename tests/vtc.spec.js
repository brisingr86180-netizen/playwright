const { test, expect } = require('@playwright/test');

test('Le bouton de connexion ouvre la popup', async ({ page }) => {
    await page.goto('https://www.vends-ta-culotte.com');

    await page.locator('.age-confirm__enter').click();
    await page.locator('#login_button').click();

    await page.locator('#UsernameID').waitFor({ state: 'visible' });

    // Remplir les identifiants
    await page.locator('#UsernameID').fill('c-quantin@hotmail.fr');
    await page.locator('#PasswordID').fill('winmus-2wIdwe-suvdym');

    await page.getByText('Continuer', { exact: true }).click();

    const compteur = page.locator('button.ex-tab--chat span.notReadNumber');
    let valeurPrecedente = await compteur.textContent();

    console.log('Valeur initiale :', valeurPrecedente);

    // Attendre que sa valeur change
    // Surveillance toutes les minutes
    while (true) {
        await page.waitForTimeout(10000);

        const nouvelleValeur = await compteur.textContent();

        console.log(
            `Compteur : ${valeurPrecedente} → ${nouvelleValeur}`
        );

        if (nouvelleValeur !== valeurPrecedente) {
            console.log('🔔 Le compteur a changé !');


            const response = await fetch('https://ntfy.sh/vtc-notif', {
                method: 'POST',
                body: '🔔 Vous avvez un nouveau message !'
            });

            valeurPrecedente = nouvelleValeur;

            // On mettra ici l'action à effectuer
        }
    }

    console.log('Le compteur a changé !');
});