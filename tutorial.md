
“I made a personal birthday website. I supplied the letter, photos, music and creative direction, and iterated on the layout and interaction. It uses HTML for the structure, CSS for the design, and vanilla JavaScript for the behavior. GitHub stores the files and Netlify serves them. I'm learning how the implementation works rather than claiming I wrote every line unaided.”

You can shorten that naturally. Directing and refining the project is real work. Understanding the implementation means being able to explain what happens and change parts of it, not pretending you memorized every line.

Netlify sends the visitor ordinary files. The visitor's browser then runs JavaScript and plays CSS animations locally. “Static hosting” means there is no custom server generating responses or storing application data. It can still have music, transitions, camera permission, downloads and moving hearts.

There is no React, Next.js, AI model, backend application, user account system, database or remote recording inbox in this project. HTML audio and browser camera APIs provide the media features.

| Layer | Actual files | What they do |
| --- | --- | --- |
| Structure | `dist/index.html` | Defines the gate, choice and confirmation screens, letter containers, audio player, recording controls and download link. |
| Appearance | `dist/style.css` | Controls colors, gradients, fonts, translucent panel, photo frames, layout changes at smaller widths and animations. |
| Content | `dist/content.js` | Stores the paragraphs and photo metadata in the `window.LETTER` object. |
| Behavior | `dist/script.js` | Reads the content, creates elements, runs the introduction, manages music and reveals photos. |
| Recording | `dist/recording.js` | Requests camera/mic permission, captures video locally, stops it and creates a save link. |
| Assets | `dist/assets/` | Stores real media files used by the site, including the prepared PDF. |
| Hosting configuration | `netlify.toml` | Tells Netlify to publish `dist` and treat the PDF as a downloadable attachment. |

The `keepsake.html`, `keepsake.css` and `keepsake.js` files are an older printable view retained in the original export. The current `save this memory` button does not use them. It links directly to `assets/our-memory.pdf`.

1. Extract the ZIP on your computer. Open the `nghy-github` folder.
2. Visit https://github.com/new and create a repository named `nghy`. A private repository keeps the source and personal media out of public repository browsing. Your deployed website can still be public.
3. On the new repository page choose **uploading an existing file** (or **Add file > Upload files**).
4. Upload the CONTENTS of `nghy-github`, including `dist`, `tools`, `netlify.toml`, this README and the other guide. Do not upload the ZIP itself. `netlify.toml` and `dist` must be at the repository root, not inside another `nghy-github` folder.
5. Commit the upload. The largest included file is under GitHub's 25 MiB browser-upload limit.

If you prefer Git in a terminal, run these inside the extracted folder after creating an EMPTY GitHub repository. Replace YOUR_USERNAME with your own username:

```sh
git init -b main
git add .
git commit -m "Add nghy birthday letter"
git remote add origin https://github.com/YOUR_USERNAME/nghy.git
git push -u origin main
```

Git will require your GitHub authentication. Do not paste credentials into the source files. If you used the browser-upload method, you do not also need to run these commands.

## Connect GitHub to Netlify

1. Sign in to https://app.netlify.com/.
2. Choose **Add new project > Import an existing project**.
3. Select GitHub, authorize access to the `nghy` repository, and select it.
4. Deploy branch: `main`. Base directory: leave empty. Build command: leave empty. Publish directory: `dist`. Framework: none, if asked. No environment variables are needed.
5. Deploy. The included `netlify.toml` already specifies `dist` as the publish directory.
6. In the project's settings, change the project/site name to an available name. The resulting address is `YOUR-CHOSEN-NAME.netlify.app`. For example, `a-memory-for-you.netlify.app` if available. Neither your GitHub username nor `chatgpt` needs to appear in it. A free Netlify subdomain still includes `.netlify.app`.

Future commits to the connected branch trigger Netlify deployments. Your original ChatGPT-hosted website remains separate and unchanged. Edits to one host do not automatically update the other.

## Quick alternative: Netlify Drop

Go to https://app.netlify.com/drop while signed in and drop the extracted **dist folder**. It contains `index.html` at its top level. Do not drop the outer project folder for this method. This deploys the same website without GitHub integration. Later updates require dropping the updated dist folder again unless you connect a repository.

The outer netlify.toml file is for repository deployments. The download link itself already has an HTML download attribute; an iPad may still open a PDF viewer or ask where to save it.

## Try it locally

With Python installed, run this inside the extracted project folder:

```sh
python -m http.server 8000 --directory dist
```

