import {CONFIG} from './config.js';
import {initDb,getProducts,getCategories,getSettings,isLive} from './db.js';
import {el,all,esc,visualOf,artStyle,artHTML,toast,initModals,openModal,whatsappUrl} from './shared.js';
import {language,t,initLanguage} from './i18n.js';

let products=[],categories=[],settings={},activeCat='all',visible=8,cart=[],currentDetail=null;
try{cart=JSON.parse(localStorage.getItem('didgstore-cart-v1')||'[]')}catch{cart=[]}
const nameOf=p=>language()==='en'&&(p.name_en||'').trim()?p.name_en:p.name_ar;
const catName=slug=>{
  const c=categories.find(item=>item.slug===slug);
  return c?(language()==='en'?c.name_en||c.name_ar:c.name_ar):t('products.default');
};
const categoryName=c=>language()==='en'?(c.name_en||c.name_ar):c.name_ar;
const money=n=>`${Number(n||0).toLocaleString(language()==='en'?'en-US':'fr-MA',{maximumFractionDigits:2})} DH`;
const currency=p=>Number(p.price)>0?money(p.price):t('products.ask');
const simpleDurations={
  'شهر واحد':'1 month','شهر':'1 month','3 شهور':'3 months','3 أشهر':'3 months',
  '6 شهور':'6 months','6 أشهر':'6 months','12 شهراً':'12 months','12 شهر':'12 months',
  'مدى الحياة':'Lifetime','حسب العرض':'Depends on offer','حسب المنتج':'Depends on product',
  'حسب اللعبة':'Depends on the game','حسب الخدمة':'Depends on service','حسب تفاصيل العرض':'See offer details'
};
const durationOf=p=>language()==='en'?p.duration_en||simpleDurations[p.duration]||p.duration:p.duration;
const descriptionOf=(p,full=false)=>{
  if(language()==='en')return (full?p.description_en:p.short_description_en)||(full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
  return (full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
};
function persistCart(){
  try{localStorage.setItem('didgstore-cart-v1',JSON.stringify(cart))}catch{/* private mode */}
  el('#cartCount').textContent=cart.reduce((n,x)=>n+x.qty,0);
}
function categoryIcon(c){
  const icons={all:'▦',subscriptions:'◉',design:'✦',gaming:'✣',ai:'✧',social:'↗',iptv:'▣'};
  const imgs={design:'canva',gaming:'games',ai:'ai',subscriptions:'spotify',iptv:'iptv'};
  return imgs[c.slug]?`<img src="./assets/tile-${imgs[c.slug]}.webp" alt=""/>`:esc(c.icon||icons[c.slug]||'▦');
}
function categoryBtn(c,tile=false){
  const count=products.filter(p=>p.is_active&&(c.slug==='all'||p.category_id===c.slug)).length;
  const cname=esc(categoryName(c));
  return tile?
    `<button class="category-tile ${activeCat===c.slug?'selected':''}" data-category="${esc(c.slug)}"><span class="category-icon">${categoryIcon(c)}</span><strong>${cname}</strong><small>${count} ${language()==='en'?'ITEMS':'منتجات'}</small></button>`:
    `<button class="filter-pill ${activeCat===c.slug?'selected':''}" data-category="${esc(c.slug)}">${cname}</button>`;
}
function renderCategories(){
  el('#categories').innerHTML=categories.map(c=>categoryBtn(c,true)).join('');
  el('#filterRow').innerHTML=categories.map(c=>categoryBtn(c)).join('');
}
function card(p){
  const old=Number(p.old_price)>Number(p.price)&&Number(p.price)>0;
  const discount=old?Math.round((1-Number(p.price)/Number(p.old_price))*100):0;
  const n=esc(nameOf(p));
  return `<article class="product-card" style="${artStyle(p)}">
    <div class="card-media" data-detail="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(t('products.details'))} ${n}">
      ${artHTML(p)}
      ${p.featured?`<span class="card-tag">✦ ${esc(t('products.featured'))}</span>`:''}
      ${discount?`<span class="card-discount">-${discount}%</span>`:''}
    </div>
    <div class="card-body"><span class="card-category">${esc(catName(p.category_id))}</span><h3>${n}</h3>
      <p>${esc(descriptionOf(p))}</p>
      ${p.duration?`<span class="card-meta">◷ ${esc(durationOf(p))}</span>`:''}
      <div class="price-row"><strong class="price-current">${esc(currency(p))}</strong>${old?`<span class="price-old">${esc(money(p.old_price))}</span>`:''}</div>
      <div class="card-actions"><button class="btn btn-primary" data-buy="${esc(p.id)}">${esc(t('products.buy'))}</button>
        <button class="add-cart" data-add="${esc(p.id)}" aria-label="${esc(t('products.addCart'))} ${n}" title="${esc(t('products.addCart'))}">+</button></div>
    </div></article>`;
}
const featureLogo={netflix:'tile-netflix.webp',spotify:'tile-spotify.webp',canva:'tile-canva.webp',discord:'tile-discord.webp',iptv:'tile-iptv.webp',games:'tile-games.webp',ai:'tile-ai.webp'};
function featureCard(p){
  const old=Number(p.old_price)>Number(p.price)&&Number(p.price)>0;
  const discount=old?Math.round((1-Number(p.price)/Number(p.old_price))*100):0;
  const v=visualOf(p),file=featureLogo[p.visual],n=esc(nameOf(p));
  const icon=file?`<img src="./assets/${file}" alt="" loading="lazy"/>`:`<span class="fallback-logo">${esc(v.symbol)}</span>`;
  return `<article class="deal-tile" style="${artStyle(p)}">
   ${discount?`<span class="deal-badge">-${discount}%</span>`:''}<span class="deal-shine" aria-hidden="true">✦</span>
   <div class="deal-icon" data-detail="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(t('products.details'))} ${n}">${p.image_url?`<img src="${esc(p.image_url)}" alt="${n}" loading="lazy"/>`:icon}</div>
   <h3 title="${n}">${n}</h3><div class="deal-duration">${esc(durationOf(p)||catName(p.category_id))}</div>
   <div class="deal-price ${Number(p.price)>0?'':'ask'}">${esc(currency(p))}${old?`<span class="deal-old">${esc(money(p.old_price))}</span>`:''}</div>
   <button class="deal-cta" data-buy="${esc(p.id)}">${esc(t('products.buyShort'))}</button>
  </article>`;
}
function renderOffers(){
  const grid=el('#featuredGrid');if(!grid)return;
  const visibleItems=products.filter(p=>p.is_active);
  const preferred=['netflix','canva','iptv','discord','spotify'];
  visibleItems.sort((a,b)=>{
    const ia=preferred.indexOf(a.visual),ib=preferred.indexOf(b.visual);
    return (ia<0?99:ia)-(ib<0?99:ib);
  });
  grid.innerHTML=visibleItems.slice(0,5).map(featureCard).join('')||`<div class="empty-state">${esc(t('offers.empty'))}</div>`;
}
function filtered(){
  const term=el('#searchInput').value.trim().toLocaleLowerCase();
  return products.filter(p=>p.is_active&&(activeCat==='all'||p.category_id===activeCat)&&
    (`${p.name_ar} ${p.name_en} ${p.short_description||''} ${p.short_description_en||''}`.toLocaleLowerCase().includes(term)));
}
function renderProducts(){
  const res=filtered();
  el('#productGrid').innerHTML=res.slice(0,visible).map(card).join('');
  el('#emptyProducts').hidden=res.length>0;
  el('#showMore').hidden=res.length<=visible;
}
function setCategory(cat){activeCat=cat;visible=8;renderCategories();renderProducts();el('#products').scrollIntoView({behavior:'smooth'})}
function product(id){return products.find(p=>String(p.id)===String(id))}
function requestMessage(p){
  return `${t('wa.productHello')}\n\n🛒 ${t('wa.product')}: ${nameOf(p)}\n💰 ${t('wa.price')}: ${currency(p)}\n${p.duration?`📅 ${t('wa.duration')}: ${durationOf(p)}\n`:''}\n${t('wa.productFooter')}`;
}
function openWhatsApp(message){
  const url=whatsappUrl(settings.whatsapp||CONFIG.fallbackWhatsApp,message);
  if(!url){toast(t('errors.noWhatsapp'));return}
  window.open(url,'_blank','noopener,noreferrer');
}
function openDetail(p,open=true){
  currentDetail=p.id;
  el('#productDetail').innerHTML=`<div class="detail-layout"><div class="detail-image" style="${artStyle(p)}">${artHTML(p)}</div>
   <div class="detail-info"><span class="card-category">${esc(catName(p.category_id))}</span><h2 id="detailTitle">${esc(nameOf(p))}</h2>
   <p>${esc(descriptionOf(p,true))}</p>${p.duration?`<div class="card-meta">◷ ${esc(durationOf(p))}</div>`:''}
   <div class="price-row"><strong class="price-current">${esc(currency(p))}</strong>
   ${Number(p.old_price)>Number(p.price)&&Number(p.price)>0?`<span class="price-old">${esc(money(p.old_price))}</span>`:''}</div>
   <button class="btn btn-primary" id="detailBuy">${esc(t('products.buyWhatsapp'))}</button>
   <button class="btn btn-outline" id="detailAdd">${esc(t('products.addCartButton'))}</button>
   <p class="detail-note">${esc(t('products.note'))}</p></div></div>`;
  el('#detailBuy').onclick=()=>openWhatsApp(requestMessage(p));
  el('#detailAdd').onclick=()=>addCart(p.id);
  if(open)openModal('productModal');
}
function addCart(id){
  const p=product(id);if(!p)return;
  const item=cart.find(x=>String(x.id)===String(id));
  if(item)item.qty=Math.min(25,item.qty+1);else cart.push({id,qty:1});
  persistCart();toast(t('cart.added'));
}
function renderCart(){
  const rows=cart.map(row=>({p:product(row.id),qty:row.qty})).filter(x=>x.p&&x.p.is_active);
  el('#cartItems').innerHTML=rows.length?rows.map(({p,qty})=>`<div class="cart-item" style="${artStyle(p)}">
    <div class="cart-thumb">${esc(visualOf(p).symbol)}</div><div><strong>${esc(nameOf(p))}</strong><small>${esc(currency(p))}</small></div>
    <div class="quantity-controls"><button data-qty="${esc(p.id)}" data-change="-1" aria-label="${esc(t('cart.minus'))}">−</button>
    <b>${qty}</b><button data-qty="${esc(p.id)}" data-change="1" aria-label="${esc(t('cart.plus'))}">+</button></div></div>`).join(''):
    `<div class="panel-empty" style="padding:28px;text-align:center;color:#94ac99">${esc(t('cart.empty'))}</div>`;
  const total=rows.reduce((sum,{p,qty})=>sum+(Number(p.price)||0)*qty,0);
  el('#cartFooter').innerHTML=rows.length?`<div class="cart-total"><span>${esc(t('cart.total'))}</span><strong>${esc(money(total))}</strong></div>
    <p class="cart-note">${esc(t('cart.note'))}</p><button class="btn btn-primary full" id="sendCart">${esc(t('cart.send'))}</button>`:'';
  el('#sendCart')?.addEventListener('click',()=>{
    const list=rows.map(({p,qty})=>`• ${nameOf(p)} × ${qty} — ${currency(p)}`).join('\n');
    openWhatsApp(`${t('wa.productHello')}\n\n${list}\n\n${t('cart.total')}: ${money(total)}\n${t('wa.cartFooter')}`);
  });
}
function renderHeroDescription(){
  const custom=language()==='en'?settings.hero_description_en:settings.hero_description;
  el('#heroSub').textContent=custom||t('hero.subtitle');
}
function bindEvents(){
  document.addEventListener('click',e=>{
    const cat=e.target.closest('[data-category]');if(cat)setCategory(cat.dataset.category);
    const detail=e.target.closest('[data-detail]');if(detail){const item=product(detail.dataset.detail);if(item)openDetail(item)}
    const buy=e.target.closest('[data-buy]');if(buy){const item=product(buy.dataset.buy);if(item)openWhatsApp(requestMessage(item))}
    const add=e.target.closest('[data-add]');if(add)addCart(add.dataset.add);
    const quantity=e.target.closest('[data-qty]');if(quantity){
      const item=cart.find(x=>String(x.id)===quantity.dataset.qty);
      if(item){item.qty+=Number(quantity.dataset.change);if(item.qty<=0)cart=cart.filter(x=>x!==item);persistCart();renderCart()}
    }
  });
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){
      e.preventDefault();const p=product(e.target.dataset.detail);if(p)openDetail(p);
    }
  });
  el('#searchInput').addEventListener('input',()=>{visible=8;renderProducts()});
  el('#openSearch').addEventListener('click',()=>{el('#products').scrollIntoView({behavior:'smooth'});setTimeout(()=>el('#searchInput').focus(),300)});
  el('#openCart').addEventListener('click',()=>{renderCart();openModal('cartModal')});
  el('#showMore').onclick=()=>{visible+=8;renderProducts()};
  el('#mobileMenu').onclick=()=>{
    const nav=el('#mainNav');nav.classList.toggle('open');el('#mobileMenu').setAttribute('aria-expanded',String(nav.classList.contains('open')));
  };
  all('#mainNav a').forEach(a=>a.onclick=()=>{
    el('#mainNav').classList.remove('open');el('#mobileMenu').setAttribute('aria-expanded','false');
  });
  el('#heroWhatsapp').onclick=()=>openWhatsApp(t('wa.inquiry'));
  el('#footerContact').onclick=()=>openWhatsApp(t('wa.contact'));
  persistCart();initModals();
  document.addEventListener('didgstore:languagechange',()=>{
    renderHeroDescription();renderCategories();renderProducts();renderOffers();
    if(currentDetail&&el('#productModal')&&!el('#productModal').hidden){
      const p=product(currentDetail);if(p)openDetail(p,false);
    }
    if(el('#cartModal')&&!el('#cartModal').hidden)renderCart();
  });
}
async function boot(){
  el('#year').textContent=new Date().getFullYear();
  initLanguage();bindEvents();
  try{
    await initDb();
    [products,categories,settings]=await Promise.all([getProducts(),getCategories(),getSettings()]);
    products=products.filter(x=>x.is_active).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    renderHeroDescription();renderCategories();renderProducts();renderOffers();
    if(!isLive){/* Sample products only while Supabase is not configured. */}
  }catch(error){
    console.error(error);
    el('#productGrid').innerHTML=`<div class="empty-state">${esc(t('errors.connection'))}</div>`;
    toast(t('errors.connectionToast'));
  }
}
boot();
