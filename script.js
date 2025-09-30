// Portfolio Script (Gallery + Modal + Filter + Form + Language)
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loading-screen');
    setTimeout(()=>hideLoading(),300);

    function hideLoading(){
        if(loadingScreen){
            loadingScreen.classList.add('hidden');
            setTimeout(()=>loadingScreen.style.display='none',500);
        }
        document.body.classList.add('loaded');
    }

    // Navbar toggle
    const navToggle=document.getElementById('nav-toggle');
    const navMenu=document.getElementById('nav-menu');
    if(navToggle&&navMenu){
        navToggle.addEventListener('click',()=>{
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        document.querySelectorAll('.nav-link').forEach(l=>{
            l.addEventListener('click',()=>{
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        document.addEventListener('click',e=>{
            if(!navToggle.contains(e.target)&&!navMenu.contains(e.target)){
                navMenu.classList.remove('active');navToggle.classList.remove('active');
            }
        });
    }

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click',e=>{
            const id=a.getAttribute('href');
            if(id.length>1){
                e.preventDefault();
                const target=document.querySelector(id);
                if(target){
                    window.scrollTo({top: target.offsetTop-70, behavior:'smooth'});
                }
            }
        });
    });

    // Active link highlight
    const sections=document.querySelectorAll('section');
    const navLinks=document.querySelectorAll('.nav-link');
    function setActive(){
        let current='';
        sections.forEach(sec=>{
            const top=sec.offsetTop-100;
            const h=sec.clientHeight;
            if(scrollY>=top && scrollY<top+h){
                current=sec.id;
            }
        });
        navLinks.forEach(l=>{
            l.classList.remove('active');
            if(l.getAttribute('href').slice(1)===current) l.classList.add('active');
        });
    }

    // Gallery filter & search
    const filterButtons=document.querySelectorAll('.filter-btn');
    const projectCards=document.querySelectorAll('.project-card');
    const searchInput=document.getElementById('project-search');
    const noResults=document.getElementById('no-results');
    let filtering=false;

    function animateIn(){
        projectCards.forEach((c,i)=>{
            setTimeout(()=>c.classList.add('animated'),100*i);
        });
    }

    function filterProjects(category, search=''){
        if(filtering) return;
        filtering=true;
        let visible=0;
        projectCards.forEach(card=>{
            const cat=card.getAttribute('data-category');
            const text=(card.innerText||'').toLowerCase();
            const matchCat = category==='all'||cat===category;
            const matchSearch = !search || text.includes(search);
            if(matchCat && matchSearch){
                card.style.display='block';
                visible++;
                requestAnimationFrame(()=>{
                    card.style.opacity='1';
                    card.style.transform='translateY(0)';
                });
            }else{
                card.style.opacity='0';
                card.style.transform='translateY(20px)';
                setTimeout(()=>card.style.display='none',300);
            }
        });
        setTimeout(()=>{
            if(noResults) noResults.style.display = visible===0?'block':'none';
            filtering=false;
        },350);
    }

    filterButtons.forEach(btn=>{
        btn.addEventListener('click',e=>{
            e.preventDefault();
            filterButtons.forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');
            const cat=btn.getAttribute('data-filter');
            const q=searchInput?searchInput.value.toLowerCase().trim():'';
            filterProjects(cat,q);
        });
    });

    if(searchInput){
        let debounce;
        searchInput.addEventListener('input',e=>{
            clearTimeout(debounce);
            debounce=setTimeout(()=>{
                const active=document.querySelector('.filter-btn.active');
                const cat=active?active.getAttribute('data-filter'):'all';
                filterProjects(cat, e.target.value.toLowerCase().trim());
            },250);
        });
    }

    // Modal logic
    let currentZoom=1;
    let currentProject=null;

    const modal=document.getElementById('project-modal');
    const modalTitle=document.getElementById('modal-title');
    const modalImage=document.getElementById('modal-image');
    const modalDescription=document.getElementById('modal-description');
    const modalTech=document.getElementById('modal-tech');
    const modalCategory=document.getElementById('modal-category');
    const zoomInBtn=document.getElementById('zoom-in');
    const zoomOutBtn=document.getElementById('zoom-out');
    const resetZoomBtn=document.getElementById('reset-zoom');
    const modalClose=document.getElementById('modal-close');
    const closeModalBtn=document.getElementById('close-modal');
    const downloadBtn=document.getElementById('download-image');
    const shareBtn=document.getElementById('share-project');

    function openModal(data){
        currentProject=data;
        currentZoom=1;
        if(modalTitle) modalTitle.textContent=data.title;
        if(modalDescription) modalDescription.textContent=data.description;
        if(modalCategory) modalCategory.textContent=getCategoryName(data.category);
        if(modalTech){
            modalTech.innerHTML='';
            data.technologies.forEach(t=>{
                const span=document.createElement('span');
                span.className='tech-tag';
                span.textContent=t;
                modalTech.appendChild(span);
            });
        }
        if(modalImage){
            modalImage.src=data.image;
            modalImage.alt=data.title;
            modalImage.style.filter='none';
        }
        document.querySelector('.modal-image-container')?.classList.remove('zoom-2','zoom-3','zoom-4');
        modal.classList.add('active');
        document.body.style.overflow='hidden';
    }
    function closeModal(){
        modal.classList.remove('active');
        document.body.style.overflow='';
        currentProject=null;
        currentZoom=1;
    }
    function getCategoryName(cat){
        if(window.languageManager){
            const lang=window.languageManager.currentLanguage;
            const mapID={ 'ui-ux':'UI/UX','web':'Website','design':'Desain' };
            const mapEN={ 'ui-ux':'UI/UX','web':'Website','design':'Design' };
            return lang==='id' ? (mapID[cat]||cat) : (mapEN[cat]||cat);
        }
        return cat;
    }
    function updateZoom(){
        const cont=document.querySelector('.modal-image-container');
        if(!cont||!modalImage) return;
        cont.className='modal-image-container zoom-'+currentZoom;
        modalImage.classList.toggle('zoomed', currentZoom>1);
    }
    if(zoomInBtn) zoomInBtn.addEventListener('click',()=>{ if(currentZoom<4){currentZoom++; updateZoom();}});
    if(zoomOutBtn) zoomOutBtn.addEventListener('click',()=>{ if(currentZoom>1){currentZoom--; updateZoom();}});
    if(resetZoomBtn) resetZoomBtn.addEventListener('click',()=>{ currentZoom=1; updateZoom();});
    if(modalClose) modalClose.addEventListener('click',closeModal);
    if(closeModalBtn) closeModalBtn.addEventListener('click',closeModal);
    modal?.querySelector('.modal-backdrop')?.addEventListener('click',closeModal);
    document.addEventListener('keydown',e=>{
        if(e.key==='Escape' && modal.classList.contains('active')) closeModal();
    });
    if(downloadBtn){
        downloadBtn.addEventListener('click',()=>{
            if(!currentProject) return;
            const link=document.createElement('a');
            link.href=currentProject.image;
            link.download=currentProject.title.replace(/\s+/g,'-').toLowerCase()+'.png';
            document.body.appendChild(link); link.click(); document.body.removeChild(link);
            showNotification('Download dimulai','success');
        });
    }
    if(shareBtn){
        shareBtn.addEventListener('click',()=>{
            if(!currentProject) return;
            const text=currentProject.title+' - '+currentProject.description;
            if(navigator.share){
                navigator.share({title: currentProject.title, text, url: location.href})
                    .then(()=>showNotification('Berhasil dibagikan','success'))
                    .catch(()=>fallbackShare(text));
            } else fallbackShare(text);
        });
    }
    function fallbackShare(text){
        if(navigator.clipboard){
            navigator.clipboard.writeText(text+'\n'+location.href)
                .then(()=>showNotification('Link disalin ke clipboard','success'))
                .catch(()=>showNotification('Gagal menyalin','error'));
        }
    }

    // Attach handlers to project buttons
    function initProjectButtons(){
        projectCards.forEach(card=>{
            const btn=card.querySelector('.project-btn');
            if(!btn) return;
            btn.addEventListener('click',e=>{
                e.preventDefault(); e.stopPropagation();
                const data={
                    title: card.querySelector('h3').textContent.trim(),
                    description: card.querySelector('p').textContent.trim(),
                    image: card.querySelector('img').src,
                    category: card.getAttribute('data-category'),
                    technologies: Array.from(card.querySelectorAll('.project-tech span')).map(s=>s.textContent.trim())
                };
                openModal(data);
            });
        });
    }

    // Contact form
    const contactForm=document.getElementById('contact-form');
    if(contactForm){
        contactForm.addEventListener('submit',e=>{
            e.preventDefault();
            const name=contactForm.querySelector('input[type="text"]').value.trim();
            const email=contactForm.querySelector('input[type="email"]').value.trim();
            const msg=contactForm.querySelector('textarea').value.trim();
            if(!name||!email||!msg){
                return showNotification(getT('form-error-fields'),'error');
            }
            if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
                return showNotification(getT('form-error-email'),'error');
            }
            if(msg.length<10){
                return showNotification(getT('form-error-message'),'error');
            }
            const submitBtn=contactForm.querySelector('button[type="submit"]');
            const original=submitBtn.textContent;
            submitBtn.textContent=getT('loading');
            submitBtn.disabled=true;
            setTimeout(()=>{
                showNotification(getT('form-success'),'success');
                contactForm.reset();
                submitBtn.textContent=original;
                submitBtn.disabled=false;
            },1500);
        });
    }

    function getT(key){
        return window.languageManager ? window.languageManager.translate(key) : key;
    }

    // Notification
    function showNotification(message,type='info'){
        const old=document.querySelectorAll('.notification');
        old.forEach(n=>{
            n.style.transform='translateX(100%)';
            setTimeout(()=>n.remove(),300);
        });
        const n=document.createElement('div');
        n.className='notification';
        const colors={success:'#10b981',error:'#ef4444',info:'#6366f1',warning:'#f59e0b'};
        Object.assign(n.style,{
            position:'fixed',top:'100px',right:'20px',background:colors[type]||colors.info,color:'#fff',
            padding:'1rem 1.2rem',borderRadius:'10px',boxShadow:'0 8px 24px rgba(0,0,0,0.15)',zIndex:9999,
            display:'flex',alignItems:'center',gap:'.75rem',fontSize:'.9rem',transform:'translateX(100%)',
            transition:'transform .35s cubic-bezier(.25,.46,.45,.94)'
        });
        n.innerHTML=`<span style="font-weight:600">${message}</span>
        <button style="background:none;border:none;color:#fff;font-size:1.1rem;cursor:pointer;">&times;</button>`;
        n.querySelector('button').onclick=()=>{n.style.transform='translateX(100%)';setTimeout(()=>n.remove(),300);};
        document.body.appendChild(n);
        setTimeout(()=>n.style.transform='translateX(0)',20);
        setTimeout(()=>{n.style.transform='translateX(100%)';setTimeout(()=>n.remove(),350);},5000);
    }

    // Back to top
    const backToTop=document.getElementById('back-to-top');
    if(backToTop){
        backToTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    }
    function updateBackToTop(){
        if(window.scrollY>350) backToTop?.classList.add('visible');
        else backToTop?.classList.remove('visible');
    }

    // Scroll handling
    let ticking=false;
    window.addEventListener('scroll',()=>{
        if(!ticking){
            requestAnimationFrame(()=>{
                setActive();
                updateBackToTop();
                ticking=false;
            });
            ticking=true;
        }
    },{passive:true});

    // Initialize
    animateIn();
    initProjectButtons();
    filterProjects('all','');

    console.log('✅ Portfolio initialized');
});
