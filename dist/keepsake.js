const letter=window.LETTER;
const pages=document.querySelector('#pages');
letter.paragraphs.forEach((text,index)=>{
 const section=document.createElement('section');section.className='memory-row';
 const paragraph=document.createElement('p');
 text.split(/(exquisite|my future rn)/g).forEach(part=>{const node=document.createElement(part==='exquisite'||part==='my future rn'?'strong':'span');node.textContent=part;paragraph.append(node)});
 section.append(paragraph);
 letter.photos.filter(photo=>photo.paragraphIndex===index).forEach(photo=>{
  const figure=document.createElement('figure');const img=document.createElement('img');img.src=photo.src;img.alt=photo.caption;
  if(photo.rotate){const wrap=document.createElement('div');wrap.className='rotation-wrap';wrap.append(img);figure.append(wrap)}else figure.append(img);
  section.append(figure);
 });pages.append(section);
});
document.querySelector('#signoff').textContent=letter.signature;
document.querySelector('#final').src=letter.finalPhoto.src;
const printButton=document.querySelector('#print');
Promise.all([...document.images].map(img=>img.decode().then(()=>true).catch(()=>false))).then(results=>{
 printButton.disabled=false;printButton.textContent='print / save as pdf';
 if(results.includes(false))document.querySelector('#help').textContent='a photo could not load. please reload this page before saving your copy.';
});
printButton.addEventListener('click',()=>window.print());
