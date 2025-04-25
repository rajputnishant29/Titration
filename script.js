const pipette = document.getElementById('empty-pippete');
const distilledWater = document.getElementById('distilled-water');
const pipetteWater = document.getElementById('pipette-water');
const pipetteMilk = document.getElementById('pipette-milk');
const emptyFlask = document.getElementById('empty-flask');
const filledFlask = document.getElementById('filled-flask');
const flask = document.getElementById('flask');
const milkBeaker = document.getElementById('milk-beaker');
const milk = document.getElementById('milk');
const popup = document.getElementById('popup');
const naoh = document.getElementById('naoh');
const naohLiquid = document.getElementById('naoh-liquid');
const cylinder = document.getElementById('cylinder');
const emptyBurette = document.getElementById('empty-Burette');

let isFirstClick = true;

// Add event listener to filled flask
flask.addEventListener('click', () => {
    flask.classList.add('shake');
    setTimeout(() => {
        flask.classList.remove('shake');
        
        // Show popup after shake effect
        popup.textContent = "Flask shaken to mix the solution!";
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 1000);
    }, 3000);
});

naoh.addEventListener('click', ()=> {
    const naohRect = naoh.getBoundingClientRect()
    const cylinderRect = cylinder.getBoundingClientRect()

    const finalX = cylinderRect.left - naohRect.left+65;
    const finalY = cylinderRect.top - naohRect.top-90;

    naoh.style.transition = 'transform 0.5s ease-in-out';

    setTimeout(()=> {
        naoh.style.transform = `translate(0px, -200px)`;
        setTimeout(()=>{
             naoh.style.transform = `translate(${finalX}px, -200px)`;
             setTimeout(()=>{
                naoh.style.transform = `translate(${finalX}px, ${finalY}px)`;
                //  Tilt NaOH to pour into burette
                setTimeout(() => {
                    naoh.style.setProperty('--x', `${finalX}px`);
                    naoh.style.setProperty('--y', `${finalY}px`);
                    naoh.classList.add('tilt');

                    naohLiquid.style.display = 'block';
                    naohLiquid.style.bottom = `${cylinderRect.bottom - 408}px`;  
                    naohLiquid.style.left = `${cylinderRect.left + 13}px`;
                    setTimeout(() => {
                        naohLiquid.style.height = '120px'; 
                        naohLiquid.style.width = '33px'; 
                    }, 800); 
                    
                    // Show popup
                    popup.textContent = "NaOH added to the burette!";
                    popup.classList.add('show');
                    setTimeout(() => {
                        popup.classList.remove('show');

                        // naohLiquid.style.height= '0px'
                        // Return NaOH to initial position
                        setTimeout(() => {
                            naohLiquid.style.display = 'none'
                            naoh.classList.remove('tilt');
                            naoh.style.transform = `translate(0px, 0px)`;
                        }, 1000);
                    }, 1000);
                }, 1000);
             },1000)
        },1000)
    },0)
})


// Add event listener to NaOH
// naoh.addEventListener('click', () => {
//     const naohRect = naoh.getBoundingClientRect();
//     const buretteRect = emptyBurette.getBoundingClientRect();
    
//     const finalX = buretteRect.left - naohRect.left + 155;
//     const finalY = buretteRect.top - naohRect.top - 100;
    
//     naoh.style.transition = 'transform 0.5s ease-in-out';
    
//     // Move to burette
//     setTimeout(() => {
//         naoh.style.transform = `translate(0px, -200px)`;
        
//         setTimeout(() => {
//             naoh.style.transform = `translate(${finalX}px, -200px)`;
            
//             setTimeout(() => {
//                 naoh.style.transform = `translate(${finalX}px, ${finalY}px)`;
                
//                 // Tilt NaOH to pour into burette
//                 setTimeout(() => {
//                     naoh.style.setProperty('--x', `${finalX}px`);
//                     naoh.style.setProperty('--y', `${finalY}px`);
//                     naoh.classList.add('tilt');
                    
//                     // Show popup
//                     popup.textContent = "NaOH added to the burette!";
//                     popup.classList.add('show');
//                     setTimeout(() => {
//                         popup.classList.remove('show');
                        
//                         // Return NaOH to initial position
//                         setTimeout(() => {
//                             naoh.classList.remove('tilt');
//                             naoh.style.transform = `translate(0px, 0px)`;
//                         }, 1000);
//                     }, 1000);
//                 }, 1000);
//             }, 1000);
//         }, 1000);
//     }, 0);
// });

