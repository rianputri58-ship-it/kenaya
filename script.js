  const slideEls = document.querySelectorAll('.slide');
  const sealTrack = document.getElementById('sealTrack');
  const dotsEl = document.getElementById('dots');
  let current = 0;

  slideEls.forEach(()=>{
    const s = document.createElement('div'); s.className = 'seal'; sealTrack.appendChild(s);
    const d = document.createElement('div'); d.className = 'dot'; dotsEl.appendChild(d);
  });
  const seals = sealTrack.querySelectorAll('.seal');
  const dots = dotsEl.querySelectorAll('.dot');

  function render(dir){
    slideEls.forEach((s,i)=>{
      s.classList.remove('exit-left','exit-right');
      if(i===current){ s.classList.add('active'); }
      else{
        s.classList.remove('active');
        if(dir==='next' && i < current) s.classList.add('exit-left');
        if(dir==='prev' && i > current) s.classList.add('exit-right');
      }
    });
    seals.forEach((s,i)=>{
      s.classList.remove('done','active');
      if(i < current) s.classList.add('done');
      if(i === current) s.classList.add('active');
    });
    dots.forEach((d,i)=>{
      d.classList.remove('done','active');
      if(i < current) d.classList.add('done');
      if(i === current) d.classList.add('active');
    });
  }

  const card = document.getElementById('card');
  card.addEventListener('click', (e)=>{
    if(e.target.closest('button, #musicBtn, .letter-scroll, .focus-overlay')) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if(x > rect.width * 0.62){
      if(current < slideEls.length - 1){ current++; render('next'); }
    } else if(x < rect.width * 0.38){
      if(current > 0){ current--; render('prev'); }
    }
  });

  // ---- 3 foto: flip lalu fokus + musik ----
  const captions = [
    '[ satu hal receh yang selalu keinget dari dia ]',
    '[ satu momen yang bikin senyum-senyum sendiri kalo diinget ]',
    '[ satu hal yang pengen banget kamu makasihin ke dia ]'
  ];
  const imgSrcs = ['assets/img/card1.jpg', 'assets/img/card2.jpg', 'assets/img/card3.jpg'];

  const focusOverlay = document.getElementById('focusOverlay');
  const focusImg = document.getElementById('focusImg');
  const focusCaption = document.getElementById('focusCaption');
  const focusClose = document.getElementById('focusClose');
  const bonusSong = document.getElementById('bonusSong');

  function openFocus(idx){
    focusImg.src = imgSrcs[idx];
    focusCaption.textContent = captions[idx];
    focusOverlay.classList.add('open');
    bgm.pause();
    bonusSong.currentTime = 0;
    bonusSong.play().catch(()=>{});
  }
  function closeFocus(){
    focusOverlay.classList.remove('open');
    bonusSong.pause();
  }

  document.querySelectorAll('.mystery-thumb').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = parseInt(btn.dataset.idx, 10);
      btn.classList.add('flipping');
      setTimeout(()=>{ openFocus(idx); }, 260);
      setTimeout(()=>{ btn.classList.remove('flipping'); }, 520);
    });
  });
  if(focusClose){ focusClose.addEventListener('click', closeFocus); }

  // populate the letter once, as paragraphs (too long for a typewriter effect)
  const rawTpl = document.getElementById('ucapanRaw');
  if(rawTpl){
    const raw = rawTpl.content ? rawTpl.content.textContent : rawTpl.innerHTML;
    const paragraphs = raw.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    const el = document.getElementById('ucapanText');
    paragraphs.forEach(p=>{
      const line = document.createElement('p');
      line.innerHTML = p.split('\n').map(escapeHtml).join('<br>');
      el.appendChild(line);
    });
  }
  function escapeHtml(str){
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  render();

  // secret message reveal
  const secretBtn = document.getElementById('secretBtn');
  const secretMsg = document.getElementById('secretMsg');
  if(secretBtn){
    let taps = 0;
    secretBtn.addEventListener('click', ()=>{
      taps++;
      if(taps >= 3){
        secretMsg.classList.add('open');
        secretBtn.textContent = 'terima kasih sudah membaca';
        secretBtn.disabled = true;
        burstHearts();
      } else {
        secretBtn.textContent = (3 - taps) + ' tap lagi';
      }
    });
  }

  function burstHearts(){
    const container = document.getElementById('hearts');
    for(let i=0;i<7;i++){
      const h = document.createElement('div');
      h.className = 'heart';
      h.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7-4.5-9.5-9C.6 8.2 2 4.5 5.5 4a5 5 0 0 1 6.5 2 5 5 0 0 1 6.5-2c3.5.5 4.9 4.2 3 8-2.5 4.5-9.5 9-9.5 9z"/></svg>';
      h.style.left = (10 + Math.random()*80) + '%';
      h.style.animationDelay = (Math.random()*0.5) + 's';
      container.appendChild(h);
      setTimeout(()=> h.remove(), 3200);
    }
  }

  // music toggle
  const musicBtn = document.getElementById('musicBtn');
  const bgm = document.getElementById('bgm');
  let playing = false;
  musicBtn.addEventListener('click', ()=>{
    if(!playing){
      bgm.play().catch(()=>{});
      playing = true;
      musicBtn.classList.remove('muted');
    } else {
      bgm.pause();
      playing = false;
      musicBtn.classList.add('muted');
    }
  });

  // ---- Envelope intro gate ----
  const introGate = document.getElementById('introGate');
  const envelopeBtn = document.getElementById('envelopeBtn');
  if(envelopeBtn && introGate){
    envelopeBtn.addEventListener('click', ()=>{
      if(envelopeBtn.classList.contains('open')) return;
      envelopeBtn.classList.add('open');
      setTimeout(()=>{ introGate.classList.add('hidden'); }, 650);
    });
  }
