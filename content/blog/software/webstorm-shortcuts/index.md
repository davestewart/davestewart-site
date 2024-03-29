---
description: Essential WebStorm keyboard shortcuts to make you the most productive developer in the office
date: 2022-04-21 # was 2022-02-07
media:
  thumbnail: webstorm-splash.png
  featured: webstorm-splash.png
---

# WebStorm shortcuts for lightning productivity

WorkFlowy is the most powerful web development IDE there is. If you want to match power with speed get your hands on WebStorm's extensive and intuitive keyboard shortcuts.

Below, I've listed 75+ essential shortcuts across multiple application areas. Where I've added or changed a shortcut I've added "customised" in brackets afterwards.

See my other article on WebStorm's [features](/blog/webstorm-features) for detailed information on many and _more_ of the features listed below.

<NavToc />

## Navigation

<NavToc section="navigation" level="3" />

### Project

Files

- `Cmd` + `E` - Recent files
- `Cmd` + `Shift` + `E` - Recent locations
- `Cmd` + `Shift` + `O` - Open file
- `Cmd` + `Shift` + `N` - Create scratch file

Panels

- `Cmd` + `1` - Toggle Project panel
- `Cmd` + `Shift` + `1` - Select file in Project _(customised)_
- `Alt` + `F1` - Go to current file in... project, explorer, changes, browser, etc
- `Ctrl` + `Tab` - Show thw Switcher popup

Projects

- `Cmd` + `Shift` + `P` - Recent projects
- `Cmd` + `Shift` + `W` - Close project _(customised)_

### Editor

Code / Markup


