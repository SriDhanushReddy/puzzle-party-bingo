import fs from 'node:fs';
const path='dist/server/wrangler.json';
const config=JSON.parse(fs.readFileSync(path,'utf8'));
config.d1_databases.forEach(db=>{db.migrations_dir='../../drizzle';});
fs.writeFileSync(path,JSON.stringify(config,null,2));
