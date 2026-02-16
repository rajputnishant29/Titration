/* 
  Titration Simulator - Wizard Logic
  Step 0: Intro (Gallery)
  Step 1: Prep (Pipette Milk, Add Phenol)
  Step 2: Titration (Fill Burette, Titrate to Pink)
  Step 3: Observation
*/

// --- DOM ELEMENTS ---
const body = document.body;
const instructionText = document.getElementById("instruction-text");
const btnStart = document.getElementById("btn-start");
const btnNextWrapper = document.getElementById("next-container");
const btnNext = document.getElementById("btn-next");
const hoverTooltip = document.getElementById('hover-tooltip');

// Groups
const groupBurette = document.getElementById('burette-group');
const groupFlask = document.getElementById('flask');
const groupPipette = document.getElementById('pipette-group');
const groupPhenol = document.getElementById('phenol-group');
const groupMilk = document.getElementById('milk-group');
const groupTitrationTools = document.getElementById('titration-tools-group');

// Interactive Elements
const pipette = document.getElementById("empty-pippete");
const pipetteMilk = document.getElementById("pipette-milk");
const milkBeaker = document.getElementById("milk-beaker");
const flaskDiv = document.getElementById("flask"); // The wrapper
const filledFlask = document.getElementById("filled-flask");
const emptyFlask = document.getElementById("empty-flask");
const phenolCap = document.getElementById("phenolphthelein-cap");
const phenolDrop = document.getElementById("phenol-drop");
const naoh = document.getElementById("naoh");
const naohLiquid = document.getElementById("naoh-liquid");
const cylinder = document.getElementById("cylinder");
const cylinderContainer = document.getElementById('cylinder-container');
const funnel = document.getElementById('funnel');
const buretteSol = document.getElementById('burette-sol');
const buretteNob = document.getElementById('burette-nob');
const buretteDrop = document.getElementById('burette-drop');

// Live Data
const liveTitrationEl = document.getElementById('live-titration-val');
const observationScreen = document.getElementById('observation-screen');
const inputAnswer = document.getElementById('input-answer');
const btnCheckAnswer = document.getElementById('btn-check-answer');
const feedbackMsg = document.getElementById('feedback-msg');

// --- STATE ---
let currentStep = 0; // 0=Intro, 1=Prep, 2=Titration, 3=Observation
let prepState = {
  milkAdded: false,
  phenolAdded: false,
  isAnimating: false
};
let titrationState = {
  naohInCylinder: false,
  naohInBurette: false,
  flaskUnder: false,
  titrationStarted: false,
  titrationRunning: false,
  volume: 0.0,
  maxVolume: 16.0,
  isPink: false,
  intervalId: null
};

// --- INITIALIZATION ---
function init() {
  updateView();
  initTooltips();

  // Event Listeners
  btnStart.addEventListener('click', () => nextStep());
  btnNext.addEventListener('click', () => nextStep());

  // Step 1 Interactions
  pipette.addEventListener('click', handlePipetteClick);
  phenolCap.addEventListener('click', handlePhenolClick);

  // Step 2 Interactions
  naoh.addEventListener('click', handleNaohClick);
  cylinderContainer.addEventListener('click', handleCylinderClick);
  // Re-bind flask click for titrator move
  flaskDiv.addEventListener('click', handleFlaskMoveClick);
  buretteNob.addEventListener('click', handleNobClick);

  // Step 3
  btnCheckAnswer.addEventListener('click', handleCheckAnswer);
}

// --- NAVIGATION ---
function nextStep() {
  currentStep++;
  updateView();
}

function updateView() {
  // Update Body Class
  body.className = `overflow-hidden bg-slate-950 step-${currentStep}`;

  // Reset Next Button
  btnNextWrapper.classList.add('hidden');

  // Text Instructions
  switch (currentStep) {
    case 0:
      instructionText.textContent = "Make yourself familiar with the instruments & glassware";
      break;
    case 1:
      instructionText.textContent = "Click on the Pipette to draw 10 mL milk sample and pour it into the flask.";
      // Reset positions if needed
      pipette.style.transform = '';
      pipetteMilk.style.transform = '';
      break;
    case 2:
      instructionText.textContent = "Click on the NaOH bottle to fill NaOH into the measuring cylinder";
      // Ensure visual transition state
      if (filledFlask) filledFlask.style.opacity = '1';
      break;
    case 3:
      instructionText.textContent = "Observation Table";
      observationScreen.classList.remove('hidden');
      break;
  }
}

