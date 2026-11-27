import {uiIcon,hydrateIcons} from './icons.js';
import {mountCustomerReviews} from './reviews-ui.js?v=4';
import {CONFIG} from './config.js';
import {initDb,getProducts,getCategories,getSettings,isLive} from './db.js?v=reviews2';
import {el,all,esc,visualOf,artStyle,artHTML,toast,initModals,openModal,whatsappUrl} from './shared.js?v=7';
import {language,t,initLanguage} from './i18n.js';
import {createCart,hasVariants,isServiceProduct,priceOf,oldPriceOf,priceText,productPageUrl,monthLabel,variantsOf} from './shop-cart.js?v=15';

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
const durationOf=p=>hasVariants(p)?(isServiceProduct(p)?(language()==='en'?'Choose package':'اختار الباقة'):(language()==='en'?'Choose a duration':'اختار المدة')):language()==='en'?p.duration_en||simpleDurations[p.duration]||p.duration:p.duration;
const descriptionOf=(p,full=false)=>{
  if(language()==='en')return (full?p.description_en:p.short_description_en)||(full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
  return (full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');
};
function categoryIcon(c){
  const icons={all:'grid',subscriptions:'package',design:'layout',gaming:'gamepad',ai:'cpu',social:'users',iptv:'monitor'};
  const imgs={all:'all-products',design:'canva',gaming:'games',ai:'ai',subscriptions:'spotify',iptv:'iptv',social:'social-media'};
  return imgs[c.slug]?`<img src="./assets/tile-${imgs[c.slug]}.webp" alt=""/>`:uiIcon(icons[c.slug]||'package');
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
      ${p.featured?`<span class="card-tag">${uiIcon("sparkles")} ${esc(t('products.featured'))}</span>`:''}
      ${discount?`<span class="card-discount">-${discount}%</span>`:''}
    </div>
    <div class="card-body"><span class="card-category">${esc(catName(p.category_id))}</span><h3>${n}</h3>
      <p>${esc(descriptionOf(p))}</p>
      ${p.duration?`<span class="card-meta">${uiIcon("clock")} ${esc(durationOf(p))}</span>`:''}
      <div class="price-row"><strong class="price-current">${esc(currency(p))}</strong>${old?`<span class="price-old">${esc(money(baseOld(p)))}</span>`:''}</div>
      <div class="card-actions"><button class="btn btn-primary" data-buy="${esc(p.id)}">${uiIcon("arrowRight")} ${esc(t('products.buy'))}</button>
        <button class="add-cart" data-add="${esc(p.id)}" aria-label="${esc(t('products.addCart'))} ${n}" title="${esc(t('products.addCart'))}">${uiIcon("plus")}</button></div>
    </div></article>`;
}
const featureLogo={netflix:'tile-netflix.webp',spotify:'tile-spotify.webp',canva:'tile-canva.webp',discord:'tile-discord.webp',iptv:'tile-iptv.webp',games:'tile-games.webp',ai:'tile-ai.webp'};
// Exclusive Latest Offers look: accessible full-card link and independent CTA.
const WA_OFFER_ICON = `<svg class="didg-wa-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.5c-5.25 0-9.5 4.23-9.5 9.47 0 1.73.47 3.39 1.34 4.84L2.5 21.5l4.84-1.29a9.5 9.5 0 1 0 4.66-17.71Z" stroke="currentColor" stroke-width="1.85" stroke-linejoin="round"/><path d="M8.55 7.4c-.34-.42-.72-.35-1.06-.13-.9.6-1.26 1.55-1.04 2.72.53 2.88 3.35 5.83 6.29 6.78 1.38.45 2.54.14 3.5-.85.3-.3.35-.69.15-.89l-2.11-1.02a.8.8 0 0 0-.97.18l-.83.88c-1.24-.53-2.43-1.7-3.09-2.94l.82-.95a.9.9 0 0 0 .14-1.02L8.55 7.4Z" fill="currentColor"/></svg>`;
const DURATION_OFFER_ICON = `<svg class="didg-wa-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 6.8V12l3.6 2.4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
function offerDiscount(p){const now=starting(p),before=baseOld(p);return before!=null&&before>now&&now>0?Math.round((1-now/before)*100):0}
function featureCard(p){
  const old=offerDiscount(p)>0;
  const discount=offerDiscount(p);
  const v=visualOf(p),file=featureLogo[p.visual],n=esc(nameOf(p));
  const icon=file?`<img src="./assets/${file}" alt="" loading="lazy"/>`:`<span class="fallback-logo">${uiIcon("package")}</span>`;
  const hasDuration=hasVariants(p);
  const ctaLabel=hasDuration?(isServiceProduct(p)?(language()==='en'?'Choose package':'اختار الباقة'):(language()==='en'?'Choose duration':'اختار المدة')):
    (language()==='en'?'Order on WhatsApp':'اطلب عبر واتساب');
  const label=discount?`<span class="deal-badge" aria-label="${language()==='en'?'Discount':'تخفيض'} ${discount}%">-${discount}%</span>`:
    `<span class="deal-badge didg-special-badge">${uiIcon("sparkles")} ${language()==='en'?'SPECIAL':'عرض خاص'}</span>`;
  return `<article class="deal-tile didg-premium-offer" style="${artStyle(p)}">
   <a class="didg-offer-hitarea" href="${esc(productPageUrl(p.id))}" aria-label="${esc(language()==='en'?'View details: ':'عرض التفاصيل: ')}${n}"></a>
   ${label}<span class="deal-shine" aria-hidden="true">${uiIcon("sparkles")}</span>
   <div class="deal-icon" aria-hidden="true">${p.image_url?`<img src="${esc(p.image_url)}" alt="" loading="lazy"/>`:icon}</div>
   <h3 title="${n}">${n}</h3><div class="deal-duration">${esc(durationOf(p)||catName(p.category_id))}</div>
   <div class="deal-price ${starting(p)>0?'':'ask'}"><span>${esc(currency(p))}</span>${old?`<span class="deal-old">${esc(money(baseOld(p)))}</span>`:''}</div>
   <button type="button" class="deal-cta" data-offer-buy="${esc(p.id)}" aria-label="${esc(ctaLabel)}: ${n}">${hasDuration?DURATION_OFFER_ICON:WA_OFFER_ICON}<span>${esc(ctaLabel)}</span></button>
  </article>`;
}
function renderOffers(){
  const grid=el('#featuredGrid');if(!grid)return;
  // Only featured or genuinely discounted active products go in Latest Offers.
  const offers=products.filter(p=>p.is_active&&(p.featured||offerDiscount(p)>0));
  const featuredFirst=(a,b)=>Number(!!b.featured)-Number(!!a.featured) ||
    (Number(a.sort_order||0)-Number(b.sort_order||0));
  grid.innerHTML=offers.sort(featuredFirst).slice(0,5).map(featureCard).join('') ||
    `<div class="empty-state">${esc(t('offers.empty'))}</div>`;
}
function orderFeaturedOffer(id){
  const p=product(id);if(!p || !p.is_active)return;
  // A duration-based offer needs a selection before the price/order is known.
  if(hasVariants(p)){goProduct(p.id);return}
  const title=nameOf(p);
  const amount=starting(p)>0?money(starting(p)):t('products.ask');
  const length=p.duration?(language()==='en'?(p.duration_en||p.duration):p.duration):'';
  const message=`${t('wa.productHello')}\n\n${title}${length?' ('+length+')':''}\n${language()==='en'?'Price':'الثمن'}: ${amount}\n${language()==='en'?'Quantity':'الكمية'}: 1\n\n${t('wa.cartFooter')}`;
  openWhatsApp(message);
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
function setupFaq(){
  const root=document.getElementById('faq');
  const search=document.getElementById('faqSearch');
  const counter=document.getElementById('faqCount');
  const empty=document.getElementById('faqEmpty');
  if(!root||!search||!counter||!empty)return;
  const cards=[...root.querySelectorAll('.didg-faq-card')];
  const filter=()=>{
    const query=search.value.trim().toLocaleLowerCase().normalize('NFKC');
    let visible=0;
    for(const card of cards){
      const question=card.querySelector('summary')?.textContent||'';
      const answer=card.querySelector('.didg-faq-answer')?.textContent||'';
      const match=!query||(question+' '+answer).toLocaleLowerCase().normalize('NFKC').includes(query);
      card.hidden=!match;
      if(!match)card.open=false;
      if(match)visible++;
    }
    counter.textContent=visible+' '+t('faq.results');
    empty.hidden=visible!==0;
  };
  search.addEventListener('input',filter);
  cards.forEach(card=>card.addEventListener('toggle',()=>{
    if(card.open)cards.forEach(other=>{if(other!==card)other.open=false});
  }));
  document.addEventListener('didgstore:languagechange',()=>{
    search.value='';
    filter();
  });
  filter();
}
function bindEvents(){
  setupFaq();
  document.addEventListener('click',e=>{
    const offerBuy=e.target.closest('[data-offer-buy]');if(offerBuy){e.preventDefault();orderFeaturedOffer(offerBuy.dataset.offerBuy);return}
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
    renderHeroDescription();renderCategories();renderProducts();renderOffers();hydrateIcons();cartWidget.count();
  });
}
async function boot(){
  el('#year').textContent=new Date().getFullYear();
  initLanguage();hydrateIcons();bindEvents();
  try{
    await initDb();
    [products,categories,settings]=await Promise.all([getProducts(),getCategories(),getSettings()]);
    products=products.filter(x=>x.is_active).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0));
    renderHeroDescription();renderCategories();renderProducts();renderOffers();hydrateIcons();cartWidget.count();
    await mountCustomerReviews(()=>products);
    if(!isLive){/* Sample products only while Supabase is not configured. */}
  }catch(error){
    console.error(error);
    el('#productGrid').innerHTML=`<div class="empty-state">${esc(t('errors.connection'))}</div>`;
    toast(t('errors.connectionToast'));
  }
}
boot();
