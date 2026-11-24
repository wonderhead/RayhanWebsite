# Rayhan Khimji acting portfolio

## Update your website

You can change your bio, photos, acting reel, and contact details right in GitHub. Open your website’s repository on GitHub and start in the **Code** tab. You’ll need permission to save changes there.

| What you want to update | Where to go |
| --- | --- |
| About page biography | [`content/bio.txt`](content/bio.txt) |
| Home page wording, photo captions, or contact details | [`content/website.json`](content/website.json) |
| Headshot, gallery photos, or agency logo | [`public/images`](public/images) |
| Acting reel | [`public/videos`](public/videos) for an MP4, then [`content/website.json`](content/website.json) to choose the file or set a video link |
| Downloadable résumé | [`public/downloads`](public/downloads) |

### Change text

1. Open the file from the table and click the pencil icon to edit it.
2. For `bio.txt`, type your bio as you would in an email. The first paragraph appears as the larger introduction. Leave a blank line between paragraphs.
3. For `website.json`, change the words inside the second pair of quotation marks on the line you want. Keep the field name, quotation marks, and any trailing comma. For example, change `"tagline": "Actor · Stage & Screen",` to `"tagline": "Actor · Stage, Screen & Voice",`. If your wording itself includes double quotation marks, use curly quotes such as `“Little Death”`.
4. Use **Preview** to check the change, then click **Commit changes** to save. Give it a short name such as `Update About bio`. If GitHub asks you to open a pull request, have it merged into `main` before publishing. [GitHub’s guide to editing files](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)

In `website.json`, look for these section names.

| Section | What you can change |
| --- | --- |
| `home` | `tagline` is the small text above your name. `mediaButton` is the wording on the button that opens Media. |
| `about` | `photoCaption` is the text under your About photo. `productionTitle` is the italicized title after it. Use `""` to leave the title blank. `photoDescription` describes the photo for visitors using screen readers. |
| `gallery` | Find the entry by its `image` filename. Change `title` for the visible caption and `alt` for a short description of what’s in the photo. |
| `contact` | `intro` is the sentence under the Contact heading. `name`, `agency`, and `email` are your agent’s details. Changing `email` also changes who receives messages drafted through the contact form. |

### Replace photos or the résumé

