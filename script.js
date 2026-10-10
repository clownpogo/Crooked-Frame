// starbursts
document.querySelectorAll('[data-burst]').forEach((el,k)=>{
 const n=+el.dataset.burst,inn=+el.dataset.in||.7,p=[];let s=k*7+3;
 const r=()=>(s=(s*9301+49297)%233280)/233280;
 for(let i=0;i<n*2;i++){const a=i/(n*2)*Math.PI*2,out=i%2==0,rad=out?(.9+r()*.1):inn*(.9+r()*.12);
  p.push((50+Math.cos(a)*rad*50).toFixed(1)+'% '+(50+Math.sin(a)*rad*50).toFixed(1)+'%')}
 el.style.clipPath='polygon('+p.join(',')+')';
});
// dropdowns
const dds=[...document.querySelectorAll('.dd')];
dds.forEach(d=>{const b=d.querySelector('button');
 b.addEventListener('click',e=>{e.stopPropagation();const o=!d.classList.contains('open');dds.forEach(x=>{x.classList.remove('open');x.firstElementChild.setAttribute('aria-expanded','false')});d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)});
 d.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>d.classList.remove('open')))});
document.addEventListener('click',()=>dds.forEach(x=>x.classList.remove('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape')dds.forEach(x=>x.classList.remove('open'))});
// home buttons
document.querySelectorAll('[data-top]').forEach(b=>b.addEventListener('click',()=>scrollTo({top:0})));
// carousel
const cs=document.getElementById('cards');
document.getElementById('next').onclick=()=>cs.appendChild(cs.firstElementChild);
document.getElementById('prev').onclick=()=>cs.prepend(cs.lastElementChild);
// form
document.getElementById('f').addEventListener('submit',e=>{e.preventDefault();{const sb=document.querySelector('.fsend');sb.classList.remove('rg');void sb.offsetWidth;sb.classList.add('rg')}
 const ok=document.getElementById('ok'),m=document.getElementById('msg'),em=document.getElementById('e');
 if(!m.value.trim()){ok.className='fmsg err';ok.textContent='Напишите сообщение';m.focus();return}
 if(!/^\S+@\S+\.\S+$/.test(em.value.trim())){ok.className='fmsg err';ok.textContent='Укажите корректный Email';em.focus();return}
 ok.className='fmsg';ok.textContent='Сообщение отправлено. Мы ответим на ваш Email.';e.target.reset()});

// product pages
const toast=document.getElementById('toast');
// ---- transitions between product pages (Комуникации / Безопастность / Развлечение) ----
const PG_ORDER=['comm','safe','fun'],PG_COL={comm:'#99e000',safe:'#ee1111',fun:'#14c8f0'};
const trEl=document.createElement('div');trEl.className='tr';trEl.setAttribute('aria-hidden','true');
trEl.innerHTML='<i class="tl d"></i><i class="tl c"></i><i class="st"></i>';document.body.appendChild(trEl);
(()=>{const n=12,d=5,p=[];for(let k=0;k<=n;k++)p.push((k%2?0:d)+'% '+(k/n*100).toFixed(2)+'%');
 for(let k=0;k<=n;k++){const y=100-k/n*100;p.push((100-(k%2?0:d))+'% '+y.toFixed(2)+'%')}
 trEl.querySelectorAll('.tl').forEach(x=>x.style.clipPath='polygon('+p.join(',')+')')})();
const curPg=()=>document.querySelector('.pg.on');
const curKey=()=>{const c=curPg();return c?c.id.slice(3):null};
let trBusy=false;
function swapPg(to){
 document.querySelectorAll('.pg.on').forEach(p=>p.classList.remove('on'));
 if(to){document.getElementById('pg-'+to).classList.add('on');document.body.style.overflow='hidden'}else document.body.style.overflow='';
}
function goPg(to){
 const from=curKey();if(trBusy||to===from)return;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches||!trEl.animate){swapPg(to);return}
 trBusy=true;trEl.classList.add('on');
 const dk=trEl.querySelector('.tl.d'),cl=trEl.querySelector('.tl.c'),st=trEl.querySelector('.st');
 const SITE_COL=['#7da8e8','#3a3a3a','#c8131b','#1cc834'],sa=document.getElementById('sideArt'),
  siteC=SITE_COL[+(sa&&sa.dataset.th)||0],gA=from?PG_COL[from]:siteC,gB=to?PG_COL[to]:siteC;
 cl.style.background='linear-gradient(90deg,'+gA+' 14%,'+gB+' 86%)';
 const IN='cubic-bezier(.65,0,.35,1)',off='translateX(-160vw)',mid='translateX(-30vw)',out='translateX(100vw)';
 const run=(el,a,b,o)=>el.animate([{transform:a},{transform:b}],Object.assign({fill:'forwards',easing:IN},o));
 const p1=[run(dk,off,mid,{duration:420}),run(cl,off,mid,{duration:420,delay:130}),
  st.animate([{transform:'scale(0) rotate(-200deg)'},{transform:'scale(1) rotate(0)'}],{duration:340,delay:240,fill:'forwards',easing:'cubic-bezier(.2,1.4,.4,1)'})];
 Promise.all(p1.map(a=>a.finished)).then(()=>{
  swapPg(to);
  setTimeout(()=>{
   const p2=[run(cl,mid,out,{duration:460}),run(dk,mid,out,{duration:460,delay:130}),
    st.animate([{transform:'scale(1) rotate(0)'},{transform:'scale(0) rotate(200deg)'}],{duration:300,fill:'forwards',easing:'ease-in'})];
   Promise.all(p2.map(a=>a.finished)).then(()=>{
    [...p1,...p2].forEach(a=>a.cancel());trEl.classList.remove('on');trBusy=false})
  },60)});
}
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>goPg(b.dataset.page)));
const closePg=()=>{if(curPg())goPg(null)};
document.querySelectorAll('[data-back]').forEach(b=>b.addEventListener('click',closePg));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePg();
 if((e.key==='ArrowRight'||e.key==='ArrowLeft')&&curPg()&&!curPg().classList.contains('spec')&&!document.getElementById('cartov').classList.contains('on')){
  const k=PG_ORDER.indexOf(curKey()),n=PG_ORDER.length;goPg(PG_ORDER[(k+(e.key==='ArrowRight'?1:n-1))%n])}});
