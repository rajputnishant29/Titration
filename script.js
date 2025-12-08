const pipette = document.getElementById("empty-pippete");
const pipetteMilk = document.getElementById("pipette-milk");
const milkBeaker = document.getElementById("milk-beaker");
const flask = document.getElementById("flask");
const flaskWithMilk = document.getElementById("filled-flask");
const startBtn = document.getElementById("start-btn");
const objective = document.getElementById("objective");
const instructionText = document.getElementById("instruction-text");
const cap = document.getElementById("phenolphthelein-cap");
const drop = document.getElementById("phenol-drop");
const naoh = document.getElementById("naoh");
const naohLiquid = document.getElementById("naoh-liquid");
const cylinder = document.getElementById("cylinder");
const cylinderContainer = document.getElementById('cylinder-container');
const funnel = document.getElementById('funnel')
const buretteSol = document.getElementById('burette-sol');
const tooltip = document.getElementById('hover-tooltip');

let naohTargetHeight = 0;

function positionNaohLiquid(fillRatio = 0.65) {
  if (!naohLiquid || !cylinder) return null;
  const cylinderRect = cylinder.getBoundingClientRect();
  const containerRect = cylinderContainer.getBoundingClientRect();

  const liquidHeight = Math.max(60, cylinderRect.height * fillRatio);
  const liquidWidth = Math.max(24, cylinderRect.width * 0.55);


  const rawBottom = containerRect.bottom - cylinderRect.bottom;
  const bottom = Math.max(0, rawBottom - 70); // negative offset ताकि base को छुए
  const left = (cylinderRect.left + (cylinderRect.width - liquidWidth) / 2) - containerRect.left;

  naohLiquid.style.position = 'absolute';
  naohLiquid.style.bottom = `${bottom}px`;
  naohLiquid.style.left = `${left}px`;
  naohLiquid.style.width = `${liquidWidth}px`;

  naohTargetHeight = liquidHeight;
  return { height: liquidHeight, width: liquidWidth, bottom, left };
}

window.addEventListener('resize', () => {
  if (naohLiquid && naohLiquid.style.display !== 'none') {
    positionNaohLiquid(); // responsive repositioning on resize
    if (naohTargetHeight) {
      naohLiquid.style.height = `${naohTargetHeight}px`;
    }
  }
});

let step = 0;
let pipetteClickable = false;
let capClickable = false;
let naohClickable = false;
let cylinderClickable = false;
let flaskClickable = false;
let nobClickable = false;

startBtn.addEventListener('click', async () => {
  if (step === 0) {
    // Show objective popup with fade effect
    instructionText.textContent = "Click on the 'Next' button to continue.";
    objective.classList.remove('hidden', 'opacity-0');
    objective.classList.add('opacity-100');
    startBtn.textContent = 'Next';
    step++;
  } else if (step === 1) {
    // Hide objective and start animation
    instructionText.textContent = "Click on the Pipette to fill 10ml milk and pour it into flask.";
    objective.classList.remove('opacity-100');
    objective.classList.add('opacity-0');

    // startBtn.disabled = true;
    startBtn.classList.add('hidden')
    await wait(500); // give fade-out time
    objective.classList.add('hidden');
    pipetteClickable = true;
  }
});

// Hover labels ---------------------------------------------------------------
if (tooltip) {
  const hoverTargets = document.querySelectorAll('.hover-item');
  hoverTargets.forEach((el) => {
    const label = el.dataset.label || el.alt || el.getAttribute('aria-label') || 'Object';

    el.addEventListener('mouseenter', () => {
      tooltip.textContent = label;
      tooltip.classList.remove('hidden');
    });

    el.addEventListener('mousemove', (event) => {
      const offsetX = 12;
      const offsetY = 12;
      tooltip.style.left = `${event.clientX + offsetX}px`;
      tooltip.style.top = `${event.clientY + offsetY}px`;
    });

    el.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
    });
  });
}

