# Todo

## Functionality

Missing

- [x] Fix header transition
- [x] Set up gallery preview
- [x] Git stars
- [x] Share buttons
- [x] Fix `useMedia()` for video

SEO

- [x] Configure title template
- [x] Set up `useHead()` for all pages
- [x] Add SEO module and configure it
- [x] Add additional data for breadcrumbs

Search

- Structure
  - [x] Build search service
  - [x] Migrate search page to service
  - [x] Move to store

- Functionality
  - [x] Add scroll-to-date
  - [x] Fix type to search
  - [x] Change sort to group
  - [ ] Add groups count

- Implement
  - [ ] Website presentation prefs

Vue Smart Header

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

Content Store

- [ ] Move all functions to store
- [ ] Decide on `page` or `post` for content `type`
  - [ ] Rename `type` to `view` 
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

Presentation

- [x] Code highlighting theme
- [ ] Add "intro" content to folders
  - Could folders just be pages with `NavFolder` components?
- [x] Add padding to bottom of page (check home, folder, page views)
- [ ] Add intersection observer to Gallery keyboard control

Journeys

- [ ] Routing
- [ ] Layout
  - [ ] Flexbox
  - [ ] Modal
- [ ] Content / components etc

Structure

- [ ] Migrate app to themes folder
- [ ] Convert to monorepo
- [ ] Migrate admin package here

Bugs

- [x] Gumroad button
- [x] Transition full screen if link clicked, then navigate
- [x] 404 page is missing?
- [ ] Review all mobile pages for responsive bugs

## New

Side menus

- See https://brandontemplar.com/posts
- [ ] Add all search filters
- [ ] Improve search cancelling
- [ ] Page TOC


## Design

Toolbar

-  Convert "Search" to icons (🔎 | ⚙️)

Home Page

- [x] Combine home and bio
- [ ] Figure out design

## Content

Tags

- [ ] Add tags to blog posts 

Structure

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

## Ideas

Small portfolio site:

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
- 

## Monorepo

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
