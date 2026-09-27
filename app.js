/*
  BIGGEST EMPIRE - client-side feature engine
  Static-site friendly: no server, no database, no API key required.
  Persistent data uses localStorage in the visitor's browser.
*/

const CONFIG = {
  whatsapp: "2330502277502",
  whatsappDisplay: "+233 050 227 7502",
  contactEmail: "",
  storageKey: "biggest_empire_v2",
  siteName: "BIGGEST EMPIRE"
};

const state = {
  filter: "all",
  search: "",
  posts: [
    {
      id:"update-1", category:"news", tag:"NEWS", title:"Empire Update Center",
      text:"Use this card for your latest eFootball announcement, version news or community bulletin.",
      date:"Today", symbol:"⚡", accent:["#79e8ff","#5a7cff"], reactions:14
    },
    {
      id:"update-2", category:"tips", tag:"TACTICS", title:"Cold Finishing Principles",
      text:"Create the opening, stay patient and choose the finish instead of rushing the final action.",
      date:"This week", symbol:"❄️", accent:["#79e8ff","#b8f5ff"], reactions:27
    },
    {
      id:"update-3", category:"event", tag:"EVENT", title:"Empire Match Night",
      text:"Create your own community fixture here. Add the date, opponent and competition details.",
      date:"Upcoming", symbol:"🏆", accent:["#ffd21c","#ff7b00"], reactions:9
    },
    {
      id:"update-4", category:"news", tag:"COMMUNITY", title:"Welcome to the Empire",
      text:"A central place for screenshots, gaming stories, tactics, announcements and community projects.",
      date:"Pinned", symbol:"🧊", accent:["#b8f5ff","#3f7dff"], reactions:36
    },
    {
      id:"update-5", category:"tips", tag:"GAMEPLAY", title:"Protect the Middle",
      text:"Use compact positioning when defending central areas and force the opponent toward less dangerous zones.",
      date:"Guide", symbol:"🎯", accent:["#8df5ad","#2cae69"], reactions:18
    },
    {
      id:"update-6", category:"event", tag:"DEALS", title:"Infinity EFB Deals",
      text:"Reserve this space for verified gaming deals, offers or projects. Add real details before publishing.",
      date:"Featured", symbol:"🔥", accent:["#ffcc42","#ff5e4d"], reactions:22
    }
  ],
  matches: [
    {id:"m1", status:"UPCOMING", date:"SAT • 20:00", home:"ICEMAN XI", away:"EMPIRE FC", score:"— : —"},
    {id:"m2", status:"RESULT", date:"FRI • 21:00", home:"ICE SQUAD", away:"GOLDEN XI", score:"3 : 2"},
    {id:"m3", status:"RESULT", date:"WED • 19:30", home:"EMPIRE FC", away:"KUMASI STARS", score:"2 : 2"},
    {id:"m4", status:"UPCOMING", date:"SUN • 18:00", home:"BIGGEST XI", away:"TACTIC BOYS", score:"— : —"},
    {id:"m5", status:"RESULT", date:"MON • 20:30", home:"ICE SQUAD", away:"RIVAL FC", score:"4 : 1"}
  ],
  gallery: [
    {title:"ICE MODE", subtitle:"Matchday", symbol:"❄️", g1:"#79e8ff", g2:"#4169ff"},
    {title:"EMPIRE NIGHT", subtitle:"Community", symbol:"🏟️", g1:"#ffd21c", g2:"#ff7b00"},
    {title:"TACTICAL LAB", subtitle:"Formation", symbol:"🧠", g1:"#c4f7ff", g2:"#3a72ff"},
    {title:"MATCH READY", subtitle:"eFootball", symbol:"⚽", g1:"#8df5ad", g2:"#178f6a"},
    {title:"COLD FINISH", subtitle:"Gameplay", symbol:"🎯", g1:"#ffcc42", g2:"#ff4d5a"},
    {title:"EMPIRE ENERGY", subtitle:"Gaming", symbol:"🔥", g1:"#ff9f00", g2:"#ff3e71"},
    {title:"THE ARENA", subtitle:"Community", symbol:"🏆", g1:"#79e8ff", g2:"#7557ff"},
    {title:"BIGGEST", subtitle:"Identity", symbol:"⚡", g1:"#ffffff", g2:"#79e8ff"}
  ]
};