pipette.addEventListener("click", async () => {
  if (!pipetteClickable) return;
  pipetteClickable = false;

  objective.classList.remove('opacity-100');
  objective.classList.add('opacity-0');
  await wait(500);
  objective.classList.add('hidden');

  await step1_addMilkToFlask();

  startBtn.disabled = false;
  instructionText.textContent = "Click on the Phenolphthalein cap to pour drops into flask";
  startBtn.textContent = 'Next';
  step++;
  capClickable = true;
});

cap.addEventListener("click", async () => {
    if (!capClickable || step !== 2) return;
    capClickable = false;
    await step2_addPhenolphthalein();
    instructionText.textContent = "Click on the NaOH bottle to fill NaOH into the measuring cylinder";
    step++;
    naohClickable = true
});


 function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//adding milk to the flask----------------------------------------------
async function step1_addMilkToFlask() {
  const pipetteRect = pipette.getBoundingClientRect();
  const milkBeakerRect = milkBeaker.getBoundingClientRect();
  const flaskRect = flask.getBoundingClientRect();

  const milkX = milkBeakerRect.left - pipetteRect.left + 40;
  const milkY = milkBeakerRect.top - pipetteRect.top - 80;

  pipette.style.transition = pipetteMilk.style.transition = "transform 1s ease-in-out";

  pipette.style.transform = pipetteMilk.style.transform = `translate(0px, -200px)`;
  await wait(1000);

  pipette.style.transform = pipetteMilk.style.transform = `translate(${milkX}px, -200px)`;
  await wait(1000);

  pipette.style.transform = pipetteMilk.style.transform = `translate(${milkX}px, ${milkY}px)`;
  await wait(1000);

  pipetteMilk.classList.add("show");
  await wait(1000);

  const flaskX = flaskRect.left - pipetteRect.left + 30;
  const flaskY = flaskRect.top - pipetteRect.top - 80;

  pipette.style.transform = pipetteMilk.style.transform = `translate(${milkX}px, -200px)`;
  await wait(1000);

  pipette.style.transform = pipetteMilk.style.transform = `translate(${flaskX}px, -200px)`;
  await wait(1000);

  pipette.style.transform = pipetteMilk.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
  await wait(1000);

  pipetteMilk.classList.remove("show");
  pipetteMilk.classList.add("pour");
  await wait(1000);

  flaskWithMilk.classList.add("show");

  // First move up
  pipette.style.transform = pipetteMilk.style.transform = `translate(${flaskX}px, -200px)`;
  await wait(1000);

  // Then move to initial position
  pipette.style.transform = pipetteMilk.style.transform = `translate(0px, 0px)`;
  await wait(1000);
}

//adding phenolphthelein to the flask------------------------------------
async function step2_addPhenolphthalein() {
  const cap = document.getElementById("phenolphthelein-cap");
  const drop = document.getElementById("phenol-drop");
  // const flask = document.getElementById("flask"); // Ensure this is defined

  const capRect = cap.getBoundingClientRect();
  const flaskRect = flask.getBoundingClientRect();

  // Distance to move horizontally & vertically
  const flaskX = flaskRect.left - capRect.left + 15;
  const flaskY = flaskRect.top - capRect.top - 120;

  cap.style.transition = "transform 1s ease-in-out";

  // Step 1: Move cap up
  cap.style.transform = `translate(0px, -140px)`;
  await wait(1000);

  // Step 2: Move cap left (toward flask)
  cap.style.transform = `translate(${flaskX}px, -140px)`;
  await wait(1000);

  // Step 3: Move cap down toward flask
  // cap.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
  // await wait(800);

  // Step 4: Show drop animation
  if (drop) {
    drop.classList.add("show"); // Ensure `.show` animates or reveals the drop
    await wait(1000);
    drop.classList.remove("show");
  }

  // Step 5: Return cap to original position
cap.style.transform = `translate(${flaskX}px, -140px)`;
await wait(1000);

// Step 5b: Move cap horizontally back
cap.style.transform = `translate(0px, -140px)`;
await wait(1000);

// Step 5c: Move cap down to original position
cap.style.transform = `translate(0px, 0px)`;
await wait(1000);
}

