---
description: Understanding when to use and when to avoid the auto-import magic
preview: true
date: 2024-05-21
media:
  featured: ./images/featured.png
  thumbnail: ./images/thumbnail.png
  opengraph: ./images/opengraph.png
---

# Getting a grip on Nuxt's auto-import functionality

## Intro

One of Nuxt 3's stand-out features is its [auto-import](https://nuxt.com/docs/guide/concepts/auto-imports) functionality which promises to reduce developer friction by removing the burden of managing imports, and even having to worry about the source of any particular dependency!

But perhaps you – like me – find the auto-import experience to be poor, with any supposed time saved eclipsed by new problems such as poor IDE integration, difficulty locating files, or understanding your application structure.

I wanted to get to the bottom of this paradox so after my original complaint in my [Nuxt Layers article](https://davestewart.co.uk/blog/nuxt-layers/), I decided to spend some time getting to know auto-import; when it was useful, when less so, and what workarounds there might be.

I've tried to keep the article as short as I can, but there's quite a lot to cover!

<NavToc level="2"
        type="list"
        exclude="intro"
        prompt="Feel free to jump to" />

## Auto-import recap

So let's reacquaint ourselves with how auto-import works, or if you were fuzzy on the specifics, shine a light on them.

### Background

Nuxt leverages [unjs/unimport](https://github.com/unjs/unimport) (which in turn leverages [unjs/unplugin](https://unplugin.unjs.io/guide/)) to supply the auto-import magic.

It's a build process which scans configured folders, hoists discovered dependencies into the global scope, injects relevant import statements into the build, and connects your IDE via TypeScript [declarations](https://itnext.io/mastering-declaration-files-the-key-to-typescripts-type-magic-fe4483a86645).

For a little more detail, [here's how Chat GPT describes it](https://chatgpt.com/share/c35d9e16-f542-47c5-89e3-0775c88c4281).

### Implementation

Whilst "auto-import" is a catch-all term which covers both **components** and **code**, there are actually significant differences and subtle ambiguity across their naming, documentation, behaviour, and defaults:

| Behaviour                | Components                                                                                                                          | Code                                                                             |
|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|
| Documentation            | [Components](https://nuxt.com/docs/guide/directory-structure/components)                                                            | [Composables](https://nuxt.com/docs/guide/directory-structure/composables)       |
| Default folders          | `~/components`                                                                                                                      | `~/composables`, `~/utils`, `~/server/utils`                                     |
| Direct import            | [`#components`](https://nuxt.com/docs/guide/directory-structure/components#direct-imports)                                          | [`#imports`](https://nuxt.com/docs/guide/concepts/auto-imports#explicit-imports) |
| Configuration option     | [`components`](https://nuxt.com/docs/api/nuxt-config#components)                                                                    | [`imports`](https://nuxt.com/docs/api/nuxt-config#imports)                       |
| Heavy-lifting done by    | [Framework code](https://github.com/nuxt/nuxt/blob/390a0ff281527880e3a610d527a0a453018b9b2b/packages/nuxt/src/components/module.ts) | [unjs/unimport](https://github.com/unjs/unimport)                                |
| Folder scanning defaults | Nested                                                                                                                              | Top-level                                                                        |
| Notes                    | Auto-prefixes nested folders                                                                                                        |                                                                                  |

Did you spot the potential **footgun**?

It's that Nuxt 3 – by _default_ – will auto-prefix nested components.

It's important to understand the ramifications of this, as it **directly** affects the nature of your project, including:

- component organisation
- component usage
- IDE integration
- refactoring


## Component auto-import config

### Defaults

To begin with, lets dig into the mechanics of component auto-imports.

Given that auto-imports are **global** by definition, and your project could have potentially many 100s of components, Nuxt looks to sidestep global namespace collisions by _prefixing_ **component** auto-imports with their folder path.

As such, Nuxt's out-of-the-box component "auto-importing" is also component _auto-renaming_:

| Folder                     | Component name     | Auto-import name               |
|----------------------------|--------------------|--------------------------------|
| `components`               | `Input.vue`        | `Input.vue`                    |
| `components/forms`         | `Input.vue`        | `FormsInput.vue`               |
| `components/forms`         | `FormsInput.vue`   | `FormsInput.vue`               |
| `components/forms`         | `Dropdown.vue`     | `FormsDropdown.vue`            |
| `components/forms/options` | `Dropdown.vue`     | `FormsOptionsDropdown.vue`     |
| `components/forms/options` | `DropdownItem.vue` | `FormsOptionsDropdownItem.vue` |

You can see how this works (or, doesn't!) in a sample repo below:

- [stackblitz.com/edit/nuxt3-component-config](https://stackblitz.com/edit/nuxt3-component-config)

Unfortunately, the docs mainly skip over this fundamental choice:

- component prefixing is not mentioned in the [Key Concepts / Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports#auto-imported-components) part of the guide
- on the Components page, manual renaming is suggested only "[for clarity](https://nuxt.com/docs/guide/directory-structure/components#component-names)"
- the docs search for "auto-import" does not reference the main [Components](https://nuxt.com/docs/guide/directory-structure/components) page
- the behaviour is different to, and not mentioned directly in, the [Nuxt 3 Migration / Auto Imports](https://nuxt.com/docs/migration/auto-imports) guide

The upshot is:

- if you didn't know about the new defaults, you may already have found auto-imports mysteriously "broken"
- even if you did, you may not be aware of the indirect ramifications path-prefixing may impose upon you

### Customisation

However, given the above you'll be glad to know you **can** reconfigure the defaults, even _per-folder_ if you wish:

```ts
// src/nuxt.config.ts
export default defineNuxtConfig({
  components: [
    // use defaults: use path prefix
    '~/core/components',

    // override defaults: no path prefix
    { path: '~/layers/site/components', pathPrefix: false },

    // override defaults: no path prefix, register all globally (for Nuxt Content)
    { path: '~/layers/blog/components', pathPrefix: false, global: true },
  ]
})
```

You can also completely disable component auto-importing per project, and per layer:

```ts
// src/nuxt.config.ts or src/layer/nuxt.config.ts 
export default defineNuxtConfig({
  components: []
})
```

The next section digs into the why's and the wherefores of these choices.

## Project size considerations

### Approach

Now you're up to speed on configuration, let's cover opting in, opting out, or sitting somewhere between.

On anything other than a quick demo, you may want to either:

- settle on a folder strategy, such as 2-levels deep, singular-names (i.e. `components/dropdown/DropdownItem.vue`), or
- turn off path-prefixing in favour of explicitly-named components, or 
- turn off auto-importing in favour of explicit imports, or
- a mixture of the last two approaches

The motivation for each may depend on:

- how large the project is
- how well the team knows the codebase
- how comfortable the developers are with magic
- your style of development
- your IDE choice

### Small to medium projects

In a small or medium projects, it's reasonably simple to keep track of component auto-importing:

```
+- src
    +- components
        +- account                    <-- nested folders; prefixed component names
        |   +- AccountSettings.vue
        |   +- AccountLogin.vue
        +- article
        |   +- ArticleList.vue
        |   +- ArticleItem.vue
        +- dropdown
        |   +- Dropdown.vue
        |   +- DropdownOption.vue
        +- site
        |   +- Footer.vue
        |   +- Header.vue
        |
        +- Button.vue                 <-- root level; no prefixing
        +- Dropdown.vue
```

However, note:

- the mix of top-level contexts, i.e. core (`dropdown`), global (`site`) and domain (`account`, `article`) concerns
- the mix of _physical_ prefixes and _auto_-prefixes `site/Footer`, `Dropdown` (which some IDEs may fail to reference) 
- that top-level imports are **not** renamed, but nested components **are**

If your project is small and everything is reasonably accessible in the Project Explorer, maybe that's fine.

But, **two questions** regarding organisation:

- are you sure your small project won't eventually become a large project?
- as your project grows, are you happy with _enforced_ [path-prefixing](https://nuxt.com/docs/guide/directory-structure/components#component-names) constraints?

If your project does expand and you need to organise further, expect longer, concatenated naming such as:

```html
<FormDropdown>
  <FormDropdownOption />
</FormDropdown>
```

Or perhaps:

```html
<AccountSettingsDropdownOption />
```

You get the idea.

### Large projects

So let's take a large project, such as [Elk](https://github.com/elk-zone/elk), a Mastodon client written by some of the core Nuxt team, and a great showcase for what Nuxt can do.

The app has about 50 [routes](https://github.com/elk-zone/elk/tree/main/pages), with 24 top-level [components](https://github.com/elk-zone/elk/tree/main/components) folders and around 180 component files. They've stuck _mainly_ to a 2-level structure with occasional strategic nesting:

```
+- src
    +- components
        +- account
        +- aria
        +- ...
        +- common
        +- ...
        +- status
        |   +- edit
        |   |   +- StatusEditHistory.vue
        |   |   +- StatusEditHistorySkeleton.vue
        |   |   +- ...
        |   +- ...
        +- ...
```

You could argue at least this is reasonably organised and mainly consistent, but let's say I'm a new team member, and I'm trying to understand how [`StatusEditHistorySkeleton`](https://github.com/elk-zone/elk/blob/65557fab5e81f39f5100126c2b432406705f378b/components/status/edit/StatusEditHistory.vue#L42-L44) fits into the overall site.

The actual import hierarchy is:

```
+- components/status/edit/StatusEditHistorySkeleton.vue
+- components/status/edit/StatusEditHistory.vue
+- components/status/edit/StatusEditIndicator.vue
+- components/status/StatusDetails.vue
+- pages/[[server]]/@[account]/[status].vue
```

But with auto-imports there are no _direct_ links between the files, so your options are:

- hope your IDE will determine the real component source or find usages
  - which may only work if the component filename matches the full auto-import
  - plus, this can take significant time if an auto-import or usages have not already been found and cached
- go via the `.nuxt/components.d.ts` file
  - which will have ~4x the number of entries as components, plus globals
- perform a manual search using the component's full name

Note that I'm not taking sides here, I'm merely highlighting:

- the ratio of **ease of importing** to **ease of locating** diminishes as the project grows larger
- you should understand the mechanisms in case you later decide to refactor

### Very large projects

I'm currently working with [Forgd](https://forgd.com/) on their web app, which has about 75 routes, 34 component folders (not much organisation yet), ~280 components, and additional `.story.vue` files.

We recently refactored to layers (making it **much** easier to locate files) and are currently reviewing auto-imports.

Here's an example of both **core** and **domain** files in our folder structure:

```
+- core
|   +- components
|   |   +- chart
|   |   +- ui
|   |   |   +- UiButton.vue
|   |   +- ...
|   +- ...
+- layers
    +- ...
    +- token-designer
    ⋮   +- components
        |   +- td
        |   ⋮   +- adjust
        |       ⋮   +- tab
        |           ⋮   +- TdAdjustTabPriceAndMarketCapPerformance.vue
        +- pages
        ⋮   +- token-designer
            ⋮   +- adjust
                ⋮   +- simulating-post-tge-pops.vue
```

Things to note about the above:

- a `core` layer contains all global concerns
- we rely on prefixes (such as `Td`) to keep naming sane
- we use aliases (such as `#tokendesigner`) to target layers


What's interesting regarding the deep nesting above, is that any of the following are valid auto-import locations if path-prefixing is turned on – but IDE tooling may only would likely only locate 4 of these files:

```
components                -->  TdAdjustTabPriceAndMarketCapPerformance
 
components/td             -->  TdAdjustTabPriceAndMarketCapPerformance
                               AdjustTabPriceAndMarketCapPerformance  
 
components/td/adjust      -->  TdAdjustTabPriceAndMarketCapPerformance
                               AdjustTabPriceAndMarketCapPerformance  
                               TabPriceAndMarketCapPerformance        
 
components/td/adjust/tab  -->  TdAdjustTabPriceAndMarketCapPerformance
                               AdjustTabPriceAndMarketCapPerformance  
                               TabPriceAndMarketCapPerformance        
                               PriceAndMarketCapPerformance            
```

Note also, without short prefixes, we could be typing component names like the following!

```html
td:   <TokenDesignerAdjustTabPriceAndMarketCapPerformance />
ad:   <AutoDistributionConfiguratorStrategyDetails />
amm:  <AutomatedMarketMakingStrategyCompleteCta />
```

We are currently considering:

- auto-importing only core-level components, and without auto-prefixing, i.e. `core/forms/UiButton`
- moving away from auto-importing domain-level components, i.e. `PriceAndMarketCapPerformance`
- moving towards local index files to export related sets of components

If that was the case, domain-level imports / usage may look like this:

```vue
<script >
import {
  PriceAndMarketCapPerformance,
  ...
} from '#tokendesigner/components/adjust'
</script>

<template>
  <PriceAndMarketCapPerformance />
  <UiButton />
  ...
</template>
```

It's a very small amount of extra code, but:

- the major IDEs add imports automatically
- a `Cmd-Click` is guaranteed to take you directly to the component
- VSCode can be coerced into supporting `.vue` file refactoring 

## IDE integration

### Preparation

Note that before you can even begin to see the benefits of type completion you will need to either build the project or run `nuxi prepare` to generate the stub files in Nuxt's build folder `.nuxt/`.

If you don't do that, code-completion is not going to work at all!

### Overview

So how do the two main IDEs, VSCode and WebStorm work with these magically auto-imported files?

Well, not all IDEs are not created equal, and frameworks authors cater differently to different IDEs.

In the case of auto-imports, both VsCode and WebStorm:

- can instantly resolve explicit imports
- can guess at implicit imports, or go via `.nuxt/components.d.ts` (can take time to search the codebase)

Also:

- WebStorm has the edge on refactoring, but VS code can be coerced into playing nice
- Volar under WebStorm is fairly hit-and-miss; sometimes it works, sometimes it doesn't

### Support

#### Navigation

Navigate to source from usage in `.vue` file:

- `Cmd-Click` component tag
  - **WebStorm** – navigates to `.nuxt/components.ts`, then you need to manually click the import
  - **VSCode** – navigates to the component, via `.nuxt/components.ts`
- `Right-Click`
  - **WebStorm** – Go To > Declaration or Usages
  - **VSCode** – Go to Definition

Find all usages from usage in `.vue` file:

- **WebStorm** – `Right-Click` > Find Usages; shows in popup
- **VSCode** – `Right-Click` > Go to References; shows [inline](https://code.visualstudio.com/docs/editor/editingevolved#_peek)

Find usages from Project Explorer:

- **WebStorm** –  `Right-Click` > Find Usages; shows "Nothing found in 'All Places'"
- **VSCode** –  `Right-Click` > Find File References; shows `.nuxt/components.d.ts`

#### Refactoring

Implicit import refactoring:

- TBC

Explicit import refactoring:

- **WebStorm** – updates any combination of `.vue` or `.ts` renames or moves
- **VSCode** doesn't update  `.vue` to `.vue` renames or moves

To work around VSCode's limitations, you can re-export `.vue` components from an `index.ts` file, and it will update `.vue` imports if the `index.ts` file or containing folders are renamed or moved:

```ts
// components/somewhere/index.ts
import SomeComponent from './SomeComponent'
...

export {
  SomeComponent,
  ...
}
```
```vue
<script>
import { SomeComponent } from '~/components/somewhere'
</script>
```

## Summary

### Trade-offs

Nuxt's auto-import **defaults** bring with them some subtle tradeoffs – which can be magnified as the project grows:

| Situation                             | Issues                                                                   |
|---------------------------------------|--------------------------------------------------------------------------|
| Root vs nested folders                | Inconsistencies between root and nested components                       |
| Missed the documentation on naming    | Only same-named components auto-import                                   |
| Small number of components            | Easy to find                                                             |
| Large number of components            | More nesting required / harder to find                                   |
| Low nesting                           | Simple names                                                             |
| Deep nesting                          | Highly-concatenated names                                                |
| Long names                            | Hard to locate / multiple possible locations                             |
| Auto-importing                        | No direct link in IDE / will need to search                              |
| Not-named the same as the path prefix | IDE may not find file / or may take a long time to find file             |
| Moving existing prefixed components   | Will break your app if you don't understand prefixing                    |
| Want to refactor component path       | Will need to manually search and rename component names                  |
| How much typing is saved              | Adding shorter imports once vs typing longer component names often       |
| Leveraging import context             | Limited local imports vs filtering all globally available imports        |
| Using layers                          | Local imports may be in some cases be simpler than unwieldy auto-imports |
| Want to leverage IDE tooling          | Lack of explicit imports may break tools around usage                    |

And the larger your application gets, the **less** magic you want and the **more** safety you need, so it's important to understand the pros and cons, so you can make the right choices for your project and team.

### Recommendations

For small or medium projects, auto-imports are fine. But you should consider what might happen if your project grows.

I generally prefer to turn off path-prefixing, as then you're free to decide on your own prefixing strategy, and it makes it easier to refactor entire subtrees of code should you decide to.

For larger projects I feel that [global concerns](https://davestewart.co.uk/blog/nuxt-layers/#global-concerns) (such as UI components, or site furniture) and some 3rd-party code absolutely benefit from being auto-imported, but it's clearer if domain-level concerns are imported explicitly. You can use `index` files for this to reduce the lines of code that would be added to individual files.

Not only are the relationships between the files clearer, but IDE and tooling support is guaranteed, and it's significantly easier to get to grips with a new project (or old project you haven't looked at in a while!).

### Last words

Maybe you're happy with auto-imports and don't feel the need to change. Or maybe auto-imports never quite worked for you, but at least you now understand them better. Or maybe it's somewhere between – which is ironically where you might end up if your project gets large enough, and you push the boundaries of auto-importing.