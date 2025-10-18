$(document).ready(function () {
  // ▼ DOWN ARROW — smooth scroll and fade hero out
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

    $(".head").addClass("head-hide"); // just fade out, not collapse
  });

  // ▲ When user scrolls back to top, fade hero back in
  $(window).on("scroll", function () {
    if ($(this).scrollTop() === 0) {
      $(".head").removeClass("head-hide");
    }
  });

  // 🏠 Home logo closes side panels
  $(".home").on("click", function () {
    $(".side").removeClass("showing");
  });

  // ▶ Open "Dev" side panel
  $(".code-btn").on("click", function () {
    $(".sec-B").addClass("showing");
  });

  // ◀ Close "Dev" side panel
  $(".back-btn").on("click", function () {
    $(".sec-B").removeClass("showing");
  });

  // Optional: if you ever want to show side A panel
  $(".begin").on("click", function () {
    $(".sec-A").addClass("showing");
    $(".head").addClass("head-hide");
  });
});
