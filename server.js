'use strict';
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const {Pool} = require('pg');
const origin = 'https://catalogo-informacoes-miguel.onrender.com';
const PORT = Number(process.env.PORT || 3000);
const PASSWORD = process.env.ADMIN_PASSWORD || '';
const pool = new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false},max:4,connectionTimeoutMillis:12000});
const sessions=new Map(), attempts=new Map();
const validCategories=new Set(['avulsas','amor','financeiro','autoconhecimento','espiritualidade','numerologia','completas','periodos']);
async function init(){await pool.query('CREATE TABLE IF NOT EXISTS catalog_state (id INTEGER PRIMARY KEY CHECK (id=1), state JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())');
 const seed = JSON.parse(fs.readFileSync(path.join(__dirname,'seed.json'),'utf8'));
 await pool.query('INSERT INTO catalog_state (id,state) VALUES (1,$1::jsonb) ON CONFLICT(id) DO NOTHING',[JSON.stringify(seed)]);
}
async function load(){const r=await pool.query('SELECT state FROM catalog_state WHERE id=1');return r.rows[0].state;}
function reply(res,status,body,extra={}){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer',...extra});res.end(JSON.stringify(body));}
function file(res,name,mime){try{const data=fs.readFileSync(path.join(__dirname,name));res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'"});res.end(data);}catch(e){res.writeHead(404);res.end('Not found');}}
function body(req){return new Promise((resolve,reject)=>{let b='',n=0;req.on('data',c=>{n+=c.length;if(n>1024*1024){reject(new Error('Corpo muito grande'));req.destroy();return;}b+=c});req.on('end',()=>{try{resolve(JSON.parse(b))}catch(e){reject(new Error('JSON invalido'))}});req.on('error',reject)});}
function session(req){const t=(req.headers.cookie||'').split(';').map(c=>c.trim()).find(c=>c.startsWith('miguel_admin='))?.slice('miguel_admin='.length);if(!t)return null;const s=sessions.get(t);if(!s)return null;if(s.exp<Date.now()){sessions.delete(t);return null}return {...s,token:t};}
function cookie(t,age){return `miguel_admin=${t}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;}
function validate(s){if(!s||!Array.isArray(s.catalog)||s.catalog.length>300||!s.config||typeof s.config!=='object')return 'Dados inválidos';let ids=new Set();for(const m of s.catalog){if(typeof m.id!=='string'||!/^[-a-zA-Z0-9]{2,90}$/.test(m.id)||ids.has(m.id))return 'Código do método inválido ou duplicado';ids.add(m.id);if(!validCategories.has(m.category)||typeof m.name!=='string'||!m.name.trim()||m.name.length>150||typeof m.price!=='number'||!Number.isFinite(m.price)||m.price<0||m.price>100000)return 'Nome, categoria ou preço inválido';if(typeof m.description!=='string'||m.description.length>8000||typeof m.summary!=='string'||m.summary.length>700||!Array.isArray(m.questions)||m.questions.length>40||m.questions.some(x=>typeof x!=='string'||x.length>1000))return 'Descrição ou perguntas inválidas';if(m.prices&&(typeof m.prices!=='object'||Object.entries(m.prices).some(([k,v])=>!/^[1-9][0-9]?$/.test(k)||!Number.isFinite(v)||v<0||v>100000)))return 'Preços por pergunta inválidos';}const c=s.config;for(const k of ['businessName','whatsappNumber','whatsappShortLink','instagramUrl','groupUrl','pixKey','pixHolder','pixBank'])if(typeof c[k]!=='string'||c[k].length>500)return 'Configuração inválida';for(const k of ['urgent24Price','sameDayPrice','standardBusinessDays','urgentCutoffHour','year'])if(!Number.isFinite(c[k])||c[k]<0||c[k]>100000)return 'Taxa ou prazo inválido';return null;}
http.createServer(async(req,res)=>{const url=new URL(req.url,'http://localhost');const pathname=url.pathname;
 try{
 if(req.method==='GET'&&pathname==='/health'){await pool.query('SELECT 1');return reply(res,200,{ok:true});}
 if(req.method==='GET'&&pathname==='/api/public/state') {const s=await load();return reply(res,200,{catalog:s.catalog,config:s.config},{'Access-Control-Allow-Origin':origin,'Vary':'Origin'});}
 if(req.method==='GET'&&pathname==='/admin')return file(res,'admin.html','text/html; charset=utf-8');
 if(req.method==='GET'&&pathname==='/admin-ui.css')return file(res,'admin-ui.css','text/css; charset=utf-8');
 if(req.method==='GET'&&pathname==='/admin-ui.js')return file(res,'admin-ui.js','application/javascript; charset=utf-8');
 if(pathname.startsWith('/api/admin/')&&req.method==='POST'){const given=req.headers.origin;if(given && given!==`https://${req.headers.host}`)return reply(res,403,{error:'Origem inválida'});}
 if(req.method==='POST'&&pathname==='/api/admin/login'){
  if(PASSWORD.length<12)return reply(res,503,{error:'Senha não configurada no servidor'});
  const ip=req.headers['x-forwarded-for']?.split(',')[0]||req.socket.remoteAddress;
  let a=attempts.get(ip)||{n:0,since:Date.now()};if(Date.now()-a.since>900000)a={n:0,since:Date.now()};if(a.n>=8)return reply(res,429,{error:'Muitas tentativas. Tente novamente em 15 minutos.'});
  const b=await body(req);const g=Buffer.from(String(b.password||'')),p=Buffer.from(PASSWORD);if(g.length!==p.length||!crypto.timingSafeEqual(g,p)){a.n++;attempts.set(ip,a);return reply(res,401,{error:'Senha incorreta'});}
  attempts.delete(ip);const t=crypto.randomBytes(32).toString('hex');sessions.set(t,{exp:Date.now()+12*3600*1000,csrf:crypto.randomBytes(32).toString('hex')});return reply(res,200,{ok:true},{'Set-Cookie':cookie(t,43200)});
 }
 if(req.method==='POST'&&pathname==='/api/admin/logout'){const s=session(req);if(s)sessions.delete(s.token);return reply(res,200,{ok:true},{'Set-Cookie':cookie('',0)});}
 if(req.method==='GET'&&pathname==='/api/admin/state'){const s=session(req);if(!s)return reply(res,401,{error:'Faça login'});return reply(res,200,{...(await load()),csrf:s.csrf});}
 if(req.method==='POST'&&pathname==='/api/admin/save'){const s=session(req);if(!s)return reply(res,401,{error:'Acesso não autorizado'});if(req.headers['x-csrf-token']!==s.csrf)return reply(res,403,{error:'Verificação de segurança inválida'});const data=await body(req);const err=validate(data);if(err)return reply(res,400,{error:err});await pool.query('UPDATE catalog_state SET state=$1::jsonb,updated_at=NOW() WHERE id=1',[JSON.stringify(data)]);return reply(res,200,{ok:true,methodCount:data.catalog.length});}
 if(req.method==='GET'&&pathname==='/') {res.writeHead(302,{Location:'/admin'});return res.end();}
 res.writeHead(404);res.end('Página não encontrada');
 }catch(e){console.error('Server error:',e.message);reply(res,500,{error:'Não foi possível concluir agora. Tente novamente.'});}
}).listen(PORT,'0.0.0.0',()=>console.log('Painel iniciado na porta '+PORT));
init().catch(e=>console.error('Banco indisponível na inicialização:',e.message));
