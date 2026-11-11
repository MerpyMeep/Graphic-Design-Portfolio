const navLinks=[...document.querySelectorAll('nav a')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${entry.target.id}`));});},{rootMargin:'-35% 0px -55% 0px'});sections.forEach(section=>observer.observe(section));}
// Open any portfolio artwork in a full-screen viewer. Use arrow keys or controls to browse.
const lightbox=document.querySelector('#art-lightbox');
const lightboxImage=lightbox.querySelector('img');
const lightboxCaption=lightbox.querySelector('figcaption');
const artwork=[...document.querySelectorAll('main img')].filter(img=>!img.closest('.intro-photo-wrap'));
let activeArtwork=0;
function showArtwork(index){activeArtwork=(index+artwork.length)%artwork.length;const img=artwork[activeArtwork];lightboxImage.src=img.currentSrc||img.src;lightboxImage.alt=img.alt||'Portfolio artwork';lightboxCaption.textContent=img.alt||'';lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeArtwork(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');lightboxImage.removeAttribute('src');document.body.style.overflow='';}
artwork.forEach((img,index)=>{img.tabIndex=0;img.addEventListener('click',()=>showArtwork(index));img.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();showArtwork(index);}});});
lightbox.querySelector('.lightbox-close').addEventListener('click',closeArtwork);
lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>showArtwork(activeArtwork-1));
lightbox.querySelector('.lightbox-next').addEventListener('click',()=>showArtwork(activeArtwork+1));
lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeArtwork();});
document.addEventListener('keydown',event=>{if(!lightbox.classList.contains('open'))return;if(event.key==='Escape')closeArtwork();if(event.key==='ArrowLeft')showArtwork(activeArtwork-1);if(event.key==='ArrowRight')showArtwork(activeArtwork+1);});