const formations = {
  "433": {
    name:"4-3-3",
    players:[
      ["GK","gk",8,50],["LB","",24,18],["CB","",28,40],["CB","",28,60],["RB","",24,82],
      ["CM","",46,30],["DM","",49,50],["CM","",46,70],
      ["LW","",75,18],["CF","",82,50],["RW","",75,82]
    ]
  },
  "4231": {
    name:"4-2-3-1",
    players:[
      ["GK","gk",8,50],["LB","",24,18],["CB","",28,40],["CB","",28,60],["RB","",24,82],
      ["DM","",43,38],["DM","",43,62],["AM","",61,50],
      ["LW","",70,18],["CF","",82,50],["RW","",70,82]
    ]
  },
  "442": {
    name:"4-4-2",
    players:[
      ["GK","gk",8,50],["LB","",24,18],["CB","",28,40],["CB","",28,60],["RB","",24,82],
      ["LM","",48,15],["CM","",48,40],["CM","",48,60],["RM","",48,85],
      ["CF","",80,40],["CF","",80,60]
    ]
  },
  "352": {
    name:"3-5-2",
    players:[
      ["GK","gk",8,50],["CB","",27,32],["CB","",27,50],["CB","",27,68],
      ["LWB","",47,12],["CM","",46,34],["DM","",48,50],["CM","",46,66],["RWB","",47,88],
      ["CF","",80,40],["CF","",80,60]
    ]
  },
  "451": {
    name:"4-5-1",
    players:[
      ["GK","gk",8,50],["LB","",24,18],["CB","",28,40],["CB","",28,60],["RB","",24,82],
      ["LM","",48,13],["CM","",47,32],["DM","",49,50],["CM","",47,68],["RM","",48,87],
      ["CF","",82,50]
    ]
  }
};

const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

function loadStore(){
  try{
    return JSON.parse(localStorage.getItem(CONFIG.storageKey)) || {
      saved:[], liked:[], reactions:{}, theme:"dark", visits:0
    };
  }catch{
    return {saved:[],liked:[],reactions:{},theme:"dark",visits:0};
  }
}
let store = loadStore();

function saveStore(){
  localStorage.setItem(CONFIG.storageKey, JSON.stringify(store));
  updateCommunityStats();
}

