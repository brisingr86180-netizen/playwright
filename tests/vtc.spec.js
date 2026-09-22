const { test, expect } = require('@playwright/test');

test('Le bouton de connexion ouvre la popup', async ({ page }) => {
    await page.goto('https://www.vends-ta-culotte.com');

    await page.locator('.age-confirm__enter').click();
    await page.locator('#login_button').click();

    await page.locator('#UsernameID').waitFor({ state: 'visible' });

    // Remplir les identifiants
    await page.locator('#UsernameID').fill(process.env.VTC_USERNAME);
    await page.locator('#PasswordID').fill(process.env.VTC_PASSWORD);

    await page.getByText('Continuer', { exact: true }).click();

    const compteur = page.locator('button.ex-tab--chat span.notReadNumber');
    let valeurPrecedente = '0';
    let minuteDepuisRefresh = 0;
    let randomWait = Math.floor(Math.random() * 60) + 30;

    if (await compteur.count() > 0) {
        valeurPrecedente = (await compteur.first().textContent())?.trim() || '0';
    }
    console.log('Valeur initiale :', valeurPrecedente);

    while (true) {
        await page.waitForTimeout(10000);


        let nouvelleValeur = '0';
        if (await compteur.count() > 0) {
            nouvelleValeur = (await compteur.first().textContent())?.trim() || '0';
        }

        console.log(
            `Compteur : ${valeurPrecedente} → ${nouvelleValeur}`
        );

        if (parseInt(nouvelleValeur) > parseInt(valeurPrecedente)) {
            console.log('🔔 Le compteur a changé !');

            const response = await fetch(`https://ntfy.sh/${process.env.NTFY_TOPIC}`, {
                method: 'POST',
                body: '🔔 Vous avez un nouveau message !',
                headers: {
                    'Title': 'Vends-Ta-Culotte',
                    'Click': 'https://www.vends-ta-culotte.com',
                    'Icon' : 'https://www.vends-ta-culotte.com/img/favicon-512x512.png',
                },
            });

        }
        valeurPrecedente = nouvelleValeur;
        minuteDepuisRefresh++;

        if (minuteDepuisRefresh >= randomWait) {
            await page.reload({
                waitUntil: 'domcontentloaded'
            });
            minuteDepuisRefresh = 0;
            randomWait = Math.floor(Math.random() * 60) + 30;
        }   
    }

    console.log('Le compteur a changé !');
});