// cart
const cart={};const cov=document.getElementById('cartov'),ciEl=document.getElementById('ci'),cnt=document.getElementById('cnt');
function renderCart(){
 const ks=Object.keys(cart);const total=ks.reduce((a,k)=>a+cart[k],0);
 cnt.textContent=total;cnt.classList.toggle('on',total>0);document.querySelectorAll('.cartb .badge').forEach(b=>{b.textContent=total;b.classList.toggle('on',total>0)});
 ciEl.innerHTML='';
 if(!ks.length){ciEl.innerHTML='<div class="empty">Корзина пуста</div>';return}
 ks.forEach(k=>{const r=document.createElement('div');r.className='ci';
  r.innerHTML='<span class="n"></span><button aria-label="Меньше">−</button><b>'+cart[k]+'</b><button aria-label="Больше">+</button><button class="rm" aria-label="Удалить">✕</button>';
  r.querySelector('.n').textContent=k;const [m,p,x]=r.querySelectorAll('button');
  m.onclick=()=>{if(--cart[k]<=0)delete cart[k];renderCart()};p.onclick=()=>{cart[k]++;renderCart()};x.onclick=()=>{delete cart[k];renderCart()};
  ciEl.appendChild(r)});
 const c=document.createElement('button');c.className='clr';c.textContent='Очистить';c.onclick=()=>{for(const k in cart)delete cart[k];renderCart()};ciEl.appendChild(c);
}
const openCart=()=>{renderCart();cov.classList.add('on')},closeCart=()=>cov.classList.remove('on');
document.getElementById('cartBtn').addEventListener('click',openCart);
document.querySelectorAll('[data-cart]').forEach(b=>b.addEventListener('click',openCart));
document.getElementById('cx').addEventListener('click',closeCart);
cov.addEventListener('click',e=>{if(e.target===cov)closeCart()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart()});
document.querySelectorAll('[data-buy]').forEach(b=>b.addEventListener('click',()=>{
 cart['Говорилка (Модель 01-К)']=(cart['Говорилка (Модель 01-К)']||0)+1;renderCart();

 const total=Object.values(cart).reduce((a,b)=>a+b,0);
 toast.querySelector('.ts').textContent='Говорилка (Модель 01-К) · в корзине: '+total;
 clearTimeout(toast._t);toast.classList.remove('on');void toast.offsetWidth;toast.classList.add('on');
 const ti=toast.querySelector('.ti');ti.querySelectorAll('.spark').forEach(x=>x.remove());
 for(let i=0;i<9;i++){const k=document.createElement('i');k.className='spark';const an=i/9*Math.PI*2+.3,d=58+(i%2)*18;
  k.style.setProperty('--dx',Math.cos(an)*d+'px');k.style.setProperty('--dy',Math.sin(an)*d+'px');k.style.background=['#e4bc38','#99e000','#14c8f0','#ee1111'][i%4];ti.appendChild(k);setTimeout(()=>k.remove(),900)}
 document.querySelectorAll('.cnt,.cartb .badge').forEach(el=>{el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump')});
 toast._t=setTimeout(()=>toast.classList.remove('on'),2400)}));
renderCart();

// smooth reveal between slides
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
 document.querySelectorAll('.cards,.fin form,.bubble .t').forEach(el=>{el.classList.add('rv');io.observe(el)});
 document.querySelectorAll('.nav8').forEach(el=>{el.classList.add('rv-s');io.observe(el)});
}

// slide labels: slide in + spinning star on scroll into the slide
(()=>{const secs=document.querySelectorAll('.assort,.why');
 const sp=document.querySelector('.assort .sp4');if(sp)sp.classList.add('sp');
 if(!('IntersectionObserver' in window)){secs.forEach(x=>x.classList.add('on-view'));return}
 const io=new IntersectionObserver(es=>es.forEach(e=>{
  if(e.intersectionRatio>=.25)e.target.classList.add('on-view');
  else if(e.intersectionRatio===0)e.target.classList.remove('on-view')}),{threshold:[0,.25]});
 secs.forEach(x=>io.observe(x))})();
// menu: open on slide 1, folded elsewhere (hover to show)
(()=>{const nav=document.querySelector('nav'),hero=document.querySelector('.hero');
 const upd=()=>nav.classList.toggle('min',hero.getBoundingClientRect().bottom<innerHeight*.5);
 addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd()})();

// fit text to the reference widths (shrinks only)
function fitAll(){
 const u=Math.min(document.documentElement.clientWidth,1440)/1440;
 document.querySelectorAll('.fit').forEach(s=>{s.style.transform='none';
  const w=s.getBoundingClientRect().width,max=parseFloat(s.dataset.w)*u;
  const left=s.matches('.pillw .fit,.pill2 .fit,.qb2 .fit');const k=w>max&&w>0?'scaleX('+(max/w).toFixed(3)+')':'';s.style.transform=(left?'':'translateX(-50%) ')+k||'none'});
}
fitAll();addEventListener('resize',fitAll);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fitAll);
;
(()=>{const pc=document.getElementById('pg-comm');if(!pc)return;const more=pc.querySelector('.cmore'),x=pc.querySelector('.specx'),ov=pc.querySelector('.specov');
const open=()=>{pc.classList.add('spec');more.setAttribute('aria-expanded','true');setTimeout(()=>x.focus({preventScroll:true}),50)};
const close=()=>{if(!pc.classList.contains('spec'))return;pc.classList.remove('spec');more.setAttribute('aria-expanded','false');more.focus({preventScroll:true})};
more.addEventListener('click',open);x.addEventListener('click',e=>{e.stopPropagation();close()});
ov.addEventListener('click',e=>{if(e.target===ov)close()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pc.classList.contains('spec')){e.stopImmediatePropagation();close()}},true);
document.addEventListener('click',e=>{if(e.target.closest('#pg-comm [data-back]')){pc.classList.remove('spec');more.setAttribute('aria-expanded','false')}},true);
})();
;
// ===== Звуки страниц: Web Audio, без внешних файлов =====
(()=>{
const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
let ctx,master,bus=null;
const ensure=()=>{
 if(!ctx){ctx=new AC();master=ctx.createGain();master.gain.value=.55;
  const cp=ctx.createDynamicsCompressor();master.connect(cp);cp.connect(ctx.destination)}
 if(ctx.state==='suspended')ctx.resume();return ctx};
// браузеры разрешают звук только после действия пользователя
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,ensure,{capture:true,passive:true}));

function osc(t,f,o){o=o||{};
 const x=ctx.createOscillator(),g=ctx.createGain();x.type=o.type||'sine';
 x.frequency.setValueAtTime(f,t);if(o.to)x.frequency.exponentialRampToValueAtTime(o.to,t+(o.sweep||o.dur));
 if(o.det)x.detune.value=o.det;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.gain,t+(o.att||.005));
 g.gain.exponentialRampToValueAtTime(.0001,t+o.dur);
 let out=g;if(o.lp){const l=ctx.createBiquadFilter();l.type='lowpass';l.frequency.setValueAtTime(o.lp,t);
  l.frequency.exponentialRampToValueAtTime(o.lpEnd||600,t+o.dur);x.connect(l);l.connect(g)}else x.connect(g);
 g.connect(o.out||bus);x.start(t);x.stop(t+o.dur+.05)}

// колокольчик: основной тон + верхние обертоны
const bell=(t,f,dur,gain,out)=>{osc(t,f,{dur,gain,out});osc(t,f*2.01,{dur:dur*.55,gain:gain*.28,out});osc(t,f*3.97,{dur:dur*.25,gain:gain*.1,out})};

// 1) «Уведомление компьютера» — классический «динь-динь»
function ding(t){
 bell(t,880,.45,.34);        // короткая нижняя нота
 bell(t+.13,1318.5,1.0,.40); // верхняя, звенит дольше
}

// 2) «Получение предмета» — короткий эпичный сигнал
function epic(t0){
 // свист: шум, поднимающийся по частоте, пока девайс влетает
 const len=ctx.sampleRate*.7,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
 for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
 const n=ctx.createBufferSource();n.buffer=buf;
 const bp=ctx.createBiquadFilter();bp.type='bandpass';bp.Q.value=2.2;
 bp.frequency.setValueAtTime(350,t0);bp.frequency.exponentialRampToValueAtTime(4200,t0+.6);
 const ng=ctx.createGain();ng.gain.setValueAtTime(0,t0);
 ng.gain.linearRampToValueAtTime(.30,t0+.55);ng.gain.linearRampToValueAtTime(0,t0+.68);
 n.connect(bp);bp.connect(ng);ng.connect(bus);n.start(t0);
 // быстрое восходящее арпеджио
 [523.25,659.25,783.99,1046.5].forEach((f,i)=>osc(t0+.2+i*.1,f,{type:'triangle',dur:.22,gain:.17}));
 // удар в момент, когда девайс «встаёт» на место (~0,6 с)
 const h=t0+.6;
 [261.63,392,523.25,659.25,783.99].forEach(f=>[-7,7].forEach(c=>
  osc(h,f,{type:'sawtooth',dur:1.1,gain:.05,det:c,lp:4200,lpEnd:700,att:.01})));
 osc(h,120,{to:48,sweep:.35,dur:.6,gain:.55,att:.004});            // низкий «бум»
 // искры
 [2093,2637,3136,4186,3136].forEach((f,i)=>osc(h+.06+i*.085,f,{dur:.55,gain:.075,type:'triangle'}));
 // девайс срывается с центра и летит на своё место: свист вверх-вниз и мягкий «стук» при посадке
 const fl=t0+1.45,fb=ctx.createBuffer(1,ctx.sampleRate*.8,ctx.sampleRate),fd=fb.getChannelData(0);
 for(let i=0;i<fd.length;i++)fd[i]=Math.random()*2-1;
 const fs=ctx.createBufferSource();fs.buffer=fb;
 const fbp=ctx.createBiquadFilter();fbp.type='bandpass';fbp.Q.value=1.6;
 fbp.frequency.setValueAtTime(500,fl);fbp.frequency.exponentialRampToValueAtTime(3000,fl+.4);fbp.frequency.exponentialRampToValueAtTime(700,fl+.75);
 const fg=ctx.createGain();fg.gain.setValueAtTime(0,fl);fg.gain.linearRampToValueAtTime(.2,fl+.3);fg.gain.linearRampToValueAtTime(0,fl+.78);
 fs.connect(fbp);fbp.connect(fg);fg.connect(bus);fs.start(fl);
 osc(t0+2.02,150,{to:65,sweep:.22,dur:.4,gain:.32,att:.004});
 [659.25,987.77].forEach((f,i)=>osc(t0+2.04+i*.07,f,{dur:.6,gain:.06}));
}

const PLAY={comm:{d:.1,fn:epic},safe:{d:.5,fn:ding},fun:{d:.5,fn:ding}}; // d = задержка анимации страницы
const fade=()=>{if(bus){const b=bus;b.gain.cancelScheduledValues(ctx.currentTime);
 b.gain.setValueAtTime(b.gain.value,ctx.currentTime);b.gain.linearRampToValueAtTime(0,ctx.currentTime+.15);bus=null}};