function toast(message){
  const el = $("#toast");
  if(!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(()=>el.classList.remove("show"),2600);
}

function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function renderUpdates(){
  const grid = $("#updateGrid");
  const empty = $("#emptyUpdates");
  if(!grid) return;

  const q = state.search.trim().toLowerCase();
  const visible = state.posts.filter(post => {
    const categoryOK = state.filter === "all" || post.category === state.filter;
    const text = `${post.title} ${post.text} ${post.tag}`.toLowerCase();
    return categoryOK && (!q || text.includes(q));
  });

  grid.innerHTML = visible.map(post => {
    const saved = store.saved.includes(post.id);
    const liked = store.liked.includes(post.id);
    const reaction = Number(store.reactions[post.id] || post.reactions || 0);
    return `
      <article class="card update-card">
        <div class="update-visual" style="--g1:${post.accent[0]};--g2:${post.accent[1]}">
          <span class="visual-code">${escapeHTML(post.tag)}</span>
          <span class="visual-ball">${post.symbol}</span>
        </div>
        <div class="card-body">
          <span class="tag">${escapeHTML(post.tag)}</span>
          <h3>${escapeHTML(post.title)}</h3>
          <p>${escapeHTML(post.text)}</p>
          <div class="card-actions">
            <span>${escapeHTML(post.date)}</span>
            <div>
              <button class="${liked ? "liked" : ""}" data-action="like" data-id="${post.id}">♥ ${reaction}</button>
              <button class="${saved ? "saved" : ""}" data-action="save" data-id="${post.id}">${saved ? "★ Saved" : "☆ Save"}</button>
              <button data-action="open" data-id="${post.id}">Read →</button>
            </div>
          </div>
        </div>
      </article>`;
  }).join("");

  empty.classList.toggle("hidden", visible.length !== 0);
}

function openPost(id){
  const post = state.posts.find(x=>x.id===id);
  if(!post) return;
  const modal = $("#postModal");
  $("#modalContent").innerHTML = `
    <div class="modal-hero" style="background:radial-gradient(circle at 30% 25%,${post.accent[0]}55,transparent 30%),linear-gradient(145deg,#101c25,#070a0f)">${post.symbol}</div>
    <span class="tag">${escapeHTML(post.tag)}</span>
    <h2 id="modalTitle">${escapeHTML(post.title)}</h2>
    <p>${escapeHTML(post.text)}</p>
    <p><b>Published:</b> ${escapeHTML(post.date)}</p>
    <div class="modal-actions">
      <button class="btn primary" data-modal-like="${post.id}">♥ React</button>
      <button class="btn dark" data-modal-save="${post.id}">☆ Save post</button>
      <button class="btn dark" data-modal-share="${post.id}">↗ Share</button>
    </div>`;
  modal.classList.remove("hidden");
  document.body.style.overflow="hidden";
}

function closeModal(id){
  const modal = $(id);
  if(modal){modal.classList.add("hidden");document.body.style.overflow="";}
}

function toggleLike(id){
  if(store.liked.includes(id)){
    store.liked = store.liked.filter(x=>x!==id);
    store.reactions[id] = Math.max(0,Number(store.reactions[id]||0)-1);
    toast("Reaction removed.");
  }else{
    store.liked.push(id);
    store.reactions[id] = Number(store.reactions[id]||0)+1;
    toast("Reaction added.");
  }
  saveStore(); renderUpdates();
}

function toggleSave(id){
  if(store.saved.includes(id)){
    store.saved = store.saved.filter(x=>x!==id);
    toast("Removed from saved posts.");
  }else{
    store.saved.push(id);
    toast("Saved to this browser.");
  }
  saveStore(); renderUpdates();
}

function renderMatches(){
  const featured = state.matches[0];
  const featuredEl = $("#featuredMatch");
  const list = $("#matchList");
  if(!featuredEl || !list) return;

  featuredEl.innerHTML = `
    <span class="match-label">${featured.status}</span>
    <span class="match-date"> • ${featured.date}</span>
    <div class="scoreboard">
      <div class="team"><b>${escapeHTML(featured.home)}</b><small>HOME</small></div>
      <div class="score">${featured.score}</div>
      <div class="team"><b>${escapeHTML(featured.away)}</b><small>AWAY</small></div>
    </div>
    <div class="match-actions">
      <button class="btn dark" id="notifyMatch">🔔 Remind me</button>
      <button class="btn primary" id="matchInfo">Match details</button>
    </div>`;

  list.innerHTML = state.matches.slice(1).map(m=>`
    <div class="match-item">
      <div><b>${escapeHTML(m.home)}</b> <span class="muted">vs</span> <b>${escapeHTML(m.away)}</b><small>${escapeHTML(m.date)}</small></div>
      <div><span class="match-status">${escapeHTML(m.status)}</span><div class="match-score">${escapeHTML(m.score)}</div></div>
    </div>`).join("");

  $("#notifyMatch")?.addEventListener("click",()=>{
    if("Notification" in window){
      if(Notification.permission==="granted"){
        new Notification("BIGGEST EMPIRE", {body:`Reminder: ${featured.home} vs ${featured.away}`});
        toast("Match reminder sent.");
      }else if(Notification.permission!=="denied"){
        Notification.requestPermission().then(p=>{
          if(p==="granted") new Notification("BIGGEST EMPIRE",{body:`Reminder: ${featured.home} vs ${featured.away}`});
          else toast("Browser notifications are blocked.");
        });
      }else toast("Browser notifications are blocked.");
    }else toast("Notifications are not supported here.");
  });
  $("#matchInfo")?.addEventListener("click",()=>toast("Edit the match data in app.js to publish your real fixture."));
}

function renderFormation(key){
  const formation = formations[key] || formations["433"];
  $("#formationName").textContent = formation.name;
  const layer = $("#playersLayer");
  if(!layer) return;
  layer.innerHTML = formation.players.map((p,i)=>`
    <button class="player-dot ${p[1]}" style="top:${p[2]}%;left:${p[3]}%" title="${p[0]}">
      ${escapeHTML(p[0])}
    </button>`).join("");
  $$(".player-dot",layer).forEach(btn=>{
    btn.addEventListener("click",()=>toast(`${btn.title}: tactical position selected.`));
  });
}

function renderGallery(){
  const grid = $("#galleryGrid");
  if(!grid) return;
  grid.innerHTML = state.gallery.map((item,i)=>`
    <article class="gallery-card" data-gallery="${i}" style="--g1:${item.g1};--g2:${item.g2}">
      <div class="gallery-content"><b>${escapeHTML(item.title)}</b><small>${escapeHTML(item.subtitle)}</small></div>
    </article>`).join("");
  $$(".gallery-card",grid).forEach(card=>{
    card.addEventListener("click",()=>openGallery(Number(card.dataset.gallery)));
  });
}

function openGallery(index){
  const item = state.gallery[index];
  if(!item) return;
  const modal = $("#imageModal");
  $("#imagePreview").innerHTML = `
    <div class="image-preview" style="--g1:${item.g1};--g2:${item.g2}">
      <div class="big-symbol">${item.symbol}</div>
      <div class="caption">${escapeHTML(item.title)} — ${escapeHTML(item.subtitle)}</div>
    </div>`;
  modal.classList.remove("hidden");
  document.body.style.overflow="hidden";
}

function updateCommunityStats(){
  $("#savedCount").textContent = store.saved.length;
  $("#reactionCount").textContent = Object.values(store.reactions).reduce((a,b)=>a+Number(b||0),0);
  $("#visitCount").textContent = Math.max(1,store.visits||1);
}

function applyTheme(){
  document.body.classList.toggle("light",store.theme==="light");
  $("#themeBtn").textContent = store.theme==="light" ? "☀" : "◐";
}
function toggleTheme(){
  store.theme = store.theme==="light" ? "dark" : "light";
  saveStore(); applyTheme();
  toast(store.theme==="light" ? "Light mode enabled." : "Dark mode enabled.");
}

function sharePage(){
  const data = {title:CONFIG.siteName,text:"Enter the BIGGEST EMPIRE — eFootball community.",url:location.href};
  if(navigator.share){
    navigator.share(data).catch(()=>{});
  }else{
    navigator.clipboard?.writeText(location.href).then(()=>toast("Page link copied."));
  }
}

function copyNumber(){
  navigator.clipboard?.writeText(CONFIG.whatsappDisplay)
    .then(()=>toast("WhatsApp number copied."))
    .catch(()=>toast(CONFIG.whatsappDisplay));
}

function handleContactForm(event){
  event.preventDefault();
  const name = $("#contactName").value.trim();
  const message = $("#contactMessage").value.trim();
  if(!name || !message) return;
  const text = `Hello BIGGEST EMPIRE,%0A%0AName: ${encodeURIComponent(name)}%0AMessage: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${text}`,"_blank","noopener");
}