// --- UTILS ---
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

function setInstruction(text) {
  instructionText.textContent = text;
}

// --- STEP 1 LOGIC (PREP) ---
async function handlePipetteClick() {
  if (currentStep !== 1 || prepState.isAnimating || prepState.milkAdded) return;
  prepState.isAnimating = true;

  // Animation Logic (Reused/Simplified)
  const pipetteRect = pipette.getBoundingClientRect();
  const milkRect = milkBeaker.getBoundingClientRect();
  const flaskRect = flaskDiv.getBoundingClientRect();

  // 1. To Milk
  const toMilkX = milkRect.left - pipetteRect.left + 60;
  const toMilkY = milkRect.top - pipetteRect.top - 80;

  pipette.style.transition = pipetteMilk.style.transition = "transform 1s ease-in-out";

  // Up
  pipette.style.transform = pipetteMilk.style.transform = `translate(0px, -200px)`;
  await wait(1000);
  // Over
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toMilkX}px, -200px)`;
  await wait(1000);
  // Down
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toMilkX}px, ${toMilkY}px)`;
  await wait(1000);

  // Draw Milk
  pipetteMilk.classList.add("show");
  await wait(1000);

  // Up
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toMilkX}px, -200px)`;
  await wait(1000);

  // 2. To Flask
  const toFlaskX = flaskRect.left - pipetteRect.left + 50;
  const toFlaskY = flaskRect.top - pipetteRect.top - 80;

  // Over
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toFlaskX}px, -200px)`;
  await wait(1000);
  // Down
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toFlaskX}px, ${toFlaskY}px)`;
  await wait(1000);

  // Pour
  pipetteMilk.classList.remove("show");
  pipetteMilk.classList.add("pour");
  await wait(1000);
  filledFlask.classList.add("show"); // Show milk in flask

  // Reset
  pipette.style.transform = pipetteMilk.style.transform = `translate(${toFlaskX}px, -200px)`;
  await wait(1000);
  pipette.style.transform = pipetteMilk.style.transform = `translate(0, 0)`;
  await wait(1000);

  prepState.milkAdded = true;
  prepState.isAnimating = false;

  setInstruction("Click on the Phenolphthalein cap to pour few drops into the flask");
  checkStep1Completion();
}

async function handlePhenolClick() {
  if (currentStep !== 1 || prepState.isAnimating || !prepState.milkAdded || prepState.phenolAdded) return;
  prepState.isAnimating = true;

  const capRect = phenolCap.getBoundingClientRect();
  const flaskRect = flaskDiv.getBoundingClientRect();

  const targetX = flaskRect.left - capRect.left + 30;

  phenolCap.style.transition = "transform 1s ease-in-out";
  phenolCap.style.transform = `translate(0px, -200px)`;
  await wait(1000);

  phenolCap.style.transform = `translate(${targetX}px, -200px)`;
  await wait(1000);

  // Drop
  if (phenolDrop) {
    phenolDrop.classList.add("show");
    await wait(1000);
    phenolDrop.classList.remove("show");

    // Flask shakes or color tint briefly?
    filledFlask.style.filter = "brightness(0.95)"; // slight change
    setTimeout(() => filledFlask.style.filter = "none", 500);
  }

  phenolCap.style.transform = `translate(0px, -200px)`;
  await wait(1000);
  phenolCap.style.transform = `translate(0px, 0px)`;
  await wait(1000);

  prepState.phenolAdded = true;
  prepState.isAnimating = false;

  checkStep1Completion();
}

function checkStep1Completion() {
  if (prepState.milkAdded && prepState.phenolAdded) {
    setInstruction("Preparation complete. Click 'NEXT' to proceed.");
    btnNextWrapper.classList.remove('hidden');
  }
}

// --- STEP 2 LOGIC (TITRATION) ---
// Instructions: NaOH -> Cyl -> Burette -> FlaskMove -> Nob
async function handleNaohClick() {
  if (currentStep !== 2 || titrationState.naohInCylinder || prepState.isAnimating) return;
  prepState.isAnimating = true; // reuse lock

  const naohRect = naoh.getBoundingClientRect();
  const cylRect = cylinder.getBoundingClientRect();

  const moveX = cylRect.left - naohRect.left + 90;
  const moveY = cylRect.top - naohRect.top - 150;

  naoh.style.transition = 'transform 1s ease-in-out';
  naoh.style.transform = `translate(0px, -240px)`;
  await wait(1000);
  naoh.style.transform = `translate(${moveX}px, -240px)`;
  await wait(1000);
  naoh.style.transform = `translate(${moveX}px, ${moveY}px)`;
  await wait(1000);

  naoh.style.setProperty('--x', `${moveX}px`);
  naoh.style.setProperty('--y', `${moveY}px`);
  naoh.classList.add('tilt');

  // Fill Cyl
  naohLiquid.style.display = 'block';
  // Simple height calc
  naohLiquid.style.height = '0px';
  naohLiquid.style.width = '24px'; // approximate
  requestAnimationFrame(() => {
    naohLiquid.style.height = '60px'; // fill logic
  });
  await wait(2000);

  naoh.classList.remove('tilt');
  await wait(1000);
  naoh.style.transform = `translate(${moveX}px, -240px)`;
  await wait(1000);
  naoh.style.transform = `translate(0px, 0px)`;
  await wait(1000);

  titrationState.naohInCylinder = true;
  prepState.isAnimating = false;
  setInstruction("Click on the measuring cylinder to fill 0.1N NaOH into the Burette");
}

async function handleCylinderClick() {
  if (currentStep !== 2 || !titrationState.naohInCylinder || titrationState.naohInBurette || prepState.isAnimating) return;
  prepState.isAnimating = true;

  const cylRect = cylinderContainer.getBoundingClientRect();
  const funRect = funnel.getBoundingClientRect();

  const moveX = funRect.right - cylRect.right + 260; // Approximate adjustment
  const moveY = funRect.top - cylRect.top - 20;

  cylinderContainer.style.transition = 'transform 1s ease-in-out';
  cylinderContainer.style.transform = `translate(0px, -300px)`;
  await wait(1000);
  cylinderContainer.style.transform = `translate(${moveX}px, -300px)`;
  await wait(1000);
  cylinderContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
  await wait(1000);

  cylinderContainer.style.setProperty('--x', `${moveX}px`);
  cylinderContainer.style.setProperty('--y', `${moveY}px`);
  cylinderContainer.classList.add('tilt');
  await wait(1000);

  // Fill Burette
  buretteSol.classList.add('fill');
  naohLiquid.classList.add('empty'); // drain anim
  await wait(2000);

  cylinderContainer.classList.remove('tilt');
  await wait(1000);
  cylinderContainer.style.transform = `translate(0,0)`; // shortcut return
  await wait(1000);

  titrationState.naohInBurette = true;
  prepState.isAnimating = false;
  setInstruction("Click on the Flask to place it under the Burette");
}

async function handleFlaskMoveClick() {
  if (currentStep !== 2 || !titrationState.naohInBurette || titrationState.flaskUnder || prepState.isAnimating) return;
  prepState.isAnimating = true;

  const flaskEl = document.getElementById('flask'); // Wrapper
  const buretteRect = document.getElementById('empty-Burette').getBoundingClientRect();
  const flaskRect = flaskEl.getBoundingClientRect();

  const targetX = (buretteRect.left + buretteRect.width * 0.5) - (flaskRect.left + flaskRect.width * 0.5);
  const targetY = (buretteRect.bottom - 40) - flaskRect.bottom; // Adjust to fit under tip

  flaskEl.style.transition = 'transform 1s ease-in-out';
  flaskEl.style.transform = `translate(${targetX}px, ${targetY}px)`;
  await wait(1000);

  titrationState.flaskUnder = true;
  prepState.isAnimating = false;
  setInstruction("Click on the Burette knob to open it and start titration");
}

function handleNobClick() {
  if (currentStep !== 2 || !titrationState.flaskUnder) return;

  if (!titrationState.titrationRunning && !titrationState.isPink) {
    // START TITRATION
    startTitration();
  } else if (titrationState.titrationRunning) {
    // STOP TITRATION
    stopTitration();
  }
}

function startTitration() {
  titrationState.titrationRunning = true;
  buretteNob.classList.add('open');
  buretteDrop.classList.add('show');
  setInstruction("Titration in progress... Click knob to stop.");

  if (titrationState.intervalId) clearInterval(titrationState.intervalId);

  titrationState.intervalId = setInterval(() => {
    titrationState.volume += 0.5;
    if (titrationState.volume > titrationState.maxVolume) {
      titrationState.volume = titrationState.maxVolume;
    }

    // Update Display
    liveTitrationEl.textContent = titrationState.volume.toFixed(1);

    // Check End Condition
    if (titrationState.volume >= 16.0) {
      handlePinkReached();
    }

  }, 500); // 0.5ml every 500ms -> 16ml takes 16s (too slow?). User said "Slowly". 
  // 16 / 0.5 = 32 steps. 32 * 0.5 = 16 seconds. Acceptable.
}

function stopTitration() {
  titrationState.titrationRunning = false;
  buretteNob.classList.remove('open');
  buretteDrop.classList.remove('show');
  if (titrationState.intervalId) clearInterval(titrationState.intervalId);

  if (titrationState.isPink) {
    setInstruction("Titration complete. Click 'NEXT' to see observation.");
    btnNextWrapper.classList.remove('hidden');
  } else {
    setInstruction("Click knob to resume titration.");
  }
}

function handlePinkReached() {
  titrationState.isPink = true;

  // Turn Pink
  if (filledFlask) {
    filledFlask.classList.add('to-pink');
    // Or swap image
    // filledFlask.src = 'assets/conical-flask - titrated.png'; 
    // But using CSS filter on existing image is smoother if supported, relying on css class I added.
  }

  setInstruction("Click on the Burette knob to close it and stop titration");
  // Don't auto-stop, wait for user to click knob as per instructions: "instructions displayed 'Click on the Burette knob to close it...'"
  // But we stop incrementing volume?? 
  // User says: "When pink appears (just reaching the volume 16 mL), instructions displayed 'Click on the Burette knob...'"
  // So we pause the counter? or does it overflow?
  // Logic: "just reaching 16ml". I will pause logic at 16.
  if (titrationState.intervalId) clearInterval(titrationState.intervalId);

  // But the drops should probably continue until closed?
  // Visual drops continue, but vol stays at 16? 
  // I'll leave drops running until user clicks close.
}

// --- STEP 3 LOGIC (OBSERVATION) ---
function handleCheckAnswer() {
  const val = parseFloat(inputAnswer.value);
  // (9 * 16 * 0.1) / 10 = 1.44 or 0.144?
  // Formula: (9 * V * N) / W
  // V=16, N=0.1, W=10
  // 9 * 16 * 0.1 = 14.4
  // 14.4 / 10 = 1.44
  // The previous code had 0.9 factor? 
  // User Instructions say: "Titratable acidity (%,lactic acid)=(9×V×N)/W"
  // AND "Titratable acidity (%,lactic acid) = (9xVxN)/W"
  // Wait, the HTML I wrote has "0.9 x V x N".
  // Let me check user request carefully.
  // User Request: "Titratable acidity (%,lactic acid)=(9×V×N)/W"
  // Wait, typically Lactic acid factor is 0.009 for grams, so % is *100?
  // 1ml 0.1N NaOH = 0.009g Lactic Acid.
  // % = (V * N * 0.009 * 100) / W = (0.9 * V * N) / W.
  // User prompt specifically says: "(9×V×N)/W".
  // 9 * 16 * 0.1 / 10 = 1.44.
  // If user meant 0.9, it would be 0.144.
  // I will stick to the USER INSTRUCTION formula verbatim: "9".
  // Maybe the milk weight is different or they normalized it?
  // Let's support the user's explicit formula text "9".

  const expected = (9 * 16 * 0.1) / 10; // 1.44

  // Allow slight margin
  if (Math.abs(val - expected) < 0.1) {
    feedbackMsg.textContent = "Right answer!";
    feedbackMsg.className = "mt-4 font-bold text-lg h-8 text-green-600";
  } else {
    feedbackMsg.textContent = "Wrong answer! Try 1.44";
    feedbackMsg.className = "mt-4 font-bold text-lg h-8 text-red-600";
  }
}


// Tooltips (Reusing existing logic)
function initTooltips() {
  const hoverTargets = document.querySelectorAll('.hover-item');
  hoverTargets.forEach((el) => {
    const label = el.dataset.label;
    if (!label) return;
    el.addEventListener('mouseenter', () => {
      if (isHidden(el)) return; // Don't show tooltip if parent is hidden
      hoverTooltip.textContent = label;
      hoverTooltip.classList.remove('hidden');
    });
    el.addEventListener('mousemove', (e) => {
      hoverTooltip.style.left = `${e.clientX + 15}px`;
      hoverTooltip.style.top = `${e.clientY + 15}px`;
    });
    el.addEventListener('mouseleave', () => {
      hoverTooltip.classList.add('hidden');
    });
  });
}

function isHidden(el) {
  return (el.offsetParent === null) || (window.getComputedStyle(el).opacity === '0');
}

// Start
init();
