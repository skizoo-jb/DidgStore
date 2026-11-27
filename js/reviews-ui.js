import {language} from './i18n.js';
import {uiIcon} from './icons.js';
import {getPublishedReviews,submitCustomerReview,isLive} from './db.js';
import {esc} from './shared.js?v=7';

const copy={
 ar:{
 nav:'تقييمات الزبناء',start:'آراء',end:'الزبناء',
 intro:'تقييمات منشورة بعد مراجعتها، بلا شهادات وهمية أو أرقام مصطنعة.',
 published:'التقييمات المنشورة',empty:'ما كاين حتى تقييم منشور دابا. كون أول واحد يشارك تجربتو!',
 loading:'جاري تحميل التقييمات...',unavailable:'تعذر تحميل التقييمات دابا. تقدر تعاود من بعد.',
 average:'متوسط التقييمات المعروضة',count:'تقييم منشور',
 form:'شارك تجربتك مع DidgStore',note:'رأيك كيعاون الزبناء الآخرين. التقييم كيخضع للمراجعة قبل النشر.',
 name:'الاسم اللي غادي يبان',namePh:'الاسم ديالك',stars:'التقييم ديالك',
 starsHelp:'اختار من نجمة حتى 5 نجوم.',product:'المنتج (اختياري)',general:'تقييم عام للمتجر',
 comment:'التعليق',commentPh:'حكي لينا على تجربتك بصدق...',min:'20 حرف على الأقل',
 confirm:'كنأكد أن هاد رأيي الحقيقي المبني على تجربتي.',submit:'صيفط التقييم للمراجعة',
 policy:'التقييمات المنشورة خاضعة للمراجعة، وماشي بالضرورة مشتريات موثقة. ما تشاركش كلمات السر أو معلومات شخصية.',
 thanks:'شكراً! توصلنا بالتقييم ديالك، وغادي يتراجع قبل ما يبان للزوار.',
 badName:'الاسم خاصو يكون من جوج حتى 60 حرف.',badRating:'اختار التقييم من نجمة حتى 5 نجوم.',
 badComment:'كتب تعليق ما بين 20 و500 حرف.',badConfirm:'أكد أن التقييم من تجربتك الحقيقية.',
 cooldown:'صيفطتي تقييم مؤخراً. عاود جرّب من بعد شوية.',submitError:'وقع مشكل فإرسال التقييم. عاود جرّب.',
 sending:'كنصيفط التقييم...',starLabel:'نجوم من أصل 5'
 },
 en:{
 nav:'Customer reviews',start:'Customer',end:'reviews',
 intro:'Moderated customer feedback, without fake testimonials or invented numbers.',
 published:'Published reviews',empty:'No reviews have been published yet. Be the first to share your experience!',
 loading:'Loading customer reviews...',unavailable:'Reviews are temporarily unavailable. Please try again later.',
 average:'Average of displayed reviews',count:'published reviews',
 form:'Share your DidgStore experience',note:'Your feedback helps other customers. Reviews are moderated before publication.',
 name:'Display name',namePh:'Your name',stars:'Your rating',
 starsHelp:'Select 1 to 5 stars.',product:'Product (optional)',general:'General store review',
 comment:'Your review',commentPh:'Describe your real experience...',min:'At least 20 characters',
 confirm:'I confirm this feedback reflects my own genuine experience.',submit:'Submit for moderation',
 policy:'Published submissions are moderated and not necessarily verified purchases. Never include passwords or personal details.',
 thanks:'Thank you! Your review was submitted and awaits moderation before appearing publicly.',
 badName:'Please enter a name of 2 to 60 characters.',badRating:'Please select a rating from 1 to 5 stars.',
 badComment:'Please write 20 to 500 characters.',badConfirm:'Please confirm this is your genuine experience.',
 cooldown:'You submitted a review recently. Please try again later.',submitError:'Could not submit the review. Please try again.',
 sending:'Submitting your review...',starLabel:'stars out of 5'
 }
};
const tx=key=>copy[language()==='en'?'en':'ar'][key];
const starIcon=()=>uiIcon('star');
let approvedReviews=[];
let currentRating=0;
let getProductRows=()=>[];
function productLabel(p){return language()==='en'?(p.name_en||p.name_ar):(p.name_ar||p.name_en)}
function shownDate(raw){
 const d=new Date(raw);
 return Number.isFinite(d.valueOf())?new Intl.DateTimeFormat(language()==='en'?'en-US':'ar-MA',{year:'numeric',month:'short',day:'numeric'}).format(d):'';
}
function renderStars(){
 document.querySelectorAll('#reviewStarButtons [data-review-star]').forEach(b=>{
  const n=Number(b.dataset.reviewStar);
  b.classList.toggle('is-lit',n<=currentRating);
  b.setAttribute('aria-pressed',String(n===currentRating));
  b.setAttribute('aria-label',n+' '+tx('starLabel'));
 });
}
function statusMessage(message,isError=false){
 const el=document.getElementById('reviewFeedback');
 if(!el)return;
 el.textContent=message;
 el.classList.toggle('is-error',isError);
}
function renderTranslations(){
 const root=document.getElementById('reviews');
 if(!root)return;
 root.querySelectorAll('[data-review-text]').forEach(node=>{
  node.textContent=tx(node.dataset.reviewText);
 });
 root.querySelectorAll('[data-review-placeholder]').forEach(node=>{
  node.setAttribute('placeholder',tx(node.dataset.reviewPlaceholder));
 });
 renderStars();
 renderProductOptions();
 renderPublished();
}
function renderProductOptions(){
 const select=document.getElementById('reviewProduct');
 if(!select)return;
 const chosen=select.value;
 const items=(getProductRows()||[]).filter(p=>p.is_active!==false);
 select.innerHTML='<option value="">'+esc(tx('general'))+'</option>'+
   items.map(p=>'<option value="'+esc(p.id)+'">'+esc(productLabel(p))+'</option>').join('');
 select.value=items.some(p=>String(p.id)===chosen)?chosen:'';
}
function renderPublished(){
 const list=document.getElementById('reviewsList');
 if(!list)return;
 const summary=document.getElementById('reviewSummary');
 const count=document.getElementById('reviewListedCount');
 if(!approvedReviews.length){
   list.innerHTML='<div class="didg-review-empty">'+esc(tx('empty'))+'</div>';
   summary.hidden=true;count.textContent='';
   return;
 }
 const sample=approvedReviews;
 const avg=sample.reduce((sum,r)=>sum+Number(r.rating),0)/sample.length;
 summary.hidden=false;
 document.getElementById('reviewAverage').textContent=avg.toFixed(1);
 document.getElementById('reviewSummaryCaption').textContent=tx('average');
 count.textContent=sample.length+' '+tx('count');
 const products=getProductRows()||[];
 list.innerHTML=sample.map(r=>{
  const rating=Math.max(1,Math.min(5,Number(r.rating)||1));
  const name=esc(r.reviewer_name||'');
  const msg=esc(r.comment||'');
  const product=products.find(p=>String(p.id)===String(r.product_id));
  const label=product?'<span class="didg-review-product">'+esc(productLabel(product))+'</span>':'';
  const first=(r.reviewer_name||'?').trim().slice(0,1).toLocaleUpperCase();
  const date=shownDate(r.created_at);
  return '<article class="didg-review-card"><div class="didg-review-author">'+
   '<span class="didg-review-avatar" aria-hidden="true">'+esc(first)+'</span>'+
   '<div class="didg-review-author-meta"><strong>'+name+'</strong><small>'+esc(date)+'</small></div></div>'+
   '<div class="didg-review-stars" role="img" aria-label="'+rating+' '+esc(tx('starLabel'))+'">'+
   Array.from({length:5},(_,i)=>'<span class="'+(i<rating?'lit':'')+'">'+starIcon()+'</span>').join('')+
   '</div><p class="didg-review-comment">'+msg+'</p>'+label+'</article>';
 }).join('');
}
function buildSection(){
 const starButtons=Array.from({length:5},(_,i)=>'<button type="button" data-review-star="'+(i+1)+'" aria-pressed="false">'+starIcon()+'</button>').join('');
 const html='<div class="section-heading didg-reviews-heading"><div>'+
  '<span class="section-kicker">DIDGSTORE • CUSTOMER FEEDBACK</span>'+
  '<h2><span data-review-text="start"></span> <span data-review-text="end"></span></h2>'+
  '<p class="didg-reviews-intro" data-review-text="intro"></p></div>'+
  '<div class="didg-review-rating-summary" id="reviewSummary" hidden>'+
   '<div class="didg-review-avg"><b id="reviewAverage">—</b>'+starIcon()+'</div>'+
   '<small id="reviewSummaryCaption"></small></div></div>'+
  '<div class="didg-reviews-layout">'+
   '<div class="didg-reviews-column"><div class="didg-review-subheading"><strong data-review-text="published"></strong><small id="reviewListedCount"></small></div>'+
   '<div id="reviewsList" class="didg-reviews-grid"><div class="didg-review-empty" data-review-text="loading"></div></div></div>'+
   '<aside class="didg-review-form-box"><div class="didg-review-form-head">'+
    '<span class="didg-review-form-icon">'+uiIcon('message')+'</span>'+
    '<div><h3 data-review-text="form"></h3><p data-review-text="note"></p></div></div>'+
    '<form id="customerReviewForm" novalidate>'+
     '<label class="didg-review-field"><span data-review-text="name"></span>'+
      '<input name="reviewer_name" id="reviewName" type="text" autocomplete="name" minlength="2" maxlength="60" required data-review-placeholder="namePh"/></label>'+
     '<fieldset class="didg-review-rating-field"><legend data-review-text="stars"></legend>'+
      '<div id="reviewStarButtons" class="didg-review-star-buttons" role="group">'+starButtons+'</div>'+
      '<small data-review-text="starsHelp"></small></fieldset>'+
     '<label class="didg-review-field"><span data-review-text="product"></span><select name="product_id" id="reviewProduct"></select></label>'+
     '<label class="didg-review-field"><span data-review-text="comment"></span><textarea name="comment" id="reviewComment" rows="4" minlength="20" maxlength="500" required data-review-placeholder="commentPh"></textarea></label>'+
     '<div class="didg-review-charrow"><span data-review-text="min"></span><small id="reviewCharCount">0 / 500</small></div>'+
     '<label class="didg-review-confirm"><input id="reviewConfirm" type="checkbox" required/><span data-review-text="confirm"></span></label>'+
     '<div class="didg-review-honey" aria-hidden="true"><label>Website<input type="text" id="reviewWebsite" tabindex="-1" autocomplete="off"/></label></div>'+
     '<button class="btn btn-primary didg-review-send" type="submit" id="reviewSend">'+uiIcon('arrowRight')+'<span data-review-text="submit"></span></button>'+
     '<p id="reviewFeedback" class="didg-review-feedback" role="status" aria-live="polite"></p>'+
     '<p class="didg-review-disclaimer" data-review-text="policy"></p>'+
    '</form></aside></div>';
 const section=document.createElement('section');
 section.className='section container didg-customer-reviews';
 section.id='reviews';
 section.setAttribute('aria-label','Customer Reviews');
 section.innerHTML=html;
 return section;
}
function bindSubmission(){
 const form=document.getElementById('customerReviewForm');
 form.querySelector('#reviewStarButtons').addEventListener('click',e=>{
  const button=e.target.closest('[data-review-star]');if(!button)return;
  currentRating=Number(button.dataset.reviewStar);renderStars();statusMessage('');
 });
 form.querySelector('#reviewComment').addEventListener('input',e=>{
  document.getElementById('reviewCharCount').textContent=e.target.value.length+' / 500';
 });
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(form.querySelector('#reviewWebsite').value.trim())return;
  const name=form.elements.reviewer_name.value.trim();
  const comment=form.elements.comment.value.trim();
  if(name.length<2||name.length>60){statusMessage(tx('badName'),true);form.elements.reviewer_name.focus();return;}
  if(!Number.isInteger(currentRating)||currentRating<1||currentRating>5){statusMessage(tx('badRating'),true);form.querySelector('[data-review-star]').focus();return;}
  if(comment.length<20||comment.length>500){statusMessage(tx('badComment'),true);form.elements.comment.focus();return;}
  if(!document.getElementById('reviewConfirm').checked){statusMessage(tx('badConfirm'),true);document.getElementById('reviewConfirm').focus();return;}
  const key='didgstore-review-last-send';
  try{const last=Number(localStorage.getItem(key)||0);if(last>0&&Date.now()-last<600000){statusMessage(tx('cooldown'),true);return}}catch{/* storage disabled */}
  if(!isLive){statusMessage(tx('unavailable'),true);return;}
  const send=form.querySelector('#reviewSend');
  send.disabled=true;statusMessage(tx('sending'));
  try{
   const chosen=form.elements.product_id.value;
   const validProduct=(getProductRows()||[]).find(p=>String(p.id)===chosen&&p.is_active!==false);
   await submitCustomerReview({reviewer_name:name,rating:currentRating,comment,product_id:validProduct?.id||null});
   try{localStorage.setItem(key,String(Date.now()))}catch{/* privacy mode */}
   form.reset();currentRating=0;renderStars();document.getElementById('reviewCharCount').textContent='0 / 500';
   statusMessage(tx('thanks'));
  }catch(err){
   console.error('Could not submit customer review:',err);
   statusMessage(tx('submitError'),true);
  }finally{send.disabled=false}
 });
}
export async function mountCustomerReviews(productsGetter){
 const faq=document.getElementById('faq');
 if(!faq||document.getElementById('reviews'))return;
 getProductRows=typeof productsGetter==='function'?productsGetter:()=>[];
 const section=buildSection();
 faq.parentNode.insertBefore(section,faq);
 bindSubmission();renderTranslations();
 document.addEventListener('didgstore:languagechange',renderTranslations);
 try{
  approvedReviews=await getPublishedReviews(100);
  renderPublished();
 }catch(err){
  console.error('Review feed unavailable:',err);
  document.getElementById('reviewsList').innerHTML='<div class="didg-review-empty">'+esc(tx('unavailable'))+'</div>';
 }
}