const mo=new MutationObserver(ms=>ms.forEach(m=>{
 const el=m.target,was=/(^|\s)on(\s|$)/.test(m.oldValue||''),is=el.classList.contains('on');
 if(was&&!is){fade();return}
 if(!is||was)return;                       // реагируем только на момент открытия страницы
 const p=PLAY[el.id.slice(3)];if(!p)return;
 const c=ensure();fade();
 c.resume().then(()=>{
  if(!el.classList.contains('on'))return;  // успели закрыть
  bus=c.createGain();bus.connect(master);
  const delay=matchMedia('(prefers-reduced-motion: reduce)').matches?0:p.d;
  p.fn(c.currentTime+delay+.02)});
}));
document.querySelectorAll('.pg').forEach(pg=>mo.observe(pg,{attributes:true,attributeFilter:['class'],attributeOldValue:true}));

// ===== UI-звуки: клик, «Приобрести», слайд между страницами =====
const go=fn=>{const c=ensure();c.state==='running'?fn(c.currentTime+.005):c.resume().then(()=>fn(c.currentTime+.005))};
const O=()=>({out:master});

// обычный клик по кнопке — короткий «тик»
function click(t){
 osc(t,1900,Object.assign(O(),{type:'triangle',to:900,dur:.05,gain:.13}));
 osc(t,320,Object.assign(O(),{dur:.06,gain:.12}));
}
// «Приобрести»: «пик» и затем «положили в корзину» (глухой стук + два восходящих звоночка)
function buy(t){
 osc(t,1500,Object.assign(O(),{type:'square',dur:.075,gain:.09,lp:5000,lpEnd:2500}));
 osc(t+.11,520,Object.assign(O(),{to:230,sweep:.12,dur:.14,gain:.32}));
 bell(t+.2,1046.5,.45,.22,master);
 bell(t+.3,1568,.8,.26,master);
}
// слайд: шум, проходящий по частотам
let nb;
const nbuf=()=>{if(!nb){const n=ctx.sampleRate,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<n;i++)d[i]=Math.random()*2-1;nb=b}return nb};
function swish(t,from,to,dur,gain){
 const s=ctx.createBufferSource();s.buffer=nbuf();s.loop=true;
 const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=1.1;
 f.frequency.setValueAtTime(from,t);f.frequency.exponentialRampToValueAtTime(to,t+dur);
 const g=ctx.createGain();g.gain.setValueAtTime(0,t);
 g.gain.linearRampToValueAtTime(gain,t+dur*.45);g.gain.linearRampToValueAtTime(0,t+dur);
 s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+dur+.05)}
function slide(t){swish(t,300,3200,.55,.15);swish(t+.6,3000,350,.6,.15)}


// «Очистить» — выброс мусора: шуршание бумаги, падение, глухой стук о ведро
function crackle(t,f,dur,gain){
 const s=ctx.createBufferSource(),b=ctx.createBiquadFilter(),g=ctx.createGain();
 s.buffer=nbuf();b.type='bandpass';b.frequency.value=f;b.Q.value=1.4;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 s.connect(b);b.connect(g);g.connect(master);s.start(t,Math.random()*.5);s.stop(t+dur+.02)}
function trash(t){
 // мнётся бумага: частые короткие хрусты, постепенно реже
 let x=0;for(let i=0;i<11;i++){crackle(t+x,1500+Math.random()*4500,.02+Math.random()*.03,.1+Math.random()*.12);x+=.018+i*.008+Math.random()*.02}
 swish(t+.12,2600,450,.28,.07);                         // бумага летит вниз
 const h=t+.4;                                            // удар о дно ведра
 osc(h,170,Object.assign(O(),{to:55,sweep:.22,dur:.3,gain:.42,att:.003}));
 crackle(h,700,.12,.22);
 osc(h,312,Object.assign(O(),{dur:.35,gain:.07,att:.002}));  // лёгкий металлический «дзынь»
 osc(h,497,Object.assign(O(),{dur:.28,gain:.05,att:.002}));
 for(let i=0;i<3;i++)crackle(h+.1+i*.07+Math.random()*.03,1800+Math.random()*3000,.025,.06)  // бумага оседает
}

document.addEventListener('click',e=>{
 const b=e.target.closest&&e.target.closest('button,a,[role=button]');if(!b)return;
 go(b.closest('[data-buy]')?buy:b.closest('.clr')?trash:click)},true);

// переход между страницами: полоса выезжает — звук слайда
const tr=document.querySelector('.tr');
if(tr)new MutationObserver(ms=>ms.forEach(m=>{
 if(tr.classList.contains('on')&&!/(^|\s)on(\s|$)/.test(m.oldValue||''))go(slide)
})).observe(tr,{attributes:true,attributeFilter:['class'],attributeOldValue:true});
})();
;
// ===== Фоновая музыка (приветственный оркестр для магазина, генерируется в браузере) + боковая кнопка =====
(()=>{
const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;

/* ---------- кнопка + ползунок громкости ---------- */
const st=document.createElement('style');
st.textContent=`
#snd{position:fixed;right:0;top:calc(var(--u)*50);z-index:150;height:max(54px,calc(var(--u)*80));display:flex;align-items:center;gap:4px;padding:0 0 0 max(12px,calc(var(--u)*18));
 border:max(3px,calc(var(--u)*5)) solid #111;border-right:0;border-radius:max(20px,calc(var(--u)*30)) 0 0 max(20px,calc(var(--u)*30));
 background:#fff;box-shadow:max(-4px,calc(var(--u)*-7)) max(4px,calc(var(--u)*7)) 0 #111;
 transform:translateX(calc(100% - 18px));transition:transform .4s cubic-bezier(.2,.8,.25,1),top .4s cubic-bezier(.2,.8,.25,1),background .2s}
#snd::before{content:"";position:absolute;left:7px;top:50%;width:5px;height:34px;margin-top:-17px;border-radius:3px;background:#111;opacity:.55;transition:opacity .2s;pointer-events:none}
#snd.open{top:calc(var(--u)*125)}
#snd.open,#snd:hover,#snd.peek,#snd.drag{transform:none}
#snd:has(:focus-visible){transform:none}
#snd.open::before,#snd:hover::before,#snd.peek::before,#snd.drag::before{opacity:0}
#snd:has(:focus-visible)::before{opacity:0}
#snd.on{background:#99e000}
#snd button{flex:none;width:max(54px,calc(var(--u)*80));height:100%;padding:0;border:0;background:none;display:grid;place-items:center;cursor:pointer;border-radius:inherit}
#snd button:focus-visible{outline:3px solid #111;outline-offset:-6px}
#snd button svg{width:58%;height:58%;display:block;transition:transform .15s}
#snd button:hover svg{transform:scale(1.1)}#snd button:active svg{transform:scale(.88)}
#snd .w,#snd.on .x{display:none}#snd.on .w{display:inline}
#snd.on .w path{animation:sndw 1.6s ease-in-out infinite}#snd.on .w path+path{animation-delay:.3s}
@keyframes sndw{0%,100%{opacity:1}50%{opacity:.25}}
#snd input{-webkit-appearance:none;appearance:none;width:max(88px,calc(var(--u)*130));height:26px;margin:0;background:transparent;cursor:pointer;--p:70%}
#snd input:focus-visible{outline:3px solid #111;outline-offset:2px;border-radius:6px}
#snd input::-webkit-slider-runnable-track{height:8px;border-radius:5px;box-shadow:0 0 0 2.5px #111;background:linear-gradient(to right,#111 var(--p),#fff var(--p))}
#snd input::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;margin-top:-7px;border-radius:50%;background:#fff;border:3px solid #111;box-shadow:2px 2px 0 #111;transition:transform .12s}
#snd input:active::-webkit-slider-thumb{transform:scale(1.15)}
#snd input::-moz-range-track{height:8px;border-radius:5px;box-shadow:0 0 0 2.5px #111;background:linear-gradient(to right,#111 var(--p),#fff var(--p))}
#snd input::-moz-range-thumb{box-sizing:border-box;width:22px;height:22px;border-radius:50%;background:#fff;border:3px solid #111;box-shadow:2px 2px 0 #111}
@media(prefers-reduced-motion:reduce){#snd{transition:none}#snd.on .w path{animation:none}}`;
document.head.appendChild(st);
const w=document.createElement('div');w.id='snd';w.setAttribute('role','group');w.setAttribute('aria-label','Музыка');
const rg=document.createElement('input');rg.type='range';rg.min=0;rg.max=100;rg.step=1;rg.setAttribute('aria-label','Громкость музыки');
const b=document.createElement('button');b.type='button';
b.innerHTML='<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 18h8l11-9v30l-11-9H6z" fill="#111" stroke="#111" stroke-width="2" stroke-linejoin="round"/>'+
 '<g class="w" fill="none" stroke="#111" stroke-width="3.6" stroke-linecap="round"><path d="M32 17a10 10 0 0 1 0 14"/><path d="M37 11a18 18 0 0 1 0 26"/></g>'+
 '<g class="x" fill="none" stroke="#111" stroke-width="3.6" stroke-linecap="round"><path d="M33 18l10 12M43 18L33 30"/></g></svg>';
w.appendChild(rg);w.appendChild(b);document.body.appendChild(w);

// как верхнее меню: на первом экране выдвинута (под меню), дальше прячется и стоит на уровне «домиков»
const nav=document.querySelector('nav');
const upd=()=>w.classList.toggle('open',!(nav&&nav.classList.contains('min'))&&!document.querySelector('.pg.on'));
const mo=new MutationObserver(upd);
if(nav)mo.observe(nav,{attributes:true,attributeFilter:['class']});
document.querySelectorAll('.pg').forEach(p=>mo.observe(p,{attributes:true,attributeFilter:['class']}));
upd();

/* ---------- звук ---------- */
// «Добро пожаловать» — лёгкая оркестровая музыка для фона магазина, до мажор, 104 BPM.
// Оркестр синтезируется прямо в браузере: струнные, скрипки, флейта, валторны и труба, арфа,
// пиццикато, контрабас, литавры, тарелки и челеста. 32 такта по кругу.
// При включении звучит торжественная приветственная фанфара, на следующих кругах — мягкое вступление.
const BPM=104,BEAT=60/BPM,S8=BEAT/2,BAR=BEAT*4,VMAX=.7,TRIM=.62;
const hz=m=>440*Math.pow(2,(m-69)/12);
let ctx,out,verb,noiseBuf,R=null,playing=false,timer=null,nextT=0,barI=0;

function init(){
 if(ctx)return ctx;
 ctx=new AC();
 const comp=ctx.createDynamicsCompressor();comp.threshold.value=-20;comp.knee.value=18;comp.ratio.value=3;comp.attack.value=.01;comp.release.value=.3;
 out=ctx.createGain();out.gain.value=0;out.connect(comp);comp.connect(ctx.destination);
 verb=ctx.createConvolver();                         // небольшой, «сухой» концертный зал — без космического эха
 const L=(ctx.sampleRate*1.7)|0,ir=ctx.createBuffer(2,L,ctx.sampleRate),a=(ctx.sampleRate*.012)|0;
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);let y=0;
  for(let i=0;i<L;i++){y+=((Math.random()*2-1)-y)*.12;d[i]=y*Math.pow(1-i/L,3.4)*(i<a?i/a:1)}}
 verb.buffer=ir;const vg=ctx.createGain();vg.gain.value=1.6;verb.connect(vg);vg.connect(out);
 noiseBuf=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate);
 const nd=noiseBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
 return ctx}

