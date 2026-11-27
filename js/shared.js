import {uiIcon} from './icons.js';
export const VISUALS = {
  canva:{symbol:'C',tag:'CANVA',accent:'#55d9ff',weak:'rgba(21,159,245,.25)'},
  discord:{symbol:'◕',tag:'NITRO',accent:'#ad93ff',weak:'rgba(138,99,255,.25)'},
  iptv:{symbol:'▣',tag:'IPTV',accent:'#bd80ff',weak:'rgba(147,66,240,.25)'},
  netflix:{symbol:'N',tag:'NETFLIX',accent:'#ff454f',weak:'rgba(225,40,45,.24)'},
  spotify:{symbol:'◉',tag:'SPOTIFY',accent:'#47ff8a',weak:'rgba(31,205,99,.23)'},
  games:{symbol:'✣',tag:'GAMING',accent:'#9afd44',weak:'rgba(137,242,30,.21)'},
  ai:{symbol:'✦',tag:'AI TOOLS',accent:'#6df4db',weak:'rgba(65,235,197,.18)'},
  social:{symbol:'↗',tag:'SOCIAL',accent:'#ffae4b',weak:'rgba(240,155,34,.2)'},
  generic:{symbol:'D',tag:'DIGITAL',accent:'#9dff39',weak:'rgba(130,246,39,.22)'}
};
export const el=(sel,root=document)=>root.querySelector(sel);
export const all=(sel,root=document)=>[...root.querySelectorAll(sel)];
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const cash=value=>Number(value)>0?`${Number(value).toLocaleString('fr-MA',{maximumFractionDigits:2})} DH`:'اسأل عن الثمن';
export function visualOf(p){return VISUALS[p?.visual]||VISUALS.generic}
export function artStyle(p){const v=visualOf(p);return `--product-accent:${v.accent};--product-accent-weak:${v.weak}`}
export function artHTML(p,withImage=true){const v=visualOf(p);return withImage&&p.image_url?`<img class="actual-image" src="${esc(p.image_url)}" alt="${esc(p.name_ar)}" loading="lazy" onerror="this.style.display='none'"/>`:`<div class="product-art"><span class="art-symbol">${uiIcon(p.visual==="games"?"gamepad":p.visual==="ai"?"cpu":p.visual==="social"?"users":p.visual==="iptv"?"monitor":"package")}</span><small>${v.tag}</small></div>`}
export const cleanPhone=number=>String(number||'').replace(/\D/g,'');
export const whatsappUrl=(number,message)=>number?`https://wa.me/${cleanPhone(number)}?text=${encodeURIComponent(message)}`:null;
let toastTimer;
export function toast(message){const box=el('#toast');if(!box)return;box.textContent=message;box.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>box.classList.remove('show'),4000)}
export function openModal(id){const node=document.getElementById(id);if(!node)return;node.hidden=false;document.body.style.overflow='hidden';node.querySelector('button')?.focus()}
export function closeModal(id){const node=document.getElementById(id);if(!node)return;node.hidden=true;if(!all('.modal-backdrop:not([hidden])').length)document.body.style.overflow=''}
export function initModals(){document.addEventListener('click',e=>{const btn=e.target.closest('[data-close]');if(btn)closeModal(btn.dataset.close);if(e.target.matches('.modal-backdrop'))closeModal(e.target.id)});document.addEventListener('keydown',e=>{if(e.key==='Escape')all('.modal-backdrop:not([hidden])').forEach(x=>closeModal(x.id))})}