function setFilter(filter){
  state.filter=filter;
  $$(".small-btn[data-filter]").forEach(b=>b.classList.toggle("selected",b.dataset.filter===filter));
  renderUpdates();
}

function shuffleGallery(){
  state.gallery.sort(()=>Math.random()-.5);
  renderGallery();
  toast("Gallery shuffled.");
}

function setupNavigation(){
  const menu = $("#mainMenu");
  $("#menuBtn")?.addEventListener("click",()=>{
    const open = menu.classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded",String(open));
  });
  $$(".nav-link").forEach(link=>{
    link.addEventListener("click",()=>menu.classList.remove("open"));
  });

  const sections = $$("main section[id]");
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        $$(".nav-link").forEach(a=>a.classList.toggle("active",a.getAttribute("href")===`#${entry.target.id}`));
      }
    });
  },{rootMargin:"-35% 0px -55% 0px"});
  sections.forEach(s=>observer.observe(s));
}

function setupEvents(){
  $("#updateSearch")?.addEventListener("input",e=>{state.search=e.target.value;renderUpdates();});
  $("#clearSearch")?.addEventListener("click",()=>{$("#updateSearch").value="";state.search="";renderUpdates();});
  $$("[data-filter]").forEach(btn=>btn.addEventListener("click",()=>setFilter(btn.dataset.filter)));

  $("#updateGrid")?.addEventListener("click",e=>{
    const btn=e.target.closest("[data-action]");
    if(!btn)return;
    const id=btn.dataset.id;
    if(btn.dataset.action==="like")toggleLike(id);
    if(btn.dataset.action==="save")toggleSave(id);
    if(btn.dataset.action==="open")openPost(id);
  });

  $("#formationSelect")?.addEventListener("change",e=>renderFormation(e.target.value));
  $("#themeBtn")?.addEventListener("click",toggleTheme);
  $("#shareBtn")?.addEventListener("click",sharePage);
  $("#copyNumber")?.addEventListener("click",copyNumber);
  $("#randomGallery")?.addEventListener("click",shuffleGallery);
  $("#contactForm")?.addEventListener("submit",handleContactForm);

  $("#emailFallback")?.addEventListener("click",()=>{
    if(CONFIG.contactEmail){
      location.href=`mailto:${CONFIG.contactEmail}`;
    }else{
      toast("Add your email address in CONFIG.contactEmail in app.js.");
    }
  });

  $("#resetPrefs")?.addEventListener("click",()=>{
    if(confirm("Reset saved posts, reactions, theme and local visit count?")){
      localStorage.removeItem(CONFIG.storageKey);
      store=loadStore();
      store.visits=1;
      saveStore(); applyTheme(); renderUpdates();
      toast("Local preferences reset.");
    }
  });

  $$("[data-close-modal]").forEach(el=>el.addEventListener("click",()=>closeModal("#postModal")));
  $$("[data-close-image]").forEach(el=>el.addEventListener("click",()=>closeModal("#imageModal")));

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"){closeModal("#postModal");closeModal("#imageModal");}
  });

  $("#modalContent")?.addEventListener("click",e=>{
    const like=e.target.closest("[data-modal-like]");
    const save=e.target.closest("[data-modal-save]");
    const share=e.target.closest("[data-modal-share]");
    if(like){toggleLike(like.dataset.modalLike);}
    if(save){toggleSave(save.dataset.modalSave);}
    if(share){
      const post=state.posts.find(x=>x.id===share.dataset.modalShare);
      if(post){
        navigator.clipboard?.writeText(`${post.title} — ${location.href}`)
          .then(()=>toast("Post link copied."));
      }
    }
  });
}

