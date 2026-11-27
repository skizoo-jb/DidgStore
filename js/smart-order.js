/* DidgStore Smart Order: product-sensitive fields, no account passwords or database writes.
   Checkout details are kept in sessionStorage for the active tab only. */
import {language} from './i18n.js';
import {uiIcon} from './icons.js';

const en=()=>language()==='en';
const clean=value=>String(value??'').trim().replace(/[\u0000-\u001f\u007f]/g,' ').slice(0,400);
export const escapeSmart=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const word=(ar,english)=>en()?english:ar;

export function smartFields(p,months=null){
  const name=String((p?.name_en||'')+' '+(p?.name_ar||'')).toLowerCase();
  const notes={key:'notes',type:'textarea',required:false,maxlength:240,
    label:word('ملاحظات إضافية (اختياري)','Order notes (optional)'),
    placeholder:word('مثلاً: شي معلومة كتعاون على تنفيذ الطلب','Any details that help with your request')};
  if(name.includes('canva')||p?.visual==='canva'){
    return [
      {key:'gmail',type:'email',required:true,maxlength:160,
       label:word('Gmail اللي بغيتي يتفعّل فيه Canva Pro','Gmail address for Canva Pro activation'),
       placeholder:'example@gmail.com',
       hint:word('كتوصلك دعوة التفعيل على بريدك. ما تعطينا حتى كلمة سر.','The activation invitation goes to your Gmail. Never share a password.')},
      notes
    ];
  }
  if(p?.category_id==='social'||Array.isArray(p?.service_packages)&&p.service_packages.length){
    const code=Math.floor(Number(months)/1000000);
    const content=code===2||code===3;
    const domain=name.includes('instagram')?['instagram.com','instagr.am']:
      name.includes('tiktok')?['tiktok.com']:
      name.includes('facebook')?['facebook.com','fb.com','fb.watch']:
      name.includes('youtube')?['youtube.com','youtu.be']:[];
    return [
      {key:'target',type:'url',required:true,maxlength:400,platformHosts:domain,
       label:content?word('رابط المنشور أو الفيديو','Post or video link'):word('رابط الحساب أو القناة','Profile or channel link'),
       placeholder:domain.length?'https://'+domain[0]+'/...':'https://...',
       hint:word('لصق الرابط الصحيح للخدمة اللي اخترتي، بلا كلمات السر.','Paste the correct public link. Never enter a password.')},
      notes
    ];
  }
  if(p?.category_id==='iptv'){
    return [
      {key:'device',type:'select',required:false,
       label:word('الجهاز اللي غادي تستعمل عليه IPTV (اختياري)','IPTV device (optional)'),
       options:[['',word('اختار الجهاز','Choose device')],['Smart TV','Smart TV'],['Android / Android TV','Android / Android TV'],['iPhone / iPad','iPhone / iPad'],['PC','PC'],['Other',word('جهاز آخر','Other device')]]},
      {key:'email',type:'email',required:false,maxlength:160,label:word('البريد الإلكتروني للتسليم (اختياري)','Delivery email (optional)'),placeholder:'example@gmail.com'},
      notes
    ];
  }
  return [
    {key:'email',type:'email',required:false,maxlength:160,label:word('البريد الإلكتروني للتسليم (اختياري)','Delivery email (optional)'),placeholder:'example@gmail.com',
     hint:word('ما خصكش تعطي كلمة السر ديال أي حساب.','Never share your account password.')},
    notes
  ];
}
export function smartFormHtml(p,months=null,values={},context='product'){
  const fields=smartFields(p,months);
  const list=fields.map(f=>{
    const val=clean(values?.[f.key]||'');
    const required=f.required?'<span class="didg-smart-required" aria-hidden="true">*</span>':'';
    const max=f.maxlength?' maxlength="'+f.maxlength+'"':'';
    const attr=' data-smart-field="'+f.key+'" aria-label="'+escapeSmart(f.label)+'"'+(f.required?' aria-required="true"':'');
    const control=f.type==='textarea'?'<textarea rows="2"'+attr+max+' placeholder="'+escapeSmart(f.placeholder||'')+'">'+escapeSmart(val)+'</textarea>':
      f.type==='select'?'<select'+attr+'>'+f.options.map(([value,label])=>'<option value="'+escapeSmart(value)+'"'+(value===val?' selected':'')+'>'+escapeSmart(label)+'</option>').join('')+'</select>':
      '<input type="'+(f.type==='email'?'email':'url')+'" inputmode="'+(f.type==='email'?'email':'url')+'" autocomplete="'+(f.key==='email'||f.key==='gmail'?'email':'off')+'"'+attr+max+' placeholder="'+escapeSmart(f.placeholder||'')+'" value="'+escapeSmart(val)+'"/>';
    return '<label class="didg-smart-field"><span class="didg-smart-field-label">'+escapeSmart(f.label)+required+'</span>'+control+
      (f.hint?'<small class="didg-smart-hint">'+escapeSmart(f.hint)+'</small>':'')+'</label>';
  }).join('');
  const title=word('معلومات الطلب','Order details');
  const privacy=word('ما كتحتاج حتى كلمة سر. هاد المعلومات كتدخل غير فرسالة WhatsApp ديال الطلب.','Never provide a password. These details are included only in your WhatsApp order message.');
  return '<div class="didg-smart-form" data-smart-context="'+escapeSmart(context)+'">'+
    '<div class="didg-smart-form-head"><span class="didg-smart-check" aria-hidden="true">'+uiIcon("clipboard")+'</span><strong>'+escapeSmart(title)+'</strong></div>'+
    '<div class="didg-smart-fields">'+list+'</div>'+
    '<p class="didg-smart-privacy">'+escapeSmart(privacy)+'</p></div>';
}
export function readSmartInputs(root){
  const result={};
  root?.querySelectorAll('[data-smart-field]').forEach(el=>{result[el.dataset.smartField]=clean(el.value)});
  return result;
}
export function validateSmartInfo(p,months,values={}){
  const info={};
  for(const f of smartFields(p,months)){
    let value=clean(values?.[f.key]||'');
    if(!value){
      if(f.required)return {ok:false,key:f.key,error:word('عمر هاد الخانة قبل الطلب: ','Please fill in: ')+f.label};
      continue;
    }
    if(f.type==='email'){
      if(value.length>160||!/^\S+@[^@\s]+\.[^@\s]+$/.test(value)||
         f.key==='gmail'&&!/^[A-Z0-9._%+\-]+@gmail\.com$/i.test(value))
        return {ok:false,key:f.key,error:word('كتب بريد إلكتروني صحيح'+(f.key==='gmail'?' من Gmail':''),'Enter a valid '+(f.key==='gmail'?'Gmail':'email')+' address')};
    }
    if(f.type==='url'){
      if(!/^https?:\/\//i.test(value))value='https://'+value;
      let url;
      try{url=new URL(value)}catch{url=null}
      if(!url||!['http:','https:'].includes(url.protocol)||!url.hostname.includes('.')||url.username||url.password)
        return {ok:false,key:f.key,error:word('دخل رابط صحيح كيبدا بـ https://','Enter a valid public URL (https://...)')};
      if(f.platformHosts?.length&&!f.platformHosts.some(host=>url.hostname.toLowerCase()===host||url.hostname.toLowerCase().endsWith('.'+host)))
        return {ok:false,key:f.key,error:word('دخل رابط تابع للمنصة ديال هاد المنتج','Enter a link from the selected platform')};
      value=url.href;
    }
    if(f.type==='select'&&!f.options.some(([candidate])=>candidate===value))
      return {ok:false,key:f.key,error:word('اختار جهاز صحيح','Select a valid device')};
    info[f.key]=value.slice(0,f.maxlength||400);
  }
  return {ok:true,info};
}
export function smartInfoLines(p,months,details={}){
  return smartFields(p,months).filter(f=>clean(details[f.key]||'')).map(f=>f.label+': '+clean(details[f.key]));
}
const CART_INFO_KEY='didgstore-cart-order-details-v1';
function loadCartDetails(){try{const o=JSON.parse(sessionStorage.getItem(CART_INFO_KEY)||'{}');return o&&typeof o==='object'&&!Array.isArray(o)?o:{}}catch{return {}}}
export function getCartOrderDetails(key){return loadCartDetails()[key]||{}}
export function saveCartOrderDetails(key,values){try{const all=loadCartDetails();all[key]={...all[key],...values};sessionStorage.setItem(CART_INFO_KEY,JSON.stringify(all))}catch{/* browser may block session storage */}}
export function clearCartOrderDetails(key){try{const all=loadCartDetails();delete all[key];sessionStorage.setItem(CART_INFO_KEY,JSON.stringify(all))}catch{/* storage unavailable */}}
