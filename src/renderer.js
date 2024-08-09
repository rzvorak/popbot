/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 * To learn more about the differences between the "main" and the "renderer" context in
 * Electron, visit:
 *
 * https://electronjs.org/docs/tutorial/application-architecture#main-and-renderer-processes
 *
 * By default, Node.js integration in this file is disabled. When enabling Node.js integration
 * in a renderer process, please be aware of potential security implications. You can read
 * more about security risks here:
 *
 * https://electronjs.org/docs/tutorial/security
 *
 * To enable Node.js integration in this file, open up `main.js` and enable the `nodeIntegration`
 * flag:
 *
 * ```
 *  // Create the browser window.
 *  mainWindow = new BrowserWindow({
 *    width: 800,
 *    height: 600,
 *    webPreferences: {
 *      nodeIntegration: true
 *    }
 *  });
 * ```
 */

import './index.css';
import './utils.css';
import './components/main.css';
import './components/settings.css';

const settingsButton = document.querySelector(".settings__button");
const settings = document.querySelector(".settings");
const autoOn = document.querySelector(".settings__auto__on");
const autoOff= document.querySelector(".settings__auto__off");
const lightMode = document.querySelector(".settings__sun");
const darkMode = document.querySelector(".settings__moon");

// Settings tab toggle
let isSettingsOpen = false;
settingsButton.addEventListener("click", async () => {
    isSettingsOpen = !isSettingsOpen;
        if (isSettingsOpen) {
            settingsButton.style.transform = "rotate(1080deg)";
            settings.style.transform = "translateY(0vh)";
        } else {
            settingsButton.style.transform = "rotate(0deg)";
            settings.style.transform = "translateY(100vh)";
        }
})

// Auto Log-in toggle
let isAutoOn = true;
autoOn.addEventListener("click", () => {
    if (!isAutoOn) {
        autoOff.classList.toggle("active");
        autoOn.classList.toggle("active");
        if (!isLightOn) {
            autoOn.classList.toggle("dark-mode");
            autoOff.classList.toggle("dark-mode");
        }
        isAutoOn = !isAutoOn;
    }
})
autoOff.addEventListener("click", () => {
    if (isAutoOn) {
        autoOff.classList.toggle("active");
        autoOn.classList.toggle("active");
        if (!isLightOn) {
            autoOn.classList.toggle("dark-mode");
            autoOff.classList.toggle("dark-mode");
        }
        isAutoOn = !isAutoOn;
    }
})

const root = document.documentElement;

// Light/dark color toggle
let isLightOn = true;
lightMode.addEventListener("click", () => {
    if (!isLightOn) {
        lightMode.classList.toggle("active");
        darkMode.classList.toggle("active");
        isLightOn = !isLightOn;

        lightMode.classList.toggle("dark-mode");
        if (isAutoOn) {
            autoOff.classList.toggle("dark-mode");
        } else {
            autoOn.classList.toggle("dark-mode");
        }

        root.style.setProperty('--clr-red50', '#fef2f2');
        root.style.setProperty('--clr-red100', '#fee2e2');
        root.style.setProperty('--clr-red500', '#d62525');
        root.style.setProperty('--clr-red700', '#b91c1c');
        root.style.setProperty('--clr-light', '#f5f5f5');
        root.style.setProperty('--clr-dark', '#0a0a0a');
    }
})
darkMode.addEventListener("click", () => {
    if (isLightOn) {
        lightMode.classList.toggle("active");
        darkMode.classList.toggle("active");
        isLightOn = !isLightOn;

        lightMode.classList.toggle("dark-mode");
        if (isAutoOn) {
            autoOff.classList.toggle("dark-mode");
        } else {
            autoOn.classList.toggle("dark-mode");
        }
        
        root.style.setProperty('--clr-red50', '#5a0000');
        root.style.setProperty('--clr-red100', '#ad0c0c');
        root.style.setProperty('--clr-red500', '#830000');
        root.style.setProperty('--clr-red700', '#691414');
        root.style.setProperty('--clr-light', '#0a0a0a');
        root.style.setProperty('--clr-dark', '#f5f5f5');
    }
})

// Menu text adjustment
const menuItems = document.querySelectorAll(".menu__item");
menuItems.forEach((element) => {
    element.addEventListener('mouseover', () => {
        element.querySelector('.menu__item__title').style.transform = "translateX(30vw)";
    })
    element.addEventListener('mouseout', () => {
        element.querySelector('.menu__item__title').style.transform = "translateX(0vw)";
    })
})

