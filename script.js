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

let step = 0;
let pipetteClickable = false;
let capClickable = false;
let naohClickable = false;
let cylinderClickable = false;


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
    instructionText.textContent = "Click on the pipette to fill and pour the milk.";
    objective.classList.remove('opacity-100');
    objective.classList.add('opacity-0');

    // startBtn.disabled = true;
    startBtn.classList.add('hidden')
    await wait(500); // give fade-out time
    objective.classList.add('hidden');
    pipetteClickable = true;
  }
});

pipette.addEventListener("click", async () => {
  if (!pipetteClickable) return;

  pipetteClickable = false; // prevent double click

  objective.classList.remove('opacity-100');
  objective.classList.add('opacity-0');
  await wait(500);
  objective.classList.add('hidden');

  await step1_addMilkToFlask();

  startBtn.disabled = false;
  instructionText.textContent = "Click on the phenolphethelien cap to pour drops into flask";
  startBtn.textContent = 'Next';
  step++;
  capClickable = true;
});

cap.addEventListener("click", async () => {
    if (!capClickable || step !== 2) return;
    capClickable = false;
    await step2_addPhenolphthalein();
    instructionText.textContent = "Click on the naoh bottle to fill NaOH into the measuring cylinder";
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
  naohLiquid.style.bottom = `${cylinderRect.bottom - 408}px`;
  naohLiquid.style.left = `${cylinderRect.left + 13}px`;
  await wait(1000)

  naohLiquid.style.height = '120px';
  naohLiquid.style.width = '33px';
  await wait(2000);


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

  instructionText.textContent = "Click on the measuring cylinder to fill NaOH into the burette";
  step++;
  cylinderClickable = true;
    
});

//cylinder to the burette---------------------------------------------------------------------------------------
cylinderContainer.addEventListener('click', async () => {
  const cylinderRect = cylinder.getBoundingClientRect();
  const funnelRect = funnel.getBoundingClientRect();

  const finalX = funnelRect.right - cylinderRect.right + 160;  // adjust for alignment
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
await wait(2000);

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

  instructionText.textContent = "aage ka baad me btata hoon ";
  step++;

  cylinderClickable = true;
});



