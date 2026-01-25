# pxt_cutscene

A lightweight, event-based cutscene system, for playing timed events.<br>
The API is designed to be simple, and compatible with TypeScript, Python, and block-based usage...

Open this page at [hackx2.github.io/pxt_cutscene](https://hackx2.github.io/pxt_cutscene/)

## Use as Extension

This repository can be added as an **extension** in MakeCode.

1. open [https://arcade.makecode.com/](https://arcade.makecode.com/)
2. click on **New Project**
3. click on **Extensions** under the gearwheel menu
4. search for **https://github.com/hackx2/pxt_cutscene** and import


## Basic Usage

```ts
const scene = cutscene.create();

scene.add(500, "start", () => {
    console.log("Cutscene started");
});

scene.add(1000, "dialogue", () => {
    console.log("Hello, world!");
});

scene.start();
```
Alternatively, refer to [test.ts](https://github.com/hackx2/pxt_cutscene/blob/master/test.ts) for a more in-depth example.

---

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
