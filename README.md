![Image](./preview.jpg)

# Frontend Mentor - Crowdfunding product page

[![Frontend Mentor](https://img.shields.io/badge/Frontend%20Mentor-Crowdfunding%20Product%20Page-2ec866?style=flat-square&logo=frontendmentor)](https://www.frontendmentor.io/challenges/crowdfunding-product-page-7uvcZe7ZR)

## Overview

I'm back to studying programming and I've started with the good old HTML and CSS, now I'm relearning JavaScript and TypeScript. After finishing the course I'm tackling some [Frontend Mentor](https://www.frontendmentor.io) challenges to put into practice everything I've learned as I continue my studies. It's also a great way to keep improving - while not forgetting everything I've learned - as I continue to learn new things.

### Live Demo

- [Live Demo](https://mellow-code-wave.netlify.app)
- [Frontend Mentor Solution](https://www.frontendmentor.io/solutions/intro-section-with-dropdown-navigation-9Lxu6GFZOB)

## Frontend Mentor

[Frontend Mentor](https://www.frontendmentor.io) challenges help you improve your coding skills by building realistic projects.

The challenges are pretty straight forward, you have to replicate the page or element as closely as possible as the initial image or Figma layout - when provided.

### The challenge

Your challenge is to build out this crowdfunding product page and get it looking as close to the design as possible.

You can use any tools you like to help you complete the challenge. So if you've got something you'd like to practice, feel free to give it a go.

Your users should be able to:

- View the optimal layout depending on their device's screen size
- See hover states for interactive elements
- Make a selection of which pledge to make
- See an updated progress bar and total money raised based on their pledge total after confirming a pledge
- See the number of total backers increment by one after confirming a pledge
- Toggle whether or not the product is bookmarked

## What I've Learned

### Splitting State Between TypeScript and CSS

The dropdown needed two independent triggers — click and hover — that could coexist without one interfering with the other (a click-opened dropdown shouldn't close just because the mouse left the area, and vice versa).

Rather than letting CSS `:hover` drive visibility directly, I moved all state decisions into TypeScript, simulating hover with `mouseenter`/`mouseleave` listeners instead of relying on the `:hover` pseudo-class. Each menu item tracks its click and hover state independently via `data-click`/`data-hover` attributes on the element itself — this made the state persistent and readable from any function touching that element, without relying on closures or module-level variables that don't survive being passed around as primitives.

CSS's job was narrowed down to translating those states into appearance: `--open`/`--visible` modifier classes (toggled by TypeScript) paired with `transition` on the base state controlled the actual opening/closing animation, along with `position: absolute` for the desktop dropdown vs `position: fixed` for the full-screen mobile panel.

One deliberate behavior: both "Features" and "Company" dropdowns can be open at once, rather than the more common mutually-exclusive pattern. On mobile, where users are actively navigating a stacked panel, I wanted every link reachable at once without one dropdown collapsing another. On desktop, that same simultaneity is only reachable through deliberate clicks — hover-driven opening still closes automatically the moment the cursor leaves, matching how people normally interact with desktop nav.

### Accessibility Driven by the Same State

`aria-expanded` on each trigger button reflects the same open/closed state that drives the visual classes — updated in the same TypeScript functions that toggle `--open`/`--visible`, so the accessibility state can never drift out of sync with what's visually happening. `aria-controls` ties each trigger to its corresponding submenu by `id`.

### Architecture and Tooling

- **TypeScript**: all dropdown/menu logic centralized here — state stored on the DOM via `dataset`, closing-on-outside-click handled through a single delegated `document` listener using `.contains()`, and `window.matchMedia` used to gate hover behavior to desktop widths only.
- **BEM (Block Element Modifier)**: applied consistently, including modifier classes (`--open`, `--visible`) reserved specifically for JS-driven state.

## Built With

- Markup: HTML5, Semantic Elements
- Styling: CSS3 (Grid, Flexbox, Fluid Spacing using clamp()), BEM Architecture
- Logic & Tooling: TypeScript, Vite, Bun

## Author

[@psudo-dev](https://github.com/psudo-dev)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) file for details