function startVisitorCounter(){
  const el=$("#visitorCount");
  if(!el)return;
  let base=128+Math.floor(Math.random()*27);
  el.textContent=base;
  setInterval(()=>{
    base += Math.random()>.55 ? 1 : -1;
    base=Math.max(101,Math.min(199,base));
    el.textContent=base;
  },8000);
}

function boot(){
  store.visits=Number(store.visits||0)+1;
  saveStore();
  applyTheme();
  renderUpdates();
  renderMatches();
  renderFormation("433");
  renderGallery();
  setupNavigation();
  setupEvents();
  startVisitorCounter();
  $("#year").textContent=new Date().getFullYear();

  // Add a tiny entrance effect without external libraries.
  requestAnimationFrame(()=>document.body.classList.add("ready"));
}

boot();


/* --------------------------------------------------------------------------
   ADVANCED STATIC-SITE FEATURES
   Everything below is browser-side and safe for a GitHub Pages/Render
   static deployment. No secret keys or server credentials are stored here.
   -------------------------------------------------------------------------- */

function setupAdvancedFeatures(){
  setupReadingProgress();
  setupBackToTop();
  setupKeyboardShortcuts();
  setupOfflineIndicator();
  setupClock();
  setupSavedPostsPanel();
  setupDataTools();
  setupInstallPrompt();
  setupLazyEnhancement();
  setupQuickCommand();
  setupScrollReveal();
}

/* Reading progress: a subtle indicator that follows the page scroll. */
function setupReadingProgress(){
  if($("#readingProgress")) return;
  const bar=document.createElement("div");
  bar.id="readingProgress";
  Object.assign(bar.style,{
    position:"fixed",left:"0",top:"0",height:"2px",width:"0%",
    background:"linear-gradient(90deg,#79e8ff,#ffffff)",
    zIndex:"2000",pointerEvents:"none",transition:"width .08s linear"
  });
  document.body.appendChild(bar);
  const update=()=>{
    const max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(max>0 ? Math.min(100,window.scrollY/max*100) : 0)+"%";
  };
  window.addEventListener("scroll",update,{passive:true});
  update();
}