// настоящие тембры: набор обертонов у каждого инструмента (вместо «синтезаторных» волн)
const WAVES={};
const TIMBRE={
 str :[1,.62,.5,.36,.28,.2,.15,.11,.08,.06],
 vln :[1,.75,.6,.45,.34,.25,.18,.13,.09,.06,.04],
 cello:[1,.85,.62,.45,.3,.2,.13,.09],
 flute:[1,.28,.09,.03],
 oboe:[.65,1,.9,.7,.5,.34,.22,.14,.09],
 brass:[1,.95,.8,.6,.42,.28,.18,.11,.07],
 harp:[1,.5,.22,.1,.05]};
const wv=n=>{if(!WAVES[n]){const im=new Float32Array(TIMBRE[n].length+1);TIMBRE[n].forEach((a,i)=>im[i+1]=a);
 WAVES[n]=ctx.createPeriodicWave(new Float32Array(im.length),im)}return WAVES[n]};

// рассадка оркестра: [панорама, уровень зала]
const GROUPS={str:[-.35,.3],vln:[-.3,.28],flt:[.25,.28],harp:[-.55,.28],horn:[.4,.35],pz:[-.15,.18],bas:[.3,.12],tim:[0,.3],pc:[0,.35],ce:[.45,.3],ob:[-.1,.28]};
const mkRun=()=>{const dry=ctx.createGain(),vs=ctx.createGain(),r={dry,vs,all:[dry,vs]};
 dry.connect(out);vs.connect(verb);
 for(const k in GROUPS){const g=ctx.createGain(),pn=GROUPS[k][0],sd=GROUPS[k][1];let n=g;
  if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=pn;g.connect(p);n=p;r.all.push(p)}
  const s=ctx.createGain();s.gain.value=sd;n.connect(dry);n.connect(s);s.connect(vs);r[k]=g;r.all.push(g,s)}
 return r};
const killRun=r=>r.all.forEach(n=>{try{n.disconnect()}catch(e){}});
const nzsrc=(t,d)=>{const s=ctx.createBufferSource();s.buffer=noiseBuf;s.loop=true;s.start(t,Math.random()*.5);s.stop(t+d+.05);return s};
// общий голос: тембр + (опционально) вибрато и фильтр; возвращает вход фильтра
function voice(t,f,d,tn,dets,vib,vdel,lpf,out){
 const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=lpf;lp.Q.value=.3;lp.connect(out);
 let lg=null;
 if(vib){const lf=ctx.createOscillator();lg=ctx.createGain();lf.frequency.value=5+Math.random()*.5;
  lg.gain.setValueAtTime(0,t);lg.gain.setValueAtTime(0,t+vdel);lg.gain.linearRampToValueAtTime(vib,t+vdel+.4);
  lf.connect(lg);lf.start(t);lf.stop(t+d+.4)}
 dets.forEach(c=>{const o=ctx.createOscillator();o.setPeriodicWave(wv(tn));o.frequency.value=f;o.detune.value=c;
  if(lg)lg.connect(o.detune);o.connect(lp);const j=Math.random()*.012;o.start(t+j);o.stop(t+d+.4)});
 return lp}

/* ---------- инструменты оркестра ---------- */
// струнная группа (пэд): ансамбль смычковых, медленное вступление, без «космических» свипов
function strn(t,m,d,r,v){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.017*v,t+.22);
 g.gain.setValueAtTime(.017*v,t+d-.2);g.gain.linearRampToValueAtTime(0,t+d+.3);
 voice(t,hz(m),d,'str',[-5,0,5],3,.3,2600,g);g.connect(r.str)}
// скрипки (мелодия)
function vln(t,m,d,v,r){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.042*v,t+.05);
 g.gain.setValueAtTime(.042*v,t+Math.max(.06,d-.1));g.gain.linearRampToValueAtTime(0,t+d+.08);
 voice(t,hz(m),d,'vln',[-4,4],9,.22,4200,g);g.connect(r.vln)}
// флейта: почти чистый тон, лёгкое дыхание
function flute(t,m,d,v,r){
 const f=hz(m),g=ctx.createGain(),n=nzsrc(t,d+.1),nf=ctx.createBiquadFilter(),ng=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.05*v,t+.07);
 g.gain.setValueAtTime(.05*v,t+Math.max(.08,d-.1));g.gain.linearRampToValueAtTime(0,t+d+.08);
 voice(t,f,d,'flute',[0],4,.3,6000,g);g.connect(r.flt);
 nf.type='bandpass';nf.frequency.value=Math.min(8000,f*3);nf.Q.value=1.2;
 ng.gain.setValueAtTime(0,t);ng.gain.linearRampToValueAtTime(.008*v,t+.04);ng.gain.linearRampToValueAtTime(.003*v,t+.2);ng.gain.linearRampToValueAtTime(0,t+d+.08);
 n.connect(nf);nf.connect(ng);ng.connect(r.flt)}
// гобой
function oboe(t,m,d,v,r){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.045*v,t+.06);
 g.gain.setValueAtTime(.045*v,t+Math.max(.07,d-.1));g.gain.linearRampToValueAtTime(0,t+d+.08);
 voice(t,hz(m),d,'oboe',[0],5,.25,3800,g);g.connect(r.ob)}
// виолончели: тёплый смычковый тон
function cello(t,m,d,v,r){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.032*v,t+.14);
 g.gain.setValueAtTime(.032*v,t+Math.max(.15,d-.15));g.gain.linearRampToValueAtTime(0,t+d+.12);
 voice(t,hz(m),d,'cello',[-4,4],5,.3,1700,g);g.connect(r.ce)}
// валторны / труба / тромбоны: медный тон, короткий «вдох» фильтра в начале ноты
function horn(t,m,d,v,r,br){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.03*v,t+.07);
 g.gain.setValueAtTime(.03*v,t+Math.max(.08,d-.12));g.gain.linearRampToValueAtTime(0,t+d+.12);
 const lp=voice(t,hz(m),d,'brass',[-3,3],0,0,br,g);
 lp.frequency.setValueAtTime(br*.45,t);lp.frequency.linearRampToValueAtTime(br,t+.07);
 g.connect(r.horn)}
// арфа: мягкий щипок, без долгого звона
function harp(t,m,v,r){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+1.1);
 const o=ctx.createOscillator();o.setPeriodicWave(wv('harp'));o.frequency.value=hz(m);o.connect(g);g.connect(r.harp);o.start(t);o.stop(t+1.2)}