//naoh into cylinder-------------------------------------------
naoh.addEventListener('click', async () => {
  const naohRect = naoh.getBoundingClientRect();
  const cylinderRect = cylinder.getBoundingClientRect();

  if (!naohClickable || step !== 3) return;
  naohClickable= false

  const finalX = cylinderRect.left - naohRect.left + 65;
  const finalY = cylinderRect.top - naohRect.top - 90;

  naoh.style.transition = 'transform 1s ease-in-out';

  // Step 1: Move up
  naoh.style.transform = `translate(0px, -200px)`;
  await wait(1000);

  // Step 2: Move horizontally
  naoh.style.transform = `translate(${finalX}px, -200px)`;
  await wait(1000);

  // Step 3: Move down
  naoh.style.transform = `translate(${finalX}px, ${finalY}px)`;
  await wait(1000);

  // Step 4: Tilt and pour
  naoh.style.setProperty('--x', `${finalX}px`);
  naoh.style.setProperty('--y', `${finalY}px`);
  naoh.classList.add('tilt');
  // await wait(1000)

  naohLiquid.style.display = 'block';
  const pos = positionNaohLiquid(0.65); // responsive fit inside cylinder
  if (pos) {
    // bottom-up fill: start height 0 then grow to target
    naohLiquid.style.transition = 'height 1.6s ease-in-out, opacity 0.2s linear';
    naohLiquid.style.height = '0px';
    naohLiquid.style.opacity = '1';
    void naohLiquid.offsetHeight; // force reflow
    naohLiquid.style.height = `${pos.height}px`;
  }
  await wait(2000);
  
  // // Remove the stream animation
  // naohStream.remove();


  // Step 5: Reset path in reverse
  // Remove tilt
  naoh.classList.remove('tilt');
  await wait(1000);

  // Step 5.1: Move up again
  naoh.style.transform = `translate(${finalX}px, -200px)`;
  await wait(1000);

  // Step 5.2: Move left
  naoh.style.transform = `translate(0px, -200px)`;
  await wait(1000);

  // Step 5.3: Move down to original
  naoh.style.transform = `translate(0px, 0px)`;
  await wait(1000);

  instructionText.textContent = "Click on the measuring cylinder to fill 0.1N NaOH into the Burette";
  step++;
  cylinderClickable = true;
});

//cylinder to the burette---------------------------------------------------------------------------------------
cylinderContainer.addEventListener('click', async () => {
  const cylinderRect = cylinder.getBoundingClientRect();
  const funnelRect = funnel.getBoundingClientRect();

  const finalX = funnelRect.right - cylinderRect.right + 160;
  const finalY = funnelRect.top - cylinderRect.top - 20;

  if (!cylinderClickable || step !== 4) return; 
  cylinderClickable = false;

  cylinderContainer.style.transition = 'transform 1s ease-in-out';

  // Step 1: Move Up
  cylinderContainer.style.transform = `translate(0px, -300px)`;
  await wait(1000);

  // Step 2: Move Left
  cylinderContainer.style.transform = `translate(-300px, -300px)`;
  await wait(1000);

  // Step 3: Move to Funnel
  cylinderContainer.style.transform = `translate(${finalX}px, ${finalY}px)`;
  await wait(1000);

  // Step 4: Tilt Left
  cylinderContainer.style.setProperty('--x', `${finalX}px`);
  cylinderContainer.style.setProperty('--y', `${finalY}px`);
  cylinderContainer.classList.add('tilt');
  await wait(1000);

// Step 5: Fill the burette
buretteSol.classList.remove('hidden');

// Force reflow to trigger transition (necessary in some browsers)
void buretteSol.offsetWidth;

// Animate opacity to simulate filling
naohLiquid.classList.add('empty');  
buretteSol.classList.add('fill');
// Drain cylinder content while burette fills
naohLiquid.style.transition = 'height 1.6s linear, opacity 0.8s linear';
naohLiquid.style.height = '0px';     // top-down empty (height decreases from bottom anchor)
naohLiquid.style.opacity = '0';
await wait(2000);
// Ensure cylinder appears empty after pour
naohLiquid.style.display = 'none';
naohLiquid.style.width = '0px';

  // Step 6: Reverse Path (un-tilt + backtrack)
  cylinderContainer.classList.remove('tilt');
  await wait(1000);
  // Step 6.1: Move up
  cylinderContainer.style.transform = `translate(${finalX}px, -200px)`;
  await wait(1000);

  // Step 6.2: Move right to center
  cylinderContainer.style.transform = `translate(0px, -200px)`;
  await wait(1000);

  // Step 6.3: Return down to original
  cylinderContainer.style.transform = `translate(0px, 0px)`;
  await wait(1000);

  // instructionText.textContent = "aage ka baad me btata hoon ";
  // Next: Move flask under the burette
  instructionText.textContent = "Click on the Flask to settle it under the Burette";
  step = 7;
  cylinderClickable = false;
  flaskClickable = true;
});

