# Sanity Studio Guide

The Studio is where the content of the site lives. You get to it by adding `/studio` to the end of the site address. Anything you publish there shows up on the site about a minute later.

There are two kinds of things to load: **Projects**, which build the Work section, and **Fun Gallery Images**, which build the free-form gallery.

## Getting in (one time only)

1. Go to `manage.sanity.io`.
2. Open the Esquina Estudio project.
3. Under Members, invite Virginia and Victoria.
4. Give them the Editor role. That lets them add and change content without being able to change how the site is built.

## Fun Gallery images

Every image in the gallery is its own entry. Click **Fun Gallery Image**, then the **+** to create one, and fill in:

- **Image (PNG with transparent background)** — needed. Upload the cut-out. It has to be a PNG with a transparent background: the gallery floats each piece on the page with no box or frame around it, so anything with a white rectangle behind it will look like a sticker stuck on top.
- **Name** — needed. A short name for the piece, like *Cocktail Hour napkins*. It is how you will recognise the entry in the list, and it is what someone hears when they reach the image with the keyboard.
- **Alt text** — optional. One sentence describing what is in the image, for people who browse with a screen reader. If you leave it empty, the name is used instead.
- **Linked project** — optional. Pick a project here and clicking the image opens that project's page. **Leave it empty and the image still shows — it just isn't clickable.** Nothing breaks either way, so only link the ones where it makes sense.
- **Display Order** — optional. See below.

Then press **Publish**. An entry that has not been published does not reach the site.

### The order, and how the gallery arranges itself

Images are read from the lowest **Display Order** number to the highest. Any image left without a number goes at the end.

The gallery does not lay them out in a line: it scatters them across a map you move around with the mouse. That scatter is worked out on its own from the images you have loaded and the order they are in, and it comes out the same every time the page is opened — the gallery does not reshuffle itself behind your back.

It does change when you **add** an image, **remove** one, or **change the order numbers**. So if you reorder, expect the whole scatter to be redrawn, not just the one image to move. Replacing the photo inside an entry that is already loaded does not move anything.

### While the gallery is still empty

Until the first image is published, the page shows a short line saying the gallery is empty. That is on purpose — nothing is broken.

## Projects

### Adding a project

1. Click **Project**, then the **+**.
2. Fill in the name, the URL slug, the project number (`01`, `02`, `03`…), the category, the services, the year and the cover image.
3. The cover background colour is only worth filling when the cover is a logo sitting on a flat colour.
4. Publish.

Projects are ordered the same way as the gallery: lowest **Display Order** first, and anything without a number at the end.

### The Spanish version

Three of the boxes come in pairs, English and Spanish, grouped together on the form: the project **name**, the **category** and the **services**. Fill the Spanish half whenever the wording is genuinely different in Spanish — the category and the services usually are, the project's own name usually is not.

The Spanish boxes are optional, and nothing on the site shows them yet: the language switch is the next piece of work. Loading them now just means nobody has to go back through every project when it arrives.

The body of the project page — the paragraphs and the images further down — is **not** doubled up. It stays as it is.

### What goes on the project page

Add the blocks in the order you want them to appear down the page:

- **Single Media** — one horizontal image or GIF, or a video link.
- **Dual Media** — two vertical images side by side.
- Plain text for the paragraphs.

## A few things worth knowing

- You do not need to shrink or compress anything before uploading. The site builds its own smaller versions of every image. Upload the best quality you have.
- Transparent backgrounds matter for the Fun Gallery. For project covers a normal photo is fine.
- Use a GIF or a video only where the movement is the point.
- Changes reach the site about a minute after you publish, not instantly.
