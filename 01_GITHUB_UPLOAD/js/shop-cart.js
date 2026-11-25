/* DidgStore — shared cart with independent product duration selections.
   Local browser cart only; no hidden tracking, payment, or direct order writing. */
import {language,t} from './i18n.js';
import {CONFIG} from './config.js';
import {esc,toast,visualOf,cleanPhone,whatsappUrl,openModal} from './shared.js';
const CART_KEY='didgstore-cart-v1';
const positiveNumber=value=>Number.isFinite(Number(value))&&Number(value)>=0?Number(value):0;
export const variantsOf=p=>Array.isArray(p?.variants)?p.variants.filter(v=>Number.isInteger(Number(v.months))&&Number(v.months)>0&&Number.isFinite(Number(v.price))&&Number(v.price)>=0).sort((a,b)=>Number(a.months)-Number(b.months)):[];
export const hasVariants=p=>variantsOf(p).length>0;
export const variantOf=(p,months)=>variantsOf(p).find(v=>Number(v.months)===Number(months))||null;
const cheapestVariant=p=>variantsOf(p).reduce((best,v)=>!best||Number(v.price)<Number(best.price)?v:best,null);
export const priceOf=(p,months)=>hasVariants(p)?positiveNumber(((months!=null?variantOf(p,months):null)||cheapestVariant(p)).price):positiveNumber(p.price);
export const oldPriceOf=(p,months)=>{const v=hasVariants(p)?((months!=null?variantOf(p,months):null)||cheapestVariant(p)):p;return v.old_price==null?null:positiveNumber(v.old_price)};
export const money=value=>`${positiveNumber(value).toLocaleString(language()==='en'?'en-US':'fr-MA',{maximumFractionDigits:2})} DH`;
export const priceText=(p,months)=>{const n=priceOf(p,months);return (hasVariants(p)&&months==null?(language()==='en'?'From ':'ابتداءً من '):'')+(n>0?money(n):t('products.ask'))};
export const monthLabel=months=>{const n=Number(months);return language()==='en'?`${n} ${n===1?'month':'months'}`:n===1?'شهر واحد':n===2?'شهرين':`${n} شهور`};
export const nameOf=p=>language()==='en'?(p.name_en||p.name_ar):p.name_ar;
export const productPageUrl=id=>`./product.html?id=${encodeURIComponent(String(id))}`;
const rowKey=(id,months)=>`${id}::${months??'base'}`;
function load(){try{const data=JSON.parse(localStorage.getItem(CART_KEY)||'[]');return Array.isArray(data)?data.filter(x=>x&&x.id!=null).map(x=>({id:String(x.id),months:x.months==null?null:Number(x.months),qty:Math.max(1,Math.min(25,Math.round(Number(x.qty)||1)))})):[]}catch{return []}}
function save(rows){try{localStorage.setItem(CART_KEY,JSON.stringify(rows))}catch{/* privacy mode */}}
export function createCart({getProducts,getSettings}){
  let rows=load();let buyerName='';
  const header=document.getElementById('cartCount');
  const items=document.getElementById('cartItems');
  const footer=document.getElementById('cartFooter');
  const modal=document.getElementById('cartModal');
  const getActive=id=>(getProducts()||[]).find(p=>String(p.id)===String(id)&&p.is_active!==false);
  const entries=()=>rows.map(r=>{const p=getActive(r.id);if(!p)return null;const v=hasVariants(p)?variantOf(p,r.months)||variantsOf(p)[0]:null;return {p,v,qty:r.qty,id:r.id,months:v?Number(v.months):null,key:rowKey(r.id,r.months)};}).filter(Boolean);
  function count(){if(header)header.textContent=rows.reduce((n,r)=>n+r.qty,0)}
  function add(id,months=null,qty=1){
    const p=getActive(id);if(!p){toast(language()==='en'?'Product unavailable':'المنتج غير متوفر');return false}
    if(hasVariants(p)&&!variantOf(p,months)){toast(language()==='en'?'Select a subscription duration first':'اختار مدة الاشتراك أولاً');return false}
    const key=rowKey(id,hasVariants(p)?Number(months):null),match=rows.find(r=>rowKey(r.id,r.months)===key);
    if(match)match.qty=Math.min(25,match.qty+Math.max(1,Number(qty)||1));else rows.push({id:String(id),months:hasVariants(p)?Number(months):null,qty:Math.max(1,Math.min(25,Number(qty)||1))});
    save(rows);count();toast(t('cart.added'));return true;
  }
  function setQty(key,delta){const row=rows.find(r=>rowKey(r.id,r.months)===key);if(!row)return;row.qty+=delta;if(row.qty<=0)rows=rows.filter(r=>r!==row);else row.qty=Math.min(25,row.qty);save(rows);render();count()}
  function remove(key){rows=rows.filter(r=>rowKey(r.id,r.months)!==key);save(rows);render();count()}
  function buildWhatsapp(){
    const list=entries();if(!list.length)return;
    const total=list.reduce((sum,{p,months,qty})=>sum+priceOf(p,months)*qty,0);
    const unknown=list.some(({p,months})=>priceOf(p,months)===0);
    const lines=list.map(({p,months,qty})=>`• ${nameOf(p)}${months?` (${monthLabel(months)})`:p.duration?` (${p.duration})`:''} ×${qty} — ${priceOf(p,months)>0?money(priceOf(p,months)):t('products.ask')}`);
    const amount=unknown?`${money(total)} (${language()==='en'?'partial total':'مجموع جزئي'})`:money(total);
    const customer=buyerName.trim()?`${language()==='en'?'Customer name':'اسم الزبون'}: ${buyerName.trim().slice(0,80)}\n`:'';
    const message=`${t('wa.productHello')}\n\n${customer}${lines.join('\n')}\n\n${t('cart.total')}: ${amount}\n${t('wa.cartFooter')}`;
    const number=cleanPhone((getSettings()||{}).whatsapp||CONFIG.fallbackWhatsApp||'');const url=whatsappUrl(number,message);
    if(!url){toast(t('errors.noWhatsapp'));return}window.open(url,'_blank','noopener,noreferrer');
  }
  function render(){
    if(!items||!footer)return;
    const list=entries();
    items.innerHTML=list.length?list.map(({p,months,qty,key})=>`<article class="didg-cart-row"><a class="didg-cart-image" href="${esc(productPageUrl(p.id))}">${p.image_url?`<img src="${esc(p.image_url)}" alt="" loading="lazy"/>`:`<span>${esc(visualOf(p).symbol)}</span>`}</a><div class="didg-cart-info"><a href="${esc(productPageUrl(p.id))}" class="didg-cart-name">${esc(nameOf(p))}</a>${months?`<small class="didg-duration-tag">${esc(monthLabel(months))}</small>`:p.duration?`<small>${esc(p.duration)}</small>`:''}<strong>${esc(priceOf(p,months)>0?money(priceOf(p,months)):t('products.ask'))}</strong><div class="didg-cart-actions"><button data-cart-step="-1" data-cart-key="${esc(key)}" aria-label="${esc(t('cart.minus'))}">−</button><b>${qty}</b><button data-cart-step="1" data-cart-key="${esc(key)}" aria-label="${esc(t('cart.plus'))}">+</button><button class="didg-remove" data-cart-remove="${esc(key)}" aria-label="${language()==='en'?'Remove':'حذف'}">×</button></div></div></article>`).join(''):`<div class="didg-cart-empty"><span>🛒</span><p>${esc(t('cart.empty'))}</p><a href="./index.html#products">${language()==='en'?'Browse products':'تصفح المنتجات'}</a></div>`;
    const total=list.reduce((n,{p,months,qty})=>n+priceOf(p,months)*qty,0);
    footer.innerHTML=list.length?`<label class="didg-cart-customer">${language()==='en'?'Your name (optional)':'الاسم ديالك (اختياري)'}<input id="didgCheckoutName" type="text" maxlength="80" placeholder="${language()==='en'?'For the WhatsApp order':'باش يبان فالطلب'}" value="${esc(buyerName)}"/></label><div class="cart-total"><span>${esc(t('cart.total'))}</span><strong>${esc(money(total))}</strong></div><p class="cart-note">${esc(t('cart.note'))}</p><button class="btn btn-primary full" id="sendCart">${esc(t('cart.send'))}</button>`:'';
    footer.querySelector('#didgCheckoutName')?.addEventListener('input',e=>{buyerName=e.target.value});
    footer.querySelector('#sendCart')?.addEventListener('click',buildWhatsapp);
  }
  items?.addEventListener('click',e=>{const btn=e.target.closest('[data-cart-step],[data-cart-remove]');if(!btn)return;if('cartStep'in btn.dataset)setQty(btn.dataset.cartKey,Number(btn.dataset.cartStep));else remove(btn.dataset.cartRemove)});
  document.getElementById('openCart')?.addEventListener('click',()=>{render();openModal('cartModal')});
  document.addEventListener('didgstore:languagechange',()=>{if(modal&&!modal.hidden)render()});
  window.addEventListener('storage',e=>{if(e.key===CART_KEY){rows=load();count();if(modal&&!modal.hidden)render()}});
  count();
  return {add,render,open:()=>{render();openModal('cartModal')},count,entries};
}