const harpRoll=(t,ch,v,r)=>ch.ap.slice(0,4).forEach((m,i)=>harp(t+i*.035,m,v*(.7+.1*i),r));
// пиццикато струнных
function pizz(t,m,v,r){
 const g=ctx.createGain(),lp=ctx.createBiquadFilter(),o=ctx.createOscillator();
 o.setPeriodicWave(wv('str'));o.frequency.value=hz(m);
 lp.type='lowpass';lp.frequency.setValueAtTime(2200,t);lp.frequency.exponentialRampToValueAtTime(700,t+.12);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055*v,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.3);
 o.connect(lp);lp.connect(g);g.connect(r.pz);o.start(t);o.stop(t+.35)}
// контрабас
function bassn(t,m,v,d,r){
 const g=ctx.createGain();
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.13*v,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+d);
 voice(t,hz(m),d,'cello',[0],0,0,520,g);g.connect(r.bas)}
// литавры
function timp(t,m,v,r){
 const f=hz(m),o=ctx.createOscillator(),g=ctx.createGain(),s=nzsrc(t,.1),nf=ctx.createBiquadFilter(),ng=ctx.createGain();
 o.type='sine';o.frequency.setValueAtTime(f*1.15,t);o.frequency.exponentialRampToValueAtTime(f,t+.08);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.32*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+1.2);
 nf.type='lowpass';nf.frequency.value=320;ng.gain.setValueAtTime(.12*v,t);ng.gain.exponentialRampToValueAtTime(.0001,t+.08);
 o.connect(g);g.connect(r.tim);s.connect(nf);nf.connect(ng);ng.connect(r.tim);o.start(t);o.stop(t+1.25)}
const roll=(t,m,d,v,r)=>{for(let x=0;x<d;x+=.07)timp(t+x,m,v*(.25+.6*x/d),r)};
// тарелки
function swell(t,d,v,r){
 const s=nzsrc(t,d+.3),f=ctx.createBiquadFilter(),g=ctx.createGain();
 f.type='highpass';f.frequency.value=4500;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.04*v,t+d);g.gain.linearRampToValueAtTime(0,t+d+.25);
 s.connect(f);f.connect(g);g.connect(r.pc)}
function crash(t,v,r){
 const s=nzsrc(t,2),f=ctx.createBiquadFilter(),g=ctx.createGain();
 f.type='highpass';f.frequency.value=4200;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.055*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+1.9);
 s.connect(f);f.connect(g);g.connect(r.pc)}

/* ---------- гармония и мелодия ---------- */
// b — бас (MIDI), str — голоса струнных, hn — аккорд для валторн и пиццикато, ap — тоны для арфы
const CH={
 C :{b:36,str:[55,60,64,67],hn:[60,64,67],ap:[60,64,67,72,76,79]},
 G :{b:43,str:[55,59,62,67],hn:[59,62,67],ap:[59,62,67,71,74,79]},
 Am:{b:45,str:[57,60,64,69],hn:[57,60,64],ap:[57,60,64,69,72,76]},
 F :{b:41,str:[57,60,65,69],hn:[57,60,65],ap:[60,65,69,72,77,81]},
 Dm:{b:38,str:[57,62,65,69],hn:[57,62,65],ap:[57,62,65,69,74,77]},
 G7:{b:43,str:[55,59,62,65],hn:[59,62,65],ap:[59,62,65,67,71,74]}};
const PR={A:[CH.C,CH.G,CH.Am,CH.F],B:[CH.F,CH.C,CH.Dm,CH.G7],C:[CH.C,CH.F,CH.G,CH.C]};   // по аккорду на такт
const HP=[0,1,2,3,4,3,2,1];                                                              // рисунок арфы, восьмыми
// мелодия: [доля от начала фразы (16 долей), нота MIDI, длительность в долях]
const MEL={
 MA :[[0,76,1.5],[1.5,74,.5],[2,72,1],[3,76,1],  [4,74,1.5],[5.5,71,.5],[6,74,1],[7,79,1],
      [8,72,1],[9,76,1],[10,81,1.5],[11.5,79,.5],[12,77,1.5],[13.5,76,.5],[14,74,1],[15,72,1]],
 MA2:[[0,81,1.5],[1.5,79,.5],[2,77,1],[3,81,1],  [4,79,1.5],[5.5,76,.5],[6,79,1],[7,84,1],
      [8,86,1.5],[9.5,84,.5],[10,81,1],[11,77,1],[12,79,1],[13,83,1],[14,86,1],[15,83,1]],
 MB :[[0,79,1],[1,84,1.5],[2.5,83,.5],[3,84,1],  [4,81,1.5],[5.5,79,.5],[6,77,1],[7,81,1],
      [8,83,1.5],[9.5,81,.5],[10,79,1],[11,83,1],[12,84,3],[15,79,1]]};
const FAN=[[0,72,.75],[.75,76,.25],[1,79,1],[2,84,2]];                                   // приветственная фанфара
// 8 фраз по 4 такта: вступление → тема (флейта) → тема 2 (скрипки) → кульминация → соло виолончели → тема с гобоем → большое тутти → финал
const SEC=[
 {p:'A',str:.9,ce:.7,harp:.8,fan:1,mel:'MA',lead:'flt',v:.7},
 {p:'A',str:.8,ce:.8,harp:.7,pz:1,mel:'MA',lead:'flt'},
 {p:'B',str:.9,ce:.9,harp:.6,pz:1,mel:'MA2',lead:'vln',dbl:1,hn:.5,tim:1,bass:.7},
 {p:'C',str:1,big:1,ce:1,harp:.5,mel:'MB',lead:'vln',dbl:1,ob:1,hn:1,tb:1,tim:2,crash:1,v:1.1,cres:1,bass:.9},
 {p:'B',str:.7,ce:.5,harp:.8,mel:'MA2',lead:'ce'},
 {p:'A',str:.9,ce:.9,harp:.6,pz:.8,mel:'MA',lead:'vln',dbl:1,ob:1,hn:.7,tim:1,bass:.7},
 {p:'C',str:1,big:1,ce:1.1,harp:.6,mel:'MB',lead:'vln',dbl:1,ob:1,tpt:1,hn:1.1,tb:1.1,tim:2,crash:1,v:1.2,cres:1,bass:1},
 {p:'B',str:.8,ce:.8,harp:.7,pz:.7,mel:'MA2',lead:'flt',ob:.7,hn:.4,v:.85}];

const inBar=(b,k)=>b>=k*4&&b<k*4+4;
function sched(i,t0){
 const si=Math.floor(i/4)%SEC.length,sec=SEC[si],k=i%4,loop=Math.floor(i/32),ch=PR[sec.p][k],
  nsi=(si+1)%SEC.length,nsec=SEC[nsi],v=(sec.v||1)*(sec.cres?.88+.06*k:1);
 ch.str.forEach((m,j)=>strn(t0+j*.015,m,BAR,R,(sec.str||.8)*(sec.cres?.9+.05*k:1)));         // струнные держат аккорд
 if(sec.big){strn(t0,ch.str[2]+12,BAR,R,.6*sec.str);strn(t0+.02,ch.str[3]+12,BAR,R,.6*sec.str)}
 if(sec.ce)cello(t0,ch.b+12,BAR*.98,sec.ce,R);                                              // виолончели
 if(sec.ce&&sec.big)cello(t0+.01,ch.b,BAR*.98,.8*sec.ce,R);                                   // и контрабасы
 if(sec.harp){harpRoll(t0,ch,sec.harp,R);if(k%2)harpRoll(t0+2*BEAT,ch,sec.harp*.7,R)}         // арфа: мягко разложенный аккорд
 if(sec.bass){bassn(t0,ch.b,sec.bass,BEAT*1.7,R);bassn(t0+2*BEAT,ch.b+7,sec.bass*.8,BEAT*1.7,R)}
 if(sec.pz)[1,3].forEach(n=>ch.hn.forEach((m,j)=>pizz(t0+n*BEAT+j*.01,m,sec.pz,R)));         // пиццикато
 if(sec.hn)ch.hn.forEach((m,j)=>horn(t0+j*.02,m,BAR*.97,sec.hn*(sec.cres?.9+.05*k:1),R,1500));  // валторны
 if(sec.tb)ch.hn.forEach((m,j)=>horn(t0+j*.02,m-12,BAR*.97,sec.tb*.9,R,800));                  // тромбоны
 if(sec.tim&&(sec.tim===2||k===0))timp(t0,ch.b,.6,R);                                        // литавры
 if(k===0&&sec.crash&&si!==0)crash(t0,1,R);                                                 // тарелки
 if(k===3&&nsi!==0&&nsec.crash){swell(t0+BEAT,3*BEAT,1,R);roll(t0+2*BEAT,ch.b,2*BEAT,1,R)}    // нарастание перед тутти
 if(sec.fan&&k===0&&loop===0){                                                              // фанфара «Добро пожаловать»
  FAN.forEach(([b,m,d])=>{horn(t0+b*BEAT,m,d*BEAT,1.5,R,3000);horn(t0+b*BEAT,m-12,d*BEAT,1.1,R,2200);horn(t0+b*BEAT,m-5,d*BEAT,.9,R,2400)});
  timp(t0,36,1,R);timp(t0+2*BEAT,36,1,R);crash(t0+2*BEAT,1.2,R);roll(t0+2*BEAT,36,2*BEAT,.9,R)}
 const M=sec.mel&&MEL[sec.mel];
 if(M)M.forEach(([b,m,d])=>{if(!inBar(b,k))return;
  const t=t0+(b-k*4)*BEAT+(Math.random()-.5)*.006,dd=d*BEAT*.95;
  if(sec.lead==='vln')vln(t,m,dd,v,R);else if(sec.lead==='ce')cello(t,m-12,dd,1.5*v,R);else flute(t,m,dd,v,R);
  if(sec.dbl)flute(t,m<=84?m+12:m,dd,.5*v,R);
  if(sec.ob){const c=ch.hn.concat(ch.hn.map(x=>x+12)).filter(x=>x<=m-3);
   oboe(t,c.length?Math.max(...c):m-5,dd,sec.ob*v,R)}
  if(sec.tpt)horn(t,m,dd,.9*v,R,2600)});
}
function tick(){if(!playing)return;while(nextT<ctx.currentTime+1.5){sched(barI,nextT);nextT+=BAR;barI++}}
function start(){
 init();
 return ctx.resume().then(()=>{
  if(ctx.state!=='running')return false;
  if(!playing){playing=true;R=mkRun();barI=0;nextT=ctx.currentTime+.2;tick();timer=setInterval(tick,300)}
  const t=ctx.currentTime;out.gain.cancelScheduledValues(t);out.gain.setValueAtTime(out.gain.value,t);out.gain.linearRampToValueAtTime(level(),t+2.5);
  return true})}
