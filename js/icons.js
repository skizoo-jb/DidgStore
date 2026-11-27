// DidgStore's own inline SVG set: consistent line weight, no icon fonts or CDNs.
const paths={
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  bag:'<path d="M5.3 8h13.4l1.1 12H4.2L5.3 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  cart:'<circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2.5 3.5h2l2.7 12.2H19l2.2-8.4H5.5"/>',
  package:'<path d="m3 7 9-4 9 4v10l-9 4-9-4V7Z"/><path d="m3 7 9 4 9-4M12 11v10"/>',
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list:'<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M9 9h7M9 13h7M9 17h5M6.6 9h.1M6.6 13h.1M6.6 17h.1"/>',
  clipboard:'<rect x="5" y="4.5" width="14" height="17" rx="2"/><path d="M9 4V3h6v1.5m-6.7 9 2.2 2.2 4.5-5"/>',
  users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2.2A5 5 0 0 1 8 13h2a5 5 0 0 1 5 4.8V20H3Z"/><path d="M16.3 5.5a3 3 0 0 1 0 5.5M17 13a5 5 0 0 1 4 4.8V20h-4"/>',
  heart:'<path d="M20.8 4.9a5.4 5.4 0 0 0-7.6 0L12 6.1l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6L12 21l8.8-8.5a5.4 5.4 0 0 0 0-7.6Z"/>',
  eye:'<path d="M2 12s3.8-6.5 10-6.5S22 12 22 12s-3.8 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  flame:'<path d="M12 22a7.5 7.5 0 0 0 7.5-7.5c0-3.6-1.7-5.7-5-9.5.2 3.2-1.5 4-2.5 4.3C11.7 6 10.5 4 8 2c0 4.8-3.5 7.6-3.5 12.5A7.5 7.5 0 0 0 12 22Z"/><path d="M12 22a3.8 3.8 0 0 0 3.8-3.8c0-1.5-.8-3-2.2-4.5-.2 1.5-.9 2.3-1.6 2.6-.3-1.5-.8-2.3-1.6-3.1a6.5 6.5 0 0 1-2.2 5A3.8 3.8 0 0 0 12 22Z"/>',
  sparkles:'<path d="m12 2 1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2ZM20 17l.7 2.3L23 20l-2.3.7L20 23l-.7-2.3L17 20l2.3-.7L20 17Z"/>',
  star:'<path d="m12 2 3.1 6.4 7 1-5.1 5 1.2 7-6.2-3.3-6.2 3.3 1.2-7-5.1-5 7-1L12 2Z"/>',
  tag:'<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  arrowRight:'<path d="M4 12h16m-7-7 7 7-7 7"/>',
  arrowLeft:'<path d="M20 12H4m7-7-7 7 7 7"/>',
  chevronRight:'<path d="m9 5 7 7-7 7"/>',
  external:'<path d="M13 4h7v7M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  check:'<path d="m4 12 5 5L20 6"/>',
  message:'<path d="M20 11.5a8 8 0 0 1-8 8 8 8 0 0 1-3.6-.8L3 20l1.4-5A8 8 0 1 1 20 11.5Z"/><path d="M8 10h8m-8 4h5"/>',
  whatsapp:'<path d="M20 11.6a8.4 8.4 0 0 1-8.4 8.4 8.4 8.4 0 0 1-3.8-.9L3 20.5l1.5-4.6A8.4 8.4 0 1 1 20 11.6Z"/><path d="M8.2 8.9c-.4.5-.5 1-.2 1.8.6 2 3 4.5 5.1 5.1.7.2 1.3.1 1.8-.4l.4-.8-2.1-1-1 .9c-1.1-.6-2-1.5-2.6-2.7l.7-1-1.1-2.1Z"/>',
  creditCard:'<rect x="2.5" y="5.5" width="19" height="13" rx="2.6"/><path d="M3 10h18M6.5 15h4"/>',
  settings:'<circle cx="12" cy="12" r="3"/><path d="m10 2-.4 2.2-2 .8-1.9-1.2L3 6.5l1.2 1.9-.8 2L1.2 11v2l2.2.5.8 2-1.2 1.9L5.7 20l1.9-1.2 2 .8.4 2.2h4l.4-2.2 2-.8 1.9 1.2 2.7-2.7-1.2-1.9.8-2 2.2-.5v-2l-2.2-.5-.8-2L21 6.5l-2.7-2.7-1.9 1.2-2-.8L14 2h-4Z"/>',
  gamepad:'<path d="M8 7h8a5 5 0 0 1 4.8 4l1 5.5a3 3 0 0 1-5.1 2.6l-2-2H9.3l-2 2a3 3 0 0 1-5.1-2.6L3.2 11A5 5 0 0 1 8 7Z"/><path d="M7 11v5m-2.5-2.5h5M16.6 11.8h.1M18.8 14h.1"/>',
  cpu:'<rect x="5" y="5" width="14" height="14" rx="2"/><path d="M9 9h6v6H9zM9 1v4m6-4v4M9 19v4m6-4v4M1 9h4M1 15h4m14-6h4m-4 6h4"/>',
  monitor:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21h6m-3-4v4"/>',
  layout:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18m-12 0v11"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  chart:'<path d="M3 20h18M5 17v-6m5 6V6m5 11v-8m5 8V3"/>',
  mail:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 7 9-7"/>',
  edit:'<path d="m4 20 4.4-1L20 7.4 16.6 4 5 15.6 4 20ZM14.8 5.8l3.4 3.4"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
  headset:'<path d="M4 13V11a8 8 0 1 1 16 0v2M4 13h2a2 2 0 0 1 2 2v3H6a2 2 0 0 1-2-2v-3Zm16 0h-2a2 2 0 0 0-2 2v3h2a2 2 0 0 0 2-2v-3ZM16 21h-4"/>',
  logOut:'<path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4M14 7l5 5-5 5M19 12H9"/>',
  lightning:'<path d="m13 2-9 11h7l-1 9 10-12h-7V2Z"/>',
  x:'<path d="M6 6l12 12M18 6 6 18"/>'
};
export function uiIcon(name,className=''){
 const key=Object.prototype.hasOwnProperty.call(paths,name)?name:'package';
 const cls=String(className).replace(/[^a-zA-Z0-9_\- ]/g,'').trim();
 return '<svg xmlns="http://www.w3.org/2000/svg" class="didg-ui-icon'+(cls?' '+cls:'')+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">'+paths[key]+'</svg>';
}
export function hydrateIcons(root=document){
 root.querySelectorAll('[data-ui-icon]').forEach(node=>{
  const name=node.getAttribute('data-ui-icon');
  if(node.dataset.uiHydrated===name)return;
  node.innerHTML=uiIcon(name);
  node.dataset.uiHydrated=name;
 });
}