Open http://localhost:8000 in your browser. Stop the server with Ctrl+C. Double-clicking index.html is not the recommended preview: local file restrictions can affect audio, masks and camera access. For an iPad camera test, use the deployed HTTPS Netlify link and grant permission on the iPad itself.

## Edit it

- Letter, signature text, photo order and music path: `dist/content.js`.
- Main heading and timed introduction: `dist/script.js`.
- Colors, sizing, spacing, staggered layout and animations: `dist/style.css`.
- Entry screens, buttons and closing line: `dist/index.html`.
- Optional camera recording: `dist/recording.js`.
- Photos, sound files, signature, pixel cats and PDF: `dist/assets/`.

The full explanation is in `tutorial.md`. Preserve quotes and commas when editing JavaScript strings. Save files as UTF-8. The PDF is pre-generated, so editing the website does NOT automatically change the existing PDF.

## Refresh the downloadable PDF after edits

The current PDF is already included. You do not need Node.js to deploy or use this site. The optional generator uses Node.js and Playwright only when you want a new PDF:

```sh
npm install --no-save playwright
npx playwright install chromium
node tools/generate-memory.cjs
```

It renders the updated site at its desktop width into one continuous PDF, pauses decorations, includes all images, removes the entry and interactive controls, and replaces `dist/assets/our-memory.pdf`. Commit the changed PDF along with your other changes. This is a desktop-layout snapshot; the live page adapts to the visitor's screen, while a PDF has a fixed size.

## Practical behavior

The audio begins through a user interaction. Browser settings can still block playback. The intro audio does not loop; the letter song does. The song file has already been trimmed to start at 58 seconds of the original song.

Recording starts when the visitor chooses `record` and grants camera/microphone access, before the confirmation and timed introduction. An indicator and stop controls stay available. Choosing `without record` skips this. The video is held in the visitor's browser memory, not uploaded to Shan, GitHub, or Netlify. The visitor must save and share it. Reloading or closing the page can discard unsaved recording data. Browser support determines whether the saved recording is MP4 or WebM.

The `go back` action tries to close the tab after its message. Browsers commonly block scripts from closing tabs they did not open; the code falls back to a blank dark screen.

## What was preserved

The `dist` files were copied from the existing website without changing the design or letter. This export adds only repository documentation, Netlify configuration and optional PDF tooling. The original host's `.openai` configuration and Git history are intentionally not part of this independent copy. Personal photos and supplied audio are included for this birthday project; there is no blanket open-source license granting rights to those media.

## Official instructions

- GitHub uploads: https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository
- GitHub terminal workflow: https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github
- Netlify repository deploys: https://docs.netlify.com/start/quickstarts/deploy-from-repository/
- Netlify build settings: https://docs.netlify.com/build/configure-builds/overview/
- Netlify Drop: https://docs.netlify.com/start/quickstarts/netlify-drop-quickstart/


## What happens when someone opens it

1. The browser loads index.html, style.css, content.js, script.js and recording.js.
2. content.js makes the letter data available. script.js builds the letter and photo elements, initially hidden behind the opening screen.
3. The first continue button shows record / without record. recording.js installs this final click behavior after script.js loads.
4. Choosing record requests permission and starts recording if successful. Choosing without record skips capture. Both lead to are you sure?
5. Yes starts the ambient audio and the timed lines. The intended waits total 60 seconds, although background tabs or busy devices can delay timers.
6. The bright letter appears, the ambient track fades away and the letter song starts at the beginning of its already-trimmed file.
7. Scrolling reveals the photos and updates the progress bar. Saving the memory downloads an existing PDF.

## How the letter is rendered

`window.LETTER.paragraphs` is an array of strings. An array is an ordered list, starting at index zero. `forEach` runs a function once for each paragraph, creates a `<p>` element and appends it to the page. `textContent` and text nodes insert the wording as text. The code splits out `exquisite` and `my future rn` and wraps those phrases in `<strong>` to make them bold.

This means the text lives in one convenient data file, instead of being embedded repeatedly throughout the layout. However, the heading, opener and final closing line currently live separately in script.js or index.html, so those are not all controlled by content.js.

## How the staggered photos work

Each photo object has a source path, an accessible description and a paragraphIndex:

```js
{src:'assets/02-3181.png', caption:'Our shadows together in 2023', paragraphIndex:1}
```

The description is used as image alt text, not a caption under the photo. `paragraphIndex:1` aligns it with the second paragraph. The script uses the photo's array index to alternate sides: even indices go left, odd indices go right. Fourteen photos create seven frames on each side.