// flask to settle under burette -------------------------------------------------
flask.addEventListener('click', async () => {
  if (!flaskClickable || step !== 7) return;
  flaskClickable = false;

  await step7_moveFlaskUnderBurette();

  // instructionText.textContent = "Flask ab burette ke neeche set ho gaya hai";
  step = 8;
  instructionText.textContent = "Click on the Burette knob to start dropping";
  nobClickable = true;
});

async function step7_moveFlaskUnderBurette() {
  const burette = document.getElementById('empty-Burette');
  const buretteRect = burette.getBoundingClientRect();
  const flaskRect = flask.getBoundingClientRect();

  // Align flask center under burette center, slightly below the tip
  const targetX = (buretteRect.left + buretteRect.width * 0.5) - (flaskRect.left + flaskRect.width * 0.5);
  const targetY = (buretteRect.bottom + 0) - flaskRect.bottom;

  flask.style.transition = 'transform 1s ease-in-out';
  flask.style.transform = `translate(${targetX}px, ${targetY}px)`;
  await wait(1000);
}

// Step 8: Open burette knob and start drops -------------------------------------
const buretteNob = document.getElementById('burette-nob');
const buretteDrop = document.getElementById('burette-drop');
const emptyBurette = document.getElementById('empty-Burette');

buretteNob.addEventListener('click', async () => {
  if (!nobClickable || step !== 8) return;
  nobClickable = false;

  // Open state
  buretteNob.classList.add('open');
  // Change burette image to show filling state
  emptyBurette.src = 'assets/Burette-filling.png';
  // Start drops animation
  buretteDrop.classList.add('show');

  // While drops are pouring, reduce burette solution level
  const pourDurationMs = 6000; // sync with wait below
  buretteSol.style.transition = `clip-path ${pourDurationMs}ms linear`;
  // Reduce visible fill from bottom by ~60%
  buretteSol.style.clipPath = 'inset(40% 0 0 0)';

  // Keep dropping for a few seconds to simulate flow
  await wait(pourDurationMs);

  // Optionally stop drops (comment out if continuous needed)
  buretteDrop.classList.remove('show');
  buretteNob.classList.remove('open');

  // Change flask image to show titrated state
  const emptyFlask = document.getElementById('empty-flask');
  const filledFlask = document.getElementById('filled-flask');
  emptyFlask.src = 'assets/conical-flask - titrated.png';
  filledFlask.classList.remove('show');

  instructionText.textContent = "Completed";
  step++;
  // Show Observation table at the end
  showObservation();
});

// Show observation overlay and compute result
function showObservation() {
  const obs = document.getElementById('observation');
  const closeBtn = document.getElementById('close-observation');
  const obsV = document.getElementById('obs-v');
  const obsN = document.getElementById('obs-n');
  const obsW = document.getElementById('obs-w');
  const resultEl = document.getElementById('obs-result');

  // Read values (fallback defaults shown in table)
  const V = parseFloat((obsV?.textContent || '0.20').trim());
  const N = parseFloat((obsN?.textContent || '0.1').trim());
  const W = parseFloat((obsW?.textContent || '10').trim());

  // Formula: (0.9 × V × N) / W
  const acidity = (0.9 * V * N) / W;  // already % lactic acid
  const acidityPct = acidity.toFixed(3); 

  if (resultEl) resultEl.textContent = `${acidityPct}%`;

  if (obs) obs.classList.remove('hidden');
  if (closeBtn) {
    closeBtn.onclick = () => obs && obs.classList.add('hidden');
  }
}