On your computer, give the replacement the exact filename shown below, including the extension. Export it in the matching format, such as JPEG for `.jpg`. In GitHub, open the listed folder, choose **Add file → Upload files**, and upload the replacement. Save it with **Commit changes**. Uploading a file with the same name in the same folder replaces that file. [GitHub’s guide to uploading files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

| Where it appears | Folder | Filename to use |
| --- | --- | --- |
| Large Home portrait | `public/images` | `rayhan-hero.jpg` and `rayhan-hero-small.jpg`. Use two sizes of the same crop, ideally 1800 × 1440 and 920 × 736 pixels. |
| Headshot & Résumé page, headshot preview | `public/images` | `rayhan-hero-small.jpg`. This is shared with Home. |
| Headshot & Résumé page, headshot download | `public/images` | `rayhan-headshot.jpg`. Upload the full-size photo here when you want the download to match the preview. |
| About photo | `public/images` | `on-set-with-cast.jpg`. Update the caption and description in `website.json` when the subject changes. |
| Contact agency logo | `public/images` | `zuri-agency-logo.jpg` |
| Résumé preview | `public/images` | `rayhan-resume-preview.png`. Export the first page of your new résumé as a PNG. |
| Résumé download | `public/downloads` | `rayhan-khimji-resume.pdf`. Update both the PDF and its preview when the résumé changes. |

The Media gallery photos all go in `public/images`.

| Current caption | Filename to replace |
| --- | --- |
| Mean Girls | `mean-girls.jpg` |
| On set | `suit-on-set.jpg` |
| Period stage performance | `period-stage.jpg` |
| Little Death | `little-death.jpg` |
| Legally Blonde | `legally-blonde.jpg` |
| Stage performance | `red-hoodie-stage.jpg` |

For a gallery photo with a new filename, upload it to `public/images` and change `image`, `title`, and `alt` in the matching gallery entry in `website.json`. The current reel cover also uses `little-death.jpg`. To give the reel its own cover, upload another image to `public/images` and put its filename in `poster` under `reel`.

### Add or replace your acting reel

Open [`content/website.json`](content/website.json) and find `video` under `reel`. Choose one of these options.

- **Play an MP4 on the Media page.** Export your video as an MP4, name it `acting-reel.mp4`, and upload it to [`public/videos`](public/videos). Change the line to `"video": "acting-reel.mp4",`. When the name stays the same, you can upload a new MP4 to replace it. GitHub’s browser upload limit is 25 MiB per file. [GitHub’s upload limits](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- **Link to a video on YouTube or Vimeo.** Copy the full share link, starting with `https://`, and paste it between the quotation marks on the `video` line. The Play button on Media opens that link. Check the link while signed out of the video service so you know visitors can watch it.
- **Show “Reel coming soon.”** Set the line to `"video": "",`.

### Publish and check your changes

1. Once all the changes are saved to `main`, open the **Actions** tab in GitHub.
2. Select **Deploy portfolio to GitHub Pages** on the left. Click **Run workflow**, choose `main`, and click the green **Run workflow** button. [GitHub’s guide to running a workflow](https://docs.github.com/en/actions/how-tos/manage-workflow-runs/manually-run-a-workflow)
3. When the run has a green check, open your live site and refresh the page you changed. If you replaced the Home portrait, check it on a phone and a computer. If you changed a download or the reel, open it to confirm it’s the new file.

## Developer notes

<details>
<summary>Local review and original photo selections</summary>

### Local review

Requires Node.js 22.12 or later and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Review Home, About, Headshot & Résumé, Media, and Contact through the main navigation.

```sh
npm run lint
npm test
npm run build
npm run preview
```

The production build includes a `404.html` app fallback for direct visits to client-side routes. The manual GitHub Pages workflow uses the base path reported by Pages, so it can build for a project path or a custom domain. [GitHub Pages workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

### Homepage review

The Alex Rivera sample was rendered before substituting Rayhan’s materials. The comparison used 1054 px desktop and 360 px phone captures and checked the original Baskerville and Avenir Next stacks, navigation, hero height, text and button placement, portrait crop, and gradient. The source screenshots were cropped to the prototype frame. The standalone sample captures differ by about two pixels vertically.

Rayhan’s version uses the two-line name, muted amber button, and separate desktop and phone portrait crops. The hero fills the space between the header and footer, and the title size is capped on wide screens. The button reads **Explore Media** and opens the Media page.

### Original photo selections

The supplied originals remain in the source photo folder. The site uses web-sized copies and offers a full-resolution headshot JPEG download.

| Placement | Original filename | Reason |
| --- | --- | --- |
| Home and Headshot & Résumé | `Photo Jun 23 2026, 12 07 48 PM.jpg` | Direct eye contact, a charcoal background that works with the hero gradient, and a clean casting portrait. |
| About | `Photo Jul 13 2025, 6 14 14 PM.jpg` | A candid, smiling group portrait from the Little Death set. |
| Media | `Photo Nov 22 2026, 1 14 52 PM (1).png` | A close-up from Little Death that shows Rayhan’s screen work. |
| Media | `Photo May 02 2026, 4 42 25 PM.jpg` | A wider on-set image showing Rayhan in costume with a castmate. |
| Media | `Photo Jul 06 2026, 11 21 58 PM.jpg` | Movement and ensemble work in Mean Girls. |
| Media | `Photo Apr 07 2026, 7 58 39 PM.jpg` | A contrasting period costume and dramatic stage lighting. |
| Media | `Photo Nov 22 2026, 1 14 52 PM.jpg` | A full-body stage still from Legally Blonde. |
| Media | `Photo Mar 07 2024, 10 43 35 PM.jpg` | A seated stage portrait in a contemporary costume. |

The original résumé `F0A8AF9B.pdf` is served under a descriptive filename.

</details>
