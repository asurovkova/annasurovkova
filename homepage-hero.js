const PLAYED_VALUE = "played";
const INTRO_DURATION = 3600;

class HomepageHero extends HTMLElement {
  connectedCallback() {
    if (this.dataset.enhanced === "true") return;
    this.dataset.enhanced = "true";

    this.image = this.querySelector(".hero__photo");
    this.sessionKey = this.dataset.sessionKey || "homepage-hero-played";
    this.reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    this.finish = this.finish.bind(this);

    this.startWhenReady();
  }

  disconnectedCallback() {
    this.removeIntroListeners();
    clearTimeout(this.finishTimer);
  }

  async startWhenReady() {
    if (!this.shouldPlay()) {
      this.finish();
      return;
    }

    try {
      if (!this.image.complete) {
        await new Promise((resolve, reject) => {
          this.image.addEventListener("load", resolve, { once: true });
          this.image.addEventListener("error", reject, { once: true });
        });
      }

      if (typeof this.image.decode === "function") {
        await this.image.decode();
      }
    } catch (_) {
      this.finish();
      return;
    }

    if (window.scrollY > 0 || this.reduceMotion.matches) {
      this.finish();
      return;
    }

    this.play();
  }

  shouldPlay() {
    if (this.reduceMotion.matches) return false;

    try {
      return sessionStorage.getItem(this.sessionKey) !== PLAYED_VALUE;
    } catch (_) {
      return false;
    }
  }

  play() {
    try {
      sessionStorage.setItem(this.sessionKey, PLAYED_VALUE);
    } catch (_) {
      this.finish();
      return;
    }

    clearTimeout(window.__heroIntroFallback);
    document.documentElement.classList.remove("hero-intro-pending");
    this.classList.remove("is-complete");
    this.classList.add("is-playing");

    window.addEventListener("scroll", this.finish, { passive: true, once: true });
    this.reduceMotion.addEventListener?.("change", this.finish, { once: true });
    this.finishTimer = window.setTimeout(this.finish, INTRO_DURATION);
  }

  finish() {
    clearTimeout(window.__heroIntroFallback);
    clearTimeout(this.finishTimer);
    document.documentElement.classList.remove("hero-intro-pending");
    this.classList.remove("is-playing");
    this.classList.add("is-complete");
    this.removeIntroListeners();
  }

  removeIntroListeners() {
    window.removeEventListener("scroll", this.finish);
    this.reduceMotion?.removeEventListener?.("change", this.finish);
  }
}

if (!customElements.get("homepage-hero")) {
  customElements.define("homepage-hero", HomepageHero);
}

export { HomepageHero };
