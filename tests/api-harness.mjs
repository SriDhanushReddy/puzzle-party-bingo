import {DatabaseSync} from 'node:sqlite';
import {registerHooks} from 'node:module';
import fs from 'node:fs';
const sqlite=new DatabaseSync(process.env.PP_TEST_DB||':memory:');sqlite.exec('PRAGMA busy_timeout=5000;');
if(!process.env.PP_TEST_DB)for(const file of fs.readdirSync(new URL('../drizzle/',import.meta.url)).filter(n=>n.endsWith('.sql')).sort())sqlite.exec(fs.readFileSync(new URL('../drizzle/'+file,import.meta.url),'utf8'));
class Prepared{constructor(sql,args=[]){this.sql=sql;this.args=args;}bind(...args){return new Prepared(this.sql,args);}async run(){const x=sqlite.prepare(this.sql).run(...this.args);return {meta:{changes:Number(x.changes)}};}async first(){return sqlite.prepare(this.sql).get(...this.args)||null;}async all(){return {results:sqlite.prepare(this.sql).all(...this.args)};}}
const db={withSession(){return this;},prepare(sql){return new Prepared(sql);},async batch(statements){sqlite.exec('BEGIN IMMEDIATE');try{const out=[];for(const s of statements)out.push(await s.run());sqlite.exec('COMMIT');return out;}catch(e){sqlite.exec('ROLLBACK');throw e;}}};
globalThis.__ppTestDB=db;registerHooks({resolve(spec,context,next){if(spec==='cloudflare:workers')return {url:'data:text/javascript,export const env={DB:globalThis.__ppTestDB};',shortCircuit:true};return next(spec,context);}});
export const route=await import('../app/api/game/route.ts');
export {sqlite};
export function client(account){let cookie='';return {async call(body){const req=new Request('http://localhost/api/game',{method:'POST',headers:{'content-type':'application/json',cookie,...(account?{'oai-authenticated-user-id':account}:{})},body:JSON.stringify(body)});const res=await route.POST(req);const c=res.headers.get('set-cookie');if(c)cookie=c.split(';')[0];return {status:res.status,...await res.json()};},async get(query=''){const res=await route.GET(new Request('http://localhost/api/game'+query,{headers:{cookie,...(account?{'oai-authenticated-user-id':account}:{})}}));const c=res.headers.get('set-cookie');if(c)cookie=c.split(';')[0];return {status:res.status,...await res.json()};}};}
