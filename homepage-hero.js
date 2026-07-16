const PLAYED_VALUE = "played";
const INTRO_DURATION = 3520;
const ANALYSIS_DELAY = 720;
const ANALYSIS_DURATION = 1450;
const ANALYSIS_STOPS = [
  { progress: 0, value: 0 },
  { progress: 0.24, value: 34 },
  { progress: 0.31, value: 34 },
  { progress: 0.58, value: 72 },
  { progress: 0.66, value: 72 },
  { progress: 0.84, value: 91 },
  { progress: 0.91, value: 91 },
  { progress: 1, value: 98 },
];

class HomepageHero extends HTMLElement {
  connectedCallback() {
    if (this.dataset.enhanced === "true") return;
    this.dataset.enhanced = "true";

    this.image = this.querySelector(".hero__photo");
    this.accuracy = this.querySelector(".hero__accuracy");
    this.sessionKey = this.dataset.sessionKey || "homepage-hero-played";
    this.reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    this.forceReplay = new URLSearchParams(location.search).get("replay") === "1";
    this.finish = this.finish.bind(this);
    this.updateAnalysis = this.updateAnalysis.bind(this);

    this.startWhenReady();
  }

  disconnectedCallback() {
    this.removeIntroListeners();
    clearTimeout(this.finishTimer);
    cancelAnimationFrame(this.analysisFrame);
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
      return this.forceReplay || sessionStorage.getItem(this.sessionKey) !== PLAYED_VALUE;
    } catch (_) {
      return false;
    }
  }

  play() {
    try {
      if (!this.forceReplay) sessionStorage.setItem(this.sessionKey, PLAYED_VALUE);
    } catch (_) {
      this.finish();
      return;
    }

    clearTimeout(window.__heroIntroFallback);
    document.documentElement.classList.remove("hero-intro-pending");
    this.classList.remove("is-complete");
    this.classList.add("is-playing");
    this.accuracy.textContent = "ANALYZING: 00%";
    this.analysisStartedAt = null;
    this.analysisFrame = requestAnimationFrame(this.updateAnalysis);

    window.addEventListener("scroll", this.finish, { passive: true, once: true });
    this.reduceMotion.addEventListener?.("change", this.finish, { once: true });
    this.finishTimer = window.setTimeout(this.finish, INTRO_DURATION);
  }

  finish() {
    clearTimeout(window.__heroIntroFallback);
    clearTimeout(this.finishTimer);
    cancelAnimationFrame(this.analysisFrame);
    this.accuracy.textContent = "CONFIDENCE: 98%";
    document.documentElement.classList.remove("hero-intro-pending");
    this.classList.remove("is-playing");
    this.classList.add("is-complete");
    this.removeIntroListeners();
  }

  updateAnalysis(timestamp) {
    if (!this.isConnected || !this.classList.contains("is-playing")) return;
    if (this.analysisStartedAt === null) this.analysisStartedAt = timestamp;

    const elapsed = timestamp - this.analysisStartedAt;
    if (elapsed < ANALYSIS_DELAY) {
      this.analysisFrame = requestAnimationFrame(this.updateAnalysis);
      return;
    }

    const progress = Math.min((elapsed - ANALYSIS_DELAY) / ANALYSIS_DURATION, 1);
    const value = this.analysisValueAt(progress);
    this.accuracy.textContent = `ANALYZING: ${String(value).padStart(2, "0")}%`;

    if (progress < 1) {
      this.analysisFrame = requestAnimationFrame(this.updateAnalysis);
      return;
    }

    this.accuracy.textContent = "CONFIDENCE: 98%";
  }

  analysisValueAt(progress) {
    const endIndex = ANALYSIS_STOPS.findIndex((stop) => stop.progress >= progress);
    if (endIndex <= 0) return ANALYSIS_STOPS[0].value;

    const start = ANALYSIS_STOPS[endIndex - 1];
    const end = ANALYSIS_STOPS[endIndex];
    const span = end.progress - start.progress;
    const localProgress = span === 0 ? 1 : (progress - start.progress) / span;
    const easedProgress = 1 - Math.pow(1 - localProgress, 2);
    return Math.round(start.value + (end.value - start.value) * easedProgress);
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
