$(document).ready(function () {
  // Optional: slide in first side panel and hide the hero
  $(".begin").on("click", function () {
    $(".sec-A").addClass("showing");
    $(".head").hide();
  });

  // Smooth-scroll to the content; optionally also fade/collapse the hero
  $(".down").on("click", function () {
    const target =
      document.querySelector(".content-wrap") ||
      document.querySelector(".intro") ||
      document.body;

    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }

    // Keep the aesthetic collapse if you like
    $(".head").addClass("head-hide");
  });

  // Home logo closes any open side panels
  $(".home").on("click", function () {
    $(".side").removeClass("showing");
  });

  // Open/close second panel
  $(".code-btn").on("click", function () {
    $(".sec-B").addClass("showing");
  });
  $(".back-btn").on("click", function () {
    $(".sec-B").removeClass("showing");
  });
});
