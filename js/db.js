import {CONFIG} from './config.js';
const seedCategories=[
 {slug:'all',name_ar:'جميع المنتجات',name_en:'ALL PRODUCTS',icon:'▦',sort_order:0},
 {slug:'subscriptions',name_ar:'الاشتراكات',name_en:'SUBSCRIPTIONS',icon:'◉',sort_order:1},
 {slug:'design',name_ar:'أدوات التصميم',name_en:'DESIGN',icon:'✦',sort_order:2},
 {slug:'gaming',name_ar:'الألعاب',name_en:'GAMING',icon:'✣',sort_order:3},
 {slug:'ai',name_ar:'الذكاء الاصطناعي',name_en:'AI TOOLS',icon:'✧',sort_order:4},
 {slug:'social',name_ar:'خدمات السوشيال',name_en:'SOCIAL',icon:'↗',sort_order:5},
 {slug:'iptv',name_ar:'خدمات IPTV',name_en:'IPTV',icon:'▣',sort_order:6}
];
const seedProducts=[
 {id:'demo-canva',name_ar:'Canva Pro',name_en:'Canva Pro',category_id:'design',price:20,old_price:null,duration:'حسب تفاصيل العرض',short_description:'أدوات التصميم والقوالب الاحترافية.',description:'تواصل معنا لمعرفة نوع الاشتراك، مدته، شروط الاستخدام والتوفر قبل تأكيد الشراء.',visual:'canva',image_url:'',featured:true,is_active:true,sort_order:1},
 {id:'demo-nitro',name_ar:'Discord Nitro',name_en:'Discord Nitro',category_id:'subscriptions',price:45,old_price:null,duration:'شهر واحد',short_description:'مزايا Discord Nitro لمدة شهر.',description:'المنتج يخضع لشروط أهلية Discord. تأكد من توفره وطريقة التفعيل قبل الأداء.',visual:'discord',image_url:'',featured:true,is_active:true,sort_order:2},
 {id:'demo-iptv',name_ar:'IPTV Premium',name_en:'IPTV Premium',category_id:'iptv',price:200,old_price:null,duration:'12 شهراً',short_description:'خدمة IPTV لمدة عام حسب العرض المتوفر.',description:'يجب التأكد من حقوق الترخيص للمحتوى، توافق الجهاز، شروط الضمان والتجربة قبل إتمام الطلب.',visual:'iptv',image_url:'',featured:true,is_active:true,sort_order:3},
 {id:'demo-games',name_ar:'مفاتيح الألعاب',name_en:'Game Keys',category_id:'gaming',price:0,old_price:null,duration:'حسب اللعبة',short_description:'استفسر عن مفاتيح الألعاب المتوفرة.',description:'المنطقة، المنصة ونوع الترخيص كتختلف حسب اللعبة. تواصل معنا لمعرفة التفاصيل.',visual:'games',image_url:'',featured:false,is_active:true,sort_order:4},
 {id:'demo-ai',name_ar:'أدوات الذكاء الاصطناعي',name_en:'AI Tools',category_id:'ai',price:0,old_price:null,duration:'حسب المنتج',short_description:'مجموعة أدوات وحلول للذكاء الاصطناعي.',description:'اسأل عن المنتجات المتوفرة وطريقة الترخيص والاستعمال.',visual:'ai',image_url:'',featured:false,is_active:true,sort_order:5},
 {id:'demo-spotify',name_ar:'Spotify Premium',name_en:'Spotify Premium',category_id:'subscriptions',price:0,old_price:null,duration:'حسب العرض',short_description:'استفسر عن عروض Spotify المتاحة.',description:'الاشتراكات المتاحة والبلدان المدعومة يتم تأكيدها قبل الطلب.',visual:'spotify',image_url:'',featured:false,is_active:true,sort_order:6},
 {id:'demo-netflix',name_ar:'Netflix',name_en:'Netflix',category_id:'subscriptions',price:0,old_price:null,duration:'حسب العرض',short_description:'استفسر عن الاشتراكات الرقمية المتاحة.',description:'تأكد من التوفر وحقوق إعادة البيع وشروط المزود قبل الطلب.',visual:'netflix',image_url:'',featured:false,is_active:true,sort_order:7},
 {id:'demo-social',name_ar:'خدمات السوشيال ميديا',name_en:'Social Services',category_id:'social',price:0,old_price:null,duration:'حسب الخدمة',short_description:'استفسر عن خدمات التسويق الرقمي المتاحة.',description:'الخدمات تخضع لقواعد المنصات. لا يمكن ضمان نتائج الوصول أو التفاعل.',visual:'social',image_url:'',featured:false,is_active:true,sort_order:8}
];
const seedSettings={id:1,store_name:'DidgStore',hero_description:'اشتراكات رقمية • مفاتيح ألعاب • أدوات إبداعية • والمزيد...',whatsapp:CONFIG.fallbackWhatsApp||''};
const STORE='didgstore-demo-v1-';
const localGet=(key,fallback)=>{try{const v=localStorage.getItem(STORE+key);return v?JSON.parse(v):structuredClone(fallback)}catch{return structuredClone(fallback)}};
const localSet=(key,value)=>localStorage.setItem(STORE+key,JSON.stringify(value));
export const isLive=Boolean(CONFIG.supabaseUrl&&CONFIG.supabaseAnonKey);
let sb;
export async function initDb(){if(!isLive)return;const mod=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');sb=mod.createClient(CONFIG.supabaseUrl,CONFIG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true}})}
const table=name=>{if(!sb)throw Error('Supabase غير متصل');return sb.from(name)};
const unwrap=({data,error})=>{if(error)throw error;return data};
export async function getProducts(admin=false){if(!isLive)return localGet('products',seedProducts);let q=table('products').select('*').order('sort_order',{ascending:true}).order('created_at',{ascending:false});if(!admin)q=q.eq('is_active',true);return unwrap(await q)}
export async function getCategories(){if(!isLive)return localGet('categories',seedCategories);return [{...seedCategories[0]},...unwrap(await table('categories').select('*').order('sort_order',{ascending:true}))]}
// Customer reviews — public submissions remain pending until an authorized admin approves.
export async function getPublishedReviews(limit=100){
  if(!isLive)return [];
  return unwrap(await table('customer_reviews')
    .select('id,reviewer_name,rating,comment,product_id,created_at')
    .eq('status','approved').order('created_at',{ascending:false})
    .limit(Math.max(1,Math.min(100,Number(limit)||100))));
}
export async function submitCustomerReview({reviewer_name,rating,comment,product_id=null}){
  if(!isLive)throw new Error('التقييمات محتاجة ربط Supabase');
  const cleanName=String(reviewer_name||'').trim();
  const cleanComment=String(comment||'').trim();
  const stars=Number(rating);
  if(cleanName.length<1||cleanName.length>60||cleanComment.length<1||cleanComment.length>500||
    !Number.isInteger(stars)||stars<1||stars>5)throw new Error('راجع الاسم والتقييم والتعليق');
  // Do not use .select() after insert: submitted rows are hidden from public SELECT by RLS.
  return unwrap(await table('customer_reviews').insert({
    reviewer_name:cleanName,rating:stars,comment:cleanComment,product_id:product_id||null
  }));
}
export async function getAdminReviews(){
  if(!isLive)return [];
  return unwrap(await table('customer_reviews')
    .select('id,reviewer_name,rating,comment,product_id,status,created_at')
    .order('created_at',{ascending:false}).limit(250));
}
export async function changeReviewStatus(id,status){
  if(!isLive)throw new Error('تعديل التقييمات محتاج Supabase');
  if(!['approved','rejected','pending'].includes(status))throw new Error('حالة تقييم غير صالحة');
  return unwrap(await table('customer_reviews').update({status}).eq('id',id).select('id,status').single());
}
export async function deleteCustomerReview(id){
  if(!isLive)throw new Error('حذف التقييمات محتاج Supabase');
  return unwrap(await table('customer_reviews').delete().eq('id',id));
}
export async function getSettings(){if(!isLive)return localGet('settings',seedSettings);return unwrap(await table('store_settings').select('*').eq('id',1).single())}
export async function saveSettings(s){if(!isLive){localSet('settings',s);return s}return unwrap(await table('store_settings').upsert({...s,id:1}).select().single())}
export async function saveProduct(record){const input={...record};if(!isLive){let rows=localGet('products',seedProducts);if(input.id){rows=rows.map(x=>x.id===input.id?{...x,...input}:x)}else{input.id='demo-'+Math.random().toString(36).slice(2,10);rows.unshift(input)}localSet('products',rows);return input}if(!input.id)delete input.id;return unwrap(await table('products').upsert(input).select().single())}
export async function deleteProduct(id){if(!isLive){localSet('products',localGet('products',seedProducts).filter(p=>p.id!==id));return}unwrap(await table('products').delete().eq('id',id))}
export async function saveCategory(cat){if(!isLive){const rows=localGet('categories',seedCategories);if(rows.some(c=>c.slug===cat.slug))throw Error('هاد التصنيف كاين من قبل');rows.push(cat);localSet('categories',rows);return cat}return unwrap(await table('categories').insert(cat).select().single())}
export async function deleteCategory(slug){if(slug==='all')throw Error('ما يمكنش تحذف جميع المنتجات');if(!isLive){const products=localGet('products',seedProducts);if(products.some(p=>p.category_id===slug))throw Error('نقل أو حذف المنتجات ديال هاد التصنيف أولاً');localSet('categories',localGet('categories',seedCategories).filter(c=>c.slug!==slug));return}unwrap(await table('categories').delete().eq('slug',slug))}
export async function getOrders(){if(!isLive)return localGet('orders',[]);return unwrap(await table('orders').select('*').order('created_at',{ascending:false}))}
export async function saveOrder(order){if(!isLive){const rows=localGet('orders',[]);const o={...order,id:order.id||'demo-'+Math.random().toString(36).slice(2,9),created_at:order.created_at||new Date().toISOString()};const i=rows.findIndex(x=>x.id===o.id);if(i>=0)rows[i]=o;else rows.unshift(o);localSet('orders',rows);return o}return unwrap(await table('orders').upsert(order).select().single())}
export async function deleteOrder(id){if(!isLive){localSet('orders',localGet('orders',[]).filter(o=>o.id!==id));return}unwrap(await table('orders').delete().eq('id',id))}
export async function uploadPhoto(file){if(!file)return null;if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('استعمل JPG أو PNG أو WebP');if(file.size>5*1024*1024)throw Error('الصورة أكبر من 5MB');if(!isLive){if(file.size>900000)throw Error('فالوضع التجريبي الصورة خاصها تكون أقل من 900KB');return await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}const name=`${crypto.randomUUID()}.${file.type==='image/png'?'png':file.type==='image/webp'?'webp':'jpg'}`;const {error}=await sb.storage.from('product-images').upload(name,file,{cacheControl:'3600',upsert:false});if(error)throw error;return sb.storage.from('product-images').getPublicUrl(name).data.publicUrl}
export async function login(email,password){if(!isLive)throw Error('سجل إعدادات Supabase أولاً');const {data,error}=await sb.auth.signInWithPassword({email,password});if(error)throw error;return data}
export async function signOut(){if(isLive)await sb.auth.signOut()}
export async function session(){if(!isLive)return {user:{email:'demo@didgstore.local'}};const {data,error}=await sb.auth.getUser();if(error)return null;return data?.user?{user:data.user}:null}
export async function isAdmin(){if(!isLive)return true;const {data,error}=await sb.rpc('is_store_admin');if(error)throw error;return data===true}
export const backendSummary=()=>isLive?'Supabase Live':'Demo (local browser only)';
