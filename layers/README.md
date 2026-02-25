# Layers

## Overview

This project uses [Nuxt's layers system](https://nuxt.com/docs/4.x/getting-started/layers#layer-priority) to enable hot-swappable application theming.

The architecture supports arbitrary `themes` sub-folders which:

- build on core functionality provided by Nuxt and Nuxt Content
- allow for progressive overloading of the `base` theme logic and presentation

## Structure

```text
+ app                         1️⃣ Core functionality
|   +- assets
|   +- plugins
|   +- utils
|
+- layers
		|
    +- 1_content           		2️⃣ Nuxt Content functionality
    |		+- composables
    |		+- server
    |		+- store
    |		+- ...
    |		+- nuxt.config.ts
    |
    +- 2_base									3️⃣ Base theme functionality (content, media, icons, common)
    |		+- components
    |		+- composables
    |		+- nuxt.config.ts
    |
    +- 3_themes								4️⃣ Primary theme functionality (routes, styling, animation, etc)
        |
        +- main								🔴 Main theme (core brand, whistles and bells)
        |		+- assets
        |		+- components
        |		+- layouts
        |		+- pages
        |
        +- pico								🟡 Pico theme (simple example, just a few files)
        |		+- ...
        |
        +- ...								🟢 Other themes (grids, 3d animation, ai-designed, etc...)
        |
        +- nuxt.config.ts			⚙️ Build and theme orchestration
```



#### Technical note

Note that Nuxt has a specific [priority ordering](https://nuxt.com/docs/4.x/getting-started/layers#layer-priority) for layers / extension, which goes like this:

1. `app/` folder
2. `layers/` folder (later layers win)
3. `extends` config (earlier entries win)

This project leverages `layers/` over `extends` purely for the conventional aspect.
