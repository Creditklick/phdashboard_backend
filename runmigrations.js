const fs = require('fs');
const path = require('path');
const Pool = require('./config/config');

const runMigrations = async () => {
  const migrationDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationDir).sort();

  for (const file of files) {
    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      await Pool.promise().query(sql);
      console.log(`✅ Migration successful: ${file}`);
    } catch (err) {
      console.error(`❌ Migration failed: ${file}`);
      console.error(err.message);
    }
  }

  process.exit();
};

runMigrations();