CSS Grid provides three desktop columns: photo, letter, photo. The script assigns row numbers through CSS variables such as `--row`. Each photo has its own row, preventing paired left-and-right photos. On small screens, media queries switch to a single column and place each photo after its paragraph while still alternating its alignment.

The final collage is a separate figure after the letter. A special rotate setting corrects the sideways seaside photo without rewriting the original image.

## Why things move

CSS `@keyframes` define repeatable changes to position and rotation. They animate the pixel hearts, cats and opening glow. JavaScript generates 48 heart elements with different positions, colors, sizes and durations.

`IntersectionObserver` tells the script when a photo enters the visible area. A class is then added to fade and slide it into place. It is observed only until its first reveal. The reduced-motion CSS settings make the experience calmer for visitors who have requested less animation on their device.

The colorful background uses CSS radial gradients. The letter panel uses a partly transparent color. The signature uses an image mask: its light strokes determine where the colored signature ink appears, allowing the black background to disappear.

## How the audio works

The HTML `<audio>` element holds the letter song. A separate Audio object holds the intro theme. The Web Audio API connects those tracks through gain nodes. A gain node controls volume, enabling fades between the opening and letter.

The code attempts playback after the yes click because browsers restrict unprompted autoplay. It prepares the letter song silently, then resets its currentTime to zero when the letter appears. Zero here is the beginning of `song-58.m4a`, which already starts at the original song's 58-second point.

The intro track has loop=false. The letter's HTML audio element has loop enabled. Browser permissions and device settings still affect whether playback succeeds.

## How recording works

`navigator.mediaDevices.getUserMedia` asks the browser for camera and microphone permission. It returns a stream of media tracks if the visitor allows access. `MediaRecorder` encodes that stream and emits chunks, which are collected in memory. When stopped, the chunks become a Blob, a browser object holding file data.

`URL.createObjectURL(blob)` makes a temporary local URL. The video player previews it and the download link saves it. That URL is not a public upload or a link Shan can open remotely. Stopping also releases the camera and microphone tracks. Deleting the recording releases the temporary URL.

There is no fetch request sending the recording to a server. A server/storage integration would be a separate feature and is not present. The deployed HTTPS site is the appropriate place to test camera support on the recipient's iPad. The included files preserve the current behavior; this handoff does not certify every iPad/browser combination.

## Why the PDF stays the same after a website edit

The download button is an anchor with a `download` attribute pointing at an existing PDF file. It does not generate a PDF when clicked. That makes saving quick and avoids a print dialog.

The PDF was rendered from the real website at 1366 pixels wide. It freezes motion, makes all photos visible, retains the letter's styling and background, and excludes the gate, recording controls, audio button and download button. It is one long page rather than many paper pages. The live website is responsive; the PDF always keeps this fixed desktop layout.

The optional tool in `tools/generate-memory.cjs` repeats that rendering using a local HTTP server and a headless browser. It uses screen styles, includes background graphics and embeds images in the PDF. Run it after changing the letter or design, then commit the new PDF. No audio or recording is embedded in the PDF.

## GitHub versus Netlify versus the URL

Git is version control: it records changes to files. GitHub stores a Git repository online. Netlify is the host: it serves the finished files to visitors over HTTPS. Connecting the repository allows Netlify to publish later commits automatically.

The URL is the address of the hosted site, not the code itself. Moving these files to Netlify does not alter the design because the browser still receives the same HTML, CSS, JavaScript and assets. A chosen Netlify project name gives an address ending in `.netlify.app`; it does not need to contain your GitHub username or ChatGPT.

## Useful code words

| Word | Meaning in this project |
| --- | --- |
| DOM | The browser's live tree of page elements. |
| Event listener | A function run in response to a click, scroll or other event. |
| Promise / async / await | A way to wait for asynchronous work, such as camera permission or a timed delay. |
| CSS class | A named group of appearance rules applied to an element. |
| Media query | CSS rules that depend on screen size or device preferences. |
| Relative path | A file address such as assets/song-58.m4a that works under any hosting domain. |
| Deploy | Publish a version of the files to a web host. |
| Build step | A process transforming source into deployable files. This site already has deployable files, so none is needed. |

## A practical way to learn it

Start by changing one paragraph in content.js and previewing it. Then change a background color in style.css. Next, move one photo by changing its paragraphIndex without giving two photos the same row. Finally, read the yes-click function and compare its timer values with the opening you see. Those small changes connect the code to visible behavior much better than memorizing definitions.
