import * as api from "./api.js";
import * as ui from "./ui.js";

var message = "";

var inputLocked = false;
function lockInput() {
    inputLocked = true;
    ui.lockTextField();
}
function unlockInput() {
    inputLocked = false;
    ui.unlockTextField();
}

function isValidEmail(email) {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
}

async function preOrder() {
    const buttonContainer = document.querySelector(".button-container");
    if (buttonContainer) {
        buttonContainer.remove();
        const textOutput = document.querySelector(".textOutput");
        textOutput.style.display = "block";
        const textArea = document.querySelector("#txt");
        textArea.style.display = "block";
        initializeUserInput();
        var name = await requestName();
        var email = await requestEmail();
        while (!isValidEmail(email)) {
            await display("that email was invalid.");
            email = await requestEmail();
        }
        api.addEntry(name, email);
        const firstName = name.split(" ")[0];
        await display("thank you " + firstName + ".", 10000000);
    }
}
document.getElementById("pre-order").addEventListener("click", preOrder);

var promptOnScreen = false;

async function requestName() {
    lockInput();
    deleteText();
    ui.showCursor();
    await wait(1000);
    await typeDisplayText("please write your name.");
    await wait(1000);
    ui.hideCursor();
    promptOnScreen = true;
    unlockInput();
    return new Promise((resolve) => {
        function handleTextEntered(event) {
            document.removeEventListener("textEntered", handleTextEntered);
            resolve(event.detail.message);
        }
        document.addEventListener("textEntered", handleTextEntered);
    });
}

async function requestEmail() {
    lockInput();
    deleteText();
    ui.showCursor();
    await wait(1000);
    await typeDisplayText("please write your email.");
    await wait(1000);
    ui.hideCursor();
    promptOnScreen = true;
    unlockInput();
    return new Promise((resolve) => {
        function handleTextEntered(event) {
            document.removeEventListener("textEntered", handleTextEntered);
            resolve(event.detail.message);
        }
        document.addEventListener("textEntered", handleTextEntered);
    });
}



function initializeUserInput() {
    document.addEventListener("mousedown", showCursor);
    document.getElementById("txt").addEventListener("input", mobileType);
    document.addEventListener("keydown", handleControl);
}

function showCursor() {
    if (inputLocked) return;
    if (promptOnScreen) {
        promptOnScreen = false;
        deleteText();
    }
    ui.showCursor();
}

function handleControl(event) {
    if (inputLocked) return;
    showCursor();
    if (promptOnScreen) {
        promptOnScreen = false;
        deleteText();
    }
    switch (event.key) {
        case "Backspace":
            removeLastCharacter();
            break;
        case "Enter":
            processText();
            break;
        case "ArrowUp":
        case "ArrowDown":
        case "ArrowLeft":
        case "ArrowRight":
        case "Tab":
        case "Shift":
        case "Control":
        case "Alt":
        case "CapsLock":
        case "Escape":
        case "PageUp":
        case "PageDown":
        case "Home":
        case "End":
        case "Insert":
        case "Delete":
        case "F1":
        case "F2":
        case "F3":
        case "F4":
        case "F5":
        case "F6":
        case "F7":
        case "F8":
        case "F9":
        case "F10":
        case "F11":
        case "F12":
            break;
        default:
            if (!compatibilityCheck(event))
                typeText(event);
            break;
    }
}

function processText() {
    const event = new CustomEvent("textEntered", { detail: { message } });
    document.dispatchEvent(event);
    deleteText();
}

function insertText(text) {
    text = text.toLowerCase();
    message += text;
    ui.addText(text);
}

function removeLastCharacter() {
    if (message.length === 0) return;
    message = message.substring(0, message.length - 1);
    ui.removeText();
}

function deleteText() {
    message = "";
    ui.deleteAllText();
    ui.hideCursor();
}

function mobileType(event) {
    if (inputLocked) return;
    if (compatibilityCheck(event)) {
        typeText(event);
    }
}

function typeText(event) {
    var key = event.data || event.key;
    //if key starts with → remove it
    if (key.startsWith("→")) {
        key = key.substring(1);
    }
    //if (key.length === 1) {

    insertText(key[key.length - 1]);
    ui.resetTextInput();
    //}
}

var keydownDetected = false;
function compatibilityCheck(event) {
    if (event.key) {
        var input = event.key;
        if (input.length === 1) {
            keydownDetected = true;
        }
    }
    //return true when keydown incompatible
    return !keydownDetected;
}

/*Output logs*/

function wait(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function typeDisplayText(text, speed = 75, varience = 40) {
    return new Promise((resolve) => {
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                var s = speed + (Math.random() * varience - varience / 2);
                //think a bit after a space bar
                if (text[i] == " ")
                    s *= 2;

                ui.addText(text[i]);
                i++;
                setTimeout(typeChar, s);
            } else {
                resolve();
            }
        }
        typeChar();
    });
}

async function display(text, showTime = 1000) {
    lockInput();
    deleteText();
    ui.showCursor();
    await wait(1000);
    await typeDisplayText(text);
    await wait(showTime);
    ui.hideCursor();
    deleteText();
    unlockInput();
}