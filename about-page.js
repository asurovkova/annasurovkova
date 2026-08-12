(() => {
  const tabs = Array.from(document.querySelectorAll("[data-language]"));
  const panel = document.querySelector("#language-panel");

  if (!tabs.length || !panel) return;

  const content = {
    cs: {
      language: "Czech",
      place: "Czech Republic",
      greeting: "Ahoj",
      pronunciation: "“AH-hoy”",
      meaning: "Hello",
      context: "I grew up in the Czech Republic, where my design journey began with multimedia, Design of Information Services, and practical problem-solving.",
      image: "./assets/about-czech-graduation.jpeg",
      imageAlt: "Anna holding her graduation folder outside Masaryk University in Brno",
      imageFit: "cover",
      imagePosition: "center 48%",
    },
    en: {
      language: "English",
      place: "International",
      greeting: "Hello",
      pronunciation: "“huh-LOH”",
      meaning: "Hello",
      context: "English connects my research, studies, publications, and international collaborations.",
      image: "./assets/about-english-chi.jpeg",
      imageAlt: "Anna presenting SoundWeAR at CHI 2026 beside a sign language interpreter",
      imageFit: "cover",
      imagePosition: "center 62%",
    },
    zh: {
      language: "Chinese",
      place: "China",
      greeting: "你好",
      pronunciation: "“Nǐ hǎo”",
      meaning: "Hello",
      context: "I spent the second half of my bachelor’s studies with the Immersive Design Group at SUSTech in Shenzhen, where my research journey began. The experience introduced me to user-centered research and rapid prototyping while opening me to new ways of thinking, collaborating, and designing across cultures.",
      image: "./assets/about-china-idg-group.jpeg",
      imageAlt: "Anna with the Immersive Design Group research team in Shenzhen",
      imageFit: "cover",
      imagePosition: "center",
    },
    ko: {
      language: "Korean",
      place: "South Korea",
      greeting: "안녕하세요",
      pronunciation: "“Annyeonghaseyo”",
      meaning: "Hello",
      context: "My master’s studies in Industrial Design at KAIST in Daejeon connect my research with an international design community.",
      image: "./assets/about-korean-classroom.jpeg",
      imageAlt: "Anna attending a class at KAIST in Daejeon",
      imageFit: "cover",
      imagePosition: "center 48%",
    },
  };

  const meta = panel.querySelector("#language-meta");
  const greeting = panel.querySelector("#language-greeting");
  const pronunciation = panel.querySelector("#language-pronunciation");
  const context = panel.querySelector("#language-context");
  const visual = panel.querySelector("#language-visual");
  const visualImage = panel.querySelector("#language-image");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  Object.values(content).forEach(({ image }) => {
    const preload = new Image();
    preload.src = image;
  });

  const selectLanguage = (tab, moveFocus = false) => {
    const key = tab.dataset.language;
    const selected = content[key];

    if (!selected) return;

    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.tabIndex = active ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", tab.id);
    meta.innerHTML = `${selected.language} <span>//</span> ${selected.place}`;
    greeting.textContent = selected.greeting;
    greeting.lang = key;
    pronunciation.innerHTML = `${selected.pronunciation} <span>//</span> ${selected.meaning}`;
    context.textContent = selected.context;
    visual.dataset.fit = selected.imageFit;
    visualImage.src = selected.image;
    visualImage.alt = selected.imageAlt;
    visualImage.style.objectPosition = selected.imagePosition;

    if (!reducedMotion) {
      panel.animate(
        [
          { opacity: 0.55, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 220, easing: "cubic-bezier(0.2, 0.75, 0.3, 1)" },
      );
    }

    if (moveFocus) tab.focus();
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectLanguage(tab));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = index;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = tabs.length - 1;
      else return;

      event.preventDefault();
      selectLanguage(tabs[nextIndex], true);
    });
  });
})();
