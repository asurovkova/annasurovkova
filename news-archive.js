class NewsArchive extends HTMLElement {
  connectedCallback() {
    if (this.dataset.enhanced === "true") return;
    this.dataset.enhanced = "true";

    this.pages = [...this.querySelectorAll("[data-news-page]")];
    this.controls = [...this.querySelectorAll("[data-news-target]")];
    this.showPage = this.showPage.bind(this);

    this.controls.forEach((control) => control.addEventListener("click", this.showPage));
  }

  disconnectedCallback() {
    this.controls?.forEach((control) => control.removeEventListener("click", this.showPage));
  }

  showPage(event) {
    const target = event.currentTarget.dataset.newsTarget;

    this.pages.forEach((page) => {
      const isActive = page.dataset.newsPage === target;
      page.setAttribute("aria-hidden", String(!isActive));
      page.inert = !isActive;
    });

    this.controls.forEach((control) => {
      const isUnavailable = control.dataset.newsTarget === target;
      control.disabled = isUnavailable;
      control.classList.toggle("is-disabled", isUnavailable);
    });
  }
}

if (!customElements.get("news-archive")) {
  customElements.define("news-archive", NewsArchive);
}

export { NewsArchive };