function stop(){
 if(!playing)return;playing=false;clearInterval(timer);timer=null;
 const r=R,t=ctx.currentTime;out.gain.cancelScheduledValues(t);out.gain.setValueAtTime(out.gain.value,t);out.gain.linearRampToValueAtTime(0,t+.7);
 setTimeout(()=>killRun(r),900)}

/* ---------- управление ---------- */
let want=true,vol=70;
try{want=localStorage.getItem('cf-music')!=='off';const sv=localStorage.getItem('cf-music-vol');if(sv!==null&&!isNaN(+sv))vol=Math.max(0,Math.min(100,+sv))}catch(e){}
const save=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
const level=()=>VMAX*TRIM*Math.pow(vol/100,2);               // громкость растёт плавно, как слышит ухо
const setUI=()=>{w.classList.toggle('on',playing&&vol>0);b.setAttribute('aria-pressed',playing);
 b.setAttribute('aria-label',playing?'Выключить музыку':'Включить музыку');b.title=playing?'Выключить музыку':'Включить музыку'};
const setVol=v=>{vol=v;rg.value=v;rg.style.setProperty('--p',v+'%');save('cf-music-vol',v);
 if(ctx&&playing){const t=ctx.currentTime;out.gain.cancelScheduledValues(t);out.gain.setTargetAtTime(level(),t,.05)}};
rg.value=vol;rg.style.setProperty('--p',vol+'%');setUI();

let pk=0;const peek=()=>{w.classList.add('peek');clearTimeout(pk);pk=setTimeout(()=>w.classList.remove('peek'),3500)};
const keep=()=>{if(w.classList.contains('peek'))peek()};
const folded=()=>!w.classList.contains('open')&&!w.classList.contains('peek')&&!w.classList.contains('drag');
// телефон: первое касание лишь выдвигает панель, чтобы случайно не сдвинуть ползунок
w.addEventListener('touchstart',e=>{if(folded()){e.preventDefault();peek()}else keep()},{capture:true,passive:false});
// пока тянем ползунок, панель не прячется
rg.addEventListener('pointerdown',()=>w.classList.add('drag'));
['pointerup','pointercancel','touchend'].forEach(v=>addEventListener(v,()=>w.classList.remove('drag'),{passive:true}));

rg.addEventListener('input',()=>{setVol(+rg.value);keep();
 if(!playing&&vol>0){want=true;save('cf-music','on');start().then(setUI)}else setUI()});
b.addEventListener('click',()=>{keep();
 if(playing){want=false;save('cf-music','off');stop();setUI()}
 else{want=true;save('cf-music','on');if(vol===0)setVol(35);start().then(setUI)}});

// браузеры запрещают звук без действия пользователя — запускаем при первом касании/клике по сайту
const EV=['pointerdown','pointerup','keydown','touchend'];
const first=e=>{if(!want||playing||w.contains(e.target))return;
 start().then(ok=>{if(ok){setUI();EV.forEach(v=>removeEventListener(v,first,true))}})};
EV.forEach(v=>addEventListener(v,first,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend();else if(playing)ctx.resume()});
})();
;
/* цвет свечения по бокам меняется вместе с разделом сайта */
(function(){const a=document.getElementById('sideArt');if(!a)return;
const S=['.hero','.assort','.why','.ask'].map(q=>document.querySelector(q));let tk=0;
const upd=()=>{tk=0;const m=innerHeight*.5;let t=0;S.forEach((e,i)=>{if(e&&e.getBoundingClientRect().top<=m)t=i});a.dataset.th=t};
addEventListener('scroll',()=>{if(!tk)tk=requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd()})();
;
/* ===== round 10: звук выбора карточки + перетаскиваемые космические фигуры ===== */
(()=>{
const AC=window.AudioContext||window.webkitAudioContext;
let ctx=null,master=null,echo=null,noise=null,verbIn=null,unlocked=false;

function build(){
 if(ctx||!AC)return;
 ctx=new AC();
 master=ctx.createGain();master.gain.value=.6;
 const cp=ctx.createDynamicsCompressor();master.connect(cp);cp.connect(ctx.destination);
 // длинное «космическое» эхо
 echo=ctx.createDelay(1);echo.delayTime.value=.31;
 const fb=ctx.createGain();fb.gain.value=.42;
 const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3800;
 echo.connect(lp);lp.connect(fb);fb.connect(echo);lp.connect(master);
 // большая «космическая» реверберация
 verbIn=ctx.createGain();const cv=ctx.createConvolver(),L=(ctx.sampleRate*3.4)|0,ir=ctx.createBuffer(2,L,ctx.sampleRate);
 for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<L;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/L,2.6)}
 cv.buffer=ir;const vg=ctx.createGain();vg.gain.value=.8;verbIn.connect(cv);cv.connect(vg);vg.connect(master);
 noise=ctx.createBuffer(1,ctx.sampleRate*.5,ctx.sampleRate);
 const d=noise.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
}
const unlock=()=>{unlocked=true;build();if(ctx&&ctx.state==='suspended')ctx.resume()};
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,unlock,{capture:true,passive:true}));
const go=fn=>{
 if(!unlocked||!AC)return;build();
 if(ctx.state==='running')fn(ctx.currentTime+.005);
 else ctx.resume().then(()=>{if(ctx.state==='running')fn(ctx.currentTime+.005)}).catch(()=>{});
};
function tone(t,f,o){o=o||{};
 const x=ctx.createOscillator(),g=ctx.createGain();
 x.type=o.type||'sine';x.frequency.setValueAtTime(o.from||f,t);
 if(o.from)x.frequency.exponentialRampToValueAtTime(f,t+(o.glide||.08));
 if(o.det)x.detune.value=o.det;
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.gain||.06,t+(o.att||.004));
 g.gain.exponentialRampToValueAtTime(.0001,t+(o.dur||1));
 x.connect(g);g.connect(master);
 const s=ctx.createGain();s.gain.value=o.send==null?.5:o.send;g.connect(s);s.connect(echo);
 const rv=ctx.createGain();rv.gain.value=o.rv==null?.45:o.rv;g.connect(rv);rv.connect(verbIn);
 x.start(t);x.stop(t+(o.dur||1)+.05);
}
function swish(t,from,to,dur,gain){
 const s=ctx.createBufferSource();s.buffer=noise;s.loop=true;
 const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=1.2;
 f.frequency.setValueAtTime(from,t);f.frequency.exponentialRampToValueAtTime(to,t+dur);
 const g=ctx.createGain();g.gain.setValueAtTime(0,t);
 g.gain.linearRampToValueAtTime(gain,t+dur*.4);g.gain.linearRampToValueAtTime(0,t+dur);
 s.connect(f);f.connect(g);g.connect(master);s.start(t);s.stop(t+dur+.05);
}