// handle refresh item movement
const menuRefresh = document.querySelector(".refresh");
const refreshButton = document.querySelector(".refresh__button");
const refreshSettings = document.querySelector(".refresh__settings");
menuRefresh.addEventListener("mouseover", async () => {
    refreshButton.style.transition = "transform 0.4s ease-in-out, font-size 0.1s ease-in-out";
    refreshSettings.style.transition = "transform 0.5s ease-in-out";
})
menuRefresh.addEventListener("mouseout", async () => {
    refreshButton.style.transition = "transform 0.6s ease-in-out, font-size 0.1s ease-in-out";
    refreshSettings.style.transition = "transform 0.3s ease-in-out";
})

// handle followers item movement
const menuFollowers = document.querySelector(".followers");
const followersButtons = document.querySelector(".followers__button__container");
const followersOptions = document.querySelector(".followers__options__container");
menuFollowers.addEventListener("mouseover", async () => {
    followersButtons.style.transition = "transform 0.5s ease-in-out";
    followersOptions.style.transition = "transform 0.4s ease-in-out";
})
menuFollowers.addEventListener("mouseout", async () => {
    followersButtons.style.transition = "transform 0.3s ease-in-out";
    followersOptions.style.transition = "transform 0.4s ease-in-out";
})

// handle interact item movement
const menuInteract = document.querySelector(".interact");
const interactButton = document.querySelector(".interact__button");
const interactSettings = document.querySelector(".interact__settings");
menuInteract.addEventListener("mouseover", async () => {
    interactButton.style.transition = "transform 0.4s ease-in-out, font-size 0.1s ease-in-out";
    interactSettings.style.transition = "transform 0.5s ease-in-out";
})
menuInteract.addEventListener("mouseout", async () => {
    interactButton.style.transition = "transform 0.6s ease-in-out, font-size 0.8s ease-in-out";
    interactSettings.style.transition = "transform 0.3s ease-in-out";
})


// refresh slider output handling
const refreshSpeed = document.querySelector(".refresh__speed__slider");
const refreshCount = document.querySelector(".refresh__count__slider");
const speedOut = document.querySelector(".refresh__speed__output");
const countOut = document.querySelector(".refresh__count__output");

refreshSpeed.addEventListener('input', () => {
    speedOut.textContent = refreshSpeed.value;
})

refreshCount.addEventListener('input', () => {
    if (refreshCount.value == 100) {
        countOut.textContent = "All";
    } else if (refreshCount.value > 90) {
        countOut.textContent = "150";
    } else if (refreshCount.value > 80) {
        countOut.textContent = "125";
    } else if (refreshCount.value > 70) {
        countOut.textContent = "100";
    } else if (refreshCount.value > 60) {
        countOut.textContent = "80";
    } else if (refreshCount.value > 50) {
        countOut.textContent = "40";
    } else if (refreshCount.value > 40) {
        countOut.textContent = "25";
    } else if (refreshCount.value > 0) {
        countOut.textContent = Math.floor(refreshCount.value / 2);
    }    
})

// followers slider output handling
const followersCount = document.querySelector(".followers__slider");
const followersOut = document.querySelector(".followers__output")
followersCount.addEventListener('input', () => {
    if (followersCount.value == 100) {
        followersOut.textContent = "750";
    } else if (followersCount.value > 90) {
        followersOut.textContent = "500";
    } else if (followersCount.value > 80) {
        followersOut.textContent = "400";
    } else if (followersCount.value > 70) {
        followersOut.textContent = "300";
    } else if (followersCount.value > 60) {
        followersOut.textContent = "200";
    } else if (followersCount.value > 50) {
        followersOut.textContent = "150";
    } else if (followersCount.value > 40) {
        followersOut.textContent = "100";
    } else if (followersCount.value > 0) {
        followersOut.textContent = Math.floor(followersCount.value / 2) * 5;
    }    
})

// interact slider output handling
const interactCount = document.querySelector(".interact__slider");
const interactOut = document.querySelector(".interact__count__output")
interactCount.addEventListener('input', () => {
    interactOut.textContent = interactCount.value;
})


// figure this thing out *//////////////////////////////////////////
window.addEventListener('DOMContentLoaded', () => {
    refreshButton.addEventListener('click', () => {
        window.electron.runPythonScript().then(result => {
            console.log('Script Output:', result.output);
            alert('Script executed. Check the console for output.');
        }).catch(error => {
            console.error('Error:', error.error);
            alert('Error executing script.');
        });
    });
});


