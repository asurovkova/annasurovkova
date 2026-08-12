# Anna Surovková — Portfolio

A dependency-free static portfolio with five pages:

- `index.html` — animated homepage and news archive
- `about.html` — education, experience, and interactive greetings
- `research.html` — research directions and publications
- `projects.html` — selected project work
- `cv.html` — embedded two-page curriculum vitae and PDF link

## Local preview

Run the site through a local static server rather than opening the files directly:

```sh
python3 -m http.server 4174 --bind 127.0.0.1 --directory .
```

Then open `http://127.0.0.1:4174/index.html`.

Append `?replay=1` to the homepage URL to replay its introduction after every refresh. In production, the introduction plays once per browser session and immediately resolves for reduced-motion visitors or when scrolling begins.

The site uses progressive enhancement: meaningful content remains readable if JavaScript is unavailable.