pipette.addEventListener('click', () => {
    if (isFirstClick) {
        // First click Fill pipette with distilled water
        const waterRect = distilledWater.getBoundingClientRect();
        const pipetteRect = pipette.getBoundingClientRect();
        
        const finalX = waterRect.left - pipetteRect.left + 55;
        const finalY = waterRect.top - pipetteRect.top - 100;
        
        pipette.style.transition = 'transform 0.5s ease-in-out';
        pipetteWater.style.transition = 'transform 0.5s ease-in-out';
        
        // Move to distilled water
        setTimeout(() => {
            pipette.style.transform = `translate(0px, -200px)`;
            pipetteWater.style.transform = `translate(0px, -200px)`;
            
            setTimeout(() => {
                pipette.style.transform = `translate(${finalX}px, -200px)`;
                pipetteWater.style.transform = `translate(${finalX}px, -200px)`;
                
                setTimeout(() => {
                    pipette.style.transform = `translate(${finalX}px, ${finalY}px)`;
                    pipetteWater.style.transform = `translate(${finalX}px, ${finalY}px)`;
                    
                    setTimeout(() => {
                        pipetteWater.classList.add('show');
                        
                        // After filling move to flask
                        const flaskRect = emptyFlask.getBoundingClientRect();
                        const flaskX = flaskRect.left - pipetteRect.left + 37;
                        const flaskY = flaskRect.top - pipetteRect.top - 100;
                        
                        setTimeout(() => {
                            pipette.style.transform = `translate(${flaskX}px, -200px)`;
                            pipetteWater.style.transform = `translate(${flaskX}px, -200px)`;
                            
                            setTimeout(() => {
                                pipette.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
                                pipetteWater.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
                                
                                setTimeout(() => {
                                    pipetteWater.classList.remove('show');
                                    pipetteWater.classList.add('pour');
                                    
                                    // Show filled flask
                                    setTimeout(() => {
                                        filledFlask.classList.add('show');
                                        
                                        // Return pipette to initial position
                                        setTimeout(() => {
                                            pipette.style.transform = `translate(0px, 0px)`;
                                            pipetteWater.style.transform = `translate(0px, 0px)`;
                                            isFirstClick = false;
                                            
                                            // Show popup
                                            popup.classList.add('show');
                                            setTimeout(() => {
                                                popup.classList.remove('show');
                                            }, 1000);
                                        }, 500);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 1000);
                    }, 500);
                }, 500);
            }, 500);
        }, 0);
    } else {
        // Second click Fill pipette with milk
        const milkRect = milkBeaker.getBoundingClientRect();
        const pipetteRect = pipette.getBoundingClientRect();
        
        const finalX = milkRect.left - pipetteRect.left + 55;
        const finalY = milkRect.top - pipetteRect.top - 100;
        
        pipette.style.transition = 'transform 0.5s ease-in-out';
        pipetteMilk.style.transition = 'transform 0.5s ease-in-out';
        
        pipetteMilk.src = 'assets/pippete-solution50ml-grey.png';
        
        // Move to milk beaker
        setTimeout(() => {
            pipette.style.transform = `translate(0px, -200px)`;
            pipetteMilk.style.transform = `translate(0px, -200px)`;
            
            setTimeout(() => {
                pipette.style.transform = `translate(${finalX}px, -200px)`;
                pipetteMilk.style.transform = `translate(${finalX}px, -200px)`;
                
                setTimeout(() => {
                    pipette.style.transform = `translate(${finalX}px, ${finalY}px)`;
                    pipetteMilk.style.transform = `translate(${finalX}px, ${finalY}px)`;
                    
                    setTimeout(() => {
                        pipetteMilk.classList.add('show');
                        
                        // After filling, move to flask
                        const flaskRect = filledFlask.getBoundingClientRect();
                        const flaskX = flaskRect.left - pipetteRect.left + 38;
                        const flaskY = flaskRect.top - pipetteRect.top - 250;
                        
                        setTimeout(() => {
                            pipette.style.transform = `translate(${flaskX}px, -200px)`;
                            pipetteMilk.style.transform = `translate(${flaskX}px, -200px)`;
                            
                            setTimeout(() => {
                                pipette.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
                                pipetteMilk.style.transform = `translate(${flaskX}px, ${flaskY}px)`;
                                
                                setTimeout(() => {
                                    pipetteMilk.classList.remove('show');
                                    pipetteMilk.classList.add('pour');
                                    
                                    // Return pipette to initial position
                                    setTimeout(() => {
                                        pipette.style.transform = `translate(0px, 0px)`;
                                        pipetteMilk.style.transform = `translate(0px, 0px)`;
                                        
                                        // Show popup for milk
                                        popup.textContent = "Milk added to the flask!";
                                        popup.classList.add('show');
                                        setTimeout(() => {
                                            popup.classList.remove('show');
                                        }, 1000);
                                    }, 500);
                                }, 500);
                            }, 500);
                        }, 1000);
                    }, 500);
                }, 500);
            }, 500);
        }, 0);
    }
});
