import {uiIcon} from './icons.js';
import {esc} from './shared.js?v=7';

const names={pending:'قيد المراجعة',approved:'منشور',rejected:'مرفوض'};
const showDate=raw=>{const d=new Date(raw);return Number.isFinite(d.valueOf())?d.toLocaleDateString('ar-MA',{day:'numeric',month:'short',year:'numeric'}):'—'};
const stars=count=>'<span class="didg-admin-review-stars" aria-label="'+Number(count)+' من 5 نجوم">'+
  Array.from({length:5},(_,i)=>'<span class="'+(i<Number(count)?'lit':'')+'">'+uiIcon('star')+'</span>').join('')+'</span>';
export function adminReviewsPanel({reviews=[],products=[],filter='pending'}={}){
 const total=reviews.length;
 const pending=reviews.filter(r=>r.status==='pending').length;
 const approved=reviews.filter(r=>r.status==='approved').length;
 const rejected=reviews.filter(r=>r.status==='rejected').length;
 const tabs=[
  ['pending','في انتظار المراجعة',pending],
  ['approved','التقييمات المنشورة',approved],
  ['rejected','المرفوضة',rejected],
  ['all','جميع التقييمات',total]
 ];
 const visible=filter==='all'?reviews:reviews.filter(r=>r.status===filter);
 const tabHtml=tabs.map(([val,label,count])=>
   '<button class="didg-admin-review-tab'+(filter===val?' selected':'')+'" type="button" data-review-filter="'+val+'" aria-pressed="'+(filter===val)+'">'+
    esc(label)+' <b>'+count+'</b></button>').join('');
 const items=visible.map(r=>{
   const product=products.find(p=>String(p.id)===String(r.product_id));
   const label=product?product.name_ar||product.name_en:'تقييم عام للمتجر';
   const pending=r.status==='pending';
   const approved=r.status==='approved';
   return '<article class="didg-admin-review-item" data-review-id="'+esc(r.id)+'">'+
    '<div class="didg-admin-review-item-top"><div><strong>'+esc(r.reviewer_name)+'</strong>'+
      '<small>'+esc(showDate(r.created_at))+' · '+esc(label)+'</small></div>'+
      '<span class="didg-admin-review-state is-'+esc(r.status)+'">'+esc(names[r.status]||r.status)+'</span></div>'+
    stars(r.rating)+
    '<p class="didg-admin-review-text">'+esc(r.comment)+'</p>'+
    '<div class="didg-admin-review-actions">'+
      (approved?'':'<button type="button" class="btn btn-primary" data-review-decision="approved" data-review-id="'+esc(r.id)+'">'+uiIcon('check')+' نشر التقييم</button>')+
      (r.status==='rejected'?'':'<button type="button" class="btn btn-outline" data-review-decision="rejected" data-review-id="'+esc(r.id)+'">'+uiIcon('x')+' رفض / إخفاء</button>')+
      (!pending?'<button type="button" class="btn btn-outline" data-review-decision="pending" data-review-id="'+esc(r.id)+'">إرجاع للمراجعة</button>':'')+
      '<button type="button" class="btn btn-outline danger" data-review-delete="'+esc(r.id)+'">'+uiIcon('trash')+' حذف نهائي</button>'+
    '</div></article>';
 }).join('');
 return '<div class="page-title-row"><div><span class="section-kicker">DIDGSTORE / ADMIN PANEL</span>'+
  '<h1>تقييمات الزبناء</h1><p>راجع التقييمات الحقيقية قبل النشر. النص الأصلي ما كيتبدلش، وما كنعرضوش تقييمات وهمية.</p></div>'+
  '<div class="page-actions"><button type="button" class="btn btn-outline" data-review-refresh>'+uiIcon('clock')+' تحديث التقييمات</button><a class="btn btn-outline" href="./index.html#reviews" target="_blank" rel="noopener noreferrer">'+uiIcon('external')+' معاينة التقييمات</a></div></div>'+
  '<div class="didg-admin-review-stats">'+
   '<div><span>في انتظار المراجعة</span><strong>'+pending+'</strong></div>'+
   '<div><span>منشورة</span><strong>'+approved+'</strong></div>'+
   '<div><span>مرفوضة</span><strong>'+rejected+'</strong></div>'+
   '<div><span>الإجمالي</span><strong>'+total+'</strong></div></div>'+
  '<div class="didg-admin-review-tabs">'+tabHtml+'</div>'+
  '<div class="didg-admin-review-list">'+
   (items||'<div class="didg-admin-review-noitems">ما كاين حتى تقييم فهاد القسم.</div>')+
   '</div>'+
  '<p class="muted-note">ملاحظة: التقييمات المنشورة ليست بالضرورة مشتريات موثقة. مستقبلاً يمكن ربطها بمعرّف طلب حقيقي لإظهار حالة الشراء الموثق.</p>';
}
