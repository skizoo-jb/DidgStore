import {CONFIG} from './config.js';
import {initDb,getProducts,getCategories,getSettings,isLive} from './db.js';
import {el,all,esc,visualOf,artStyle,artHTML,toast,initModals,openModal,whatsappUrl} from './shared.js';
import {language,t,initLanguage} from './i18n.js';
import {createCart,hasVariants,priceOf,oldPriceOf,priceText,productPageUrl,monthLabel,variantsOf} from './shop-cart.js';

let products=[],categories=[],settings={},activeCat='all',visible=8;
const cartWidget=createCart({getProducts:()=>products,getSettings:()=>settings});
const nameOf=p=>language()==='en'&&(p.name_en||'').trim()?p.name_en:p.name_ar;
const catName=slug=>{
  const c=categories.find(item=>item.slug===slug);
  return c?(language()==='en'?c.name_en||c.name_ar:c.name_ar):t('products.default');
};
const categoryName=c=>language()==='en'?(c.name_en||c.name_ar):c.name_ar;
const money=n=>`${Number(n||0).toLocaleString(language()==='en'?'en-US':'fr-MA',{maximumFractionDigits:2})} DH`;
const currency=p=>priceText(p);
const baseOld=p=>oldPriceOf(p,null);
const starting=p=>priceOf(p,null);
const simpleDurations={
  'شهر واحد':'1 month','شهر':'1 month','3 شهور':'3 months','3 أشهر':'3 months',
  '6 شهور':'6 months','6 أشهر':'6 months','12 شهراً':'12 months','12 شهر':'12 months',
  'مدى الحياة':'Lifetime','حسب العرض':'Depends on offer','حسب المنتج':'Depends on product',
  'حسب اللعبة':'Depends on the game','حسب الخدمة':'Depends on service','حسب تفاصيل العرض':'See offer details'
};
const durationOf=p=>hasVariants(p)?(language()==='en'?'Choose a duration':'اختار المدة'):language()==='en'?p.duration_en||simpleDurations[p.duration]||p.duration:p.duration;
const descriptionOf=(p,full=false)=>{
  if(language()==='en')return (full?p.description_en:p.short_description_en)||(full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
  return (full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
};
function categoryIcon(c){
  const icons={all:'▦',subscriptions:'◉',design:'✦',gaming:'✣',ai:'✧',social:'↗',iptv:'▣'};
  const imgs={all:'all-products',design:'canva',gaming:'games',ai:'ai',subscriptions:'spotify',iptv:'iptv',social:'social-media'};
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
  const old=baseOld(p)!=null&&baseOld(p)>starting(p)&&starting(p)>0;
  const discount=old?Math.round((1-starting(p)/baseOld(p))*100):0;
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
      <div class="price-row"><strong class="price-current">${esc(currency(p))}</strong>${old?`<span class="price-old">${esc(money(baseOld(p)))}</span>`:''}</div>
      <div class="card-actions"><button class="btn btn-primary" data-buy="${esc(p.id)}">${esc(t('products.buy'))}</button>
        <button class="add-cart" data-add="${esc(p.id)}" aria-label="${esc(t('products.addCart'))} ${n}" title="${esc(t('products.addCart'))}">+</button></div>
    </div></article>`;
}
const featureLogo={netflix:'tile-netflix.webp',spotify:'tile-spotify.webp',canva:'tile-canva.webp',discord:'tile-discord.webp',iptv:'tile-iptv.webp',games:'tile-games.webp',ai:'tile-ai.webp'};
function featureCard(p){
  const old=baseOld(p)!=null&&baseOld(p)>starting(p)&&starting(p)>0;
  const discount=old?Math.round((1-starting(p)/baseOld(p))*100):0;
  const v=visualOf(p),file=featureLogo[p.visual],n=esc(nameOf(p));
  const icon=file?`<img src="./assets/${file}" alt="" loading="lazy"/>`:`<span class="fallback-logo">${esc(v.symbol)}</span>`;
  return `<article class="deal-tile" style="${artStyle(p)}">
   ${discount?`<span class="deal-badge">-${discount}%</span>`:''}<span class="deal-shine" aria-hidden="true">✦</span>
   <div class="deal-icon" data-detail="${esc(p.id)}" role="button" tabindex="0" aria-label="${esc(t('products.details'))} ${n}">${p.image_url?`<img src="${esc(p.image_url)}" alt="${n}" loading="lazy"/>`:icon}</div>
   <h3 title="${n}">${n}</h3><div class="deal-duration">${esc(durationOf(p)||catName(p.category_id))}</div>
   <div class="deal-price ${Number(p.price)>0?'':'ask'}">${esc(currency(p))}${old?`<span class="deal-old">${esc(money(baseOld(p)))}</span>`:''}</div>
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
function openWhatsApp(message){
  const url=whatsappUrl(settings.whatsapp||CONFIG.fallbackWhatsApp,message);
  if(!url){toast(t('errors.noWhatsapp'));return}
  window.open(url,'_blank','noopener,noreferrer');
}
function goProduct(id){window.location.href=productPageUrl(id)}
function renderHeroDescription(){
  const custom=language()==='en'?settings.hero_description_en:settings.hero_description;
  el('#heroSub').textContent=custom||t('hero.subtitle');
}
function bindEvents(){
  document.addEventListener('click',e=>{
    const cat=e.target.closest('[data-category]');if(cat)setCategory(cat.dataset.category);
    const detail=e.target.closest('[data-detail]');if(detail){goProduct(detail.dataset.detail);return}
    const buy=e.target.closest('[data-buy]');if(buy){goProduct(buy.dataset.buy);return}
    const add=e.target.closest('[data-add]');if(add){const p=products.find(p=>String(p.id)===String(add.dataset.add));if(!p)return;if(hasVariants(p))goProduct(p.id);else cartWidget.add(p.id);return}

  });
  document.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-detail]')){
      e.preventDefault();goProduct(e.target.dataset.detail);
    }
  });
  el('#searchInput').addEventListener('input',()=>{visible=8;renderProducts()});
  el('#openSearch').addEventListener('click',()=>{el('#products').scrollIntoView({behavior:'smooth'});setTimeout(()=>el('#searchInput').focus(),300)});
  el('#showMore').onclick=()=>{visible+=8;renderProducts()};
  el('#mobileMenu').onclick=()=>{
    const nav=el('#mainNav');nav.classList.toggle('open');el('#mobileMenu').setAttribute('aria-expanded',String(nav.classList.contains('open')));
  };
  all('#mainNav a').forEach(a=>a.onclick=()=>{
    el('#mainNav').classList.remove('open');el('#mobileMenu').setAttribute('aria-expanded','false');
  });
  el('#heroWhatsapp').onclick=()=>openWhatsApp(t('wa.inquiry'));
  el('#footerContact').onclick=()=>openWhatsApp(t('wa.contact'));
  initModals();
  document.addEventListener('didgstore:languagechange',()=>{
    renderHeroDescription();renderCategories();renderProducts();renderOffers();cartWidget.count();
  });
}
async function boot(){
  el('#year').textContent=new Date().getFullYear();
  initLanguage();bindEvents();
  try{
    await initDb();
    [products,categories,settings]=await Promise.all([getProducts(),getCategories(),getSettings()]);
    products=products.filter(x=>x.is_active).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    renderHeroDescription();renderCategories();renderProducts();renderOffers();cartWidget.count();
    if(!isLive){/* Sample products only while Supabase is not configured. */}
  }catch(error){
    console.error(error);
    el('#productGrid').innerHTML=`<div class="empty-state">${esc(t('errors.connection'))}</div>`;
    toast(t('errors.connectionToast'));
  }
}
boot();
