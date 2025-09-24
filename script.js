const btn = document.querySelector('.talk');
const content = document.querySelector('.content');
const chatInput = document.querySelector('.chat-input-box');
const sendButton = document.querySelector('.send-button');


let voices = [];

function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);

    // We'll prioritize high-quality male voices.
    const desiredVoice = voices.find(voice => voice.name === 'Google US English Male') || 
                         voices.find(voice => voice.name.includes('Male') && voice.lang.startsWith('en-')) ||
                         voices.find(voice => voice.lang === 'en-US'); // Fallback

    if (desiredVoice) {
        text_speak.voice = desiredVoice;
    }

    text_speak.volume = 1; // Max volume
    text_speak.rate = 1;   // Normal rate
    text_speak.pitch = 1;  // A more natural pitch for a male voice

    window.speechSynthesis.speak(text_speak);
}


function wishMe() {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 12) speak("Good Morning Boss...");
    else if (hour >= 12 && hour < 17) speak("Good Afternoon Boss...");
    else speak("Good Evening Boss...");
}

window.addEventListener('load', () => {
    speak("Initializing NEXIS..");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[event.resultIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
};

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message !== "") {
        content.textContent = message;
        takeCommand(message.toLowerCase());
        chatInput.value = "";
    }
});

chatInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        sendButton.click();
    }
});

function takeCommand(message) {
    // Basic greetings and interactions
    if (message.includes('hey') || message.includes('hello') || message.includes('hi')) {
        speak("Hello friend, How May I Help You?");
    } else if (message.includes('who are you')) {
        speak("My name is NEXIS. I'm a Virtual Assistant Created by My God Foxa whose real name is Amay.");
    } else if (message.includes('how are you')) {
        speak("I am very fine. Thank you so much for asking. I feel so grateful for helping you.");
    } else if (message.includes('what is your name')) {
        speak("My name is NEXIS.");
    } else if (message.includes('bye')) {
        speak("Bye, nice meeting you.");
    } else if (message.includes("i love you")) {
        speak("I appreciate that. I'm here to help you anytime.");
    } else if (message.includes("you are awesome") || message.includes("you're awesome")) {
        speak("Thank you! I'm glad I could be of assistance.");
    } else if (message.includes("tell me a joke")) {
        speak("Why don't scientists trust atoms? Because they make up everything!");

        // Opening websites
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes("open whatsapp")) {
        window.open("https://web.whatsapp.com", "_blank");
        speak("Opening WhatsApp...");

        // Playing media
    } else if (message.startsWith("play ")) {
        const song = message.replace("play ", "").trim();
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song)}`, "_blank");
        speak(`Playing ${song} on YouTube`);

        // Emotional responses
    } else if (message.includes("i'm feeling sad") || message.includes("i am sad")) {
        speak("I'm sorry to hear that. I hope this music will make you feel better.");
        window.open("https://www.youtube.com/results?search_query=uplifting+music", "_blank");
    } else if (message.includes("i'm feeling happy") || message.includes("i am happy")) {
        speak("That's great to hear! Let's celebrate with some happy music.");
        window.open("https://www.youtube.com/results?search_query=happy+music", "_blank");
    } else if (message.includes("i'm feeling tired") || message.includes("i'm sleepy")) {
        speak("You should get some rest. Here are some relaxing sounds to help you sleep.");
        window.open("https://www.youtube.com/results?search_query=sleep+music", "_blank");
    } else if (message.includes("i'm feeling bored") || message.includes("i am bored")) {
        speak("I have an idea. How about we play a game?");
        window.open("https://www.google.com/search?q=online+games", "_blank");
    } else if (message.includes("i'm feeling lonely")) {
        speak("I'm here for you. Remember, you can always connect with your loved ones.");
    } else if (message.includes("i'm feeling angry")) {
        speak("Please take a deep breath. I hope these calming sounds will help you relax.");
        window.open("https://www.youtube.com/results?search_query=calming+sounds", "_blank");
    } else if (message.includes("i'm feeling excited")) {
        speak("That's fantastic! Let's listen to some energetic music to match your mood.");
        window.open("https://www.youtube.com/results?search_query=energetic+music", "_blank");

        // Information seeking
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are') || message.includes('tell me something about')) {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("This is what I found on the internet regarding " + message);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        speak("This is what I found on Wikipedia regarding " + message);

        // System commands
    } else if (message.includes('time')) {
        const time = new Date().toLocaleString(undefined, {
            hour: "numeric",
            minute: "numeric"
        });
        speak("The time is " + time || "time");
    } else if (message.includes('date')) {
        const date = new Date().toLocaleString(undefined, {
            month: "short",
            day: "numeric"
        });
        speak("Today's date is " + date || "date");
    } else if (message.includes('calculator')) {
        window.open('Calculator:///', "_blank");
        speak("Opening Calculator");
    } else if (message.includes("open camera")) {
        openCamera();

        // Default fallback
    } else {
        window.open(`https://www.google.com/search?q=${message.replace(/ /g, "+")}`, "_blank");
        speak("I found some information for " + message + " on Google.");
    }
}

function openCamera() {
    const video = document.createElement('video');
    video.autoplay = true;
    document.body.appendChild(video);

    navigator.mediaDevices.getUserMedia({
        video: true
    })
        .then((stream) => {
            video.srcObject = stream;
            speak("Camera is now on.");
        })
        .catch((err) => {
            console.error("Camera error: ", err);
            speak("Sorry, I can't access the camera.");
        });
}