/* Back-to-top button is injected so the HTML stays clean. */
function setupBackToTop(){
  if($("#backTop")) return;
  const button=document.createElement("button");
  button.id="backTop";
  button.type="button";
  button.textContent="↑";
  button.title="Back to top";
  Object.assign(button.style,{
    position:"fixed",right:"20px",bottom:"88px",width:"44px",height:"44px",
    borderRadius:"12px",border:"1px solid var(--line)",
    background:"var(--card)",color:"var(--text)",zIndex:"700",
    opacity:"0",pointerEvents:"none",transition:"opacity .2s,transform .2s",
    transform:"translateY(8px)",fontWeight:"900"
  });
  document.body.appendChild(button);
  button.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  window.addEventListener("scroll",()=>{
    const show=window.scrollY>700;
    button.style.opacity=show?"1":"0";
    button.style.pointerEvents=show?"auto":"none";
    button.style.transform=show?"translateY(0)":"translateY(8px)";
  },{passive:true});
}

/* Useful keyboard shortcuts for desktop visitors. */
function setupKeyboardShortcuts(){
  document.addEventListener("keydown",event=>{
    const tag=(document.activeElement?.tagName||"").toLowerCase();
    const typing=tag==="input"||tag==="textarea"||tag==="select";
    if(event.key==="/"&&!typing){
      event.preventDefault();
      $("#updateSearch")?.focus();
      toast("Search focused. Type to filter Empire updates.");
    }
    if(event.key.toLowerCase()==="g"&&!typing){
      const sections=["home","updates","matches","tactics","gallery","community","contact"];
      const index=Number(prompt("Go to section: 1 Home, 2 Updates, 3 Matches, 4 Tactics, 5 Gallery, 6 Community, 7 Contact"));
      if(index>=1&&index<=sections.length){
        document.getElementById(sections[index-1])?.scrollIntoView({behavior:"smooth"});
      }
    }
  });
}

/* Online/offline state is real browser network status, not a server claim. */
function setupOfflineIndicator(){
  const update=()=>{
    let el=$("#networkState");
    if(!el){
      el=document.createElement("div");
      el.id="networkState";
      Object.assign(el.style,{
        position:"fixed",left:"18px",bottom:"18px",zIndex:"1000",
        padding:"8px 11px",borderRadius:"10px",fontSize:"11px",
        fontWeight:"900",border:"1px solid var(--line)",
        background:"var(--card)",color:"var(--muted)",
        opacity:"0",transition:"opacity .2s"
      });
      document.body.appendChild(el);
    }
    if(navigator.onLine){
      el.textContent="● ONLINE";
      el.style.color="#72e9a0";
      if(el.dataset.manual==="1"){el.style.opacity="1";setTimeout(()=>el.style.opacity="0",2200);el.dataset.manual="0";}
    }else{
      el.textContent="● OFFLINE — local features still work";
      el.style.color="#ffcc62";
      el.style.opacity="1";
      el.dataset.manual="1";
    }
  };
  window.addEventListener("online",update);
  window.addEventListener("offline",update);
  update();
}

/* Local time badge, injected into the footer area. */
function setupClock(){
  const target=document.createElement("span");
  target.id="localClock";
  target.style.cssText="display:block;margin-top:6px;font-size:10px;color:#68727f";
  $(".footer-right")?.appendChild(target);
  const tick=()=>{
    target.textContent="Your local time: "+new Intl.DateTimeFormat(undefined,{
      hour:"2-digit",minute:"2-digit",second:"2-digit"
    }).format(new Date());
  };
  tick();
  setInterval(tick,1000);
}

/* Saved-post browser view. This is entirely local and never uploads content. */
function setupSavedPostsPanel(){
  const button=document.createElement("button");
  button.id="savedPanelBtn";
  button.className="small-btn";
  button.textContent="★ Saved";
  button.title="View posts saved in this browser";
  $(".head-tools")?.appendChild(button);
  button.addEventListener("click",()=>{
    if(!store.saved.length){
      toast("You have no saved posts yet.");
      return;
    }
    const savedPosts=state.posts.filter(p=>store.saved.includes(p.id));
    $("#modalContent").innerHTML=`
      <p class="eyebrow">YOUR LIBRARY</p>
      <h2 id="modalTitle">Saved Posts</h2>
      <p>These bookmarks are stored only in this browser.</p>
      <div style="display:grid;gap:9px;margin-top:18px">
        ${savedPosts.map(p=>`
          <button class="btn dark" style="justify-content:flex-start;text-align:left" data-open-saved="${p.id}">
            ${p.symbol} &nbsp; <b>${escapeHTML(p.title)}</b>
          </button>`).join("")}
      </div>`;
    $("#postModal").classList.remove("hidden");
    document.body.style.overflow="hidden";
  });

  $("#modalContent")?.addEventListener("click",event=>{
    const btn=event.target.closest("[data-open-saved]");
    if(btn) openPost(btn.dataset.openSaved);
  });
}

