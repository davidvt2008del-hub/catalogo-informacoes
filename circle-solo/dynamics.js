/* Motor de dinâmicas sociais: decisões de todos os participantes, apuração e consequências.
   Separado do chat de IA. Não usa identidade secreta para enviesar os votos. */
(function(){
"use strict";
const signs=['Áries','Touro','Gêmeos','Câncer','Leão','Virgem','Libra','Escorpião','Sagitário','Capricórnio','Aquário','Peixes'];
const publicSigns={lia:'Leão',rafa:'Capricórnio',bia:'Câncer',dani:'Virgem',leo:'Libra',manu:'Áries',gui:'Peixes'};
const quiz=[
 {q:'Qual é o maior planeta do Sistema Solar?',opts:['Terra','Saturno','Júpiter','Netuno'],a:2},
 {q:'Quantos lados tem um hexágono?',opts:['Cinco','Seis','Sete','Oito'],a:1},
 {q:'Em qual continente está a cidade de Marrakech?',opts:['África','Europa','Ásia','Oceania'],a:0}
];
const quotes=[
 {by:'lia',text:'Se eu disser que nunca derrubei uma bandeja no trabalho, eu tô mentindo bonito.'},
 {by:'rafa',text:'Tem dia que minha vontade era desligar o despertador e sumir da academia.'},
 {by:'bia',text:'Eu comecei a faculdade achando que nunca ia precisar decorar tanta coisa.'},
 {by:'dani',text:'Já refiz um projeto inteiro porque o tom de azul me incomodava.'},
 {by:'leo',text:'Eu sou a pessoa que pausa um filme pra pesquisar uma coisa aleatória.'},
 {by:'manu',text:'Minha mãe ainda acha que pode administrar meu negócio melhor que eu.'},
 {by:'gui',text:'Já perdi a hora porque tava tentando tirar uma música de ouvido.'}
];
const truths={
 lia:['Já fingi que não vi um cliente conhecido porque eu só queria ir embora.','Eu fico toda sem jeito quando alguém me elogia de surpresa.'],
 rafa:['Se eu pudesse, ficava o domingo inteiro sem olhar pro celular.','Eu tenho medo de me decepcionar com pessoas em quem confio.'],
 bia:['Já chorei escondida depois de um dia horrível na faculdade.','Eu sempre tento cuidar de todo mundo e acabo esquecendo de mim.'],
 dani:['Já apaguei um desenho que eu amava porque achei que ninguém ia gostar.','Demoro muito para contar uma coisa íntima para alguém.'],
 leo:['Já me fiz de entendido num assunto e precisei pesquisar depois.','Eu releio mensagens antes de enviar porque penso demais.'],
 manu:['Já tive que pedir desculpa depois de falar na hora da raiva.','Eu tenho dificuldade em pedir ajuda, mesmo quando preciso.'],
 gui:['Já esqueci uma letra inteira no meio de um ensaio.','Tenho saudade de coisas simples que eu nem valorizava antes.']
};
const confessions={
 lia:'Às vezes, eu invento desculpa pra não sair porque prefiro ficar em casa.',
 rafa:'Eu já aumentei uma história pra parecer mais interessante numa conversa.',
 bia:'Eu faço cara de tranquila, mas fico pensando numa mensagem por horas.',
 dani:'Eu tenho um caderno com ideias que nunca mostrei a ninguém.',
 leo:'Já me apresentei de outro jeito porque tinha medo de não gostarem de mim.',
 manu:'Eu digo que não ligo pra opinião dos outros, mas ligo sim.',
 gui:'Já inventei que estava ocupado só porque não sabia dizer não.'
};
const bombs={
 lia:['Qual momento da sua vida vc mudaria se pudesse?','Quem aqui vc teria mais dificuldade de conhecer pessoalmente?'],
 rafa:['Vc já fingiu gostar de alguém pra não se sentir excluído?','Qual detalhe da sua história mais te deixa inseguro?'],
 bia:['Vc já se arrependeu de confiar em uma pessoa rápido demais?','Qual mania sua as pessoas não imaginam?'],
 dani:['Qual foi a última coisa que vc escondeu por insegurança?','Vc prefere ser querido por todos ou entendido por poucos?'],
 leo:['Qual situação te fez mudar de opinião sobre alguém?','Já contou uma história de um jeito diferente pra impressionar?'],
 manu:['Quando foi a última vez que seu orgulho atrapalhou alguma coisa?','Já falou mal de alguém e depois pediu desculpa?'],
 gui:['O que vc não consegue perdoar numa amizade?','Qual coisa boba te deixa com muita vergonha?']
};
const styles=['Samba','Pagode','Funk','Pop','Forró','Axé','Sertanejo','Rock','MPB'];
const outfits={
 lia:['Vestido verde com acessórios dourados e chinelo na bolsa.','Uma blusa estampada e brincos enormes, sem passar frio.'],
 rafa:['Camisa preta de linho e tênis branco.','Uma camisa aberta por cima de camiseta clara.'],
 bia:['Macacão rosa e muitas presilhas no cabelo.','Um vestido lilás e tênis bem confortável.'],
 dani:['Look todo preto com um detalhe prata.','Um conjunto azul-marinho, básico mas bem pensado.'],
 leo:['Camisa estampada e calça de sarja.','Uma camisa vintage com tênis surrado.'],
 manu:['Roupa vermelha com sandália brilhante.','Vestido amarelo e argolas enormes.'],
 gui:['Camisa florida e calça leve.','Camiseta de banda e uma jaqueta jeans.']
};
const track={
 lia:['pop anos 2000','música de verão'],rafa:['pagode','funk leve'],bia:['pop brasileiro','indie pop'],dani:['MPB','eletrônico tranquilo'],
 leo:['rock alternativo','MPB clássica'],manu:['axé','pagodão'],gui:['forró','MPB acústica']
};
function randomPick(a,random){return a[Math.floor(random()*a.length)]}
function shuffle(a,random){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function name(game,people,id){return id==='user'?game.player.alias:(people.find(p=>p.id===id)?.name||id)}
function alive(game,people){return ['user',...people.map(p=>p.id)].filter(id=>!game.blocked.includes(id));}
function score(game,id,target,kind,random){
 const bot=game.bots[id];
 const rel=target==='user'?(bot?.trust||0):(bot?.other?.[target]||0);
 const targetProfile=kind==='sus'?people.find(p=>p.id===target):null;
 const profileScore=target==='user'?(bot?.suspicion||0):Math.round((targetProfile?.bio?.length||40)/40);
 const noise=(random()-.5)*42;
 return kind==='sus'?-rel*.9+profileScore*.23+noise:rel*.95+(target==='user'?0:8)+noise;
}
function choose(game,people,id,kind,random,exclude=[]){
 const options=alive(game,people).filter(x=>x!==id&&!exclude.includes(x));
 return options.map(target=>({target,value:score(game,id,target,kind,random)})).sort((a,b)=>b.value-a.value)[0]?.target||'user';
}
function histogram(entries,k,game,people){
 const counts={};for(const e of entries){const id=e[k];if(id)counts[id]=(counts[id]||0)+1;}
 return Object.entries(counts).map(([id,count])=>({id,label:name(game,people,id),count})).sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));
}
function cloneEntry(by,label,detail,extras={}){return {by,label,detail,...extras};}
function modeName(kind){
 return ({zodiac:'Descubra o signo',poll:'Pesquisa de Opinião',truth:'Jogo da Verdade',quiz:'Mentes Brilhantes',painting:'Pintando Verdades',rival:'Meu Maior Rival',bomb:'A Última Bomba',dance:'Segue o Baile',party:'Festa do Circle',quote:'Quem disse isso?',confession:'Confissões',ally:'Compatibilidade'})[kind]||kind;
}
function picksForQuotes(game,people,random){
 const options=shuffle(quotes.filter(q=>alive(game,people).includes(q.by)),random).slice(0,3);
 return options.map(q=>({text:q.text,by:q.by,options:shuffle(alive(game,people).filter(x=>x!=='user'),random).slice(0,4).includes(q.by)
  ?shuffle(alive(game,people).filter(x=>x!=='user'),random).slice(0,4):shuffle([q.by,...shuffle(alive(game,people).filter(x=>x!=='user'&&x!==q.by),random).slice(0,3)],random)}));
}
function context(game,people,challenge,random){
 if(challenge.type!=='quote')return null;
 const key=challenge.key;
 if(!game.questionSets)game.questionSets={};
 if(!game.questionSets[key])game.questionSets[key]=picksForQuotes(game,people,random);
 return game.questionSets[key];
}
function applyEffects(game,ids,trustDelta,suspicionDelta=0){
 ids.forEach(id=>{
  if(id==='user')return;
  const b=game.bots[id];if(!b)return;
  b.trust=Math.max(-100,Math.min(100,b.trust+trustDelta));
  b.suspicion=Math.max(0,Math.min(100,b.suspicion+suspicionDelta));
 });
}
function resolved(game,people,c,input,random){
 const bots=people.filter(p=>!game.blocked.includes(p.id));
 const all=alive(game,people);
 const entries=[],sections=[],effects=[],gameContext=context(game,people,c,random);
 const select=(id,kind,exclude)=>choose(game,people,id,kind,random,exclude);
 const tally=(items,k,label)=>{const bars=histogram(items,k,game,people);sections.push({title:label,type:'bars',rows:bars});return bars;};
 const opinion=(by,label,detail,x={})=>entries.push(cloneEntry(by,label,detail,x));
 let headline='',summary='',reaction='',stake='',outcome={};
 const candidates=all.filter(id=>id!=='user');
 if(c.type==='zodiac'){
  const userTarget=input.target,guess=input.sign;
  opinion('user','Seu palpite',name(game,people,userTarget)+' é de '+guess,{target:userTarget,guess});
  for(const p of bots){const target=randomPick(all.filter(x=>x!==p.id),random);
   const sign=target==='user'?randomPick(signs,random):random()<.28?publicSigns[target]:randomPick(signs,random);
   opinion(p.id,'Palpite de '+p.name,name(game,people,target)+' seria de '+sign,{target,guess:sign});
  }
  const actual=publicSigns[userTarget];
  headline=actual?'O signo verdadeiro de '+name(game,people,userTarget)+' é '+actual:'Seu próprio signo ainda não foi informado no perfil.';
  const matched=entries.filter(e=>e.target===userTarget&&e.guess===actual).length;
  summary=actual?'Entre os palpites sobre '+name(game,people,userTarget)+', '+matched+' acertaram o signo.':'Os palpites sobre seu perfil continuam em aberto.';
  reaction='O Circle revelou os palpites e o signo do participante escolhido; os jogadores compararam as justificativas e primeiras impressões.';
  stake='É uma brincadeira de percepção, sem benefício de imunidade.';
 }
 else if(c.type==='poll'){
  opinion('user','Sua pesquisa','Mais confiável: '+name(game,people,input.trusted)+' · possível catfish: '+name(game,people,input.suspect),{trusted:input.trusted,suspect:input.suspect});
  for(const p of bots){let trusted=select(p.id,'trust'),suspect=select(p.id,'sus',[trusted]);opinion(p.id,'Voto secreto de '+p.name,'Votação registrada',{trusted,suspect});}
  const trusted=tally(entries,'trusted','Mais confiável');
  const suspected=tally(entries,'suspect','Mais suspeito de ser catfish');
  headline='O Circle revelou a opinião da casa';
  summary=(trusted[0]?name(game,people,trusted[0].id)+' liderou em confiança ('+trusted[0].count+' voto(s)). ':'')+
       (suspected[0]?name(game,people,suspected[0].id)+' recebeu mais suspeitas ('+suspected[0].count+' voto(s)).':'');
  reaction='Resultados oficiais da Pesquisa de Opinião: '+summary;
  stake='Ninguém foi revelado como catfish. São impressões dos participantes, não provas nem avaliações eliminatórias.';
  applyEffects(game,[input.trusted],3,-3);applyEffects(game,[input.suspect],-5,8);
  if(suspected[0]?.id==='user')bots.forEach(p=>{game.bots[p.id].suspicion=Math.min(100,game.bots[p.id].suspicion+2);});
  sections.push({title:'Como as pessoas votaram',type:'note',text:'A votação individual dos adversários permanece anônima; apenas os totais são públicos.'});
  outcome={poll:{trusted,suspected}};
 }
 else if(c.type==='truth'){
  opinion('user','Sua verdade',input.text);
  for(const p of bots)opinion(p.id,p.name+' contou',randomPick(truths[p.id],random));
  headline='A roda de verdades terminou';
  summary='Todos os '+all.length+' participantes responderam. Algumas histórias foram íntimas; outras, bem leves.';
  reaction='O Circle reuniu as verdades compartilhadas. Cada pessoa escolheu o quanto queria se expor.';
  stake='Quem se mostrou vulnerável pode ganhar proximidade, mas nenhuma resposta prova a identidade verdadeira.';
  applyEffects(game,bots.map(p=>p.id),2);
 }
 else if(c.type==='quiz'){
  const answers=input.answers;let userCorrect=0;let scores=[{by:'user',name:name(game,people,'user'),points:0}];
  for(let i=0;i<quiz.length;i++){if(Number(answers[i])===quiz[i].a){userCorrect++;scores[0].points++;}}
  for(const p of bots){let points=0;const picks=[];
   for(let i=0;i<quiz.length;i++){const isRight=random()<(p.traits.game>=80?.78:p.traits.game<=35?.42:.62);
    const answer=isRight?quiz[i].a:randomPick(quiz[i].opts.map((_,k)=>k).filter(k=>k!==quiz[i].a),random);
    picks.push(answer);if(answer===quiz[i].a)points++;
   }
   scores.push({by:p.id,name:p.name,points});opinion(p.id,p.name+' respondeu',points+'/'+quiz.length+' questões corretas');
  }
  scores.sort((a,b)=>b.points-a.points||a.name.localeCompare(b.name));
  sections.push({title:'Placar de conhecimento',type:'scores',rows:scores});
  sections.push({title:'Gabarito',type:'notes',rows:quiz.map((q,i)=>({label:q.q,detail:q.opts[q.a]}))});
  headline=userCorrect===3?'Vc acertou todas!':userCorrect===0?'Nenhuma resposta certa desta vez.':userCorrect+' acerto(s) para vc';
  summary='Os maiores resultados foram '+scores.filter(s=>s.points===scores[0].points).map(s=>s.name).join(', ')+' com '+scores[0].points+'/'+quiz.length+'.';
  reaction='O Circle divulgou o placar completo de Mentes Brilhantes. '+summary;
  stake='Essa prova rende assunto para o grupo; não elimina ninguém diretamente.';
  outcome={scores};
 }
 else if(c.type==='painting'){
  opinion('user','Sua pintura','Um desenho sobre '+name(game,people,input.target)+(input.text?': '+input.text:'.'),{image:input.image||'',target:input.target});
  const symbols=['🌻','🎭','🌊','🔥','🎵','⭐','🎨','☕'];
  for(const p of bots){const target=randomPick(all.filter(x=>x!==p.id),random);
   const symbol=randomPick(symbols,random);
   opinion(p.id,'Pintura de '+p.name,symbol+' · '+name(game,people,target)+' visto(a) como '+randomPick(['uma pessoa luminosa','alguém misterioso','uma energia tranquila','alguém cheio de histórias','uma pessoa divertida','um desafio'],random),{target,symbol});
  }
  let grouped=tally(entries,'target','Quem apareceu mais nos desenhos?');
  headline='O Circle abriu a galeria anônima';
  summary=(grouped[0]?name(game,people,grouped[0].id)+' apareceu em '+grouped[0].count+' desenho(s). ':'')+'Os participantes podem comparar o que cada pintura quis transmitir.';
  reaction='As pinturas anônimas foram exibidas, com diferentes interpretações sobre os perfis.';
  stake='A galeria mostra percepções, não identidades secretas.';
 }
 else if(c.type==='rival'){
  opinion('user','Sua escolha',name(game,people,input.target)+(input.text?' — '+input.text:''),{target:input.target});
  for(const p of bots){let target=select(p.id,'sus');opinion(p.id,'Escolha secreta de '+p.name,'', {target});}
  let bars=tally(entries,'target','Quem foi citado como maior rival');
  headline='O maior rival da casa foi escolhido';
  summary=(bars[0]?name(game,people,bars[0].id)+' recebeu '+bars[0].count+' indicação(ões).':'');
  reaction='Os jogadores descobriram quem foi mais citado como rival, mas o Circle preservou os autores das escolhas.';
  stake='A rivalidade pode afetar confiança e conversas, mas não provoca um bloqueio imediato.';
  applyEffects(game,[input.target],-5,5);
 }
 else if(c.type==='bomb'){
  opinion('user','Sua pergunta anônima',input.text,{target:input.target,anonymous:true});
  for(const p of bots){const target=select(p.id,'sus');opinion(p.id,'Pergunta anônima',randomPick(bombs[p.id],random),{target,anonymous:true});}
  const targets=tally(entries,'target','Quem recebeu mais perguntas');
  headline='As perguntas anônimas foram abertas';
  summary=(targets[0]?name(game,people,targets[0].id)+' recebeu '+targets[0].count+' pergunta(s).':'')+' Cada participante pode responder no grupo.';
  reaction='As perguntas anônimas apareceram na tela. O Circle convidou os alvos a responder.';
  stake='Perguntas não revelam autoria. As reações e respostas podem alterar a opinião dos demais.';
  outcome={questions:entries.map(e=>({target:e.target,text:e.detail,by:e.by}))};
 }
 else if(c.type==='dance'){
  opinion('user','Sua indicação',name(game,people,input.target)+' combina com '+input.style+(input.text?' porque '+input.text:''),{target:input.target,style:input.style});
  for(const p of bots){const target=randomPick(all.filter(x=>x!==p.id),random),style=randomPick(styles,random);opinion(p.id,'Escolha de '+p.name,name(game,people,target)+' combina com '+style,{target,style});}
  const bars=tally(entries,'target','Quem mais inspirou indicações');
  const styleCount={};entries.forEach(e=>styleCount[e.style]=(styleCount[e.style]||0)+1);
  sections.push({title:'Ritmos mais escolhidos',type:'notes',rows:Object.entries(styleCount).sort((a,b)=>b[1]-a[1]).map(([label,count])=>({label,detail:count+' indicação(ões)'}))});
  headline='A festa ganhou trilha sonora';
  summary=(bars[0]?name(game,people,bars[0].id)+' foi a pessoa mais associada a um estilo de dança.':'')+' Sem sensores nem aparelhos.';
  reaction='O Circle compartilhou os estilos musicais escolhidos e abriu o chat para comentar.';
  stake='É um jogo de percepção e humor, sem disputa física ou vantagem de voto.';
 }
 else if(c.type==='party'){
  opinion('user','Seu look','Look: '+input.text+'. Música: '+input.song);
  for(const p of bots)opinion(p.id,'Look de '+p.name,randomPick(outfits[p.id],random)+' Música: '+randomPick(track[p.id],random)+'.');
  const prizes=[
   {label:'Mais criativo',id:randomPick(all,random)},
   {label:'Melhor trilha sonora',id:randomPick(all,random)},
   {label:'Visual mais comentado',id:randomPick(all,random)}
  ];
  sections.push({title:'Destaques da festa',type:'notes',rows:prizes.map(p=>({label:p.label,detail:name(game,people,p.id)}))});
  headline='A Festa do Circle movimentou os apartamentos';
  summary=prizes.map(p=>p.label+': '+name(game,people,p.id)).join(' · ');
  reaction='Os looks e as músicas de todos os participantes foram revelados. '+summary;
  stake='Os prêmios são simbólicos e não interferem diretamente no bloqueio.';
  applyEffects(game,bots.map(p=>p.id),1);
 }
 else if(c.type==='quote'){
  const cards=gameContext||[];
  let score=0;
  for(let i=0;i<cards.length;i++){
   const q=cards[i];if(input.guesses?.[i]===q.by)score++;
   opinion(q.by,'Depoimento '+(i+1),q.text,{correct:q.by,userGuess:input.guesses?.[i],quote:i+1});
  }
  sections.push({title:'Quem disse cada frase',type:'notes',rows:cards.map((q,i)=>({label:'Frase '+(i+1),detail:name(game,people,q.by)+' · vc respondeu '+name(game,people,input.guesses?.[i])}))});
  headline='Vc acertou '+score+' de '+cards.length+' identidades';
  summary='Agora os autores dos depoimentos foram revelados. Acertar depende de lembrar quem é quem, não de adivinhar quem é catfish.';
  reaction='O Circle revelou quem escreveu cada depoimento. '+headline+'.';
  stake='Esta dinâmica testa o quanto vc conhece o jeito de cada um.';
  outcome={score,max:cards.length};
 }
 else if(c.type==='confession'){
  opinion('user','Confissão anônima',input.text,{anonymous:true});
  for(const p of bots)opinion(p.id,'Confissão anônima',confessions[p.id],{anonymous:true});
  const shuffled=shuffle(entries,random);
  entries.length=0;entries.push(...shuffled);
  headline='As confissões foram divulgadas sem nomes';
  summary=entries.length+' mensagens anônimas foram compartilhadas. Os participantes podem comentar sem saber a autoria.';
  reaction='O Circle divulgou as confissões anonimamente. O grupo está livre para conversar sobre o que foi contado.';
  stake='Os autores não são revelados nesta dinâmica. Uma confissão não é prova de identidade falsa.';
 }
 else if(c.type==='ally'){
  opinion('user','Sua dupla',name(game,people,input.target)+(input.text?' — '+input.text:''),{partner:input.target});
  for(const p of bots){const partner=select(p.id,'trust');opinion(p.id,'Escolha secreta de '+p.name,'',{partner});}
  const mutual=[];
  for(const item of entries){if(item.by==='user'||!item.partner)continue;const other=entries.find(e=>e.by===item.partner);if(other?.partner===item.by)mutual.push([item.by,item.partner]);}
  let pair=mutual.length?randomPick(mutual,random):null;
  if(!pair){const popular=histogram(entries,'partner',game,people);const lead=popular[0]?.id||'user';const supporter=entries.find(e=>e.partner===lead&&e.by!==lead)?.by||'user';pair=[lead,supporter];}
  pair=[...new Set(pair)].filter(Boolean);
  game.immunity={week:game.week,ids:pair};
  sections.push({title:'Dupla protegida no bloqueio desta semana',type:'notes',rows:[{label:'Participantes',detail:pair.map(id=>name(game,people,id)).join(' e ')}]});
  const partners=tally(entries,'partner','Quem foi mais escolhido como dupla');
  headline='O Circle formou uma dupla protegida';
  summary=pair.map(id=>name(game,people,id)).join(' e ')+' terão proteção contra o próximo bloqueio desta semana.';
  reaction='Resultado de Compatibilidade: '+summary;
  stake='Proteção vale somente no bloqueio atual. Na próxima semana termina. A dupla continua participando das avaliações normalmente.';
  applyEffects(game,[input.target],4,-2);
  outcome={protected:pair};
 }
 else throw Error('Tipo de dinâmica desconhecido: '+c.type);
 return {key:c.key,kind:c.type,title:c.title,headline,summary,reaction,stake,entries,sections,meta:outcome,submittedAt:Date.now(),releaseAt:Date.now()+10500,stage:'collecting',resultRead:false,reacted:false};
}
window.CircleDynamics={signs,quiz,styles,publicSigns,modeName,context,resolved,alive,quotes};
})();