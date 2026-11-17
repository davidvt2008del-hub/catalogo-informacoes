/* Circle: Minha Temporada — jogo de simulação social individual */
(function(){
'use strict';
const KEY='circle-solo-v3';
const $=id=>document.getElementById(id);
const E=s=>String(s===undefined||s===null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\w\s]/g,' ').replace(/\s+/g,' ').trim();
const people=[
{id:'lia',name:'Lia',age:26,city:'Recife',job:'Bartender',bio:'Intensa, bem-humorada e sem paciência pra falsidade. Amo praia e gente de verdade.',cls:'a',initial:'L',style:'direta',trueSelf:true,secret:'Lia é mesmo uma bartender de Recife.',traits:{social:87,trust:54,game:49,lie:14},likes:['sinceridade','humor','amizade'],avoids:['mentira','fofoca'],opening:['Oiiii! Finalmente alguém pra conversar sem ficar olhando pra parede kkkkk','E aíí, como vc tá se sentindo nesse Circle?']},
{id:'rafa',name:'Rafael',age:29,city:'Rio de Janeiro',job:'Personal trainer',bio:'Treino, praia, família e muito papo. Vim pelo desafio!',cls:'b',initial:'R',style:'encantador',trueSelf:false,secret:'Rafael é, na verdade, Júlia, 25 anos, social media. Criou o perfil de personal trainer para parecer mais popular.',traits:{social:83,trust:45,game:90,lie:88},likes:['disciplina','confiança','energia'],avoids:['suspeita','exposição'],opening:['Salveeee! Papo bom por aqui já vale metade do jogo haha','E aí, tudo em paz? Tô tentando sentir a energia dessa galera.']},
{id:'bia',name:'Bia',age:23,city:'São Paulo',job:'Estudante de nutrição',bio:'Falo demais, choro assistindo filme e faço amizade em cinco minutos.',cls:'c',initial:'B',style:'fofa',trueSelf:true,secret:'Bia é uma estudante de nutrição de São Paulo, como diz seu perfil.',traits:{social:92,trust:82,game:38,lie:10},likes:['amizade','cuidado','fofoca'],avoids:['conflito','briga'],opening:['OIEEEEE! Eu tava doida pra alguém me chamar kkkkk','Socorrooo, finalmente uma conversa privada! Tá tudo bem?']},
{id:'dani',name:'Dani',age:32,city:'Belo Horizonte',job:'Designer',bio:'Observadora, criativa e um pouquinho competitiva. Eu noto os detalhes.',cls:'d',initial:'D',style:'analitica',trueSelf:true,secret:'Dani é designer e joga com identidade verdadeira.',traits:{social:56,trust:50,game:94,lie:45},likes:['coerência','estratégia','respeito'],avoids:['contradição','impulsividade'],opening:['Oi. Eu estava esperando pra entender melhor as pessoas daqui.','Que bom que chamou. As primeiras conversas dizem muita coisa, né?']},
{id:'leo',name:'Léo',age:27,city:'Curitiba',job:'Professor de história',bio:'Gosto de livros, café, cinema e de saber a história de todo mundo.',cls:'e',initial:'L',style:'ponderado',trueSelf:false,secret:'Léo é, na verdade, Davi, 31 anos, publicitário de Florianópolis. Escolheu um perfil de professor para transmitir confiança.',traits:{social:61,trust:49,game:81,lie:79},likes:['livros','história','respeito'],avoids:['pressa','interrogatório'],opening:['Opa, tudo bem? Esse experimento social é curioso demais.','Que interessante vc me chamar. Como está sendo a experiência até agora?']},
{id:'manu',name:'Manu',age:26,city:'Salvador',job:'Empreendedora',bio:'Minha energia é lá em cima, mas não confunde sorriso com ingenuidade.',cls:'f',initial:'M',style:'provocadora',trueSelf:true,secret:'Manu é empreendedora em Salvador, sem identidade falsa.',traits:{social:79,trust:52,game:76,lie:29},likes:['ousadia','humor','lealdade'],avoids:['falsidade','vitimismo'],opening:['MEU AMOR, CHEGUEI! kkkkk tava precisando de fofoca','Opa! Já veio com informação quente ou só saudade? haha']},
{id:'gui',name:'Gui',age:24,city:'Fortaleza',job:'Músico',bio:'Meu violão é meu melhor amigo. Sou mais coração do que razão.',cls:'g',initial:'G',style:'descontraido',trueSelf:true,secret:'Gui é músico de Fortaleza, como afirma seu perfil.',traits:{social:75,trust:76,game:31,lie:11},likes:['música','amizade','arte'],avoids:['disputa','agressividade'],opening:['Eita, conversa chegando! Vamo trocar ideia haha','Aí sim! Me conta como tá a experiência nesse lugar maluco?']}
];
const CHALLENGES=[
{title:'Quem é de qual signo?',desc:'Os participantes dão palpites sobre signos. O Circle revela o signo do alvo escolhido.',type:'zodiac'},
{title:'Pesquisa de Opinião',desc:'Todos escolhem o mais confiável e um possível catfish. Votos anônimos, resultados públicos.',type:'poll'},
{title:'Jogo da Verdade',desc:'Cada participante compartilha uma verdade pessoal e os outros podem reagir.',type:'truth'},
{title:'Mentes Brilhantes',desc:'Três perguntas, todos jogam e o Circle revela o placar com o gabarito.',type:'quiz'},
{title:'Pintando Verdades',desc:'Desenhe outro perfil com o dedo. Os demais jogadores também apresentam suas interpretações.',type:'painting'},
{title:'Meu Maior Rival',desc:'Cada pessoa aponta seu maior rival. O Circle revela quem foi mais citado.',type:'rival'},
{title:'A Última Bomba',desc:'Perguntas anônimas direcionadas. Cada participante recebe a chance de responder.',type:'bomb'},
{title:'Segue o Baile',desc:'Escolha um ritmo para alguém e veja as escolhas da casa, sem aparelho de dança.',type:'dance'},
{title:'Festa do Circle',desc:'Escolha seu look e uma música. O Circle revela as ideias de todo mundo e os destaques.',type:'party'},
{title:'Quem disse isso?',desc:'Três depoimentos anônimos: descubra quem escreveu cada um e confira o gabarito.',type:'quote'},
{title:'Confissões',desc:'Todos enviam confissões anônimas para provocar uma conversa no grupo.',type:'confession'},
{title:'Compatibilidade',desc:'Todos escolhem uma dupla; o Circle protege dois participantes no próximo bloqueio.',type:'ally'}
];
let game=null,view='inicio',chat='grupo',draft='',listening=false,recognition=null,typingIds={},busy=false,toastTimer=null,painting=false,painted=false,openedDynamic=null;
function rand(){game.seed=(Math.imul(1664525,game.seed)+1013904223)>>>0;return game.seed/4294967296;}
function pick(a){return a[Math.floor(rand()*a.length)];}
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rand()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function n(id){return game.bots[id];}
function alive(){return ['user'].concat(people.map(p=>p.id)).filter(id=>!game.blocked.includes(id));}
function pFor(id){return id==='user'?{id:'user',name:game.player.alias,cls:'me',initial:(game.player.alias||'V')[0],bio:game.player.bio,job:game.player.job,age:game.player.age,city:game.player.city}:people.find(p=>p.id===id);}
function humanDate(t){return new Intl.DateTimeFormat('pt-BR',{timeZone:'America/Sao_Paulo',dateStyle:'short',timeStyle:'short'}).format(new Date(t));}
function nowSP(){const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',weekday:'short',hour:'2-digit',hourCycle:'h23',minute:'2-digit',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));return {weekday:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday),hour:+parts.hour,minute:+parts.minute,date:[parts.year,parts.month,parts.day].join('-')};}
function toast(s){let el=$('toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),3200);}
function log(text,type){game.events.unshift({id:Date.now()+'-'+Math.floor(rand()*1000),text,type:type||'info',date:Date.now(),day:game.day,week:game.week});if(game.events.length>150)game.events.length=150;}
function message(room,by,text){if(!game.chats[room])game.chats[room]=[];game.chats[room].push({by,text:String(text).slice(0,1200),at:Date.now(),day:game.day,week:game.week});if(game.chats[room].length>190)game.chats[room].shift();if(by!=='user'&&chat!==room)game.unread[room]=(game.unread[room]||0)+1;}
function save(){try{localStorage.setItem(KEY,JSON.stringify(game));return true;}catch(e){toast('Espaço do navegador cheio. Faça backup no menu Ajustes.');return false;}}
function valid(g){return g&&g.version===1&&g.player&&typeof g.player.alias==='string'&&g.bots&&g.chats&&g.stage&&Array.isArray(g.blocked)&&Array.isArray(g.events);}
function start(alias,age,city,bio,mode,job){game={version:1,seed:(Date.now()>>>0)||777,player:{alias:alias.slice(0,26),age:age.slice(0,2),city:city.slice(0,38),job:job.slice(0,40),bio:bio.slice(0,190)},mode:mode==='real'?'real':'livre',created:Date.now(),week:1,day:0,stage:'social',blocked:[],chats:{grupo:[]},events:[],bots:{},unread:{},tasks:{},ballots:[],rankings:[],influencers:[],vote:[],proposed:'',pendingBlock:'',lastRealDay:'',lastRealSunday:'',lastRoundDate:'',winner:'',gameOver:false,dynamics:{},questionSets:{},immunity:null};
people.forEach(p=>{game.chats[p.id]=[];game.bots[p.id]={trust:Math.round((p.traits.trust-45)*.45+(rand()-.5)*35),suspicion:Math.round(rand()*25),said:[],other:{},memory:[],contacts:0,open:0};people.forEach(x=>{if(x.id!==p.id)game.bots[p.id].other[x.id]=Math.round((rand()-.5)*52);});});
message('grupo','circle','ALERTA! Bem-vindos ao Circle! Seus perfis estão liberados. Os chats já estão abertos. Boa sorte!');
log('A temporada começou! Vc entrou com o perfil '+game.player.alias+'.','start');
log('Entre nos chats e conheça os participantes. O primeiro bloqueio acontece no domingo.','alert');
save();view='inicio';render();if(window.CircleAI?.signedIn()){game.aiIntro=true;save();initiative();}
}
function blocked(id){return game.blocked.includes(id);}
function updateTrust(id,d,source){let b=n(id);b.trust=Math.max(-100,Math.min(100,b.trust+d));if(source)b.memory.unshift(source.slice(0,140));b.memory=b.memory.slice(0,12);}
function mentioned(text){const a=normalize(text);return people.find(p=>a.includes(normalize(p.name)))||null;}
function discoverTone(text){const s=normalize(text);return {
greet:/\boi\b|ola|opa|e ai|bom dia|boa noite|tudo bem/.test(s),
trust:/confio|confianca|amizade|alianca|fechar comigo|junto|parceria|leal/.test(s),
sus:/catfish|falso|fake|mentira|mentindo|desconfio|suspeito/.test(s),
vote:/voto|votar|ranking|avaliacao|classificacao|influenciador|eliminacao|bloqueio/.test(s),
ask:/\bquem\b|\bcomo\b|\bqual\b|\bpor que\b|\bvoce\b|vc|teu|tua|\?/.test(s),
work:/trabalha|profissao|emprego|trampo|trabalhando/.test(s),
where:/mora|cidade|onde|recife|curitiba|salvador|fortaleza/.test(s),
age:/idade|anos|quantos/.test(s),
angry:/ridiculo|odio|burro|idiota|otario|mentiroso|calado|falso pra mim/.test(s),
nice:/gosto|amo|adoro|querido|fof|legal|amei|incrivel|lindo/.test(s),
game:/jogo|estrategia|jogar|ganhar|vencer|final/.test(s),
truth:/verdade|sincero|serio|real/.test(s),
music:/musica|canto|cantor|banda|som|violao/.test(s),
family:/familia|mae|pai|irmao|casa/.test(s),
other:mentioned(text)
};}
function fresh(id,responses){let b=n(id);let avail=responses.filter(s=>!b.said.slice(-7).includes(s));let answer=pick(avail.length?avail:responses);b.said.push(answer);if(b.said.length>30)b.said.shift();return answer;}


const replyPending=new Set();
function npcSay(room,id,text){
 if(!game||game.gameOver||blocked(id))return;
 message(room,id,text);
 save();
 if(view==='chats')render();
}
function npcReply(room,id,objective,lastUserMessage,delay=2200){
 if(!game||game.gameOver||blocked(id)||!window.CircleAI?.signedIn())return;
 const key=room+'/'+id;
 if(replyPending.has(key))return;
 replyPending.add(key);
 const session=game;
 const jitter=Math.floor(rand()*3400);
 typingIds[id]=true;
 setTimeout(async()=>{
  try{
   if(game!==session||game.gameOver||blocked(id))return;
   const actual=game.chats[room]||[];
   const last=lastUserMessage==='@circle'?'':actual.filter(x=>x.by==='user').at(-1)?.text||lastUserMessage||'';
   const answer=await CircleAI.reply({actor:pFor(id),room,game,people,lastUserMessage:last,objective});
   if(game!==session||game.gameOver||blocked(id))return;
   npcSay(room,id,answer);
  }catch(err){
   console.warn('NPC AI error',err);
   if(game===session)toast('A IA não conseguiu responder agora. Verifique sua conta ou seus créditos e tente novamente.');
  }finally{
   replyPending.delete(key);
   delete typingIds[id];
   if(game===session&&view==='chats')render();
  }
 },delay+jitter);
}
function send(){
 if(game.gameOver||blocked('user'))return toast('A sua participação no Circle terminou.');
 if(!window.CircleAI?.signedIn())return toast('Conecte a IA primeiro para conversar com pessoas que respondem de verdade.');
 let text=(draft||$('composer')?.value||'').trim().slice(0,1200);
 text=text.replace(/^(circle[\s,.:]*)?(escreve a[ií]|escreva a[ií]|escreve|digita)[\s,.:]*/i,'').replace(/[,.; ]*circle[\s,.:]*enviar[.! ]*$/i,'').trim();
 if(!text)return toast('Escreva uma mensagem primeiro.');
 const dest=chat;
 draft='';
 message(dest,'user',text);
 let receivers=dest==='grupo'?shuffle(people.filter(p=>!blocked(p.id))).slice(0,1+(rand()<.27?1:0)):people.filter(p=>p.id===dest&&!blocked(p.id));
 const tone=discoverTone(text);
 for(const p of receivers){
  if(tone.angry)updateTrust(p.id,-14,'Uma mensagem ríspida.');
  else if(tone.nice)updateTrust(p.id,3,'Uma conversa simpática.');
  else if(tone.trust)updateTrust(p.id,2,'Mostrou interesse em se aproximar.');
  else updateTrust(p.id,1,'Conversa normal.');
  const objective=dest==='grupo'?
    'Você leu uma mensagem de '+game.player.alias+' no grupo. Só responda se tiver uma reação genuína ao tema. Não mude de assunto. É uma conversa casual, no primeiro dia não fale de jogo nem estratégia espontaneamente.':
    'Responda diretamente à última mensagem de '+game.player.alias+' na conversa privada de forma espontânea, coerente e humana. Não dê resposta genérica.';
  npcReply(dest,p.id,objective,text,2200+Math.floor(rand()*2700));
 }
 save();
 render();
}
function initiative(){
 if(!game||game.gameOver||!window.CircleAI?.signedIn())return;
 const available=people.filter(p=>!blocked(p.id));
 if(!available.length)return;
 const actor=pick(available);
 const objective=(game.week===1&&currentDay()===0)?
  'É o primeiro dia. Entre no grupo de forma espontânea com uma apresentação breve ou detalhe engraçado da sua rotina. Não pergunte quem é catfish, não fale de ranking nem de competição.':
  'Escreva uma mensagem espontânea no grupo baseada em sua personalidade e nas conversas anteriores. Pode comentar rotina, música, um acontecimento da dinâmica do dia ou fazer uma observação engraçada. Só fale de estratégias se as pessoas já estão discutindo isso. Não seja genérico nem saia interrogando.';
 npcReply('grupo',actor,objective,'',3200);
}
async function connectAI(){
 if(!window.CircleAI)return toast('A integração de IA não carregou. Atualize a página com internet.');
 try{
  await CircleAI.connect();
  toast('IA conectada! Agora os personagens podem conversar de verdade.');
  if(game&&!game.aiIntro&&game.stage==='social'){
   game.aiIntro=true;save();
   initiative();
  }
  render();
 }catch(err){
  console.warn('AI login',err);
  toast(err?.message||'Não foi possível conectar a IA.');
 }
}

function dueTask(){if(game.stage!=='social')return null;const d=game.mode==='real'?nowSP().weekday===0?6:(nowSP().weekday+6)%7:game.day;if(d===2||d===5||d===6)return null;const idx=(game.week-1)*4+[0,1,0,2,3,0,0][d];const c=CHALLENGES[idx%CHALLENGES.length];const key=game.week+'-'+d;return {key,...c};}
function nextDay(){if(game.mode!=='livre'||game.stage!=='social')return;if(game.day>=6)return;const current=dueTask();if(current){const state=dynState(current);if(!state||state.stage!=='complete')return toast('Antes de avançar, participe da dinâmica de hoje, veja o resultado e conclua o evento.');}game.day++;openedDynamic=null;if(game.day===2)log('Quarta-feira: dia livre de desenvolvimento. Nenhuma prova obrigatória.','pause');else if(game.day===5)log('Sábado: dia livre de gira. Nenhuma prova obrigatória.','pause');else if(game.day===6){game.stage='vote';log('ALERTA! Domingo, 18h: as avaliações estão abertas.','alert');message('grupo','circle','ALERTA! São 18h do domingo. É hora de classificar seus colegas do Circle.');}else{initiative();log('Um novo dia começou. A dinâmica está disponível na aba Jogos.','game');}save();render();}
function checkReal(){if(!game||game.mode!=='real'||game.gameOver||game.stage!=='social')return;const t=nowSP();const k=t.date;if(game.lastRealDay!==k){game.lastRealDay=k;if(t.weekday!==3&&t.weekday!==6){initiative();}save();}if(t.weekday===0&&t.hour>=18&&game.lastRealSunday!==k){game.stage='vote';game.lastRealSunday=k;log('São 18h de domingo! As avaliações estão abertas.','alert');message('grupo','circle','ALERTA! Avaliações de domingo liberadas às 18h.');save();render();}}
function allBotBallots(){const ids=alive();const result={};for(const p of people.filter(p=>!blocked(p.id))){const b=n(p.id);let choices=ids.filter(id=>id!==p.id);const score=id=>{let rel=id==='user'?b.trust:(b.other[id]||0);let target=id==='user'?{traits:{game:53,trust:55}}:pFor(id);let untrust=0;return rel*.72+(100-p.traits.game)*.12*(rel>0?1:-1)+rand()*45+(target.traits?.social||60)*.08-untrust;};const scored=choices.map(id=>({id,points:score(id)}));scored.sort((x,y)=>y.points-x.points);result[p.id]=scored.map(x=>x.id);}return result;}
function voteSubmit(){if(game.stage!=='vote')return;let order=Array.from(document.querySelectorAll('[data-rank-id]')).map(x=>x.dataset.rankId);if(order.length!==alive().length-1||new Set(order).size!==order.length)return toast('Complete seu ranking antes de enviar.');game.vote=order;const all=allBotBallots();all.user=order;game.ballots.push({week:game.week,all});let scores={};for(const voter of Object.keys(all)){all[voter].forEach((id,i)=>{if(!scores[id])scores[id]={points:0,count:0};scores[id].points+=(all[voter].length-i);scores[id].count++;});}const ranking=alive().map(id=>({id,score:scores[id]?scores[id].points/scores[id].count:0})).sort((a,b)=>b.score-a.score||((a.id>b.id)?1:-1));game.rankings.push({week:game.week,ranking});game.influencers=ranking.slice(0,2).map(x=>x.id);game.stage=game.week===4?'final':'influencers';log('Todas as avaliações foram calculadas. O resultado está guardado.','vote');message('grupo','circle','As avaliações foram encerradas. Os influenciadores serão anunciados às 20h.');save();view='avaliacoes';render();}
function revealInfluencers(){if(game.stage!=='influencers')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<20)return toast('A revelação acontece a partir das 20h.');game.stage='block';log('20h — Influenciadores da semana: '+game.influencers.map(id=>pFor(id).name).join(' e ')+'.','alert');message('grupo','circle','ALERTA! Os influenciadores da semana são '+game.influencers.map(id=>pFor(id).name).join(' e ')+'. A Sala Azul foi aberta.');save();render();}
function possibleTargets(){const protectedIds=game.immunity?.week===game.week?(game.immunity.ids||[]):[];const avail=alive().filter(id=>!game.influencers.includes(id));const targetable=avail.filter(id=>!protectedIds.includes(id));return targetable.length?targetable:avail;}
function botTarget(influencer){const candidates=possibleTargets();const bot=n(influencer);return candidates.map(id=>({id,score:(id==='user'?bot.trust:(bot.other[id]||0))-(id==='user'?bot.suspicion*.3:0)+(rand()-.5)*28})).sort((a,b)=>a.score-b.score)[0]?.id;}
function executeBlock(){if(game.stage!=='block')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<21)return toast('O bloqueio acontece a partir das 21h.');const targets=possibleTargets();if(!targets.length)return;let chosen=game.pendingBlock&&targets.includes(game.pendingBlock)?game.pendingBlock:null;const inf=game.influencers;
if(inf.includes('user')){const rival=inf.find(id=>id!=='user');const their=botTarget(rival);if(!chosen)return toast('Como influenciador, escolha quem você quer bloquear.');if(chosen!==their&&rand()<.32)chosen=their;}else{const picks=inf.map(botTarget);chosen=picks[0]===picks[1]?picks[0]:(rand()<.5?picks[0]:picks[1]);}
game.blocked.push(chosen);const p=pFor(chosen);log('21h — '+p.name+' foi bloqueado do Circle!','block');message('grupo','circle','ALERTA! '+p.name+' foi bloqueado. Está fora da disputa.');game.lastBlocked=chosen;game.stage=chosen==='user'?'eliminated':'post';if(chosen==='user'){game.gameOver=true;log('Você foi bloqueado. Sua temporada acabou.','end');}else{const identity=p.trueSelf?'Perfil verdadeiro.':p.secret;log('Revelação de '+p.name+': '+identity,'reveal');}
save();view='resultado';render();}
function nextWeek(){if(game.stage!=='post')return;game.week++;game.day=0;game.stage='social';game.vote=[];game.pendingBlock='';game.influencers=[];game.immunity=null;game.lastRealSunday=game.mode==='real'&&nowSP().weekday===0?nowSP().date:'';if(game.mode==='real'&&nowSP().weekday!==1)game.lastRealDay=nowSP().date;log('Semana '+game.week+' começou. Uma nova rodada de jogos e estratégias!','start');initiative();save();view='inicio';render();}
function finish(){if(game.stage!=='final')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<21)return toast('O resultado final sai a partir das 21h.');game.winner=game.rankings.at(-1).ranking[0].id;game.gameOver=true;game.stage='done';log('A temporada chegou ao fim. Vencedor: '+pFor(game.winner).name+'.','end');save();view='resultado';render();}

function dynState(c){return c?(game.dynamics||{})[c.key]||null:null;}
function taskChoice(id){const v=$(id)?.value||'';return String(v).trim();}
function dynamicCurrent(){return dueTask();}
function collectDynamicInput(c){
 const response={};
 if(['zodiac','painting','rival','dance','ally','bomb'].includes(c.type)){
  response.target=taskChoice('dyn-target');
  if(!response.target||!alive().includes(response.target))return {error:'Escolha uma pessoa que ainda está no Circle.'};
 }
 if(c.type==='zodiac'){response.sign=taskChoice('dyn-sign');if(!CircleDynamics.signs.includes(response.sign))return {error:'Escolha o signo que vc acha que combina com essa pessoa.'};}
 if(c.type==='poll'){response.trusted=taskChoice('trustchoice');response.suspect=taskChoice('suschoice');if(!response.trusted||!response.suspect||response.trusted===response.suspect||!alive().includes(response.trusted)||!alive().includes(response.suspect))return {error:'Escolha dois participantes diferentes.'};}
 if(c.type==='quiz'){response.answers=CircleDynamics.quiz.map((q,i)=>document.querySelector('input[name="q'+i+'"]:checked')?.value);if(response.answers.some(x=>x===undefined))return {error:'Responda às três perguntas.'};}
 if(c.type==='quote'){const cards=CircleDynamics.context(game,people,c,rand)||[];response.guesses=cards.map((q,i)=>taskChoice('quote'+i));if(response.guesses.length!==3||response.guesses.some((x,i)=>!cards[i].options.includes(x)))return {error:'Escolha o autor das três frases.'};}
 if(c.type==='dance'){response.style=taskChoice('dyn-style');if(!CircleDynamics.styles.includes(response.style))return {error:'Escolha um estilo musical.'};}
 if(c.type==='party'){response.song=taskChoice('dyn-song');if(!response.song)return {error:'Escolha uma música para sua festa.'};}
 if(c.type==='painting'&&!painted)return {error:'Faça seu desenho com o dedo antes de enviar.'};
 response.text=taskChoice('taskanswer');
 if(['truth','bomb','confession','party'].includes(c.type)&&response.text.length<5)return {error:'Escreva uma resposta para a dinâmica.'};
 if(c.type==='bomb'&&!/[?？]/.test(response.text))return {error:'Escreva uma pergunta terminada em ?'};
 if(c.type==='painting'){
  const canvas=$('paintboard');try{response.image=canvas.toDataURL('image/jpeg',.52);}catch(e){return {error:'Não foi possível guardar o desenho.'};}
 }
 return response;
}
function taskSubmit(){
 const c=dynamicCurrent();if(!c||game.stage!=='social')return toast('Não há dinâmica aberta agora.');
 if(dynState(c))return toast('Sua participação nesta dinâmica já foi registrada.');
 if(!window.CircleDynamics)return toast('O motor da prova não carregou. Atualize a página.');
 const data=collectDynamicInput(c);if(data.error)return toast(data.error);
 const outcome=CircleDynamics.resolved(game,people,c,data,rand);
 if(!game.dynamics)game.dynamics={};
 game.dynamics[c.key]=outcome;
 game.tasks[c.key]={answer:data.text||data.sign||data.style||data.trusted||'Respostas enviadas',title:c.title,at:Date.now(),image:data.image||''};
 log('Todos estão participando de "'+c.title+'". Aguarde a apuração.','game');
 painted=false;save();render();toast('Sua resposta foi enviada. O Circle vai reunir as outras participações.');
}
function revealDynamic(key){
 const d=(game.dynamics||{})[key];if(!d||d.stage!=='collecting')return;
 if(Date.now()<d.releaseAt)return toast('O Circle ainda está reunindo as respostas.');
 d.stage='results';d.resultRead=true;
 message('grupo','circle','ALERTA! Resultado de '+d.title+': '+d.summary+' '+d.stake);
 log('Resultado divulgado: '+d.headline,'reveal');
 save();render();
}

function reactDynamic(key){
 const d=(game.dynamics||{})[key];if(!d||d.stage!=='results')return;
 d.stage='discussion';d.reacted=true;
 const liveBots=people.filter(p=>!blocked(p.id));
 const wanted=[];
 if(d.kind==='poll'){
  const poll=d.meta?.poll;const ids=[poll?.suspected?.[0]?.id,poll?.trusted?.[0]?.id];
  ids.filter(id=>id&&id!=='user'&&!blocked(id)).forEach(id=>wanted.push(id));
 }else if(d.kind==='rival'){
  const top=d.sections.find(s=>s.type==='bars')?.rows?.[0]?.id;if(top&&top!=='user'&&!blocked(top))wanted.push(top);
 }else if(d.kind==='bomb'){
  const questions=d.meta?.questions||[];
  const chosen=questions.filter(q=>q.target&&q.target!=='user'&&!blocked(q.target));
  const distinct=[...new Set(chosen.map(q=>q.target))];
  distinct.slice(0,2).forEach(id=>wanted.push(id));
  const first=chosen.find(q=>q.target===wanted[0]);
  if(first){
   message('grupo','circle','Uma pergunta anônima para '+pFor(wanted[0]).name+': "'+first.text+'"');
  }
 }else if(d.kind==='painting'){
  const userEntry=d.entries.find(e=>e.by==='user');
  if(userEntry?.target&&userEntry.target!=='user'&&!blocked(userEntry.target))wanted.push(userEntry.target);
 }
 while(wanted.length<Math.min(2,liveBots.length)){
  const available=liveBots.filter(p=>!wanted.includes(p.id));
  if(!available.length)break;wanted.push(pick(available).id);
 }
 if(window.CircleAI?.signedIn()&&wanted.length){
  for(const id of wanted){
   let objective='A dinâmica '+d.title+' acabou. O Circle anunciou o resultado: '+d.summary+' Reaja especificamente a isso no grupo. Não repita o anúncio nem fale genericamente sobre o jogo. Faça um comentário condizente com seus sentimentos e com quem você já conhece.';
   if(d.kind==='bomb'){
    const question=d.meta?.questions?.find(q=>q.target===id);
    if(question)objective='Uma pergunta anônima foi direcionada a vc, '+pFor(id).name+': "'+question.text+'". Responda A ESSA PERGUNTA no grupo de maneira direta e humana. Vc pode ficar desconfortável, mas não fuja para frases genéricas. Não diga quem perguntou, pq não sabe.';
   }
   if(d.kind==='poll'){
    const p=d.meta?.poll;const suspect=p?.suspected?.[0]?.id===id;
    const trusted=p?.trusted?.[0]?.id===id;
    if(suspect)objective+=' Vc recebeu o maior número de suspeitas de ser catfish. Vc pode ficar incomodado e defender seu perfil sem revelar identidade secreta.';
    if(trusted)objective+=' Vc ficou em primeiro entre os mais confiáveis. Reaja de forma natural, sem arrogância obrigatória.';
   }
   npcReply('grupo',id,objective,'@circle',3000+Math.floor(rand()*2000));
  }
 }
 log('Reações abertas no chat geral.','social');
 save();render();
}
function answerBomb(key,skip=false){
 const d=(game.dynamics||{})[key];if(!d||d.kind!=='bomb'||!['discussion','results'].includes(d.stage))return;
 const q=d.meta?.questions?.filter(x=>x.target==='user')||[];
 if(!q.length)return toast('Nenhuma pergunta foi dirigida ao seu perfil.');
 if(d.answeredUser)return toast('Vc já respondeu essa rodada.');
 const answer=skip?'Prefiro não responder essa pergunta agora.':taskChoice('dyn-answer');
 if(!skip&&answer.length<3)return toast('Escreva sua resposta ou escolha não responder.');
 d.answeredUser=answer.slice(0,500);
 message('grupo','user',d.answeredUser);
 log(skip?'Vc optou por não responder à bomba anônima.':'Vc respondeu a uma pergunta anônima.','game');
 save();render();toast('Sua resposta apareceu no chat geral.');
}
function finishDynamic(key){
 const d=(game.dynamics||{})[key];if(!d||!['results','discussion'].includes(d.stage))return;
 if(d.stage==='results')reactDynamic(key);
 if(d.kind==='bomb'&&d.meta?.questions?.some(q=>q.target==='user')&&!d.answeredUser)return toast('Antes de concluir, responda à pergunta anônima dirigida a vc ou escolha não responder.');
 d.stage='complete';d.completedAt=Date.now();openedDynamic=null;
 log('Dinâmica concluída: '+d.title+'. As decisões da casa foram registradas.','game');
 save();render();toast('Dinâmica concluída! Vc já pode seguir para o próximo dia.');
}
function refreshReaction(title){return pick(['Essa dinâmica mostrou muita coisa sobre as pessoas 👀','Genteee, eu tô amando como esse jogo muda a cada prova kkk','Acho que vou ter que repensar minhas alianças depois dessa.','Quem vê de fora não imagina a tensão que dá isso aqui!','Muita informação pra processar, viu? kkkkk']);}
function av(id,sz){const p=pFor(id);if(id!=='user'&&id!=='grupo'){return '<div class="avatar npcphoto portrait-'+E(id)+'" role="img" aria-label="Retrato fictício de '+E(p.name)+'"></div>';}return '<div class="avatar '+E(p.cls)+'"'+(id==='user'&&game.player.photo?' style="background-image:url('+E(game.player.photo)+')" aria-label="Sua foto de perfil"':'')+'>'+E(p.initial||'?')+'</div>';}
function eventList(count){return game.events.slice(0,count).map(e=>'<div class="event"><time>SEMANA '+e.week+' · '+humanDate(e.date)+'</time><p>'+E(e.text)+'</p></div>').join('');}
function title(s,help){return '<div class="sectionTitle"><h2>'+E(s)+'</h2>'+(help?'<small>'+E(help)+'</small>':'')+'</div>';}
function actions(){return '<div class="row"><button class="btn secondary sm" data-act="nav" data-to="chats">💬 Abrir chats</button><button class="btn secondary sm" data-act="nav" data-to="jogos">🎯 Ver dinâmicas</button></div>';}
function dayName(i){return ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'][i];}
function currentDay(){return game.mode==='livre'?game.day:((nowSP().weekday+6)%7);}
function welcome(){return '<div class="welcomeWrap"><div class="welcome"><div class="welcomeInfo"><div class="logo"></div><div class="eyebrow" style="margin-top:22px">EXPERIÊNCIA DE FÃ · NÃO OFICIAL</div><h1>Seu perfil.<br>Sua estratégia.<br>Seu Circle.</h1><p>Sete participantes virtuais. Alguns perfis são catfish. Faça amizades, forme alianças, desconfie e tente chegar à final. Você pode ser bloqueado.</p><div class="row" style="margin-top:25px"><span class="pill">🎙️ Comandos de voz</span><span class="pill">🕵️ Perfis misteriosos</span><span class="pill">🏆 Classificações</span></div></div><div class="welcomeForm"><h2>Crie seu perfil</h2><p class="muted">Os outros jogadores vão conhecer só o que vc colocar aqui.</p><label class="label" for="name">Nome no Circle</label><input class="field" id="name" maxlength="26" placeholder="Ex.: Miguel"><div class="row"><div style="flex:1"><label class="label" for="age">Idade</label><input class="field" id="age" inputmode="numeric" maxlength="2" placeholder="18"></div><div style="flex:2"><label class="label" for="city">Cidade</label><input class="field" id="city" maxlength="38" placeholder="Sua cidade"></div></div><label class="label" for="job">Profissão ou ocupação</label><input class="field" id="job" maxlength="40" placeholder="Ex.: Cartomante"><label class="label" for="bio">Sua bio</label><textarea class="field" id="bio" maxlength="190" placeholder="Como vc quer se apresentar aos jogadores?"></textarea><label class="label" for="mode">Ritmo da temporada</label><select class="field" id="mode"><option value="livre">Jogar agora · avançar os dias manualmente</option><option value="real">Calendário real · eliminações aos domingos</option></select><p class="note">Nos dois modos, quarta é livre para desenvolvimento e sábado para gira. As avaliações são no domingo, 18h; influenciadores às 20h; bloqueio às 21h. No ritmo livre, vc avança esses horários ao seu tempo.</p><div class="note" style="margin-top:13px">As conversas agora são criadas por IA com personalidade e memória, não respostas de lista. Na primeira conversa será necessário conectar uma conta Puter; há uma franquia gratuita, e custos adicionais só se vc escolher mais créditos.</div><button class="btn" style="width:100%;margin-top:13px" data-act="start">ENTRAR NO CIRCLE</button></div></div></div>';}
function side(){const links=[['inicio','⌂','Início'],['chats','💬','Chats'],['jogos','🎯','Jogos'],['avaliacoes','🏆','Avaliações'],['jogadores','👥','Jogadores'],['calendario','🗓','Agenda'],['ajustes','⚙','Ajustes']];return '<aside class="sidebar"><div class="brand"><div class="logo"></div><div><strong>CIRCLE</strong><small>MINHA TEMPORADA</small></div></div><nav class="nav" aria-label="Navegação">'+links.map(x=>'<button class="'+(view===x[0]?'active':'')+'" data-act="nav" data-to="'+x[0]+'"><i>'+x[1]+'</i><span>'+x[2]+'</span></button>').join('')+'</nav><div class="sidefoot"><strong>🎤 Circle, escreve aí...</strong>Toque no microfone do chat para falar. Também funciona digitando normalmente.<div style="margin-top:8px;color:#e4b1db">Fan game independente, sem vínculo com a Netflix.</div></div></aside>';}
function shell(content){return '<div class="shell">'+side()+'<div class="main"><header class="topbar"><div><div class="eyebrow">CIRCLE · TEMPORADA '+E(game.week)+'</div><h1>'+E(({inicio:'Seu apartamento',chats:'Circle Chat',jogos:'Jogos & dinâmicas',avaliacoes:'Classificações',jogadores:'Participantes',calendario:'Agenda semanal',ajustes:'Meu Circle',resultado:'Alerta do Circle'})[view]||'Circle')+'</h1></div><div class="righttop"><span class="counter">SEMANA <b>'+game.week+'/4</b> · '+alive().length+' NO JOGO</span><button class="btn sm" data-act="nav" data-to="chats">💬 Chats</button></div></header><div class="content">'+content+'</div></div></div>';}
function home(){let content='';if(game.gameOver)content='<div class="hero"><span class="pill">RESULTADO FINAL</span><h2>Sua temporada terminou!</h2><p>Veja quem venceu e descubra os catfish.</p><button class="btn" data-act="nav" data-to="resultado">Ver resultado</button></div>';
else content='<div class="hero"><span class="pill">'+(game.mode==='livre'?'RITMO LIVRE':'CALENDÁRIO REAL')+' · '+dayName(currentDay()).toUpperCase()+'</span><h2>Bem-vindo ao seu apartamento, '+E(game.player.alias)+'!</h2><p>Do outro lado da tela, sete jogadores com motivações diferentes. Forme laços, prepare suas avaliações e lembre-se: alguém pode não ser quem diz ser.</p><div class="row">'+(game.mode==='livre'&&game.stage==='social'?'<button class="btn" data-act="nextday">Avançar para '+dayName(Math.min(game.day+1,6))+' →</button>':'')+'<button class="btn secondary" data-act="nav" data-to="chats">Conversar com jogadores</button></div></div>';
const stage=game.stage==='vote'?'Avaliações abertas · domingo 18h':game.stage==='influencers'?'Esperando anúncio · domingo 20h':game.stage==='block'?'Sala Azul · domingo 21h':game.stage==='final'?'Avaliação final encerrada':game.stage==='post'?'Jogador bloqueado · próxima semana':game.gameOver?'Temporada encerrada':'Semana '+game.week+' · '+dayName(currentDay());
const call=game.stage==='vote'||game.stage==='influencers'||game.stage==='block'||game.stage==='final'||game.stage==='post';
content+=title('Painel do Circle','O que está acontecendo?')+'<div class="grid2"><section class="panel"><div class="spread"><span class="pill '+(call?'':'green')+'">'+E(stage)+'</span><span class="muted">'+alive().length+' perfis ativos</span></div><h2 style="margin-top:16px">Sua próxima movimentação</h2><p class="muted">'+(game.gameOver?'Sua trajetória pode ser revista em Resultado.':game.stage==='social'?(currentDay()===2||currentDay()===5?'Hoje vc não tem dinâmica obrigatória. Converse apenas se quiser.':'Converse, analise os perfis e participe das dinâmicas. Suas relações influenciam os votos.'):game.stage==='vote'?'É hora de ordenar os outros jogadores, do mais querido ao menos querido.':game.stage==='influencers'?'Os resultados já foram calculados. Os influenciadores serão revelados às 20h.':game.stage==='block'?'Os influenciadores precisam decidir quem será bloqueado.':game.stage==='final'?'A classificação final está pronta. A revelação acontece às 21h.':'Veja a pessoa bloqueada e siga para a próxima semana.')+'</p><div class="row">'+(call?'<button class="btn" data-act="nav" data-to="'+(game.stage==='post'?'resultado':'avaliacoes')+'">Ver evento do Circle</button>':actions())+'</div></section><section class="panel"><h2>Últimos acontecimentos</h2>'+eventList(4)+'</section></div>'+title('Participantes','Quem parece confiável?')+'<div class="people">'+people.filter(p=>!blocked(p.id)).slice(0,4).map(p=>personCard(p)).join('')+'</div>';return content;}
function personCard(p){return '<button class="person" data-act="openchat" data-id="'+p.id+'">'+av(p.id)+'<h3>'+E(p.name)+'</h3><small>'+E(p.age)+' anos · '+E(p.city)+'</small><p>'+E(p.bio)+'</p><span style="display:block;margin-top:10px;color:#e7acd4;font-size:11px">Conversar →</span></button>';}
function playerList(){return title('Os oito perfis','Ninguém pode ver identidades secretas antes do bloqueio.')+'<div class="people">'+['user',...people.map(p=>p.id)].map(id=>{const p=pFor(id);const dead=blocked(id);return '<div class="person" style="'+(dead?'opacity:.54;':'')+'">'+av(id)+'<h3>'+E(p.name)+(id==='user'?' (vc)':'')+'</h3><small>'+E(p.age||'')+' anos · '+E(p.city||'')+'</small><p>'+E(p.bio||'')+'</p><div class="row" style="margin-top:12px"><span class="pill '+(dead?'':'green')+'">'+(dead?'BLOQUEADO':'NO JOGO')+'</span>'+(id!=='user'&&!dead?'<button class="btn secondary sm" data-act="openchat" data-id="'+id+'">Conversar</button>':'')+'</div>'+(dead&&id!=='user'?'<p style="color:var(--gold);font-size:11px">Revelação: '+E(p.secret)+'</p>':'')+'</div>';}).join('')+'</div>';}
function chats(){const aiBanner=window.CircleAI?.signedIn()?'':'<div class="alert" style="margin-bottom:12px"><strong>Conversas reais com IA</strong><p class="muted">Para os participantes responderem com contexto, conecte a IA. Será necessário entrar numa conta Puter. Há créditos iniciais gratuitos e podem existir cobranças se vc optar por ampliar seu uso.</p><button class="btn sm" data-act="connectai">Conectar inteligência artificial</button></div>';const ids=['grupo',...people.map(p=>p.id)];if(chat!=='grupo'&&blocked(chat)){}let name=chat==='grupo'?'Chat geral':pFor(chat).name;const msgs=(game.chats[chat]||[]).map(m=>'<div class="msg '+(m.by==='user'?'mine':'')+'"><div class="who">'+E(m.by==='circle'?'● CIRCLE':pFor(m.by).name)+'</div><div class="bubble">'+E(m.text)+'</div><div class="hour">'+humanDate(m.at)+'</div></div>').join('');
return aiBanner+'<div class="chatLayout"><div class="chatList">'+ids.map(id=>{const p=id==='grupo'?{name:'Chat geral',initial:'✳',cls:'me'}:pFor(id);return '<button class="chatContact '+(chat===id?'sel':'')+'" data-act="openchat" data-id="'+id+'">'+(id==='grupo'?'<div class="avatar me">✳</div>':av(id))+'<div><b>'+E(p.name)+'</b><small>'+(id==='grupo'?'Todos os jogadores':(blocked(id)?'Bloqueado · conversa arquivada':'Mensagem privada'))+'</small></div>'+(game.unread[id]?'<span class="unread">'+game.unread[id]+'</span>':'')+'</button>';}).join('')+'</div><div class="chatArea"><div class="chatHead">'+(chat==='grupo'?'<div class="avatar me">✳</div>':av(chat))+'<div><h2>'+E(name)+'</h2><small>'+(chat==='grupo'?'Conversa com todos os participantes':blocked(chat)?'Este jogador foi bloqueado':'Conversa privada · sua estratégia importa')+'</small></div></div><div id="messages" class="messages">'+(msgs||'<div class="muted">Ainda não há mensagens aqui. Que tal começar uma conversa?</div>')+'</div><div class="composeBox"><div class="typing">'+(Object.keys(typingIds).some(id=>chat===id||chat==='grupo')?'● alguém está digitando...':'')+'</div><div class="compose"><textarea id="composer" aria-label="Digite sua mensagem" placeholder="Diga algo ao Circle..." '+(game.gameOver||blocked('user')||blocked(chat)?'disabled':'')+'>'+E(draft)+'</textarea><button class="iconbtn" data-act="mic" aria-label="Ativar comando de voz" title="Ativar comando de voz">'+(listening?'🔴':'🎙️')+'</button><button class="iconbtn send" data-act="send" aria-label="Enviar mensagem" title="Enviar mensagem" '+(game.gameOver||blocked('user')||blocked(chat)?'disabled':'')+'>➤</button></div><div class="hint">Toque no microfone e diga: “Circle, escreve aí: oi, gente!” ou “Circle, enviar”. No iPhone, o navegador pode exigir ativação a cada fala.</div></div></div></div>';}

function opts(players,chosen='',placeholder='Escolha alguém'){
 return '<option value="">'+E(placeholder)+'</option>'+players.map(id=>'<option value="'+E(id)+'" '+(id===chosen?'selected':'')+'>'+E(pFor(id).name)+'</option>').join('');
}
function dynForm(c){
 const ids=alive().filter(id=>id!=='user');
 const target='<label class="label" for="dyn-target">Escolha um participante</label><select class="field" id="dyn-target">'+opts(ids)+'</select>';
 const reason='<label class="label" for="taskanswer">'+(c.type==='painting'?'O que sua pintura quer dizer? (opcional)':'Sua explicação (opcional)')+'</label><textarea class="field answer" id="taskanswer" maxlength="650" placeholder="Escreva com suas palavras..."></textarea>';
 const send='<button class="btn" style="margin-top:12px" data-act="task">Enviar participação ao Circle</button>';
 let inner='';
 if(c.type==='zodiac')inner=target+'<label class="label" for="dyn-sign">Qual signo vc acha que ele(a) é?</label><select class="field" id="dyn-sign"><option value="">Escolha um signo</option>'+CircleDynamics.signs.map(n=>'<option value="'+E(n)+'">'+E(n)+'</option>').join('')+'</select>'+reason;
 else if(c.type==='poll')inner='<label class="label" for="trustchoice">Quem parece ser mais confiável?</label><select class="field" id="trustchoice">'+opts(alive().filter(x=>x!=='user'))+'</select><label class="label" for="suschoice">Quem pode ser catfish?</label><select class="field" id="suschoice">'+opts(alive().filter(x=>x!=='user'))+'</select><div class="dyn-note">Os votos serão anônimos. O Circle vai divulgar os totais, mas não revelar os votos individuais.</div>';
 else if(c.type==='quiz')inner=CircleDynamics.quiz.map((q,i)=>'<fieldset class="dyn-field"><legend><b>'+(i+1)+'. '+E(q.q)+'</b></legend>'+q.opts.map((opt,j)=>'<label class="dyn-option"><input type="radio" name="q'+i+'" value="'+j+'"> '+E(opt)+'</label>').join('')+'</fieldset>').join('');
 else if(c.type==='quote'){
  const has=!!game.questionSets?.[c.key];
  const qs=CircleDynamics.context(game,people,c,rand)||[];
  if(!has)save();
  inner=qs.map((q,i)=>'<fieldset class="dyn-field"><legend><b>Depoimento '+(i+1)+':</b> '+E(q.text)+'</legend><label class="label" for="quote'+i+'">Quem escreveu?</label><select class="field" id="quote'+i+'">'+opts(q.options)+'</select></fieldset>').join('');
 }
 else if(c.type==='painting')inner=target+'<p class="muted">Desenhe com o dedo no quadro branco. Os outros jogadores também vão entregar seus desenhos simbólicos sobre alguém.</p><canvas class="draw" id="paintboard" width="700" height="350" aria-label="Quadro de pintura"></canvas><button class="btn secondary sm" style="margin:10px 0" data-act="clearpaint">Apagar minha pintura</button>'+reason;
 else if(c.type==='rival'||c.type==='ally')inner=target+reason;
 else if(c.type==='bomb')inner=target+'<label class="label" for="taskanswer">Que pergunta anônima vc quer fazer?</label><textarea class="field answer" id="taskanswer" maxlength="350" placeholder="Escreva uma pergunta objetiva..."></textarea>';
 else if(c.type==='dance')inner=target+'<label class="label" for="dyn-style">Escolha um ritmo que combina com essa pessoa</label><select class="field" id="dyn-style"><option value="">Escolha um estilo</option>'+CircleDynamics.styles.map(n=>'<option value="'+E(n)+'">'+E(n)+'</option>').join('')+'</select>'+reason;
 else if(c.type==='party')inner='<label class="label" for="taskanswer">Descreva seu look da festa</label><textarea class="field answer" id="taskanswer" maxlength="450" placeholder="Ex.: camisa rosa, calça branca, acessórios prateados..."></textarea><label class="label" for="dyn-song">Música para começar a festa</label><input class="field" id="dyn-song" maxlength="85" placeholder="Nome de uma música ou estilo">';
 else if(c.type==='confession')inner='<label class="label" for="taskanswer">Sua confissão anônima</label><textarea class="field answer" id="taskanswer" maxlength="450" placeholder="Algo sobre vc que ninguém imagina..."></textarea><div class="dyn-note">A autoria não será exibida para os outros jogadores.</div>';
 else inner='<label class="label" for="taskanswer">Sua resposta à dinâmica</label><textarea class="field answer" id="taskanswer" maxlength="600" placeholder="Conta algo verdadeiro sobre vc..."></textarea>';
 return '<div class="challenge"><span class="pill">SEMANA '+game.week+' · '+dayName(currentDay())+'</span><h3>'+E(c.title)+'</h3><p>'+E(c.desc)+'</p><div class="dyn-note">Etapas: sua participação → respostas dos outros jogadores → apuração → resultado → reações.</div>'+inner+send+'</div>';
}
function dynCard(d){
 const status=({collecting:'Recebendo participações',results:'Resultados disponíveis',discussion:'Reações liberadas',complete:'Concluída'})[d.stage]||d.stage;
 return '<button class="dyn-archive" data-act="dynopen" data-id="'+E(d.key)+'"><span>'+E(d.title)+'</span><small>'+E(status)+' · semana '+E(d.key.split('-')[0])+'</small></button>';
}
function dynResults(d){
 const rows=d.entries||[];
 let charts='';
 for(const section of d.sections||[]){
  charts+='<div class="dyn-section"><h3>'+E(section.title)+'</h3>';
  if(section.type==='bars'){const max=Math.max(1,...(section.rows||[]).map(r=>r.count||0));charts+=(section.rows||[]).map(r=>'<div class="dyn-bars"><div class="spread"><b>'+E(r.label)+'</b><span>'+r.count+' voto(s)</span></div><div class="bar"><div style="width:'+Math.round(100*r.count/max)+'%"></div></div></div>').join('');}
  else if(section.type==='scores')charts+=(section.rows||[]).map((r,i)=>'<div class="stat"><span>'+Number(i+1)+'º '+E(r.name)+'</span><b>'+r.points+' ponto(s)</b></div>').join('');
  else if(section.type==='notes')charts+=(section.rows||[]).map(r=>'<div class="stat"><span>'+E(r.label)+'</span><b>'+E(r.detail)+'</b></div>').join('');
  else charts+='<p class="muted">'+E(section.text)+'</p>';
  charts+='</div>';
 }
 const secret=['poll','rival','ally'].includes(d.kind);
 const hiddenAnon=['confession','bomb'].includes(d.kind);
 let entries=rows;
 if(secret)entries=rows.filter(x=>x.by==='user');
 if(d.kind==='quote')entries=[];
 let cards=entries.length?'<div class="dyn-section"><h3>'+(hiddenAnon?'Participações anônimas':'O que cada pessoa apresentou')+'</h3><div class="dyn-entries">'+entries.map((e,k)=>{
  let who=hiddenAnon?'Participante anônimo '+(k+1):e.by==='user'?game.player.alias:e.by==='circle'?'Circle':pFor(e.by).name;
  const picture=e.image?'<img class="dyn-art-photo" alt="Desenho enviado por vc" src="'+E(e.image)+'">':'';
  const icon=e.symbol?'<div class="dyn-art-symbol">'+E(e.symbol)+'</div>':'';
  return '<article class="dyn-entry">'+(!hiddenAnon?'<div class="row">'+av(e.by)+'<strong>'+E(who)+'</strong></div>':'<strong>'+E(who)+'</strong>')+'<p>'+E(e.detail||'Participação registrada')+'</p>'+picture+icon+'</article>';
 }).join('')+'</div></div>':'';
 if(d.kind==='poll')cards='<div class="dyn-note">Seu voto: '+E(d.entries[0]?.detail||'Registrado')+'. Os outros votos são secretos; os números abaixo já incluem os oito participantes.</div>';
 if(d.kind==='rival'||d.kind==='ally')cards='<div class="dyn-note">Sua escolha: '+E(d.entries[0]?.detail||'Registrada')+'. As escolhas individuais dos outros participantes são sigilosas.</div>';
 let base='<div class="dyn-results"><div class="dyn-headline"><span class="pill">ALERTA! O CIRCLE REVELOU</span><h2>'+E(d.headline)+'</h2><p>'+E(d.summary)+'</p></div>'+cards+charts+'<div class="dyn-note">'+E(d.stake)+'</div>';
 const bombsToUser=d.kind==='bomb'?(d.meta?.questions||[]).filter(q=>q.target==='user'):[];
 if(d.stage==='complete')base+='<div class="row"><span class="pill green">✓ Dinâmica concluída</span><button class="btn secondary sm" data-act="nav" data-to="chats">Ver conversas</button></div>';
 else if(d.stage==='results')base+='<button class="btn" data-act="dynreact" data-id="'+E(d.key)+'">Abrir reações dos jogadores →</button>';
 else if(d.stage==='discussion')base+='<div class="alert"><strong>O Circle anunciou o resultado!</strong><p>As relações e suspeitas foram atualizadas. Os jogadores estão liberados para reagir no chat geral.</p></div>'+(bombsToUser.length?'<div class="dyn-section"><h3>Uma pergunta anônima chegou para vc</h3>'+bombsToUser.map(q=>'<p class="muted">'+E(q.text)+'</p>').join('')+(d.answeredUser?'<div class="alert success">Sua resposta: '+E(d.answeredUser)+'</div>':'<textarea class="field" maxlength="500" id="dyn-answer" placeholder="Sua resposta aparece com seu nome no chat geral..."></textarea><div class="row"><button class="btn secondary sm" data-act="dynanswer" data-id="'+E(d.key)+'">Responder</button><button class="btn ghost sm" data-act="dynskip" data-id="'+E(d.key)+'">Prefiro não responder</button></div>')+'</div>':'')+'<div class="row"><button class="btn secondary" data-act="nav" data-to="chats">Ver chat geral</button><button class="btn" data-act="dynfinish" data-id="'+E(d.key)+'">Concluir dinâmica</button></div>';
 return base+'</div>';
}
function dynActive(d){
 if(d.stage!=='collecting')return dynResults(d);
 const elapsed=Math.max(0,Date.now()-d.submittedAt),duration=Math.max(1000,d.releaseAt-d.submittedAt),count=Math.min(7,Math.max(0,Math.floor(7*elapsed/duration)));
 const ready=Date.now()>=d.releaseAt;
 return '<section class="dyn-progress"><span class="pill">CIRCLE · APURAÇÃO</span><h2>Os jogadores estão participando</h2><p class="muted">Sua resposta já foi enviada. O Circle está reunindo as escolhas dos outros sete participantes desta simulação.</p><div class="dyn-progress-track"><div style="width:'+Math.round(100*count/7)+'%"></div></div><div class="spread"><strong>'+count+' de 7 participantes</strong><span>'+(!ready?'Preparando resultados...':'Todas as respostas recebidas')+'</span></div>'+(ready?'<button class="btn" data-act="dynreveal" data-id="'+E(d.key)+'">Revelar resultados do Circle</button>':'<div class="dyn-wait">O resultado será liberado em instantes.</div>')+'</section>';
}
function games(){
 const current=dueTask();const latest=Object.values(game.dynamics||{}).reverse();
 let copy='<div class="hero"><span class="pill">TODOS PARTICIPAM</span><h2>Dinâmicas que movimentam o jogo</h2><p>Vc faz sua parte. Os outros jogadores também escolhem, respondem ou desenham. Depois o Circle apura e revela os resultados — e as consequências aparecem nos relacionamentos e no chat.</p></div>';
 let shown=current;let d=current&&dynState(current);
 if(openedDynamic){const archive=(game.dynamics||{})[openedDynamic];if(archive){copy+='<button class="btn secondary sm" data-act="dynback">← Voltar aos jogos atuais</button>';copy+=dynActive(archive);copy+=title('Registro das dinâmicas anteriores');copy+='<div class="dyn-archive-list">'+latest.filter(x=>x.key!==openedDynamic).map(dynCard).join('')+'</div>';return copy;}openedDynamic=null;}
 if(game.stage!=='social')copy+='<div class="alert">Hoje o Circle está na fase de avaliações ou bloqueios. As provas não estão abertas, mas os resultados anteriores continuam disponíveis abaixo.</div>';
 else if(!current)copy+='<section class="panel"><h2>🌿 Dia livre</h2><p class="muted">Quarta é seu desenvolvimento, sábado é sua gira e domingo é dia de avaliações. Não há uma dinâmica obrigatória agora.</p></section>';
 else if(d)copy+=dynActive(d);
 else copy+=dynForm(current);
 if(latest.length){copy+=title('Histórico das dinâmicas','Resultados anteriores continuam disponíveis');copy+='<div class="dyn-archive-list">'+latest.filter(x=>x.key!==current?.key).map(dynCard).join('')+'</div>';}
 copy+=title('Agenda completa de jogos','Um jogo diferente por dia de prova')+'<div class="gameGrid">'+CHALLENGES.map((g,i)=>'<div class="gameChip"><strong>'+E(g.title)+'</strong><small>'+E(g.desc)+'</small></div>').join('')+'</div>';
 return copy;
}
function ratingView(){const stage=game.stage,base='<div class="hero"><span class="pill">DOMINGO NO CIRCLE</span><h2>Avaliações e eliminações</h2><p>18h — avaliação · 20h — influenciadores · 21h — bloqueio. Os votos dos adversários consideram alianças, relações, estratégias e suspeitas.</p></div>';
if(stage==='social')return base+'<div class="panel"><h2>Próxima votação: domingo, 18h</h2><p class="muted">Continue jogando. A ordem das suas amizades pode mudar o resultado da semana.</p>'+(game.mode==='livre'?'<p class="muted">No ritmo livre, avance os dias até domingo para abrir as avaliações.</p>':'')+'</div>';
if(stage==='vote'){const ids=alive().filter(id=>id!=='user');if(!game.tempRanking||game.tempRanking.length!==ids.length||game.tempRanking.some(id=>!ids.includes(id)))game.tempRanking=shuffle(ids);return base+'<section class="panel"><h2>Faça seu ranking</h2><p class="muted">Coloque no topo os perfis em que vc mais confia. Use as setas para trocar a posição e envie sua avaliação.</p><div id="rankings">'+game.tempRanking.map((id,i)=>'<div class="rankRow" data-rank-id="'+id+'"><div class="pos">'+(i+1)+'º</div>'+av(id)+'<b>'+E(pFor(id).name)+'</b><div class="arrows"><button aria-label="Subir '+E(pFor(id).name)+'" data-act="up" data-id="'+id+'" '+(i===0?'disabled':'')+'>↑</button><button aria-label="Descer '+E(pFor(id).name)+'" data-act="down" data-id="'+id+'" '+(i===ids.length-1?'disabled':'')+'>↓</button></div></div>').join('')+'</div><button class="btn" data-act="vote">Enviar avaliação</button></section>';}
if(stage==='influencers')return base+'<div class="panel"><span class="pill">20h · INFLUENCIADORES</span><h2>O ranking está fechado</h2><p class="muted">Todos os perfis foram avaliados. A identidade dos influenciadores ainda está em segredo.</p><button class="btn" data-act="reveal">Revelar influenciadores</button></div>';
if(stage==='block')return base+'<div class="panel"><span class="pill">SALA AZUL · 21h</span><h2>Influenciadores: '+game.influencers.map(id=>E(pFor(id).name)).join(' e ')+'</h2><p class="muted">'+(game.influencers.includes('user')?'Vc é influenciador! Escolha quem gostaria de bloquear. O outro influenciador pode discordar.':'Os dois influenciadores estão decidindo quem será bloqueado. A escolha reflete suas estratégias e relacionamentos.')+'</p>'+(game.influencers.includes('user')?'<label class="label" for="blockchoice">Quem vc quer bloquear?</label><select class="field" id="blockchoice"><option value="">Escolha um participante</option>'+possibleTargets().map(id=>'<option value="'+id+'" '+(game.pendingBlock===id?'selected':'')+'>'+E(pFor(id).name)+'</option>').join('')+'</select>':'')+'<button class="btn" style="margin-top:14px" data-act="block">Revelar o bloqueio das 21h</button></div>';
if(stage==='final')return base+'<div class="panel"><span class="pill">GRANDE FINAL</span><h2>Chegou a última classificação!</h2><p class="muted">Todos os votos foram calculados. O perfil mais bem avaliado será o vencedor, sem vitória garantida para vc.</p><button class="btn" data-act="final">Revelar o vencedor</button></div>';
return base+'<div class="panel"><h2>Temporada encerrada ou aguardando próxima rodada</h2><button class="btn" data-act="nav" data-to="resultado">Ver resultado</button></div>';}
function results(){const stage=game.stage,last=game.lastBlocked||'';
if(stage==='post')return '<div class="endCard"><span class="pill">ALERTA! BLOQUEIO</span><h2>'+E(pFor(last).name)+' foi bloqueado!</h2><p>'+E(pFor(last).secret)+'</p><button class="btn" data-act="nextweek">Começar a semana '+(game.week+1)+'</button></div>';
if(stage==='eliminated')return '<div class="endCard"><span class="pill">VOCÊ FOI BLOQUEADO</span><h2>Fim de jogo, '+E(game.player.alias)+'.</h2><p>Os influenciadores decidiram bloquear vc. Essa temporada termina aqui. Os perfis verdadeiros e falsos são revelados abaixo.</p><button class="btn" data-act="restart">Começar outra temporada</button></div>'+revealAll();
if(stage==='done')return '<div class="endCard"><span class="pill">GRANDE FINAL</span><h2>'+E(pFor(game.winner).name)+' venceu a temporada!</h2><p>'+(game.winner==='user'?'PARABÉNS! Sua estratégia te levou até o topo do Circle.':'Dessa vez não foi vc, mas cada escolha construiu uma história diferente. Não há vencedor predeterminado.')+'</p><button class="btn" data-act="restart">Jogar uma nova temporada</button></div>'+title('Classificação final')+rankingBlock(game.rankings.at(-1)?.ranking||[])+revealAll();
return '<div class="panel"><h2>Os resultados ainda estão em segredo</h2><p class="muted">O Circle só revela os bloqueios quando chega o momento certo.</p></div>';}
function revealAll(){return title('A verdade por trás dos perfis')+'<div class="panel">'+people.map(p=>'<div class="event"><strong>'+E(p.name)+' — '+(p.trueSelf?'PERFIL VERDADEIRO':'CATFISH')+'</strong><p>'+E(p.secret)+'</p></div>').join('')+'</div>';}
function rankingBlock(r){return '<div class="panel">'+r.map((a,i)=>'<div class="rankRow"><span class="pos">'+(i+1)+'º</span>'+av(a.id)+'<b>'+E(pFor(a.id).name)+'</b><span class="pill">'+a.score.toFixed(2)+' pts</span></div>').join('')+'</div>';}
function calendar(){let wk=['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'];let desc=['Jogos','Conversas','Desenvolvimento','Estratégia','Festa','Gira','Avaliação'];let emojis=['🎯','💬','🌿','🧠','🎉','🕯️','🏆'];return '<div class="hero"><span class="pill">4 SEMANAS · 8 PARTICIPANTES</span><h2>Sua rotina vem primeiro</h2><p>Quarta e sábado não têm eventos obrigatórios. Domingo: avaliações às 18h, influenciadores às 20h e bloqueio às 21h. Na quarta semana, grande final.</p></div>'+title('Calendário semanal',game.mode==='livre'?'Dias avançam quando vc quiser':'Dias seguem o horário de São Paulo')+'<div class="panel"><div class="dayGrid">'+wk.map((w,i)=>'<div class="day '+((i===2||i===5)?'spare ':'')+(currentDay()===i?'today':'')+'"><span style="font-size:18px">'+emojis[i]+'</span><b>'+w.slice(0,3)+'</b><small>'+desc[i]+'</small><em>'+(i===2||i===5?'Livre':i===6?'18·20·21h':'Dinâmica')+'</em></div>').join('')+'</div><div class="divider"></div><p class="muted">Nos domingos: <b>18h</b> avaliações; <b>20h</b> anúncio; <b>21h</b> bloqueio. No modo livre, o relógio de cada evento é narrativo e vc confirma cada etapa. No modo real, o evento é liberado no horário. Se perder uma etapa, ela fica disponível depois.</p>'+(game.mode==='livre'&&game.stage==='social'?'<button class="btn" data-act="nextday">Avançar um dia</button>':'')+'</div>'+title('Etapas da temporada')+'<div class="grid3">'+[1,2,3,4].map(w=>'<div class="panel"><span class="pill '+(w===game.week?'green':'')+'">SEMANA '+w+'</span><h3 style="margin-top:13px">'+(w===4?'Grande final':'Uma eliminação')+'</h3><p class="muted">As conversas mudam a estratégia dos jogadores até o domingo.</p></div>').join('')+'</div>';}
function settings(){return '<div class="grid2"><div class="panel"><h2>Meu perfil</h2><div class="row">'+av('user')+'<div><strong>'+E(game.player.alias)+'</strong><div class="muted">'+E(game.player.job)+' · '+E(game.player.city)+'</div></div></div><p class="muted">'+E(game.player.bio)+'</p><label class="label">Foto opcional (só neste aparelho)</label><input id="photo" type="file" accept="image/*" class="field"><p class="note">A foto é comprimida para caber no armazenamento do navegador.</p><div class="divider"></div><h2>Áudio e voz</h2><p class="muted">Fale “Circle, escreve aí: ...”, “Circle, enviar”, “Circle, abrir chat com Lia”, “Circle, abrir o grupo” ou “Circle, ler mensagens”.</p><button class="btn secondary" data-act="mic">🎙️ Testar microfone</button><button class="btn secondary" data-act="speak">🔊 Ouvir uma frase do Circle</button></div><div class="panel"><h2>Progresso e backup</h2><p class="muted">Seus dados ficam neste navegador, não em um servidor. Faça backup após cada domingo para preservar a temporada ao trocar de aparelho ou apagar dados do Safari.</p><div class="row"><button class="btn" data-act="export">⬇ Salvar backup</button><label class="btn secondary" style="cursor:pointer">⬆ Restaurar backup<input id="import" type="file" accept=".json,application/json" class="hidden"></label></div><div class="divider"></div><div class="stat"><span>Ritmo</span><b>'+(game.mode==='real'?'Calendário real':'Avanço livre')+'</b></div><div class="stat"><span>Semana</span><b>'+game.week+'/4</b></div><div class="stat"><span>Jogadores ativos</span><b>'+alive().length+'</b></div><div class="stat"><span>Provas concluídas</span><b>'+Object.keys(game.tasks).length+'</b></div><div class="divider"></div><button class="btn danger" data-act="restart">Apagar temporada e recomeçar</button><p class="note">Jogo de fã independente, não associado à Netflix. Os personagens são fictícios e suas falas são produzidas por IA mediante conexão com Puter. O provedor poderá processar o conteúdo dos chats; verifique os termos e os créditos gratuitos da sua conta.</p></div></div>';}
function render(){if(!game){$('app').innerHTML=welcome();return;}let content=({inicio:home,chats,jogos:games,avaliacoes:ratingView,jogadores:playerList,calendario:calendar,ajustes:settings,resultado:results})[view]||home;$('app').innerHTML=shell(content());if(view==='chats'){const m=$('messages');if(m)m.scrollTop=m.scrollHeight;}}
function act(e){const b=e.target.closest('[data-act]');if(!b)return;const action=b.dataset.act,id=b.dataset.id,to=b.dataset.to;try{
if(action==='start'){const alias=$('name').value.trim(),age=$('age').value.trim(),city=$('city').value.trim(),job=$('job').value.trim(),bio=$('bio').value.trim();if(!alias||!age||!city||!bio)return toast('Preencha nome, idade, cidade e biografia.');if(!/^\d\d?$/.test(age)||+age<13||+age>99)return toast('Digite uma idade válida.');start(alias,age,city,bio,$('mode').value,job||'Não informado');}
else if(!game)return;
else if(action==='nav'){view=to;render();}
else if(action==='openchat'){chat=id;draft='';game.unread[id]=0;view='chats';save();render();}
else if(action==='send')send();
else if(action==='connectai')connectAI();
else if(action==='mic')microphone();
else if(action==='nextday')nextDay();
else if(action==='task')taskSubmit();
else if(action==='dynreveal')revealDynamic(id);
else if(action==='dynreact')reactDynamic(id);
else if(action==='dynfinish')finishDynamic(id);
else if(action==='dynanswer')answerBomb(id,false);
else if(action==='dynskip')answerBomb(id,true);
else if(action==='dynopen'){openedDynamic=id;view='jogos';render();}
else if(action==='dynback'){openedDynamic=null;render();}
else if(action==='clearpaint'){const p=$('paintboard');if(p){p.getContext('2d').clearRect(0,0,p.width,p.height);painted=false;}}
else if(action==='up'||action==='down'){let ix=game.tempRanking.indexOf(id),j=ix+(action==='up'?-1:1);if(j>=0&&j<game.tempRanking.length){[game.tempRanking[ix],game.tempRanking[j]]=[game.tempRanking[j],game.tempRanking[ix]];save();render();}}
else if(action==='vote')voteSubmit();
else if(action==='reveal')revealInfluencers();
else if(action==='block'){game.pendingBlock=$('blockchoice')?.value||'';executeBlock();}
else if(action==='nextweek')nextWeek();
else if(action==='final')finish();
else if(action==='export')backup();
else if(action==='restart'){if(confirm('Quer apagar essa temporada e recomeçar? Faça um backup antes, se quiser guardá-la.')){localStorage.removeItem(KEY);game=null;view='inicio';chat='grupo';draft='';render();}}
else if(action==='speak')speak('Alerta! Bem-vindo ao Circle. Sua próxima mensagem pode mudar o jogo.');
}catch(ex){console.error('Erro em ação',action,ex);toast('Não foi possível concluir essa ação. Tente novamente.');}}
function backup(){const file=new Blob([JSON.stringify(game,null,2)],{type:'application/json'});const url=URL.createObjectURL(file);const a=document.createElement('a');a.href=url;a.download='circle-backup-semana-'+game.week+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('Backup criado. Guarde o arquivo em um lugar seguro!');}
function uploadBackup(file){if(!file||file.size>2e6)return toast('Selecione um backup válido de até 2 MB.');const reader=new FileReader();reader.onload=()=>{try{const g=JSON.parse(reader.result);if(!valid(g))throw new Error('inválido');if(!confirm('Restaurar esse backup vai substituir sua partida atual. Continuar?'))return;game=g;view='inicio';chat='grupo';draft='';save();render();toast('Sua temporada foi restaurada!');}catch(e){toast('Não consegui ler esse backup.');}};reader.readAsText(file);}
function photoChange(file){if(!file||!file.type.startsWith('image/'))return toast('Escolha uma imagem.');if(file.size>10e6)return toast('A foto deve ter menos de 10 MB.');const img=new Image();const u=URL.createObjectURL(file);img.onload=()=>{const c=document.createElement('canvas');c.width=170;c.height=170;const ctx=c.getContext('2d');const k=Math.max(170/img.width,170/img.height);ctx.drawImage(img,(170-img.width*k)/2,(170-img.height*k)/2,img.width*k,img.height*k);game.player.photo=c.toDataURL('image/jpeg',.68);URL.revokeObjectURL(u);save();render();toast('Foto atualizada!');};img.onerror=()=>{URL.revokeObjectURL(u);toast('Não foi possível abrir a foto.');};img.src=u;}
function speak(t){if(!('speechSynthesis' in window))return toast('Leitura em voz alta não disponível neste navegador.');window.speechSynthesis.cancel();const utter=new SpeechSynthesisUtterance(t);utter.lang='pt-BR';utter.rate=.99;window.speechSynthesis.speak(utter);}
function parseVoice(spoken){const raw=String(spoken||'').trim(),s=normalize(raw);let m;
if(!raw)return;
if(/^(circle )?(apagar|limpar)( mensagem| texto)?$/.test(s)){draft='';if(view==='chats')render();return toast('Texto apagado.');}
if(/^(circle )?(enviar|manda|enviar mensagem)$/.test(s)){send();return;}
if((m=s.match(/^(circle )?abrir (o |a )?(chat com |conversa com )?(.+)$/))){const x=m[4].trim();if(/avaliac|classificac|votac/.test(x)){view='avaliacoes';render();return toast('Avaliações abertas.');}if(/jogo|desafio|dinamica/.test(x)){view='jogos';render();return toast('Jogos abertos.');}if(/calendario|agenda/.test(x)){view='calendario';render();return toast('Agenda aberta.');}if(/grupo|geral/.test(x)){chat='grupo';view='chats';game.unread[chat]=0;render();return toast('Chat geral aberto.');}const p=people.find(p=>x.includes(normalize(p.name)));if(p){chat=p.id;view='chats';game.unread[chat]=0;render();return toast('Chat de '+p.name+' aberto.');}}
if(/^(circle )?(ler|leia|le) (as )?(mensagens|ultima mensagem)/.test(s)){const ms=game.chats[chat]||[];const content=ms.slice(-3).map(m=>(m.by==='user'?'Você':m.by==='circle'?'Circle':pFor(m.by).name)+' disse: '+m.text).join('. ');speak(content||'Não há mensagens.');return;}
if(/^(circle )?(parar de falar|silencio)$/.test(s)){if('speechSynthesis' in window)window.speechSynthesis.cancel();return;}
let text=raw.replace(/^(circle[\s,.:]*)?(escreve a[ií]|escreva a[ií]|escreve|digita|ditar|mensagem)[\s,.:]*/i,'').trim();
if(!text)text=raw;
if(view!=='chats')view='chats';
const sendAfter=/[,.; ]*circle[\s,.:]*enviar[.! ]*$/i.test(text);text=text.replace(/[,.; ]*circle[\s,.:]*enviar[.! ]*$/i,'').trim();draft=(draft?draft+' ':'')+text;
render();if(sendAfter)send();else toast('Mensagem transcrita. Diga “Circle, enviar” ou toque em ➤.');}
function microphone(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){if(view!=='chats'){view='chats';render();}const box=$('composer');if(box)box.focus();toast('Neste navegador, use o microfone do teclado para ditar. Diga “Circle, escreve aí...” e toque em enviar.');return;}
if(recognition&&listening){recognition.stop();return;}
try{recognition=new SR();recognition.lang='pt-BR';recognition.interimResults=false;recognition.continuous=false;recognition.maxAlternatives=1;recognition.onstart=()=>{listening=true;render();toast('O Circle está ouvindo. Pode falar!');};recognition.onresult=ev=>{const text=ev.results[ev.results.length-1][0].transcript;parseVoice(text);};recognition.onerror=ev=>{if(ev.error!=='no-speech'&&ev.error!=='aborted')toast('O microfone falhou: '+ev.error+'. Verifique a permissão.');};recognition.onend=()=>{listening=false;recognition=null;if(game)render();};recognition.start();}catch(e){toast('Não foi possível iniciar o microfone. Verifique as permissões do navegador.');}}
$('app').addEventListener('click',act);
function drawPoint(ev,first){
 const board=ev.target;if(!board||board.id!=='paintboard')return;
 const rect=board.getBoundingClientRect(),x=(ev.clientX-rect.left)*board.width/rect.width,y=(ev.clientY-rect.top)*board.height/rect.height;
 const ctx=board.getContext('2d');ctx.strokeStyle='#4f315e';ctx.lineWidth=5;ctx.lineCap='round';ctx.lineJoin='round';
 if(first){painting=true;painted=true;ctx.beginPath();ctx.moveTo(x,y);try{board.setPointerCapture(ev.pointerId);}catch(e){}}
 else if(painting){ctx.lineTo(x,y);ctx.stroke();}
}
$('app').addEventListener('pointerdown',e=>drawPoint(e,true));
$('app').addEventListener('pointermove',e=>drawPoint(e,false));
$('app').addEventListener('pointerup',()=>painting=false);
$('app').addEventListener('pointercancel',()=>painting=false);
$('app').addEventListener('input',e=>{if(e.target.id==='composer')draft=e.target.value;});
$('app').addEventListener('keydown',e=>{if(e.target.id==='composer'&&e.key==='Enter'&&!e.shiftKey){e.preventDefault();send();}});
$('app').addEventListener('change',e=>{if(e.target.id==='import')uploadBackup(e.target.files[0]);if(e.target.id==='photo')photoChange(e.target.files[0]);if(e.target.id==='blockchoice'&&game){game.pendingBlock=e.target.value;save();}});
try{const stored=localStorage.getItem(KEY);if(stored){const o=JSON.parse(stored);if(valid(o))game=o;}}catch(e){console.warn('Jogo salvo indisponível',e);}
if(game){checkReal();}
render();
setInterval(()=>{if(game&&game.mode==='real')checkReal();},60000);
setInterval(()=>{if(!game||view!=='jogos')return;const current=openedDynamic?game.dynamics?.[openedDynamic]:dynState(dueTask());if(current?.stage==='collecting')render();},1200);
})();