/* Export/import makes local content preferences portable between devices. */
function setupDataTools(){
  const community=$("#resetPrefs");
  if(!community) return;
  const wrap=document.createElement("div");
  wrap.style.cssText="display:flex;gap:7px;flex-wrap:wrap;grid-column:1/-1";
  wrap.innerHTML=`
    <button type="button" class="small-btn" id="exportPrefs">Export preferences</button>
    <button type="button" class="small-btn" id="importPrefs">Import preferences</button>
    <input id="importPrefsFile" type="file" accept="application/json" hidden>`;
  community.parentElement?.appendChild(wrap);

  $("#exportPrefs")?.addEventListener("click",()=>{
    const payload={
      app:"BIGGEST EMPIRE",
      version:2,
      exportedAt:new Date().toISOString(),
      preferences:store
    };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:"application/json"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;a.download="biggest-empire-preferences.json";
    document.body.appendChild(a);a.click();a.remove();
    URL.revokeObjectURL(url);
    toast("Preferences exported.");
  });

  $("#importPrefs")?.addEventListener("click",()=>$("#importPrefsFile")?.click());
  $("#importPrefsFile")?.addEventListener("change",event=>{
    const file=event.target.files?.[0];
    if(!file)return;
    const reader=new FileReader();
    reader.onload=()=>{
      try{
        const data=JSON.parse(reader.result);
        const incoming=data.preferences||data;
        if(!incoming||typeof incoming!=="object") throw new Error("Invalid data");
        store={
          saved:Array.isArray(incoming.saved)?incoming.saved:[],
          liked:Array.isArray(incoming.liked)?incoming.liked:[],
          reactions:incoming.reactions&&typeof incoming.reactions==="object"?incoming.reactions:{},
          theme:incoming.theme==="light"?"light":"dark",
          visits:Number(incoming.visits)||1
        };
        saveStore();applyTheme();renderUpdates();updateCommunityStats();
        toast("Preferences imported.");
      }catch{
        toast("That file is not a valid Empire preference file.");
      }
      event.target.value="";
    };
    reader.readAsText(file);
  });
}

/* Optional PWA install prompt: works only when the browser provides it. */
let deferredInstallPrompt=null;
function setupInstallPrompt(){
  window.addEventListener("beforeinstallprompt",event=>{
    event.preventDefault();
    deferredInstallPrompt=event;
    let btn=$("#installSite");
    if(!btn){
      btn=document.createElement("button");
      btn.id="installSite";
      btn.className="small-btn";
      btn.textContent="Install site";
      $(".head-tools")?.appendChild(btn);
    }
    btn.onclick=async()=>{
      if(!deferredInstallPrompt)return;
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt=null;
      btn.remove();
    };
  });
}

/* Add a subtle hover tilt to cards on pointer devices. */
function setupLazyEnhancement(){
  if(!window.matchMedia("(pointer:fine)").matches)return;
  document.addEventListener("pointermove",event=>{
    const card=event.target.closest(".card,.community-card,.feature-card");
    if(!card)return;
    const rect=card.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width-.5;
    const y=(event.clientY-rect.top)/rect.height-.5;
    card.style.transform=`translateY(-3px) perspective(800px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg)`;
  });
  document.addEventListener("pointerout",event=>{
    const card=event.target.closest(".card,.community-card,.feature-card");
    if(card && !card.contains(event.relatedTarget))card.style.transform="";
  });
}

