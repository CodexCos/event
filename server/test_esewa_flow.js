const pool = require('./config/db');
const jwt = require('jsonwebtoken');

async function testApi() {
  try {
    const uRes = await pool.query('SELECT id FROM users');
    const userId = uRes.rows[0].id;

    const eRes = await pool.query('SELECT id, price FROM events WHERE price > 0');
    const eventId = eRes.rows[0].id;

    await pool.query('DELETE FROM registrations WHERE user_id = $1 AND event_id = $2', [userId, eventId]);

    const token = jwt.sign({ id: userId, role: 'participant' }, process.env.JWT_SECRET || 'secret');

    const res = await fetch('http://localhost:3001/api/payments/esewa/initiate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({ event_id: eventId })
    });

    const json = await res.json();
    console.log('Initiate response:', JSON.stringify(json, null, 2));

    if (json.esewaUrl && json.formData) {
      const params = new URLSearchParams(json.formData);
      const esewaRes = await fetch(json.esewaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });

      const text = await esewaRes.text();
      console.log('eSewa Response HTTP status:', esewaRes.status);
      console.log('Contains ES104:', text.includes('ES104'));
      if (text.includes('ES104')) {
        console.log('ES104 snippet:', text.slice(text.indexOf('ES104') - 50, text.indexOf('ES104') + 100));
      }
    }
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    process.exit(0);
  }
}

testApi();
