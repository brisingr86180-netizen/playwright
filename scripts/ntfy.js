const response = await fetch('https://ntfy.sh/vtc-notif', {
    method: 'POST',
    body: '🔔 Test Playwright : notification reçue !'
});

console.log('Statut :', response.status);
console.log(await response.text());