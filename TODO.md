# TODO List

> Initial migration and mae ready for release

- [Phase 1](#phase-1)
- [Phase 2](#phase-2)

# Phase 1

## Functionality

### Missing

- [x] Fix header transition
- [x] Set up gallery preview
- [x] Git stars
- [x] Share buttons
- [x] Fix `useMedia()` for video

### SEO

- [x] Configure title template
- [x] Set up `useHead()` for all pages
- [x] Add SEO module and configure it
- [x] Add additional data for breadcrumbs

### Search

Structure

- [x] Build search service
- [x] Migrate search page to service
- [x] Move to store

Functionality

- [x] Add scroll-to-date
- [x] Fix type to search
- [x] Change sort to group
- [x] Remove "off" and make radio buttons toggle to off

### Bugs

- [x] Gumroad button
- [x] Transition full screen if link clicked, then navigate
- [x] 404 page is missing?
- [x] Review all mobile pages for responsive bugs

### Mobile

- [x] Mobile needs Home and Up button
- [x] Mobile menu missing Home
- [x] Mobile overlay should hide on scroll
- [x] ~~Nav could do with top level breadcrumb (Section)~~
- [x] Search button needs more space
- [x] Return text / images toggle in search
- [x] Make Tags Group layout responsive

### Responsive

- [x] Strapline has bad beaks on mobile
- [x] Search group by date has left margin on mobile
- Surround navigation feels too small on mobile
  - [x] Maybe make them look like buttons? 
  - [ ] How about swipe to go to next/previous on mobile?

### Styling

- [x] Tighter line height on H3
  - Alias on mobile

### Components

- [x] Tables break responsive layout
  - MultiFlow
  - Nuxt Layers
- [x] Quotes break responsive layout
- [x] Shiki breaks responsive layout
  - ES Kit
- [x] Sticky header is janky
  - ~~jittery scrolling (Multiflow)~~
  - bounces to top twice on scroll up

## Design

### Presentation

Formatting

- [x] Code highlighting theme
- [x] Fix Shiki theming
- [x] Home Page font size and leading to 1.5em (match with folders)
- [x] Search page should use title font for tags and UI toggles
- [x] Increase margin on PageList items

Components

- [x] ~~Could folders just be pages with `NavFolder` components?~~
- [x] re-implement folder `toc` property
  - [x] Do manually in the page
  - [x] Provide a way for TOC to get tree items

Layout

- [x] Add padding to bottom of page (check home, folder, page views)
- [x] Add intersection observer to Gallery keyboard control

## Nuxt Content

### Data

- [x] Move search query to server
- [x] Drafts are showing in Blog and Search
- [x] Review how `status` works

### Content Store

- [x] Move all functions to store
- [x] Review post filters
  - Review frontmatter
    - [x] `draft` -> `draft: true`
    - [x] `unlisted` -> `navigation: false`
    - [x] `visibility` -> delete
    - [x] `preview` -> Just use component in the page
- [x] Consider moving filtering to the backend
- [x] Review how Content native search works


# Phase 2

> Architectural and content updates

## Pickups

Data

- [ ] Decide on `page` or `post` for content `type`
  - [ ] Rename `type` to `view`
- Path control
  - [x] Make sure Up navigation respects full path in blog
  - [ ] In transform, combine path and permalink
  - [ ] Include `_path` in returned

Components

- [ ] Make PageList items completely clickable
- [ ] Add image zoom / preview component
- [ ] Add `> [!Alert]` component https://v2.content.nuxt.com/usage/markdown#props

Navigation

- [ ] Make whole of PageItem clickable
- [ ] Make whole of ThumbnailItem clickable
- [ ] Make all items tabbable

Misc

- [ ] Website presentation prefs
- [ ] Review image compression
- [ ] Add groups count
- [ ] Fix RSS feed content

## Architecture

Refactor page and meta

- [ ] Refactor page store / loading
- [ ] Pass data via props / inject
- [ ] Move search to services
- [ ] Move meta to services
- [ ] Consider _passing_ images to gallery?

## Site structure

### Structure

- [ ] Migrate app to themes folder
- [ ] Convert to monorepo
- [ ] Migrate admin package here

### Monorepo

```scss
+- apps
|   +- admin
|   +- site
+- packages
|   +- content
|   +- layers
+- themes
    +- main
    +- nuxt-ui
    +- tube-map
```


## Site Content

### Design

Home Page

- [x] Combine home and bio
- [ ] Figure out design

### Content

Text

- [ ] Landing pages don't have intro paragraphs
- [ ] Check all folder text; some of it is very out of date
- [ ] Missing alt text on images
- [ ] Fix RSS page
- [ ] Add search to blog folder
- [ ] Add gallery to some folders
  - [ ] Projects
  - [ ] Blog
- [ ] Archive

Tags

- [x] Add tags to blog posts

### Structure

Redirects

| Name                         | From                 | To                  |
|------------------------------|----------------------|---------------------|
| ToDo Emojis                  | Products             | Projects/Personal   |
| Timezone Planner             | Products             | Projects/Personal   |
| Versioning Chrome extensions | Blog/Work            | Blog/Programming    |
| ES Kit                       | Projects/Open Source | Archive/Open Source |


- [ ] 301 redirects
- [ ] Convert to slashless URLs
- [ ] Update Hyvor Talk 

Archive projects

- [ ] ES Kit

Structure

- Projects
  - Nuxt Modules
    - [x] Nuxt Content Assets
    - [x] Nuxt Areas
    - [ ] Nuxt Perfect Scrollbar
    - [ ] Nuxt Layer Utils
    - [ ] Nuxt Content Outline
  - Vue Plugins
    - [ ] Vue Smart Header
    - [x] Vue Class Store
    - [x] Vuex Pathify
  - Browser Extensions
    - [ ] WXT Layers
    - [ ] WXT Pages
    - [ ] WebExt Messaging
    - [ ] Extension Bus
  - JavaScript Libraries
    - [ ] Tree Lang
    - [x] Spaceman
    - [x] Alias HQ
    - [x] Axios Actions
    - [ ] Phomemo CLI
    - [x] State Machine
    - [x] Outliner
    - [ ] Package Wiki
  - Figma
    - [ ] Figma Select Related
    - [ ] Figma Messaging
  - Personal Projects
    - [ ] Dave Stewart
    - [x] Likely Logic
    - [x] Branding Experiment
    - [ ] Emoji Picker
  - Blog
    - [ ] Nuxt IKEA
    - [ ] Nuxt Data Fetching
      - add computed / watch for asyncData
      - add only one asyncData function
  - Nuxt (new Nuxt section)
    - [ ] Nuxt auto-import
      [ ] Nuxt data fetching
      [ ] Nuxt layers


## New

### Vue Smart Header

- [ ] Separate trigger
- [ ] Rename props / redesign numbers
- [ ] Fix `visible` / trigger
- [ ] Fix route navigation show when in trigger mode
- [ ] Make route navigation opt-in
- [ ] Package
- [ ] Publish
- [ ] Props
  - selector
  - $height keyword
  - 'x2' expression
  - support distance and time
  - just ideas...

### Side menus

- See https://brandontemplar.com/posts
- [ ] Add all search filters
- [x] Improve search cancelling
- [ ] Page TOC

## Ideas

### Journeys

- [ ] Routing
- [ ] Layout
  - [ ] Flexbox
  - [ ] Modal
- [ ] Content / components etc
- [ ] Show Next / Prev buttons centralised in main margins

### Small portfolio site:

- show ONLY the things that matter
- a pick projects and share them (via a URL)
- session analytics (what did you look at?)

Better bio:

- data
- timeline
  - aggregate from items?

How do I advertise ME to get a job?

- people actually WANT that (it's not just self-indulgent)

Show your decisions:

- don't just show what you used
- show WHY you used it
- what led to that decision?
- help people hire you

Project idea:

- AI summaries, based on what you clicked on so far
- ask users what they want from the seession
- have AI summarise it
- conversation on one side, visuals on the other
- download a PDF for your session

BIO:

- create logos
- love the detail
- always thinking about things

