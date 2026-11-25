import {CONFIG} from './config.js';
import {initDb,getProducts,getCategories,getSettings} from './db.js';
import {language,initLanguage,t} from './i18n.js';
import {esc,visualOf,artStyle,artHTML,initModals,toast,whatsappUrl} from './shared.js';
import {createCart,hasVariants,variantsOf,priceOf,oldPriceOf,priceText,money,monthLabel,nameOf,productPageUrl} from './shop-cart.js';
const $=id=>document.getElementById(id);
let products=[],categories=[],settings={},current=null,selectedMonths=null,qty=1;
const cartWidget=createCart({getProducts:()=>products,getSettings:()=>settings});
const local={
  ar:{back:'← المنتجات',home:'الرئيسية',products:'المنتجات',loading:'جاري تحميل تفاصيل المنتج...',notFound:'هاد المنتج ما بقاش متوفر. رجع للمتجر وشوف المنتجات الأخرى.',failed:'ما قدرناش نحمّلو تفاصيل المنتج. راجع الاتصال أو إعدادات Supabase.',duration:'اختار مدة الاشتراك',hint:'اختار المدة باش يبان الثمن ديالها',price:'الثمن',quantity:'الكمية',add:'+ أضف للسلة',buy:'اطلب الآن عبر WhatsApp ↗',description:'الوصف الكامل',related:'منتجات مشابهة',browse:'جميع المنتجات ←',footer:'العودة للمتجر',note:'الطلب كيتم عبر WhatsApp، والمدة والتوفر والثمن النهائي كيتم تأكيدهم قبل الأداء.',ask:'اسأل عن الثمن'},
  en:{back:'← Products',home:'Home',products:'Products',loading:'Loading product details...',notFound:'This product is not currently available. Browse other products.',failed:'Unable to load product details. Check your connection or Supabase configuration.',duration:'Choose subscription duration',hint:'Select a duration to see its price',price:'Price',quantity:'Quantity',add:'+ Add to cart',buy:'Order via WhatsApp ↗',description:'Full description',related:'Related products',browse:'All products →',footer:'Back to store',note:'Orders are handled on WhatsApp. Final pricing and availability are confirmed before payment.',ask:'Ask for price'}
};
const txt=key=>local[language()][key];
const desc=(p,full)=>{if(language()==='en')return (full?p.description_en:p.short_description_en)||(full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback');return (full?p.description:p.short_description)||t(full?'products.detailsFallback':'products.shortFallback')};
const durationText=p=>language()==='en'?(p.duration_en||p.duration||''):(p.duration||'');
const categoryName=p=>{const c=categories.find(c=>c.slug===p.category_id);return c?(language()==='en'?c.name_en:c.name_ar):''};
function readMonths(){if(!hasVariants(current))return null;return selectedMonths&&variantsOf(current).some(v=>v.months===selectedMonths)?selectedMonths:variantsOf(current)[0].months}
function updatePrice(){if(!current)return;const months=readMonths(),price=priceOf(current,months),old=oldPriceOf(current,months);$('detailPrice').textContent=price>0?money(price):txt('ask');$('detailOldPrice').textContent=old!=null&&old>price&&price>0?money(old):'';$('detailOldPrice').hidden=!(old!=null&&old>price&&price>0);$('qtyValue').textContent=qty;document.querySelectorAll('[data-select-months]').forEach(b=>{const active=Number(b.dataset.selectMonths)===months;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))})}
function selectMonths(months){selectedMonths=Number(months);updatePrice()}
function render(){
  $('browseLink').textContent=txt('back');$('breadcrumbs').innerHTML=`<a href="./index.html">${esc(txt('home'))}</a> / <span>${esc(txt('products'))}</span>`;
  $('cartHeading').textContent=t('cart.title');$('footerBrowse').textContent=txt('footer');$('year').textContent=new Date().getFullYear();
  if(!current)return;
  document.title=`${nameOf(current)} | DidgStore`;
  $('productState').hidden=true;$('detailShell').hidden=false;$('longSection').hidden=false;
  $('detailCategory').textContent=categoryName(current);$('detailName').textContent=nameOf(current);$('detailShort').textContent=desc(current,false);
  $('detailMedia').innerHTML=current.image_url?`<img class="didg-real-product-image" src="${esc(current.image_url)}" alt="${esc(nameOf(current))}"/>`:`<div class="didg-product-art" style="${artStyle(current)}">${artHTML(current,false)}</div>`;
  $('detailNote').textContent=txt('note');$('qtyLabel').textContent=txt('quantity');$('priceLabel').textContent=txt('price');$('addToCart').textContent=txt('add');$('orderWhatsapp').textContent=txt('buy');
  $('durationPicker').hidden=!hasVariants(current);$('durationHeading').textContent=txt('duration');$('durationHint').textContent=txt('hint');
  if(hasVariants(current))$('durationOptions').innerHTML=variantsOf(current).map(v=>`<button type="button" class="didg-duration-opt" data-select-months="${Number(v.months)}" aria-pressed="false"><b>${esc(monthLabel(v.months))}</b><span>${esc(v.price>0?money(v.price):txt('ask'))}</span></button>`).join('');
  updatePrice();
  $('descriptionHeading').textContent=txt('description');$('longDescription').textContent=desc(current,true);
  $('relatedHeading').textContent=txt('related');$('moreProducts').textContent=txt('browse');
  const related=products.filter(p=>p.is_active!==false&&p.id!==current.id&&p.category_id===current.category_id).slice(0,4);
  $('relatedSection').hidden=related.length===0;
  $('relatedGrid').innerHTML=related.map(p=>`<a class="didg-related-card" href="${esc(productPageUrl(p.id))}" style="${artStyle(p)}"><div class="didg-related-picture">${p.image_url?`<img src="${esc(p.image_url)}" alt="" loading="lazy"/>`:`<span>${esc(visualOf(p).symbol)}</span>`}</div><b>${esc(nameOf(p))}</b><small>${esc(priceText(p))}</small></a>`).join('');
}
function openWa(){if(!current)return;const m=readMonths(),unit=priceOf(current,m),old=oldPriceOf(current,m);
  const msg=`${t('wa.productHello')}\n\n🛒 ${t('wa.product')}: ${nameOf(current)}\n${m?`📅 ${t('wa.duration')}: ${monthLabel(m)}\n`:current.duration?`📅 ${t('wa.duration')}: ${durationText(current)}\n`:''}${language()==='en'?'Quantity':'الكمية'}: ${qty}\n💰 ${t('wa.price')}: ${unit>0?money(unit):txt('ask')}\n${t('cart.total')}: ${unit>0?money(unit*qty):txt('ask')}\n\n${t('wa.productFooter')}`;
  const number=settings.whatsapp||CONFIG.fallbackWhatsApp,url=whatsappUrl(number,msg);
  if(!url){toast(t('errors.noWhatsapp'));return}window.open(url,'_blank','noopener,noreferrer')
}
async function init(){
  initModals();initLanguage();
  document.addEventListener('didgstore:languagechange',render);
  $('durationOptions').addEventListener('click',e=>{const el=e.target.closest('[data-select-months]');if(el)selectMonths(el.dataset.selectMonths)});
  $('qtyMinus').addEventListener('click',()=>{qty=Math.max(1,qty-1);updatePrice()});
  $('qtyPlus').addEventListener('click',()=>{qty=Math.min(25,qty+1);updatePrice()});
  $('addToCart').addEventListener('click',()=>{if(cartWidget.add(current.id,readMonths(),qty))cartWidget.open()});
  $('orderWhatsapp').addEventListener('click',openWa);
  try{
    const id=new URL(location.href).searchParams.get('id');if(!id){$('productState').textContent=txt('notFound');return}
    await initDb();[products,categories,settings]=await Promise.all([getProducts(),getCategories(),getSettings()]);
    current=products.find(p=>String(p.id)===id&&p.is_active!==false);
    if(!current){$('productState').textContent=txt('notFound');return}
    selectedMonths=hasVariants(current)?variantsOf(current)[0].months:null;
    cartWidget.count();render();
  }catch(error){console.error(error);$('productState').textContent=txt('failed')}
}
init();
