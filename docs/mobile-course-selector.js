/* Mobile-only post-auth course picker. Membership gate loads this file only for allowed users. */
(() => {
  "use strict";
  const open = document.getElementById("mobileOpenPpl");
  const back = document.getElementById("mobileBackToCourses");
  if (!open || !back) return;
  const root = document.documentElement;
  const choosePpl = () => {
    root.classList.add("pilot-mobile-ppl-open");
    window.scrollTo({ top: 0, behavior: "instant" });
    back.focus({ preventScroll: true });
  };
  const chooseHome = () => {
    root.classList.remove("pilot-mobile-ppl-open");
    window.scrollTo({ top: 0, behavior: "instant" });
    open.focus({ preventScroll: true });
  };
  open.addEventListener("click", choosePpl);
  back.addEventListener("click", chooseHome);
  if (new URLSearchParams(location.search).get("course") === "ppl") choosePpl();
})();