/* ---------- 1) карточки: только «выбор карточки» — два быстрых шелеста, без звона ---------- */
let lastCard=0;
function cardSound(){
 const now=performance.now();if(now-lastCard<140)return;lastCard=now;
 go(t=>{swish(t,800,3400,.13,.06);swish(t+.1,2800,1200,.08,.03)});
}
const cards=document.getElementById('cards');
if(cards){
 cards.addEventListener('pointerover',e=>{
  const c=e.target.closest('.card');if(!c||(e.relatedTarget&&c.contains(e.relatedTarget)))return;cardSound();
 });
 cards.addEventListener('focusin',e=>{
  const c=e.target.closest('.card');
  if(c&&e.target.matches(':focus-visible')&&!(e.relatedTarget&&c.contains(e.relatedTarget)))cardSound();
 });
}

/* ---------- 2) боковые фигуры (главная страница и страницы товаров) ---------- */
const root=document.getElementById('sideArt');if(!root)return;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCALE=[523.25,587.33,659.25,783.99,880,1046.5,1174.66,1318.51,1567.98]; // пентатоника
const rnd=(a,b)=>a+Math.random()*(b-a);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const KIND=el=>el.classList.contains('st')||el.classList.contains('tri')?'st':
 el.classList.contains('fr')||el.classList.contains('bb')||el.classList.contains('sh')?'fr':el.classList.contains('ci')?'ci':'dt';
const items=[...document.querySelectorAll('.sd i')].map((el,idx)=>{
 return{el,kind:KIND(el),grp:el.closest('.pgart')||root,note:SCALE[(idx*4+(idx>>1))%SCALE.length],
  ax:rnd(14,34),ay:rnd(20,46),px:rnd(0,6.28),py:rnd(0,6.28),
  wx:6.283/rnd(24,52),wy:6.283/rnd(28,60),
  ar:rnd(4,11),pr:rnd(0,6.28),wr:6.283/rnd(34,70),
  ix:0,iy:0,vx:0,vy:0,ir:0,vr:0,drag:null,off:false,dx:0,dy:0,hit:0,fl:0,cr:rnd(70,130),r:20,m:400,
  hx:0,hy:0,w:0,h:0,sw:0,sh:0,sl:0};
});
const byEl=new Map(items.map(o=>[o.el,o]));
let mW=0,mH=0,measured=null,cur=null;const mouse={x:-999,y:-999,on:false};

function measure(g){
 items.forEach(o=>{if(o.grp!==g)return;const sd=o.el.parentElement;
  o.hx=o.el.offsetLeft;o.hy=o.el.offsetTop;o.w=o.el.offsetWidth;o.h=o.el.offsetHeight;
  o.sw=sd.clientWidth;o.sh=sd.clientHeight;o.sl=sd.getBoundingClientRect().left;
  o.off=o.sw<o.w+24;o.r=Math.max(8,Math.max(o.w,o.h)/2*.82);o.m=o.r*o.r});               // нет места по бокам — фигура не нужна
 measured=g;mW=innerWidth;mH=innerHeight;
}
function wall(o){ // мягкие стенки: фигуры не выходят за свою боковую панель
 const mnx=-o.hx+10,mxx=o.sw-o.w-o.hx-10,mny=-o.hy+10,mxy=o.sh-o.h-o.hy-10;
 if(o.ix<mnx){o.ix=mnx;o.vx=Math.abs(o.vx)*.95}else if(o.ix>mxx){o.ix=mxx;o.vx=-Math.abs(o.vx)*.95}
 if(o.iy<mny){o.iy=mny;o.vy=Math.abs(o.vy)*.95}else if(o.iy>mxy){o.iy=mxy;o.vy=-Math.abs(o.vy)*.95}
}
addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.on=true},{passive:true});
document.addEventListener('pointerleave',()=>{mouse.on=false});

let lastT=0;const WOB=.3;           // покачивание ослаблено — теперь главная тут физика
let lastClash=0;
const vxOf=o=>o.drag?(performance.now()-o.drag.lt>90?0:o.drag.svx):o.vx;
const vyOf=o=>o.drag?(performance.now()-o.drag.lt>90?0:o.drag.svy):o.vy;

/* звук и эффект удара фигур друг о друга */
function clash(a,b,sp,px,py){
 const now=performance.now(),pw=clamp(sp/380,.3,1);
 [a,b].forEach(o=>{
  o.vr+=(Math.random()<.5?-1:1)*clamp(sp*.5,40,260);
  if(!reduce&&o.el.animate&&now-o.fl>260){o.fl=now;
   o.el.animate([{filter:'brightness(3)'},{filter:'brightness(1)'}],{duration:420,easing:'ease-out'});
   o.el.animate([{scale:'1'},{scale:'1.28',offset:.2},{scale:'1'}],{duration:380,easing:'ease-out'});
  }
 });
 if(!reduce&&now-a.hit>150){a.hit=now;for(let i=0;i<4;i++)spark(a,px,py,colOf(a),50);}
}

/* столкновения фигур в одной боковой панели: упругие шары с массой */
function fight(act){
 const by=new Map();
 for(const o of items){if(o.grp!==act||o.off)continue;const p=o.el.parentElement;
  let arr=by.get(p);if(!arr){arr=[];by.set(p,arr)}arr.push(o)}
 by.forEach(arr=>{
  for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){
   const a=arr[i],b=arr[j];
   const ax=a.hx+a.w/2+a.dx+a.ix,ay=a.hy+a.h/2+a.dy+a.iy,
         bx=b.hx+b.w/2+b.dx+b.ix,by_=b.hy+b.h/2+b.dy+b.iy;
   let ex=bx-ax,ey=by_-ay,d=Math.hypot(ex,ey);const R=a.r+b.r;
   if(d>=R)continue;
   if(d<.01){ex=Math.random()-.5;ey=Math.random()-.5;d=Math.hypot(ex,ey)||1}
   const nx=ex/d,ny=ey/d,wa=a.drag?0:1/a.m,wb=b.drag?0:1/b.m,ws=wa+wb;
   if(!ws)continue;
   const pen=R-d;                                      // растащить, чтобы не слипались
   a.ix-=nx*pen*wa/ws;a.iy-=ny*pen*wa/ws;b.ix+=nx*pen*wb/ws;b.iy+=ny*pen*wb/ws;
   const rv=(vxOf(b)-vxOf(a))*nx+(vyOf(b)-vyOf(a))*ny;   // <0 — сближаются
   if(rv<0){
    const e=1.05,jj=-(1+e)*rv/ws;                       // чуть больше 1 — удары «заряженные»
    a.vx-=jj*nx*wa;a.vy-=jj*ny*wa;b.vx+=jj*nx*wb;b.vy+=jj*ny*wb;
    clash(a,b,-rv,a.hx+a.w/2+a.dx+a.ix+nx*a.r,a.hy+a.h/2+a.dy+a.iy+ny*a.r);
   }
  }
 });
 for(const o of items)if(o.grp===act&&!o.off&&!o.drag)wall(o);
}

function frame(now){
 requestAnimationFrame(frame);
 if(document.hidden)return;
 const pg=document.querySelector('.pg.on');
 const act=pg?pg.querySelector('.pgart'):(innerWidth>1440?root:null);   // что сейчас на экране
 if(!act)return;
 if(measured!==act||mW!==innerWidth||mH!==innerHeight)measure(act);
 const dt=Math.min(.05,lastT?(now-lastT)/1000:.016);lastT=now;const t=now/1000;
 for(const o of items){
  if(o.grp!==act||o.off)continue;
  const dx=(Math.sin(t*o.wx+o.px)*o.ax+Math.sin(t*o.wx*.37+o.py)*o.ax*.45)*WOB;
  const dy=(Math.sin(t*o.wy+o.py)*o.ay+Math.sin(t*o.wy*.41+o.px)*o.ay*.4)*WOB;
  o.dx=dx;o.dy=dy;
  if(!o.drag){
   if(mouse.on){
    const cx=o.sl+o.hx+o.w/2+dx+o.ix,cy=o.hy+o.h/2+dy+o.iy,ex=cx-mouse.x,ey=cy-mouse.y,d=Math.hypot(ex,ey),R=110+o.w/2;
    if(d<R&&d>1){const f=(1-d/R)*240;o.vx+=ex/d*f*dt;o.vy+=ey/d*f*dt}
   }
   // БОЙ: фигуры не засыпают — всё время носятся и сталкиваются
   let sp=Math.hypot(o.vx,o.vy);
   if(sp<1){const an=Math.random()*6.283;o.vx=Math.cos(an);o.vy=Math.sin(an);sp=1}
   if(sp<o.cr){const k=1+(o.cr/sp-1)*Math.min(1,dt*2.5);o.vx*=k;o.vy*=k}
   else{const fr=Math.exp(-.35*dt);o.vx*=fr;o.vy*=fr}
   if(sp>560){o.vx*=560/sp;o.vy*=560/sp}
   o.ix+=o.vx*dt;o.iy+=o.vy*dt;wall(o);
  }
  o.vr+=(-1.4*o.ir-1.0*o.vr)*dt;o.ir+=o.vr*dt;
  const r=Math.sin(t*o.wr+o.pr)*o.ar+o.ir;
  o.el.style.translate=(dx+o.ix).toFixed(2)+'px '+(dy+o.iy).toFixed(2)+'px';
  o.el.style.rotate=r.toFixed(2)+'deg';
 }
 fight(act);
}
if(!reduce)requestAnimationFrame(frame);

