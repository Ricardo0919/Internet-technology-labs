document.addEventListener("DOMContentLoaded", () => {
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const job = btn.closest(".job");
      const details = job.querySelector(".job-details");

      details.classList.toggle("show");
      btn.classList.toggle("active");
    });
  });
});
