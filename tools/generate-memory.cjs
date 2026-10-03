// Optional developer tool. The live website does not need Node or Playwright.
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '../dist');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.m4a':'audio/mp4','.pdf':'application/pdf'};
const server = http.createServer((req,res) => {
  let filename;
  try { filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname)); }
  catch { res.writeHead(400); res.end(); return; }
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.stat(filename,(error,stat)=>{
    if(error || !stat.isFile()){res.writeHead(404);res.end();return;}
    res.setHeader('Content-Type',types[path.extname(filename)] || 'application/octet-stream');
    fs.createReadStream(filename).pipe(res);
  });
});
(async () => {
  let browser;
  try {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    browser = await chromium.launch({headless:true});
    const page = await browser.newPage({viewport:{width:1366,height:979},deviceScaleFactor:1});
    await page.goto(`http://127.0.0.1:${server.address().port}/index.html`);
    await page.evaluate(() => {
      document.querySelector('#experience').hidden = false;
      document.querySelector('#gate').remove();
      document.querySelectorAll('img').forEach(img => img.loading = 'eager');
    });
    await page.addStyleTag({content:`
      *{animation:none!important;transition:none!important;print-color-adjust:exact!important;-webkit-print-color-adjust:exact!important}
      #sound,.progress,#record-status,#reaction,.keepsake-download{display:none!important}
      .memory-photo,#final-photo{opacity:1!important;translate:none!important;scale:1!important}
      #pixel-background{position:absolute!important;inset:0!important}
    `});
    await page.evaluate(async()=>{
      await document.fonts.ready;
      await Promise.all([...document.images].map(img=>img.decode()));
    });
    const height = await page.evaluate(()=>document.documentElement.scrollHeight);
    await page.emulateMedia({media:'screen'});
    await page.pdf({path:path.join(root,'assets/our-memory.pdf'),width:'1366px',height:`${height}px`,printBackground:true,margin:{top:0,bottom:0,left:0,right:0}});
    console.log('Updated dist/assets/our-memory.pdf. Review it, then commit and deploy.');
  } finally {
    if(browser) await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(error=>{console.error(error);process.exitCode=1;});
