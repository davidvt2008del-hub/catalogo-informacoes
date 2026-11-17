/* Circle: Minha Temporada — jogo de simulação social individual */
(function(){
'use strict';
const KEY='circle-solo-v2';
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
{title:'Quem é de qual signo?',desc:'Escolha um jogador e tente adivinhar seu signo. Conte por que ele combina com esse signo.',type:'write'},
{title:'Pesquisa de Opinião',desc:'Quem parece mais confiável? E quem parece ser um catfish? Justifique sua escolha.',type:'poll'},
{title:'Jogo da Verdade',desc:'Conte uma verdade sobre vc que ainda não apareceu no seu perfil. Pode aproximar ou afastar pessoas.',type:'write'},
{title:'Mentes Brilhantes',desc:'Responda: qual é o maior planeta do Sistema Solar?',type:'quiz',answers:['Terra','Saturno','Júpiter','Netuno'],correct:2},
{title:'Pintando Verdades',desc:'Crie um pequeno retrato simbólico de alguém usando texto e emojis. O desenho pode despertar suspeitas.',type:'write'},
{title:'Meu Maior Rival',desc:'Escolha o jogador que mais te preocupa neste momento e explique seu motivo.',type:'rival'},
{title:'A Última Bomba',desc:'Envie uma pergunta anônima que você gostaria de fazer para o grupo.',type:'anon'},
{title:'Segue o Baile',desc:'Sem aparelho de dança: escolha um estilo musical que combina com alguém do Circle e explique por quê.',type:'write'},
{title:'Festa do Circle',desc:'Conte como seria seu look e qual música abriria sua festa do Circle.',type:'write'},
{title:'Quem disse isso?',desc:'Escolha uma frase marcante do grupo. Tente descobrir o que a pessoa realmente quis dizer.',type:'write'},
{title:'Confissões',desc:'Escreva algo que vc nunca disse a outro jogador. Sua confissão vai para o grupo sem seu nome.',type:'anon'},
{title:'Compatibilidade',desc:'Quem seria sua dupla ideal para uma prova valendo imunidade? Por quê?',type:'ally'}
];
let game=null,view='inicio',chat='grupo',draft='',listening=false,recognition=null,typingIds={},busy=false,toastTimer=null,painting=false;
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
function start(alias,age,city,bio,mode,job){game={version:1,seed:(Date.now()>>>0)||777,player:{alias:alias.slice(0,26),age:age.slice(0,2),city:city.slice(0,38),job:job.slice(0,40),bio:bio.slice(0,190)},mode:mode==='real'?'real':'livre',created:Date.now(),week:1,day:0,stage:'social',blocked:[],chats:{grupo:[]},events:[],bots:{},unread:{},tasks:{},ballots:[],rankings:[],influencers:[],vote:[],proposed:'',pendingBlock:'',lastRealDay:'',lastRealSunday:'',lastRoundDate:'',winner:'',gameOver:false};
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
   const last=actual.filter(x=>x.by==='user').at(-1)?.text||lastUserMessage||'';
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
function nextDay(){if(game.mode!=='livre'||game.stage!=='social')return;if(game.day>=6)return;game.day++;if(game.day===2)log('Quarta-feira: dia livre de desenvolvimento. Nenhuma prova obrigatória.','pause');else if(game.day===5)log('Sábado: dia livre de gira. Nenhuma prova obrigatória.','pause');else if(game.day===6){game.stage='vote';log('ALERTA! Domingo, 18h: as avaliações estão abertas.','alert');message('grupo','circle','ALERTA! São 18h do domingo. É hora de classificar seus colegas do Circle.');}else{initiative();log('Um novo dia começou. A dinâmica está disponível na aba Jogos.','game');}save();render();}
function checkReal(){if(!game||game.mode!=='real'||game.gameOver||game.stage!=='social')return;const t=nowSP();const k=t.date;if(game.lastRealDay!==k){game.lastRealDay=k;if(t.weekday!==3&&t.weekday!==6){initiative();}save();}if(t.weekday===0&&t.hour>=18&&game.lastRealSunday!==k){game.stage='vote';game.lastRealSunday=k;log('São 18h de domingo! As avaliações estão abertas.','alert');message('grupo','circle','ALERTA! Avaliações de domingo liberadas às 18h.');save();render();}}
function allBotBallots(){const ids=alive();const result={};for(const p of people.filter(p=>!blocked(p.id))){const b=n(p.id);let choices=ids.filter(id=>id!==p.id);const score=id=>{let rel=id==='user'?b.trust:(b.other[id]||0);let target=id==='user'?{traits:{game:53,trust:55}}:pFor(id);let untrust=(id!=='user'&&!target.trueSelf&&p.traits.game>60?8:0);return rel*.72+(100-p.traits.game)*.12*(rel>0?1:-1)+rand()*45+(target.traits?.social||60)*.08-untrust;};const scored=choices.map(id=>({id,points:score(id)}));scored.sort((x,y)=>y.points-x.points);result[p.id]=scored.map(x=>x.id);}return result;}
function voteSubmit(){if(game.stage!=='vote')return;let order=Array.from(document.querySelectorAll('[data-rank-id]')).map(x=>x.dataset.rankId);if(order.length!==alive().length-1||new Set(order).size!==order.length)return toast('Complete seu ranking antes de enviar.');game.vote=order;const all=allBotBallots();all.user=order;game.ballots.push({week:game.week,all});let scores={};for(const voter of Object.keys(all)){all[voter].forEach((id,i)=>{if(!scores[id])scores[id]={points:0,count:0};scores[id].points+=(all[voter].length-i);scores[id].count++;});}const ranking=alive().map(id=>({id,score:scores[id]?scores[id].points/scores[id].count:0})).sort((a,b)=>b.score-a.score||((a.id>b.id)?1:-1));game.rankings.push({week:game.week,ranking});game.influencers=ranking.slice(0,2).map(x=>x.id);game.stage=game.week===4?'final':'influencers';log('Todas as avaliações foram calculadas. O resultado está guardado.','vote');message('grupo','circle','As avaliações foram encerradas. Os influenciadores serão anunciados às 20h.');save();view='avaliacoes';render();}
function revealInfluencers(){if(game.stage!=='influencers')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<20)return toast('A revelação acontece a partir das 20h.');game.stage='block';log('20h — Influenciadores da semana: '+game.influencers.map(id=>pFor(id).name).join(' e ')+'.','alert');message('grupo','circle','ALERTA! Os influenciadores da semana são '+game.influencers.map(id=>pFor(id).name).join(' e ')+'. A Sala Azul foi aberta.');save();render();}
function possibleTargets(){return alive().filter(id=>!game.influencers.includes(id));}
function botTarget(influencer){const candidates=possibleTargets();const bot=n(influencer);return candidates.map(id=>({id,score:(id==='user'?bot.trust:(bot.other[id]||0))-(id==='user'?bot.suspicion*.3:0)+(rand()-.5)*28})).sort((a,b)=>a.score-b.score)[0]?.id;}
function executeBlock(){if(game.stage!=='block')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<21)return toast('O bloqueio acontece a partir das 21h.');const targets=possibleTargets();if(!targets.length)return;let chosen=game.pendingBlock&&targets.includes(game.pendingBlock)?game.pendingBlock:null;const inf=game.influencers;
if(inf.includes('user')){const rival=inf.find(id=>id!=='user');const their=botTarget(rival);if(!chosen)return toast('Como influenciador, escolha quem você quer bloquear.');if(chosen!==their&&rand()<.32)chosen=their;}else{const picks=inf.map(botTarget);chosen=picks[0]===picks[1]?picks[0]:(rand()<.5?picks[0]:picks[1]);}
game.blocked.push(chosen);const p=pFor(chosen);log('21h — '+p.name+' foi bloqueado do Circle!','block');message('grupo','circle','ALERTA! '+p.name+' foi bloqueado. Está fora da disputa.');game.lastBlocked=chosen;game.stage=chosen==='user'?'eliminated':'post';if(chosen==='user'){game.gameOver=true;log('Você foi bloqueado. Sua temporada acabou.','end');}else{const identity=p.trueSelf?'Perfil verdadeiro.':p.secret;log('Revelação de '+p.name+': '+identity,'reveal');}
save();view='resultado';render();}
function nextWeek(){if(game.stage!=='post')return;game.week++;game.day=0;game.stage='social';game.vote=[];game.pendingBlock='';game.influencers=[];game.lastRealSunday=game.mode==='real'&&nowSP().weekday===0?nowSP().date:'';if(game.mode==='real'&&nowSP().weekday!==1)game.lastRealDay=nowSP().date;log('Semana '+game.week+' começou. Uma nova rodada de jogos e estratégias!','start');initiative();save();view='inicio';render();}
function finish(){if(game.stage!=='final')return;if(game.mode==='real'&&nowSP().weekday===0&&nowSP().hour<21)return toast('O resultado final sai a partir das 21h.');game.winner=game.rankings.at(-1).ranking[0].id;game.gameOver=true;game.stage='done';log('A temporada chegou ao fim. Vencedor: '+pFor(game.winner).name+'.','end');save();view='resultado';render();}
function taskSubmit(){
 let c=dueTask();if(!c)return toast('Hoje não há prova obrigatória.');
 if(game.tasks[c.key])return toast('Essa dinâmica já foi concluída.');
 const box=$('taskanswer');let result=box?.value?.trim()||'',drawing=null;
 if(c.type==='quiz')result=document.querySelector('input[name="quiz"]:checked')?.value||'';
 else if(c.type==='poll'){
   const trusted=$('trustchoice')?.value,suspect=$('suschoice')?.value;
   if(!trusted||!suspect||trusted===suspect)return toast('Escolha duas pessoas diferentes.');
   result='Mais confiável: '+pFor(trusted).name+' | Possível catfish: '+pFor(suspect).name;
   updateTrust(trusted,5,'Vc me considerou confiável na pesquisa.');
   updateTrust(suspect,-8,'Vc me apontou como possível catfish.');
 }else if(c.type==='rival'||c.type==='ally'){
   const selected=$('personchoice')?.value;
   if(!selected)return toast('Escolha um participante primeiro.');
   result=(c.type==='rival'?'Meu maior rival: ':'Minha dupla ideal: ')+pFor(selected).name+'. '+result;
 }else if(c.title==='Pintando Verdades'){
   const board=$('paintboard');
   if(board)try{drawing=board.toDataURL('image/jpeg',.56);}catch(e){}
   result=result||'Publiquei um desenho simbólico na dinâmica.';
 }
 if(!String(result).trim())return toast('Preencha sua resposta.');
 game.tasks[c.key]={answer:String(result).slice(0,650),title:c.title,at:Date.now()};
 if(drawing)game.tasks[c.key].image=drawing;
 if(c.type==='quiz'){
   log(Number(result)===c.correct?'Vc acertou o desafio de Mentes Brilhantes!':'Sua resposta foi registrada. A correta era Júpiter.','game');
 }else{
   const t=discoverTone(String(result));
   if(t.other){for(const p of people){if(p.id!==t.other.id){
     const change=c.type==='rival'?-8:c.type==='ally'?6:Math.round((rand()-.5)*7);
     n(p.id).other[t.other.id]=Math.min(100,Math.max(-100,(n(p.id).other[t.other.id]||0)+change));
   }}}
   log('Sua resposta à dinâmica "'+c.title+'" foi publicada.','game');
   message('grupo','circle',(c.type==='anon'?'Uma mensagem anônima foi enviada: ':'Dinâmica de '+game.player.alias+': ')+String(result).slice(0,450));
   if(c.type!=='anon'&&rand()<.7){const bot=pick(people.filter(p=>!blocked(p.id)));if(bot)npcReply('grupo',bot.id,'Reaja de forma natural à última mensagem da dinâmica, sem soar como robô. Se for dia 1, não fale de alianças ou votos.','',3300);}
 }
 save();render();toast('Resposta registrada!');
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
function games(){
 let c=dueTask(),done=c&&game.tasks[c.key];
 let copy='<div class="hero"><span class="pill">DINÂMICAS DA TEMPORADA</span><h2>Jogue com cabeça e coração</h2><p>Suas decisões alteram a imagem que os adversários têm de vc. Quarta e sábado são livres. Nos outros dias, as dinâmicas podem render conversas e desconfiança.</p></div>';
 if(game.stage!=='social')copy+='<div class="alert">As avaliações e bloqueios estão acontecendo. As dinâmicas da semana ficam pausadas até a próxima rodada.</div>';
 else if(!c)copy+='<div class="panel"><h2>🌿 Hoje é dia livre</h2><p class="muted">Quarta-feira é reservada ao seu desenvolvimento, sábado à sua gira e domingo às avaliações. Não há prova obrigatória agora.</p></div>';
 else {
   let form='';
   if(done)form='<div class="alert success">✓ Resposta registrada: '+E(done.answer)+'</div>'+(done.image?'<img src="'+E(done.image)+'" alt="Seu desenho" style="max-width:100%;border-radius:12px;margin-top:12px">':'');
   else if(c.type==='quiz')form='<div>'+c.answers.map((a,i)=>'<label style="display:block;margin:9px 0"><input type="radio" name="quiz" value="'+i+'"> '+E(a)+'</label>').join('')+'</div><button class="btn" data-act="task">Enviar resposta</button>';
   else if(c.type==='poll')form='<label class="label" for="trustchoice">Quem parece mais confiável?</label><select class="field" id="trustchoice"><option value="">Escolha alguém</option>'+people.filter(p=>!blocked(p.id)).map(p=>'<option value="'+p.id+'">'+E(p.name)+'</option>').join('')+'</select><label class="label" for="suschoice">Quem pode ser catfish?</label><select class="field" id="suschoice"><option value="">Escolha alguém</option>'+people.filter(p=>!blocked(p.id)).map(p=>'<option value="'+p.id+'">'+E(p.name)+'</option>').join('')+'</select><button class="btn" style="margin-top:12px" data-act="task">Enviar pesquisa</button>';
   else if(c.type==='rival'||c.type==='ally')form='<label class="label" for="personchoice">Selecione o jogador</label><select class="field" id="personchoice"><option value="">Escolha alguém</option>'+people.filter(p=>!blocked(p.id)).map(p=>'<option value="'+p.id+'">'+E(p.name)+'</option>').join('')+'</select><textarea class="field answer" id="taskanswer" maxlength="450" style="margin-top:10px" placeholder="Por que vc escolheu essa pessoa?"></textarea><button class="btn" style="margin-top:10px" data-act="task">Confirmar escolha</button>';
   else if(c.title==='Pintando Verdades')form='<p class="muted">Desenhe com o dedo na tela do celular ou com o mouse.</p><canvas id="paintboard" class="draw" width="700" height="350" aria-label="Quadro de pintura"></canvas><button class="btn secondary sm" style="margin:9px 0" data-act="clearpaint">Apagar desenho</button><textarea class="field answer" id="taskanswer" maxlength="450" placeholder="Legenda do seu desenho (opcional)"></textarea><button class="btn" style="margin-top:10px" data-act="task">Publicar desenho</button>';
   else form='<textarea class="field answer" id="taskanswer" maxlength="650" placeholder="Sua resposta vai influenciar as relações dentro do Circle..."></textarea><button class="btn" style="margin-top:10px" data-act="task">Publicar no Circle</button>';
   copy+='<div class="challenge"><span class="pill">SEMANA '+game.week+' · '+dayName(currentDay())+'</span><h3>'+E(c.title)+'</h3><p>'+E(c.desc)+'</p>'+form+'</div>';
 }
 copy+=title('Jogos da temporada','Versões para celular, sem aparelho de dança')+'<div class="gameGrid">'+CHALLENGES.map(g=>'<div class="gameChip"><strong>'+E(g.title)+'</strong><small>'+E(g.desc)+'</small></div>').join('')+'</div>';
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
else if(action==='clearpaint'){const p=$('paintboard');if(p)p.getContext('2d').clearRect(0,0,p.width,p.height);}
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
 if(first){painting=true;ctx.beginPath();ctx.moveTo(x,y);try{board.setPointerCapture(ev.pointerId);}catch(e){}}
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
})();