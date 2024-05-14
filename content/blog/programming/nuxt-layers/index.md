---
description: Build sites that scale by structuring code by domain, not concern
date: 2024-05-14
media:
  opengraph: ./images/opengraph.png
  featured: ./images/featured.png
  thumbnail: ./images/thumb.png
---

# Modular site architecture with Nuxt layers

## Intro

Nuxt 3 introduces a new paradigm called "Layers" that the docs [describe](https://nuxt.com/docs/getting-started/layers) as "a powerful system that allows you to extend the default files, configs, and much more". Whilst this explanation may be _technically_ accurate, the emphasis on "extending" overlooks a more everyday use case, that of "structuring" your application by *domain (vs concern)*.

To get you up-to-speed on the concepts, I'll begin with some theory:

- [Site structuring](#site-structuring)<br>
  A comparison of structuring by concern vs by domain
- [Nuxt layers intro](#nuxt-layers-intro)<br>
  A brief intro to Nuxt layers and how they work

Then, I'll share actionable steps to migrate an existing Nuxt application: 

- [Demo](#demo)<br>
  A demo repo with tagged commits following a layers migration
- [Nuxt concerns](#nuxt-concerns)<br>
  How individual Nuxt concerns work or need to be reconfigured when moved to layers
- [Site migration](#migrating-an-existing-site)<br>
  Advice and steps to successfully migrate your own Nuxt 3 site to layers

## Site structuring

Let's take a look at two main ways to structure sites and apps; by [concern](#by-concern) and by [domain](#by-domain).

> Note that the choice of words "domain" and "concern" could easily be "feature" and "responsibility".
>
> *Feel free to use whatever terms make the most sense to you.*

### By concern

Most Vue and Nuxt projects are born of simple starter templates, which group files by *concern* (`pages`, `components`, etc):

```
+- src
    +- components
    |   +- blog
    |   +- home
    +- content
    |   +- blog
    +- pages
    |   +- blog.vue
    |   +- home.vue
    +- ...
```

This structure is simple to understand and somewhat invisible when your site or application is small.

However, as sites grow in size, this grouping obfuscates more *natural* relationships (i.e. everything related to `blog`) which makes it hard to understand what your site or application actually *does*.

### By domain

At a certain size of site (and actually, not that big!) it becomes more intuitive to silo files by *domain* (`blog`, `home`, etc):

```
+- src
    +- blog
    |   +- components
    |   +- content
    |   +- pages
    +- home
    |   +- components
    |   +- pages
    +- ...
```

Transposing physical locations has tangible benefits...

File management:

- domains (`blog`, `home`, etc) become self-contained units
- related code will generally be located in a sibling folder
- less open folders / scrolling / jumping in your IDE

Configuration and settings:

- domain config is discrete from from global config
- simpler, smaller, domain entry points, rather than one huge config file
- minimal mixing of global and local concerns

Developer experience:

- PRs are simpler as most files will exist downstream from a common folder
- you can more easily develop new features or site sections
- you can more easily turn complete features on / off
- domains can be broken out further if they get too large

The conceptual shift from concern to domain may feel familiar to you [if you moved](https://vuejs.org/guide/extras/composition-api-faq.html#more-flexible-code-organization) from Vue's Options API to the Composition API; rather than concerns being striped across a sprawling `options` structure, they can be declared and grouped together as domains.

##  Nuxt layers intro

So it turns out that Nuxt Layers – along with their extension superpowers can also structure a Nuxt app by _domain_.

Nuxt Layers can be viewed as "mini" applications which are combined to create the "main" application.

Each layer:

- may contain `pages`, `components`, `server` folders, etc
- indicates it's a layer using a `nuxt.config.ts` file

Then the main `nuxt.config.ts` tells Nuxt where your layers are.

### Example

For example, a small personal site might be structured as follows:

```
+- src
    +- base                          <-- global, shared or one-off functionality
    |   +- ...
    +- blog                          <-- nuxt content configuration, markdown articles
    |   +- ...
    +- home                          <-- one-off components, animation plugin and configuration
    |   +- components
    |   |   +- Hero.vue
    |   |   +- Services.vue
    |   |   +- Testimonials.vue
    |   |   +- ...
    |   +- pages
    |   |   +- index.vue
    |   +- plugins
    |   |   +- ...
    |   +- nuxt.config.ts
    +- ...
    +- nuxt.config.ts 
```

The top-level layers silo related `pages`, `components`, `plugins`, even `config`.

The root-level `nuxt.config.ts` collates these layers via [unjs/c12](https://github.com/unjs/c12?tab=readme-ov-file#extending-configuration)'s `extends` keyword:

```ts
export default defineNuxtConfig({
  extends: [
    './base',
    './blog',
    './home',
  ]
})
```

Note that c12 can also extend from [packages and repos](https://nuxt.com/docs/getting-started/layers#usage) – but for the sake of this article, I'm only covering folders.

## Demo

So that's the theory covered, *let's see some code!*

In order to provide the actionable advice I mentioned, I wanted to share a real-world migration – so I've taken Sebastian Chopin's [Alpine](https://github.com/nuxt-themes/alpine/) theme demo – which gives me some content to work with – and progressively migrated it from a _concern_-based to a _domain_-based setup.

The milestones in the migration are:

- `1.0` – **[Alpine starter repo](#)**<br>
  A simple, content-oriented repo extending the external theme
- `1.1` – **[Combined theme and content](#)**<br>Local content and external theme in a traditional flat folder structure (by concern)
- `1.2` – **[Manually layered base, theme and content](#)**<br>
  Initial migration of the base, theme and content to basic Nuxt Layers (by domain, but somewhat brittle)
- `1.3` – **[Automatically layered base, theme and content](#)**<br>
  Additional work to migrate config, paths to something more robust using Nuxt Layers Utils (by domain, but flexible)

You can clone or browse the repo from here:

- [github.com/davestewart/nuxt-layers-demo](https://github.com/davestewart/nuxt-layers-demo)

And be sure to skim the official Layers docs before continuing:

- [Get Started » Layers](https://nuxt.com/docs/getting-started/layers)
- [Guide » Authoring Nuxt Layers](https://nuxt.com/docs/guide/going-further/layers)

## Nuxt concerns

Now that you understand how a layer-based site is structured, let's review any specifics for Nuxt's concerns to work correctly under this new paradigm:

- [Framework folders](#framework-folders)
- [Imports](#imports-and-exports)
- [Pages and routes](#pages)
- [Nuxt Content](#nuxt-content)
- [Tailwind](#tailwind)
- [Config](#config)


### Framework folders

Core framework folders [within layers](https://nuxt.com/docs/guide/going-further/layers) generally work as expected:

```
+- src 
    +- some-layer
        +- components             <-- autoloaded
        +- composables            <-- autoloaded
        +- layouts                <-- adds layouts
        +- pages                  <-- creates routes
        +- plugins                <-- autoloaded
        +- public                 <-- copied to output
        +- server                 <-- adds middleware, api routes, etc
        +- utils                  <-- autoloaded
```

This means you can break out concerns across layers **as you see fit** – and Nuxt will stitch them into the final app.

### Imports and exports

Given that layers are generally self-contained, importing is simplified:

```ts
// src/dashboard/components/User.vue
import { queryUser } from '../services'
```

If you want to import from another layer (and you opted for a [flat](#folder-structure) layer structure) you essentially get aliases for free:

```ts
// src/profile/components/User.ts
import { queryUser } from '~/dashboard/services'
```

Otherwise, you can set up [aliases](https://nuxt.com/docs/api/nuxt-config#alias) manually:

```ts
// src/layers/profile/components/User.ts
import { queryUser } from '#dashboard/services'
```

If you want to expose only certain dependencies from a layer, consider an index file:

```ts
// src/dashboard/index.ts
export * from './services/foo'
export * from './utils/bar'
```
```ts
// src/profile/components/User.ts
import { queryUser } from '~/dashboard'
```

And regarding [auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports) – remember they only import  `components`, `composables` and `utils` folders.

You may need to configure additional imports using [`config.imports.dirs`](https://nuxt.com/docs/api/nuxt-config#dirs).

### Pages and routes

Layers can happily contain their own pages and define navigable routes.

However, any `pages` folders must contain **full folder paths** – as the layer name is **not** automatically prepended:

```ts
+- src
    +- blog
    |   +- pages
    |       +- blog             <-- route starts here, i.e. /blog
    |           +- index.vue
    |           +- ...
    +- home
        +- pages
            +- index.vue        <-- route starts here, i.e. /
```

<!--
I looked into whether it would be possible using the [`pages:extend`](https://nuxt.com/docs/guide/going-further/custom-routing#pages-hook) hook, but unfortunately in Nuxt's own internal [`resolvePagesRoutes`](https://github.com/nuxt/nuxt/blob/main/packages/nuxt/src/pages/utils.ts#L51-L66) function overwrites same-named pages in separate folders. I suspect the only way round this would be a new layer-specific option such as `pagesPrefix`.
-->

### Nuxt Content

Nuxt Content plays nicely with Nuxt Layers.

This means you can silo domain-specific content along with its related `pages`, `components`, etc, rather than treat all content as a global concern – which might suit if your site has multiple content-driven sections such as Blog, Guide, etc.:

```
+- src
    +- blog
    |   +- ...
    +- guide
        +- components
        |   +- ...
        +- content
        |   +- index.md
        |   +- ...
        +- pages
        |   +- ...
        +- nuxt.config.ts

```

Note that unlike [pages](#pages-and-routes) you **can** configure content without re-nesting the folder:

```ts
// src/blog/nuxt.config.ts
export default defineNuxtConfig({
  content: {
    sources: {
      blog: {
        driver: 'fs',
        base: `./blog/content`, // referenced from root
        prefix: `/blog`,
      }
    }
  }
})
```

### Tailwind

At the time of writing, Nuxt's [Tailwind module](https://github.com/nuxt-modules/tailwindcss) does not pick up layers (though it's a [simple](https://nuxt.com/docs/guide/going-further/layers#multi-layer-support-for-nuxt-modules) PR).

But you can easily tell Tailwind where your CSS classes can be found:

```js
// tailwind.config.ts
export default {
  content: [
    './core/components/**/*.vue',
    './layers/**/pages/**/*.vue',
    './layers/**/components/**/*.vue',
    ...
	],
  ...
}
```

### Config

There are a few things to think about when considering config:

- where to locate each file
- what each file should contain
- how to correctly resolve paths
- how to keep code clean

#### Layer configs

Layers allow you to move domain-specific config to the individual layer config files:

```ts
// src/blog/nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    'markdown-tools'
  ],
  markdownTools: {
    ...
  }
})
```

This can be great for isolating domain specific functionality, and at the same time simplifying your root config.

Your final config will be intelligently-merged (via [unjs/defu](https://github.com/unjs/defu)).

#### Base config

You might also consider moving infrequently-accessed folders and settings to a [base](#folder-structure) layer: 

```ts
// src/base/nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: { ... },
  modules: [ ... ],
  plugins: [ ... ],
  nitro: { ... },
  ...
})
```

This de-clutters root-level folders and config, making it simpler to understand the rest of your app. 

Note that if you move core folders you will need to reconfigure some core [dir settings](#path-configuration). 

#### Path resolution

Path resolution with layers can be tricky, because of differing targets and formats across multiple folders and settings:

```ts
export default {
  foo: resolve('../some-folder'),
  bar: 'some-layer/some-folder',
  baz: '~/other-layer',
}
```

As there's a lot to cover, I'll save the detail for the [migration](#migrating-an-existing-site) section.

#### Keeping code clean

For complex configuration that may differ only _slightly_ across layers (such as [hooks](https://nuxt.com/docs/api/nuxt-config#hooks)) you might consider helpers:

```ts
// src/base/utils/layers.ts
export function defineLayerConfig (path: string, options?: LayerOptions) {
  const output: ReturnType<typeof defineNuxtConfig> = {}
  if (options.hooks) { ... }
  if (options.foo) { ... }
  return output
}
```

Call from layers like so:

```ts
// src/blog/nuxt.config.ts
import { defineLayerConfig } from '../base/utils/layers'

export default defineNuxtConfig ({
  ...defineLayerConfig(__dirname, {
    hooks: { ... },
    foo: [ ... ] 
  })
})
```

> Note that you **cannot use path aliases** such as `~` in config `import` statements – because Nuxt will not yet have compiled them into its own`.nuxt/tsconfig.json` file.

## Migrating an existing site

So you now understand the concepts, you have an idea of the updates to make, but you need a plan to do it.

Below, I've outlined my best advice, including:

- [Folder structure](#folder-structure)
- [Global concerns](#global-concerns)
- [Path configuration](#path-configuration)
- [Migration steps](#migration-steps)
- [Tips](#tips)

### Folder structure

The first thing to decide when migrating your site to layers is your ideal folder structure.

You can move some or all concerns to layers:

<div style="overflow-x: auto;">
<table style="margin: 0 !important">
<thead>
<tr>
<th style="text-align:center">Partial</th>
<th style="text-align:center">Hybrid</th>
<th style="text-align:center">Flat</th>
</tr>
</thead>
<tbody>
<tr>
<td>
<pre class="language-text"><code>+- src
    +- assets
    |
    +- layers
    |   +- blog
    |   |   +- ...
    |   +- home
    |       +- ...
    |
    +- layouts
    +- plugins
    +- components
    +- nuxt.config.ts
</code></pre>
</td>
<td>
<pre class="language-text"><code>+- src
    +- core
    |   +- ...
    |
    +- layers
    |   +- blog
    |   |   +- ...
    |   +- home
    |       +- ...
    |
    +- nuxt.config.ts
</code></pre>
</td>
<td>
<pre class="language-text"><code>+- src
    +- blog
    |   +- ...
    +- core
    |   +- ...
    +- home
    |   +- ...
    |
    +- nuxt.config.ts
</code></pre>
</td>
</tr>
</tbody>
</table>
</div>

I prefer the hybrid or flat structure, but there's nothing stopping you starting simple and changing your mind later.

### Global concerns

As mentioned [earlier](#base-config) it's nice to be able to silo those domain-*less* folders and config options.

For concerns which take more of a foundational role, I group under `base` or `core`:

```
+- src
    +- core
    |   +- assets
    |   +- middleware
    |   +- modules
    |   +- public
    |   +- utils
    +- ... 
```

If a concern spans multiple domains, or isn't specific enough to get its own domain, `site` feels like a nice bucket:

```
+- src
    +- ... 
    +- site
        +- components
        |   +- Footer.vue
        |   +- Header.vue
        +- pages
        |   +- about.vue
        |   +- contact.vue
        +- ...
```

Note that if you move any default folders, you will need to tell Nuxt:

```ts
// src/nuxt.config.ts
export default defineNuxtConfig({
  publicDir: 'core/public',
  dir: {
    assets: 'core/assets',
    modules: 'core/modules',
    middleware: 'core/middleware',
  },
})
```

### Path configuration

The correct path configurations (**target** and **format**) are _critical_ to Nuxt finding concerns moved to layers.

#### A review of Nuxt's path-related config

Nuxt's path configuration can be driven by a variety of path formats:

| Type           | Code                                | Notes                               |
|----------------|-------------------------------------|-------------------------------------|
| Absolute       | `Path.resolve('layers/some-layer')` | You can also use `import.meta.url`  |
| Root-relative  | `layers/some-layer`                 |                                     |
| Layer-relative | `some-layer`                        |                                     |
| Alias          | `~/layers/some-layer`               | Expands internally to absolute path |
| Glob           | `some-layer/**/*.vue`               | Expands to an array of paths        |

And here's a sample of the differences between some of [25+ path-related](https://github.com/davestewart/nuxt-layers-utils#nuxt-config) config options (along with some quirks):

| Name                                                             | Abs | Root | Layer | Alias | Glob | Notes                                            |
|------------------------------------------------------------------|:---:|:----:|:-----:|:-----:|:----:|--------------------------------------------------|
| [`extends`](https://nuxt.com/docs/api/nuxt-config#extends)       |     |  ●   |   ●   |       |      | Layers can be nested (mainly useful for modules) |
| [`dir.*`](https://nuxt.com/docs/api/nuxt-config#dir)             |  ●  |  ●   |       |       |      |                                                  |
| [`dir.public`](https://nuxt.com/docs/api/nuxt-config#public)     |  ●  |  ●   |       |       |      | First public folder found wins                   |
| [`imports.dirs`](https://nuxt.com/docs/api/nuxt-config#dirs)     |     |  ●   |       |       |      | Only supported in root config                    |
| [`modules`](https://nuxt.com/docs/api/nuxt-config#modules)       |  ●  |      |       |       |      |                                                  |
| [`plugins`](https://nuxt.com/docs/api/nuxt-config#plugins-1)     |  ●  |  ●   |       |   ●   |      |                                                  |
| [`components`](https://nuxt.com/docs/api/nuxt-config#components) |     |      |       |   ●   |      |                                                  |
| [`ignore`](https://nuxt.com/docs/api/nuxt-config#ignore)         |     |      |       |       |  ●   |                                                  |

#### Advice on configuring paths

There is also the question of _where_ to configure your paths; in the **root** and/or **layer** configuration?

My experience has led me to the conclusion that ***it's just simpler to configure all path-related config in the root***:

- it's easier to compare and copy/paste paths between options
- you're not searching through multiple folders and layer config files
- path resolution is consistent between layers of differing depths

As such, your core `nuxt.config.ts` file might look something like this:

```ts
import { resolve } from 'pathe'

export default definedNuxtConfig({
  extends: [
    'core',
    'layers/blog',
    'layers/site'
  ],

  alias: {
    '#core': resolve('core'),
    '#blog': resolve('layers/blog'),
    '#site': resolve('layers/site'),
  },

  publicDir: 'core/public',

  dir: {
    assets: 'core/assets',
    modules: 'core/assets',
    middleware: 'core/assets',
  },

  components: [
    '~/layers/site/extra',
  ]
})
```

Is this a little verbose? Yes. Is it succinct and accessible? Also, yes.

If you want this even simpler, use [Nuxt Layers Utils](https://github.com/davestewart/nuxt-layers-utils) to abstract the implementation to simple one-liners, i.e.:

```ts
{
  alias: layers.alias(),
}
```

See the [Tips](#tips) section for a full example.

### Migration steps

Migrating an existing site isn't difficult, but it can be a little risky and frustrating. 

You should treat it like any other major refactor and aim to go slow; migrate feature-by-feature, folder-by-folder, or file-by-file – as your build **will** break – and there will be times when you don't know why.

Set aside a few hours for a small site, and a day or more for a larger, in-production one.

Before you start:

- review key [Nuxt concerns](#nuxt-concerns) to get a good overview of each
- create a `migration` branch to isolate your updates from your working code

Make a plan to work on:

- global concerns, such as `base`
- specific domains, such as `blog`, `home`, etc 

To start:

- create aliases for all layers
- use an IDE like Webstorm which rewrites your paths as you move files

Then, tackle a single domain / layer at a time:

- create the new layer:
  - add a top-level folder
  - add the `nuxt.config.ts`
  - update the root `extends` array
- move concerns in an order that is likely to break only one thing at a time:
  - `config`:
    - moving settings and modules should be straightforward
    - some configuration (i.e. [Nuxt Content](#nuxt-content)) may need reconfiguring
  - `pages`:
    - remember routes are not prefixed with the layer name
    - check imports as you move 
  - `components`:
    - if imported, review paths
    - if auto-imported, should just work
    - if not, you may need to add to configure `components` (the config option) paths
  - `content`
    - decide whether content will be global or local
    - remember Nuxt Content components need to live in `components/content`
- the things to check as you move are:
  - `paths`:
    - remember `Path.resolve()`'s context whilst consuming `config` is your project's root folder
    - layer-level paths may still need to be `./<layer>/<concern>` vs `./<concern>`
  - `imports`:
    - global imports may flip from `~/<concern>/<domain>` to `~/<layer>/<concern>`
    - local imports may become `../<concern>`
  - `config`:
    - config `import` statements **cannot** use path aliases; you may need to use `../layer/concern`


Some additional points as you work:

- commit your changes after each successful update or set of updates
- properly **read** and try to _understand_ terminal and browser console errors

Gotchas:

- layer config watching is buggy (intermittent at best)
- you may need to restart the dev server from time to time
- if a change causes an error, it's not always clear why

### Tips

#### Use Nuxt Layers Utils

To simplify path-related configuration, use [Nuxt Layers Utils](https://github.com/davestewart/nuxt-layers-utils) to declare your layers and auto-generate config:

```ts
// /<your-project>/nuxt.config.ts
import { useLayers } from 'nuxt-layers-utils'

const layers = useLayers(__dirname, {
  core: 'core',
  blog: 'layers/blog',
  site: 'layers/site',
})

export default defineNuxtConfig({
  extends: layers.extends(),
  alias: layers.alias('#'),
  ...
})
```

#### Group related config

Lean on [unjs/defu](https://github.com/unjs/defu) to create smaller, related sections of config, then merge them together on export:

```ts
// src/core/nuxt.config.ts
const config = defineNuxtConfig({ ... })
const modules = defineNuxtConfig({ ... })
const build = defineNuxtConfig({ ... })
const ui = defineNuxtConfig({ ... })

export default defu({
  config,
  modules,
  build,
  ui,
})
```

#### Isolate layers

Use comments or conditionals to toggle layers:

```ts
// src/nuxt.config.ts
export default defineNuxtConfig({
  extends: [
    './base',
    // './home',
    isDev && './blog',
  ]
})
```

## Last words

Hopefully this section gives you some solid ideas on how to modularise your site or app – and if I've skipped over anything – ideas on how to approach it. Layers are generally quite logical and predicable, with a minor tradeoff of a little more configuration.

And lastly, kudos to the UnJS and Nuxt team for the work they've done here.

<!--
## Resources

Links to resources here
-->