- `Cmd` + `B` / `Cmd` + `Click` - go to declaration / find usages (depending on context)
- _Works in all [language](https://www.jetbrains.com/help/webstorm/application-development-guidelines.html) types, even across boundaries!_

Cursor

- `Cmd` + `[` - Go to previous edit point
- `Cmd` + `]` - Go to next edit point

## Editing

<NavToc section="editing" level="3" />

### Selection

Words

- `Alt` + `double-click` - Select multiple words
- `Ctrl` + `G` - Select next same word (forward)
- `Ctrl` + `Shift` + `G` - Deselect next same word (backward)
- `Ctrl` + `Cmd` + `G` - Select all same word

Regions

- `Alt` + `Up`/`Down` - Expand / reduce selection bounds
- `Alt` + `drag` vertically - Select multiple blocks or starts/ends of lines

Multi-caret operations (video [here](https://www.youtube.com/watch?v=PIqBf7Ekjgk))

- _Start typing to modify text on all lines_
- `Arrow` keys - Move carets
- `Enter` - Add carriage returns
- `Delete` - Remove text
- `Home` / `End` - Jump to home / end on all lines
- `Esc` / `Click` - Clear selection

Modifications once selected ([Smart Keys](https://www.jetbrains.com/help/idea/settings-smart-keys.html))

- Type `< ( { [  " '` - Wrap with the corresponding pair, i.e. hit `[` to get `[selection]`

### Clipboard

Multi-caret / range

- `Cmd` + `C` - Copy text / ranges
- `Cmd` + `V` - Paste into / over ranges

Multi-clipboard

- `Cmd` + `Shift` + `V` - Paste recent (popup)

### Modification

Formatting

- `Ctrl` + `W` - Toggle soft-wraps _(customised)_
- `Cmd` + `Alt` + `L` - Reformat code
- `Cmd` + `Shift` + `U` - Toggle case

Commenting

- `Cmd` + `/` - Inline comment / uncomment
- `Cmd` + `Shift` + `/` - Block comment / uncomment

Move lines

- `Alt` + `Shift` + `Up`/`Down` - Move line up / down
- `Cmd` + `Shift` + `Up`/`Down` - Move block (statement, element) up / down

Modify lines

- _Place caret anywhere within line then_
- `Cmd` + `C` - Copy line
- `Cmd` + `X` - Cut line
- `Cmd` + `D` - Duplicate selection / line
- `Cmd` + `Backspace` - Delete line

### Markdown

**Yes, Markdown!**

Note that some Markdown shortcuts are a little unintuitive, so I recommend you review and [change them](#setup).

Formatting

- `Cmd` + `I` - Italic
- `Cmd` + `B` - Bold

Insert (also `Ctrl` + `Enter`)

- `Cmd` + `Shift` + `L` - Link _(customised from `Cmd` + `U`)_
- `Cmd` + `Shift` + `C` - Code
- `Cmd` + `Shift` + `I` - Image
- `Cmd` + `Shift` + `T` - Table

You can access additional Markdown functionality via:

- the Right Click Menu
- the Actions palette via `Cmd` + `Shift` + `A`:
  - type **"Markdown"** to see actions
  - type the formatting e.g. **"Align Right"**


### Tips

- Rename an opening / closing HTML / JSX / XML tag to rename its corresponding pair
- Typing an attribute quote will automatically pair and position the caret, i.e. `attr="` &gt; `attr="<caret>"`
- For mass editing:
  - Look to select patterns, i.e. `: '` or `= [` or `class=`
  - Then `Ctrl` + `G` to select same occurrences
  - Then `Arrows`, `Home`, `End`, expand selection to move around
  - Then start typing, toggle case, copy and paste, etc
  - _You can get real creative!_
  
## Assistance

<NavToc section="assistance" level="3" />

### Search

Text

- `Cmd` + `Shift` + `F` - Find text in path
- `Cmd` + `Shift` + `R` - Replace text in path

Symbols

- `Cmd` + `O` - Find class
- `Cmd` + `Alt` + `O` - Find symbol

Files

- `Alt` + `F7` - Find usages (whilst a file is selected)

### Intelligence

Coding assistance

- `Cmd` + `P` - Show function parameters
- `Ctrl` + `Space` - Show completions
- `Alt` + `Enter` - Show intentions

Code refactoring

- `Ctrl` + `T` - Refactor this...
- `Cmd` + `Alt` + `V` (then `Up` / `Down`) - Extract variable
- `Cmd` + `Alt` + `C` (then `Up` / `Down`) - Extract constant

General refactoring

- `F6` - Move file / namespace / function / variable
- `Shift` + `F6` - Rename file / namespace / function / variable
- `Drag` file - Move / refactor file

### Code generation

Live templates

- `Cmd` + `J` - Show available templates, then `Tab` to insert
- Or simply type template key (i.e. `forin`) + `Tab` - Add template with placeholders
  - Use `Tab` to jump between placeholders

Postfix completion

- Type `<expr>.log` + `Tab` - convert expression to `console.log(<expr>)` 
- Type `<expr>.if` + `Tab` - convert expression to `if (<expr>) { ... }`

HTML

- `Cmd` + `Alt` + `T` > `T` - Surround with tag (then type tag name to fill in)
- `<expr>` + `Tab` - Generate tags using Emmet
  - Use `Enter` to jump between placeholders

## Application

<NavToc section="application" level="3" />

### Panels

Search

- `Cmd` + `Shift` + `A` - Find action (any application command; tip: use this any time you can't remember something!)
- `Shift` + `Shift` - Find anything (files, classes, assets, shortcuts, preferences, etc)

Preferences

- `Cmd` + `,` - Show preferences dialog
- Type anything - Find preference

### Tips

Click any list (Project hierarchy, Code Structure, Find Results, etc) then:

- Start typing to filter / highlight
- Use fuzzy matching, i.e. `pn` to find `[P]age[N]ode`
- Use `/` to disambiguate folders, like `s/c/app`

## Setup

There are two main ways to change or add your own shortcuts.

Using preferences

- go **"Preferences > Keymap"**, then either

  1. Use the tree to find the Action manually
  2. Use the search input to filter by name
  3. Use the "Find Actions by Shortcut" tool find the action by typing the shortcut

- For plugins:

  1. locate the plugin via **"Keymap > Plugins > [Plugin Name]"**

Using the Actions palette

1. `Cmd` + `Shift` + `A` to show the Actions palette
2. Type the name of the action you want to find
3. Select the action then hit `Alt` + `Enter` to show the "Keyboard Shortcut" dialog
4. Press the keyboard shortcut you want to use

## Touchbar

### Custom touchbar icons

For touchbar Macs, unfortunately it's impossible to use the F-keys mentioned above, so instead you can configure touchbar icons and use the touchbar instead.

Click below to download:

<a href="https://github.com/davestewart/davestewart-site/tree/main/content/blog/software/webstorm-shortcuts/touchbar-icons.zip">
  <img src="./touchbar.png" style="margin-left: 1rem; width: 92%; max-width: 700px;">
</a>

Thanks to [Iconscout](https://iconscout.com/unicons/explore/line) for their excellent free icons got me started with this.

### Configuration

<img src="./touchbar-config.png" style="margin-left: 1rem; max-width: 270px;">

To add the icons:

- Go to **Preferences** > **Appearance & Behavior** > **Menus and Toolbars**
- Choose **Touch bar** > **Default**
- Click the `+` button
- Choose which actions to add

Once done:

- Select each action individually
- Click the `Edit` icon in the toolbar
- Pick the appropriate icon from your hard disk 

#### Debugger touchbar bug

Because of – I'd call it a bug – in WebStorm, if you use the Node Debugger, the debugger touchbar overrides the default touchbar, hiding the project shortcuts.

To fix this, go to the preferences, and simply delete the touchbar folder. Don't worry! The debugger controls are easily available via the main Debugger UI.
