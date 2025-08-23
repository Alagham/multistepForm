const form = document.getElementById("multiStepForm");
const steps = document.querySelectorAll(".form-step");
const stepIndicators = document.querySelectorAll(".step");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const summaryDiv = document.getElementById("summary");
const progressBar = document.getElementById("progressBar");

let currentStep = 0;

function showStep(step) {
  steps.forEach((s, i) => {
    s.classList.toggle("active", i === step);
    if (stepIndicators[i]) {
      stepIndicators[i].classList.toggle("active", i === step);
    }
  });

  // Hide prev on first step
  prevBtn.style.display = step === 0 ? "none" : "inline-block";

  // Change next button text
  if (step === steps.length - 1) {
    nextBtn.style.display = "none"; // hide Next/Confirm on Thank You
    prevBtn.style.display = "none"; // also hide Prev on Thank You
  } else {
    nextBtn.style.display = "inline-block";
    nextBtn.textContent = step === steps.length - 2 ? "Confirm" : "Next";
  }

  // Update progress bar
  let progress = ((step + 1) / steps.length) * 100;
  progressBar.style.width = progress + "%";
}

function validateStep() {
  const inputs = steps[currentStep].querySelectorAll("input[required]");
  for (let input of inputs) {
    if (!input.checkValidity()) {
      
      input.reportValidity();
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener("click", () => {
  // If we are at the second to last step (Summary) and press Confirm:
  if (currentStep === steps.length - 2) {
    generateSummary();   // ✅ Build the summary before showing it
    currentStep++;
    showStep(currentStep); // move to Thank You step
    return;
  }

  if (!validateStep()) return;

  currentStep++;
  // If we are going INTO the Summary step
  if (currentStep === steps.length - 2) {
    generateSummary();
  }
  showStep(currentStep);
});

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep--;
    showStep(currentStep);
  }
});

function generateSummary() {
  const formData = new FormData(form);

  // Plans with prices
  const planPrices = {
    "Basic": 10,
    "Standard": 20,
    "Premium": 30
  };

  // Add-ons with prices
  const addonPrices = {
    "Cloud Storage": 5,
    "Premium Support": 7,
    "Extra Devices": 3
  };

  let summaryHTML = `<h3>Your Selections</h3><ul>`;
  let total = 0;

  // Get plan
  const plan = formData.get("plan");
  if (plan) {
    let price = planPrices[plan] || 0;
    total += price;
    summaryHTML += `<li><strong>Plan:</strong> ${plan} - $${price}/mo</li>`;
  }

  // Get addons
  const addons = formData.getAll("addons");
  if (addons.length > 0) {
    summaryHTML += `<li><strong>Add-ons:</strong><ul>`;
    addons.forEach(addon => {
      let price = addonPrices[addon] || 0;
      total += price;
      summaryHTML += `<li>${addon} - $${price}/mo</li>`;
    });
    summaryHTML += `</ul></li>`;
  }

  summaryHTML += `</ul>`;

  // Show total
  summaryHTML += `<h3>Total: $${total}/mo</h3>`;

  summaryDiv.innerHTML = summaryHTML;
}

// Initialize
showStep(currentStep);