/* A lightweight command palette built without a framework. */
function setupQuickCommand(){
  const palette=document.createElement("div");
  palette.id="commandPalette";
  palette.className="modal hidden";
  palette.innerHTML=`
    <div class="modal-backdrop" data-command-close></div>
    <div class="modal-box" style="max-width:560px">
      <button class="modal-close" data-command-close aria-label="Close">×</button>
      <p class="eyebrow">QUICK COMMAND</p>
      <h2 id="modalTitle">Empire Search</h2>
      <div class="search-bar" style="margin-top:15px">
        <span>⌕</span><input id="commandInput" placeholder="Try: updates, matches, tactics..." autocomplete="off">
      </div>
      <div id="commandResults" style="display:grid;gap:7px;margin-top:10px"></div>
    </div>`;
  document.body.appendChild(palette);

  const commands=[
    ["Home","home"],["Updates","updates"],["Matches","matches"],
    ["Tactics","tactics"],["Gallery","gallery"],["Community","community"],["Contact","contact"]
  ];
  const results=$("#commandResults");
  const renderCommands=q=>{
    const query=q.toLowerCase().trim();
    const list=commands.filter(c=>!query||c[0].toLowerCase().includes(query));
    results.innerHTML=list.map(c=>`
      <button class="btn dark" style="justify-content:flex-start" data-command-section="${c[1]}">→ ${c[0]}</button>`).join("");
  };
  renderCommands("");
  $("#commandInput").addEventListener("input",e=>renderCommands(e.target.value));
  results.addEventListener("click",e=>{
    const btn=e.target.closest("[data-command-section]");
    if(!btn)return;
    palette.classList.add("hidden");
    document.body.style.overflow="";
    document.getElementById(btn.dataset.commandSection)?.scrollIntoView({behavior:"smooth"});
  });
  palette.addEventListener("click",e=>{
    if(e.target.matches("[data-command-close]")){
      palette.classList.add("hidden");document.body.style.overflow="";
    }
  });
  document.addEventListener("keydown",e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
      e.preventDefault();
      palette.classList.remove("hidden");
      document.body.style.overflow="hidden";
      $("#commandInput").focus();
    }
  });
}

/* Reveal sections as the visitor scrolls down. */
function setupScrollReveal(){
  if(!("IntersectionObserver" in window))return;
  const targets=$$(".card,.match-feature,.match-item,.feature-card,.community-card,.contact-form,.final-banner,.gallery-card");
  targets.forEach(el=>{
    el.style.opacity="0";
    el.style.transform="translateY(14px)";
    el.style.transition="opacity .45s ease,transform .45s ease";
  });
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.opacity="1";
        entry.target.style.transform="";
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08});
  targets.forEach(el=>observer.observe(el));
}

/* A safe public-share helper for individual update cards. */
function sharePost(post){
  const title=post?.title||CONFIG.siteName;
  const text=`${title} — ${CONFIG.siteName}`;
  if(navigator.share){
    navigator.share({title,text,url:location.href}).catch(()=>{});
  }else{
    navigator.clipboard?.writeText(`${text} ${location.href}`).then(()=>toast("Post link copied."));
  }
}

/* Optional dynamic post API hook.
   Developers can call window.BiggestEmpire.addPost({...}) in the console
   or from another local script. Nothing is sent to a remote server. */
window.BiggestEmpire={
  version:"2.0-static",
  getState:()=>JSON.parse(JSON.stringify(state)),
  getPreferences:()=>JSON.parse(JSON.stringify(store)),
  addPost(post){
    if(!post||!post.title)return false;
    const item={
      id:post.id||`local-${Date.now()}`,
      category:post.category||"news",
      tag:post.tag||"NEWS",
      title:post.title,
      text:post.text||"",
      date:post.date||"Just added",
      symbol:post.symbol||"⚡",
      accent:post.accent||["#79e8ff","#4169ff"],
      reactions:Number(post.reactions)||0
    };
    state.posts.unshift(item);
    renderUpdates();
    toast("New local post added.");
    return item.id;
  },
  removePost(id){
    const before=state.posts.length;
    state.posts=state.posts.filter(p=>p.id!==id);
    renderUpdates();
    return state.posts.length<before;
  },
  clearLocalData(){
    localStorage.removeItem(CONFIG.storageKey);
    store=loadStore();
    renderUpdates();updateCommunityStats();applyTheme();
    return true;
  }
};

/* Initialize the advanced layer after the core UI has painted. */
setTimeout(setupAdvancedFeatures,0);