/* космический «дзынь»: FM-колокола, свисты, плывущие пэды и огромная реверберация */
function fm(t,f,o){
 const c=ctx.createOscillator(),m=ctx.createOscillator(),mg=ctx.createGain(),g=ctx.createGain(),D=o.dur||1;
 c.frequency.value=f;m.frequency.value=f*(o.ratio||3.5);
 mg.gain.setValueAtTime(f*(o.idx||2),t);mg.gain.exponentialRampToValueAtTime(f*.02,t+D*.7);
 m.connect(mg);mg.connect(c.frequency);
 g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.gain||.04,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+D);
 c.connect(g);g.connect(master);
 const s=ctx.createGain();s.gain.value=o.send==null?.5:o.send;g.connect(s);s.connect(echo);
 const r=ctx.createGain();r.gain.value=o.rv==null?.6:o.rv;g.connect(r);r.connect(verbIn);
 c.start(t);m.start(t);c.stop(t+D+.05);m.stop(t+D+.05);
}
/* ЗВОНКИЙ «дзынь»: металлический колокол с неупорядоченными обертонами, яркой атакой «дзз» и долгим звоном */
function soft(t,f,o){
 o=o||{};const g=(o.gain||.05)*1.3,d=(o.dur||1.5)*1.25;
 tone(t,f,{dur:d,gain:g,att:.002,send:.4,rv:.4});                       // основной тон
 tone(t,f*2.0,{dur:d*.7,gain:g*.45,att:.002,send:.35,rv:.36});          // октава
 tone(t,f*2.76,{dur:d*.55,gain:g*.38,att:.002,send:.3,rv:.34});         // «колокольные» обертоны
 tone(t,f*5.4,{dur:d*.32,gain:g*.22,att:.001,send:.25,rv:.3});
 tone(t,f*8.93,{dur:d*.16,gain:g*.14,att:.001,send:.2,rv:.25});
 tone(t,f*1.003,{dur:d*.9,gain:g*.5,att:.002,send:.35,rv:.38,det:6});   // лёгкая расстройка — «шиммер»
 tone(t,f*6.2,{dur:.09,gain:g*.38,att:.001,send:0,rv:.15,type:'triangle'}); // «дз» — удар по металлу
 tone(t,f*9.5,{dur:.05,gain:g*.22,att:.001,send:0,rv:.1,type:'square'});
}
function ping(o){
 const f=o.note*(1+(Math.random()-.5)*.004);
 go(t=>{
  if(o.kind==='st'){            // звезда — светлое «дзи-нь» (две ноты: основная и квинта)
   soft(t,f*2,{gain:.05,dur:1.6});
   soft(t+.1,f*3,{gain:.034,dur:1.7});
  }else if(o.kind==='fr'){      // рамка — тёплый одиночный звон пониже
   soft(t,f,{gain:.06,dur:1.5});
  }else if(o.kind==='ci'){      // кружок — мягкий звон с долгим затуханием и тихой квинтой
   soft(t,f,{gain:.05,dur:2.3});
   soft(t+.14,f*1.5,{gain:.028,dur:2.1});
  }else{                        // точка — крошечный высокий «дзинь»
   soft(t,f*2,{gain:.032,dur:.9});
  }
 });
}

function spark(o,x,y,col,spread){
 const sd=o.el.parentElement,sz=rnd(6,12),a=rnd(0,6.283),d=rnd(20,spread),sp=document.createElement('i');
 sp.className='fxs';sp.style.cssText='--c:'+col+';left:'+(x-sz/2)+'px;top:'+(y-sz/2)+'px;width:'+sz+'px;height:'+sz+'px';
 sd.appendChild(sp);
 sp.animate([{opacity:1,transform:'translate(0,0) scale(.4)'},{opacity:.8,offset:.4},
  {opacity:0,transform:'translate('+Math.cos(a)*d+'px,'+(Math.sin(a)*d-10)+'px) scale(1) rotate('+rnd(-180,180)+'deg)'}],
  {duration:rnd(900,1500),easing:'cubic-bezier(.2,.7,.3,1)'}).onfinish=()=>sp.remove();
}
function centerOf(o){const r=o.el.getBoundingClientRect(),sr=o.el.parentElement.getBoundingClientRect();
 return{x:r.left+r.width/2-sr.left,y:r.top+r.height/2-sr.top,w:r.width,gx:r.left+r.width/2,gy:r.top+r.height/2}}
const colOf=o=>(o.el.style.getPropertyValue('--c')||'#fff').trim();

function burst(o,ev){ // обычный клик без перетаскивания
 const c=centerOf(o),col=colOf(o),el=o.el,sd=el.parentElement;
 const dx=c.gx-ev.clientX,dy=c.gy-ev.clientY,L=Math.hypot(dx,dy)||1;
 o.vx+=dx/L*rnd(45,70)+rnd(-14,14);o.vy+=dy/L*rnd(45,70)+rnd(-14,14);o.vr+=(Math.random()<.5?-1:1)*rnd(110,200);
 if(reduce||!el.animate)return;
 el.animate([{scale:'1'},{scale:'1.55',offset:.25},{scale:'.92',offset:.6},{scale:'1'}],{duration:900,easing:'ease-out'});
 el.animate([{filter:'brightness(2.4)'},{filter:'brightness(1)'}],{duration:900,easing:'ease-out'});
 const w=Math.max(c.w,26),ring=document.createElement('div');
 ring.className='fxr';ring.style.cssText='--c:'+col+';left:'+(c.x-w/2)+'px;top:'+(c.y-w/2)+'px;width:'+w+'px;height:'+w+'px';
 sd.appendChild(ring);
 ring.animate([{opacity:.85,transform:'scale(.5)'},{opacity:0,transform:'scale(3.2)'}],{duration:1300,easing:'cubic-bezier(.15,.7,.3,1)'}).onfinish=()=>ring.remove();
 for(let i=0;i<8;i++)spark(o,c.x,c.y,col,80);
}

/* перетаскивание: хватаешь фигуру, тянешь, отпускаешь — она по инерции уплывает */
document.addEventListener('pointerdown',e=>{
 const el=e.target.closest&&e.target.closest('.sd i');if(!el||e.button>0)return;
 const o=byEl.get(el);if(!o)return;
 e.preventDefault();if(measured!==o.grp)measure(o.grp);
 o.drag={id:e.pointerId,sx:e.clientX,sy:e.clientY,ox:o.ix,oy:o.iy,moved:false,lx:e.clientX,ly:e.clientY,lt:performance.now(),svx:0,svy:0,trail:0};
 cur=o;o.vx=o.vy=0;
 try{el.setPointerCapture(e.pointerId)}catch(_){}
 el.classList.add('grab');ping(o);
});
document.addEventListener('pointermove',e=>{
 const o=cur;if(!o||!o.drag||e.pointerId!==o.drag.id)return;const d=o.drag;
 const mx=e.clientX-d.sx,my=e.clientY-d.sy;
 if(!d.moved&&Math.hypot(mx,my)>5)d.moved=true;
 if(!d.moved)return;
 o.ix=d.ox+mx;o.iy=d.oy+my;o.vx=o.vy=0;wall(o);
 const now=performance.now(),dtm=Math.max(1,now-d.lt);
 d.svx=d.svx*.6+(e.clientX-d.lx)/dtm*1000*.4;d.svy=d.svy*.6+(e.clientY-d.ly)/dtm*1000*.4;
 d.lx=e.clientX;d.ly=e.clientY;d.lt=now;
 o.vr+=(d.svx*.0006)*0;o.ir+=(clamp(d.svx,-600,600)*.004-o.ir)*.08;     // чуть наклоняется по ходу движения
 if(!reduce&&now-d.trail>80){d.trail=now;const c=centerOf(o);spark(o,c.x,c.y,colOf(o),42)} // след из искорок
});
function release(e){
 const o=cur;if(!o||!o.drag||e.pointerId!==o.drag.id)return;const d=o.drag;
 cur=null;o.drag=null;o.el.classList.remove('grab');
 if(!d.moved){burst(o,e);return}
 const stale=performance.now()-d.lt>90;
 o.vx=stale?0:clamp(d.svx,-900,900)*.75;o.vy=stale?0:clamp(d.svy,-900,900)*.75;
 o.vr+=clamp(o.vx,-600,600)*.2;
}
document.addEventListener('pointerup',release);
document.addEventListener('pointercancel',release);
})();
