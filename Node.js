const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

app.post('/webhook', (req, res) => {
    const incomingMsg = req.body.Body.toLowerCase();
    let reply = '';

    if (incomingMsg.includes('hi')) {
        reply = 'Hello 👋\n1 - Pricing\n2 - Support\n3 - Agent';
    } else if (incomingMsg === '1') {
        reply = 'Our pricing starts at $10/month.';
    } else if (incomingMsg === '2') {
        reply = 'Please describe your issue.';
    } else {
        reply = 'Sorry, I didn’t understand that.';
    }

    res.set('Content-Type', 'text/xml');
    res.send(`
        <Response>
            <Message>${reply}</Message>
        </Response>
    `);
});

app.listen(3000, () => console.log('Bot running'));
