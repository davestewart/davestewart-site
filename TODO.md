# Todo

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

- Structure
  - [x] Build search service
  - [x] Migrate search page to service
  - [x] Move to store

- Functionality
  - [x] Add scroll-to-date
  - [x] Fix type to search
  - [x] Change sort to group
  - [ ] Add groups count

### UX

- [ ] Website presentation prefs

### Bugs

- [x] Gumroad button
- [x] Transition full screen if link clicked, then navigate
- [x] 404 page is missing?
- [ ] Review all mobile pages for responsive bugs

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
  - jittery scrolling
    - Multiflow
  - bounces to top twice on scroll up

### Other

- [ ] Review image compression

## Design

### Presentation

- [x] Code highlighting theme
- [ ] Add "intro" content to folders
  - Could folders just be pages with `NavFolder` components?
- [x] Add padding to bottom of page (check home, folder, page views)
- [ ] Add intersection observer to Gallery keyboard control

## Nuxt Content

### Content

- [ ] Landing pages don't have intro paragraphs
- [ ] Missing alt text on images

### Data

- [ ] Decide on `page` or `post` for content `type`
  - [ ] Rename `type` to `view` 
- Path control
  - [ ] In transform, combine path and permalink 
  - [ ] Include `_path` in returned
- [ ] Move search query to server
- [ ] Fix RSS feed content
- [ ] Drafts are showing in Blog and Search

### Content Store

- [ ] Move all functions to store
- [-] Implement sorting (number folders)
- [ ] Review post filters
  - Review at frontmatter, consider hidden: true
  - Reconsider all use cases
    - `draft`
    - `unlisted`
    - could use `navigation: false` for this (https://v2.content.nuxt.com/usage/markdown#front-matter)
- [ ] Consider moving filtering to the backend
- [ ] Review how Content native search works
- [ ] Consider HATEOS for content
  - parent
  - siblings
  - surround
  - tags

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

Tags

- [ ] Add tags to blog posts

### Structure

- [ ] Convert to slashless URLs
- [ ] 301 redirects
- [ ] Structure
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
      - [ ] WebExt Messaging
      - [ ] WXT Layers
      - [ ] WXT Pages
      - [ ] Extension Bus
    - JavaScript Libraries
      - [ ] Tree Lang
      - [x] Spaceman
      - [x] Alias HQ
      - [x] Axios Actions
      - [ ] Phomemo CLI
      - [x] State Machine
      - [x] ES Kit
      - [x] Outliner
      - [ ] Package Wiki
    - Figma
      - [ ] Figma Select Related
      - [ ] Figma Messaging
    - Personal Projects
      - [ ] Emoji Picker
      - [ ] Dave Stewart
      - [x] Likely Logic
      - [x] Branding Experiment
    - Blog
      - [ ] Nuxt IKEA
      - [ ] Nuxt Data Fetching
        - add computed / watch for asyncData
        - add only one asyncData function

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

