import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
const config=JSON.parse(fs.readFileSync('dist/server/wrangler.json','utf8'));
if(config.d1_databases.some(db=>!db.database_id||db.database_id==='00000000-0000-4000-8000-000000000000'))throw Error('Set CLOUDFLARE_DATABASE_ID to your own D1 database ID and run pnpm build again.');
for(const args of [['d1','migrations','apply','DB','--remote','--config','dist/server/wrangler.json'],['deploy','--config','dist/server/wrangler.json']]){const r=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js',...args],{stdio:'inherit'});if(r.status!==0)process.exit(r.status||1);}
