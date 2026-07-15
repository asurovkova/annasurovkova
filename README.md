# Animated homepage hero

A dependency-free, progressively enhanced implementation of Figma node `1951:637`, including the complete page beneath the animated hero.

Open `index.html` through any local static server. The reusable unit is the light-DOM `<homepage-hero>` custom element, styled by `homepage-hero.css` and enhanced by `homepage-hero.js`.

The completed state is the default CSS state, so the photograph, copy, labels, links, and navigation remain readable if JavaScript is unavailable. The intro begins only after the photograph loads and decodes, skips for reduced motion or repeat visits in the same browser session, and completes immediately when scrolling begins.

The page also includes the responsive About, Publications, Research Interest, News, archive navigation, contact, and footer sections from the supplied Figma design.
