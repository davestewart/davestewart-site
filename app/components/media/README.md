# Media

## Overview

This file is designed to help you understand the relationship between content and media, and how media is processed and rendered.

## Types

The types below are used to represent content and media:

```ts
+- ParsedPage               // full page content
|                           // ⚡️ Transformed in server/plugins/content.ts 
|                           // 📄 Queried per page load  
|
+- ContentData              // common attributes
|   +- FolderData           // only folder attributes
|   +- PageData             // only page attributes
|                           // 🗂️ Available on site load
|
+- MediaProps               // common media properties
    +- MediaData            // parsed media attributes
                            // ⚙️ Parsed in component setup
```

Effectively, everything flows from the original markdown. The final data are made available by stores, composables, etc., which are covered in the next sections.


## Data

### Stores

```ts
// get the content store, which makes available ContentItems
const content = useContentStore()

// get the content store, which makes available ContentItems
const search = useSearchStore()
```

### Composables

There are a few core composables to help with media processing.

```ts
// get the current page from anywhere
const page = usePage()

// resolve specific media from page input
const media = resolveMedia(key, page)    

// parse media props into final MediaItem 
const data = useMedia(media)             
```

## Media components

Media components are responsible for rendering media to the page:

```ts
+- MediaFeatured            // a single image, with optional caption
|   +- MediaImage 
|
+- MediaGallery             // multiple images with navigation and full screen
|   +- MediaImage
|
+- MediaVideo               // video component for youtube, vimeo
|
+- MediaEmbed               // iframe component
|
+- MediaImage               // core image display
```

Additionally `PageHero` can render any of the above components:

```scss
+- PageHero 
    +- MediaEmbed
    +- MediaVideo 
    +- MediaGallery 
    +- MediaFeatured
```

All components take common `MediaProps` values including:

- `src`: the media source
- `width`: the media width
- `height`: the media height
- `text`: the media caption or alt text
- `href`: the media link

However, they also take a `media` prop:

- a sub-key of the current page's `media` frontmatter

This allows the markdown to be flexible about to define media:

```markdown
:media-video{src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" width="1200" height="675"}
```
```markdown
:media-video{media="featured"}
```

## Presentation components

These components combine data and media to render content structures:

```ts
+- PageTree                 // renders a tree of meta items
    +- PageTree             // nested folders
    |
    +- ThumbnailWall        // renders a grid of page thumbnails
    |   +- ThumbnailItem    // renders a page thumbnail
    |
    +- PageList             // renders a list of pages
        +- PageItem         // renders a page's title and description
```
