const bcrypt = require('bcryptjs');
const pool = require('./config/db');

const seed = async () => {
  try {
    console.log('Seeding default EventMate demo accounts...');

    // Clear existing users to avoid unique email conflicts
    await pool.query('DELETE FROM users CASCADE');

    const participantHash = await bcrypt.hash('participant123', 12);
    const organizerHash = await bcrypt.hash('organizer123', 12);
    const adminHash = await bcrypt.hash('admin123', 12);

    await pool.query(`
      INSERT INTO users (name, email, password, role, company, bio) VALUES
      ('Laxmi Prasad', 'laxmi@eventmate.com', $1, 'participant', null, 'Event enthusiast looking to explore local tech and art events.'),
      ('Shyam Gopal', 'shyam@eventpro.com', $2, 'organizer', 'EventPro Ltd.', 'Professional event manager hosting tech conferences and sports activities.'),
      ('Rajesh Hamal', 'rajesh@eventmate.com', $3, 'admin', 'EventMate HQ', 'Super Admin monitoring the platform operations and events safety.')
    `, [participantHash, organizerHash, adminHash]);

    console.log('✅ Default demo accounts seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
