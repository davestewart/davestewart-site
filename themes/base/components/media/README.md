# Media

## Overview

This file is designed to help you understand the relationship between content and media, and how media is processed and rendered.

## Types

The types below are used to represent content and media:

```ts
+- PageContent              // full page content
|                           // ⚡️ Transformed in server/plugins/content.ts 
|                           // 📄 Queried per page load  
|
+- MetaItem                 // item (page) metadata
|   +- MetaFolder           // only folder metadata
|   +- MetaPost             // only post metadata
|                           // 🗂️ Injected on page load
|
+- MediaProps               // common media properties
    +- MediaSource          // parsed media attributes
                            // ⚙️ Parsed in component setup
```

Effectively, everything flows from the original markdown. The final data are made available by stores, composables, etc., which are covered in the next sections.


## Data

### Stores

```ts
// get the meta store, which stores all meta items
const meta = useMetaStore()

// search the meta store
const items = meta.search(query)
```

### Composables

There are a couple of core composables to help with media processing:

```ts
// resolve specific media item from (optional) page input
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

However, they also take a `<string>` `media` prop:

- a child-key of the current page's `media` frontmatter

This allows the markdown to be flexible about to define media:

```markdown
:media-video{src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" width="1200" height="675"}
```
```markdown
:media-video{media="featured"}
```

> This may change in the future to directly access the media data. 

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

Items for each component should be fetched from the meta store.
