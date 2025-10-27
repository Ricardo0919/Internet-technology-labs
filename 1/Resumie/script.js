// Run after the HTML is loaded
document.addEventListener("DOMContentLoaded", () => {
  // All "+" toggle buttons
  const toggleButtons = document.querySelectorAll(".toggle-btn");

  toggleButtons.forEach((btn) => {
    // Click to open/close this job section
    btn.addEventListener("click", () => {
      // Nearest .job card for this button
      const job = btn.closest(".job");
      // The details list inside this job
      const details = job.querySelector(".job-details");

      // Show/hide details
      details.classList.toggle("show");
      // Rotate the "+" icon (via CSS)
      btn.classList.toggle("active");
    });
  });
});
