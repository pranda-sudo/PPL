/* Dočasný veřejný provoz Pilotní akademie bez přihlášení a Supabase. */
(function () {
  "use strict";
  async function start() {
    document.documentElement.classList.add("pilot-access-granted");
    for (const node of document.querySelectorAll("script[data-member-src]")) {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = node.dataset.memberSrc;
        script.async = false;
        script.onload = resolve;
        script.onerror = () => reject(new Error("Výukový soubor se nepodařilo načíst: " + script.src));
        node.replaceWith(script);
      });
    }
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", () => { start().catch(console.error); }, { once: true });
  else start().catch(console.error);
})();
