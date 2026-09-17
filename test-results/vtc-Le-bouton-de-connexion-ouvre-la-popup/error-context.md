# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: vtc.spec.js >> Le bouton de connexion ouvre la popup
- Location: tests\vtc.spec.js:3:1

# Error details

```
Error: page.waitForTimeout: Test ended.
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | 
  3  | test('Le bouton de connexion ouvre la popup', async ({ page }) => {
  4  |     await page.goto('https://www.vends-ta-culotte.com');
  5  | 
  6  |     await page.locator('.age-confirm__enter').click();
  7  |     await page.locator('#login_button').click();
  8  | 
  9  |     await page.locator('#UsernameID').waitFor({ state: 'visible' });
  10 | 
  11 |     // Remplir les identifiants
  12 |     await page.locator('#UsernameID').fill('c-quantin@hotmail.fr');
  13 |     await page.locator('#PasswordID').fill('winmus-2wIdwe-suvdym');
  14 | 
  15 |     await page.getByText('Continuer', { exact: true }).click();
  16 | 
  17 |     const compteur = page.locator('button.ex-tab--chat span.notReadNumber');
  18 |     let valeurPrecedente = await compteur.textContent();
  19 | 
  20 |     console.log('Valeur initiale :', valeurPrecedente);
  21 | 
  22 |     // Attendre que sa valeur change
  23 |     // Surveillance toutes les minutes
  24 |     while (true) {
> 25 |         await page.waitForTimeout(10000);
     |                    ^ Error: page.waitForTimeout: Test ended.
  26 | 
  27 |         const nouvelleValeur = await compteur.textContent();
  28 | 
  29 |         console.log(
  30 |             `Compteur : ${valeurPrecedente} → ${nouvelleValeur}`
  31 |         );
  32 | 
  33 |         if (nouvelleValeur !== valeurPrecedente) {
  34 |             console.log('🔔 Le compteur a changé !');
  35 | 
  36 | 
  37 |             const response = await fetch('https://ntfy.sh/vtc-notif', {
  38 |                 method: 'POST',
  39 |                 body: '🔔 Vous avvez un nouveau message !'
  40 |             });
  41 | 
  42 |             valeurPrecedente = nouvelleValeur;
  43 | 
  44 |             // On mettra ici l'action à effectuer
  45 |         }
  46 |     }
  47 | 
  48 |     console.log('Le compteur a changé !');
  49 | });
```