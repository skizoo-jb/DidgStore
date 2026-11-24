// DidgStore storefront localization: no remote translation service or secret keys.
const STORAGE_KEY = 'didgstore-language-v1';
const strings = {
  ar: {
    'lang.switch':'اختيار اللغة', 'meta.title':'DidgStore | متجرك الرقمي المتكامل',
    'meta.description':'DidgStore — كتالوج رقمي عصري مع طلب مباشر عبر واتساب.',
    'nav.home':'⌂ الرئيسية','nav.homePlain':'الرئيسية','nav.products':'المنتجات','nav.offers':'العروض','nav.faq':'الأسئلة الشائعة','nav.contact':'تواصل معنا',
    'nav.search':'ابحث عن منتج...','nav.searchAria':'البحث عن منتج','nav.admin':'♙ دخول الإدارة','nav.adminPlain':'دخول الإدارة','nav.menu':'القائمة',
    'hero.titleStart':'متجرك الرقمي','hero.titleEnd':'المتكامل',
    'hero.subtitle':'اشتراكات رقمية • مفاتيح ألعاب • أدوات إبداعية • والمزيد...',
    'hero.easy':'طلب سهل','hero.easySub':'بخطوات واضحة','hero.clear':'تفاصيل واضحة','hero.clearSub':'قبل تأكيد الطلب',
    'hero.direct':'تواصل مباشر','hero.directSub':'عبر واتساب','hero.order':'اطلب الآن عبر WhatsApp',
    'hero.caption':'اختر المنتج المناسب وراسِلنا لتأكيد التوفر والثمن',
    'categories.browse':'تصفح الأقسام',
    'offers.latest':'أحدث','offers.deals':'العروض','offers.selected':'منتجات مختارة من الكتالوج',
    'offers.digital':'منتجات رقمية','offers.featured':'مميزة','offers.promoDesc':'اختار اللي بغيتي، وشوف الثمن والتفاصيل قبل الطلب.',
    'offers.explore':'استكشف المنتجات ←','offers.empty':'ما كايناش منتجات منشورة دابا.',
    'trust.order':'طلب مباشر','trust.whatsapp':'عبر واتساب','trust.selection':'اختيار منظم','trust.details':'تفاصيل كل منتج',
    'trust.contact':'تواصل مع المتجر','trust.follow':'للتأكيد والمتابعة','trust.payment':'طرق الأداء','trust.afterContact':'تُحدّد بعد التواصل',
    'products.all':'جميع','products.items':'المنتجات','products.sub':'تصفح المنتجات، قارن التفاصيل، وطلب مباشرة عبر WhatsApp.',
    'products.placeholder':'قلب على منتج...','products.searchAria':'البحث عن المنتجات',
    'products.empty':'ما لقيناش منتجات بهاد البحث. جرب اسم آخر أو تبديل التصنيف.', 'products.more':'عرض المزيد ↓',
    'products.default':'منتج رقمي','products.details':'تفاصيل','products.featured':'مميز','products.shortFallback':'شوف التفاصيل قبل الطلب.',
    'products.ask':'اسأل عن الثمن','products.buy':'اطلب الآن ↗','products.buyShort':'◉ اطلب الآن','products.addCart':'إضافة للسلة',
    'products.detailsFallback':'تواصل معنا للحصول على التفاصيل.',
    'products.buyWhatsapp':'اطلب عبر واتساب ↗','products.addCartButton':'+ أضف للسلة',
    'products.note':'الثمن والتوفر النهائيين كيتم تأكيدهم قبل الطلب. هاد الموقع كتالوج، ما فيهش أداء مباشر.',
    'steps.titleStart':'الطلب عندنا','steps.titleEnd':'بسيط',
    'steps.one':'اختار المنتج','steps.oneDesc':'تصفح الكتالوج وشوف المدة والتفاصيل والثمن.',
    'steps.two':'ضغط طلب','steps.twoDesc':'غادي تتحضر ليك رسالة فيها معلومات المنتج.',
    'steps.three':'كمل على WhatsApp','steps.threeDesc':'كتأكد مع المتجر التوفر وطريقة الأداء والتسليم.',
    'faq.titleStart':'الأسئلة','faq.titleEnd':'الشائعة',
    'faq.q1':'كيفاش نطلب منتج؟','faq.a1':'اختار المنتج واضغط «اطلب الآن». غادي يتحل WhatsApp برسالة فيها اسم المنتج والثمن.',
    'faq.q2':'واش نقدر نخلص فالموقع؟','faq.a2':'لا. DidgStore حالياً كتالوج، والتنسيق على الأداء كيكون عبر WhatsApp.',
    'faq.q3':'واش الأثمنة والتوفر نهائيين؟','faq.a3':'المنتجات التجريبية والثمن والتوفر النهائيين خاصك تأكدهم مع المتجر قبل الأداء.',
    'faq.q4':'واش نقدر نطلب أكثر من منتج؟','faq.a4':'نعم. استعمل سلة الطلبات لإرسال رسالة واحدة فيها المنتجات والكمية.',
    'contact.title':'بغيتي تستفسر على شي منتج؟','contact.desc':'تواصل مع المتجر مباشرة عبر WhatsApp.',
    'contact.button':'تواصل عبر WhatsApp ↗',
    'footer.desc':'كتالوج لعرض وطلب المنتجات الرقمية عبر WhatsApp.', 'footer.links':'الروابط',
    'footer.help':'المساعدة','footer.brand':'DidgStore','footer.country':'المغرب • MAD','footer.rights':'جميع الحقوق محفوظة.',
    'cart.title':'سلة الطلبات','cart.empty':'سلة الطلبات خاوية. زيد شي منتج من الكتالوج.',
    'cart.added':'تزاد المنتج لسلة الطلبات ✓','cart.minus':'نقص الكمية','cart.plus':'زد الكمية',
    'cart.total':'المجموع التقريبي','cart.note':'بعض الأثمنة حسب الطلب؛ المجموع النهائي كيتم تأكيده عبر واتساب.',
    'cart.send':'إرسال الطلب عبر WhatsApp ↗',
    'common.close':'إغلاق','errors.noWhatsapp':'خاص تزيد رقم WhatsApp من إعدادات الإدارة قبل ما يخدم الطلب.',
    'errors.connection':'تعذر الاتصال بقاعدة البيانات. تأكد من إعدادات Supabase واتصال الإنترنت.',
    'errors.connectionToast':'كاين مشكل فالاتصال بقاعدة البيانات',
    'wa.productHello':'السلام عليكم، بغيت نطلب من DidgStore:', 'wa.product':'المنتج', 'wa.price':'الثمن', 'wa.duration':'المدة',
    'wa.productFooter':'بغيت نعرف التوفر، طريقة الأداء والتسليم. شكراً.',
    'wa.cartFooter':'المرجو تأكيد التوفر والثمن وطريقة الأداء. شكراً.',
    'wa.inquiry':'السلام عليكم، بغيت نستفسر على منتجات DidgStore.',
    'wa.contact':'السلام عليكم، بغيت نتواصل مع DidgStore.'
  },
  en: {
    'lang.switch':'Choose language', 'meta.title':'DidgStore | Your Digital Store',
    'meta.description':'Discover digital products on DidgStore and place orders through WhatsApp.',
    'nav.home':'⌂ Home','nav.homePlain':'Home','nav.products':'Products','nav.offers':'Offers','nav.faq':'FAQs','nav.contact':'Contact us',
    'nav.search':'Search products...','nav.searchAria':'Search for a product','nav.admin':'♙ Admin Login','nav.adminPlain':'Admin Login','nav.menu':'Menu',
    'hero.titleStart':'Your complete','hero.titleEnd':'digital store',
    'hero.subtitle':'Digital subscriptions • Game keys • Creative tools • And more...',
    'hero.easy':'Easy ordering','hero.easySub':'A few simple steps',
    'hero.clear':'Clear details','hero.clearSub':'Before you order',
    'hero.direct':'Direct contact','hero.directSub':'Via WhatsApp','hero.order':'Order now on WhatsApp',
    'hero.caption':'Choose your product and contact us to confirm availability and price',
    'categories.browse':'Browse categories',
    'offers.latest':'Latest','offers.deals':'Offers','offers.selected':'Handpicked from our catalog',
    'offers.digital':'Featured digital','offers.featured':'products',
    'offers.promoDesc':'Explore the options, check prices and details before ordering.',
    'offers.explore':'Explore products →','offers.empty':'No published products available yet.',
    'trust.order':'Direct ordering','trust.whatsapp':'On WhatsApp',
    'trust.selection':'Organized catalog','trust.details':'Details for every product',
    'trust.contact':'Talk to the store','trust.follow':'Confirm and follow up',
    'trust.payment':'Payment methods','trust.afterContact':'Discussed when ordering',
    'products.all':'All','products.items':'Products','products.sub':'Browse products, compare details and order directly on WhatsApp.',
    'products.placeholder':'Search for a product...','products.searchAria':'Search products',
    'products.empty':'No products match your search. Try another term or category.', 'products.more':'Load more ↓',
    'products.default':'Digital product','products.details':'Details','products.featured':'Featured',
    'products.shortFallback':'See details before ordering.', 'products.ask':'Ask for price',
    'products.buy':'Order now ↗','products.buyShort':'◉ Order now','products.addCart':'Add to cart',
    'products.detailsFallback':'Contact us for more details.',
    'products.buyWhatsapp':'Order on WhatsApp ↗','products.addCartButton':'+ Add to cart',
    'products.note':'Final availability and pricing are confirmed before ordering. This site is a catalog, not an online checkout.',
    'steps.titleStart':'Ordering is','steps.titleEnd':'simple',
    'steps.one':'Choose a product','steps.oneDesc':'Browse the catalog and check pricing, duration and details.',
    'steps.two':'Place a request','steps.twoDesc':'A WhatsApp message with your product details will be prepared.',
    'steps.three':'Continue on WhatsApp','steps.threeDesc':'Confirm availability, payment and delivery with the store.',
    'faq.titleStart':'Frequently asked','faq.titleEnd':'questions',
    'faq.q1':'How do I order a product?','faq.a1':'Choose a product and click “Order now.” WhatsApp opens with the product name and price.',
    'faq.q2':'Can I pay directly on the website?','faq.a2':'Not yet. DidgStore is currently a catalog; payment arrangements are made through WhatsApp.',
    'faq.q3':'Are the prices and availability final?','faq.a3':'Please confirm availability, final pricing and offer details with the store before payment.',
    'faq.q4':'Can I order multiple products?','faq.a4':'Yes. Use the cart to send one WhatsApp message with your products and quantities.',
    'contact.title':'Need help choosing a product?','contact.desc':'Contact the store directly on WhatsApp.',
    'contact.button':'Contact us on WhatsApp ↗',
    'footer.desc':'A catalog for browsing and ordering digital products through WhatsApp.',
    'footer.links':'Quick links','footer.help':'Help','footer.brand':'DidgStore','footer.country':'Morocco • MAD','footer.rights':'All rights reserved.',
    'cart.title':'Your cart','cart.empty':'Your cart is empty. Add products from the catalog.',
    'cart.added':'Added to your cart ✓','cart.minus':'Decrease quantity','cart.plus':'Increase quantity',
    'cart.total':'Estimated total','cart.note':'Some prices require confirmation; final totals are confirmed via WhatsApp.',
    'cart.send':'Send order on WhatsApp ↗',
    'common.close':'Close','errors.noWhatsapp':'The store WhatsApp number has not been configured yet.',
    'errors.connection':'Unable to connect to the database. Check Supabase settings and your internet connection.',
    'errors.connectionToast':'There was a problem connecting to the database.',
    'wa.productHello':'Hello, I would like to order from DidgStore:',
    'wa.product':'Product','wa.price':'Price','wa.duration':'Duration',
    'wa.productFooter':'Please confirm availability, payment options and delivery. Thank you.',
    'wa.cartFooter':'Please confirm availability, prices and payment options. Thank you.',
    'wa.inquiry':'Hello, I have a question about DidgStore products.',
    'wa.contact':'Hello, I would like to contact DidgStore.'
  }
};
let activeLanguage='ar';
export const language=()=>activeLanguage;
export const t=key=>strings[activeLanguage][key] ?? strings.ar[key] ?? key;
export function translatePage(lang){
  activeLanguage=lang==='en'?'en':'ar';
  document.documentElement.lang=activeLanguage;
  document.documentElement.dir=activeLanguage==='ar'?'rtl':'ltr';
  document.title=t('meta.title');
  const meta=document.querySelector('meta[name="description"]');
  if(meta)meta.content=t('meta.description');
  document.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node=>node.setAttribute('placeholder',t(node.dataset.i18nPlaceholder)));
  document.querySelectorAll('[data-i18n-aria]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nAria)));
  document.querySelectorAll('[data-i18n-title]').forEach(node=>node.setAttribute('title',t(node.dataset.i18nTitle)));
  document.querySelectorAll('[data-lang]').forEach(node=>{
    const selected=node.dataset.lang===activeLanguage;
    node.classList.toggle('selected',selected);
    node.setAttribute('aria-pressed',String(selected));
  });
  try{localStorage.setItem(STORAGE_KEY,activeLanguage)}catch{/* privacy mode */}
  document.dispatchEvent(new CustomEvent('didgstore:languagechange',{detail:{lang:activeLanguage}}));
}
export function initLanguage(){
  let saved='ar';
  try{saved=localStorage.getItem(STORAGE_KEY)||'ar'}catch{/* privacy mode */}
  translatePage(saved);
  document.querySelectorAll('[data-lang]').forEach(btn=>btn.addEventListener('click',()=>{
    if(btn.dataset.lang!==activeLanguage)translatePage(btn.dataset.lang);
  }));
}
