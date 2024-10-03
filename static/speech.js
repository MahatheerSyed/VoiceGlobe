document.getElementById("mic").addEventListener("click", function () {
  const backgroundAudio = new Audio("static/audio/pop1.mp3");
  backgroundAudio
    .play()
    .then(() => {
      // Wait for the audio to finish playing
      backgroundAudio.onended = function () {
        // Now, handle microphone access after audio has played
        startMicrophoneAccess();
      };
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });

  function startMicrophoneAccess() {
    // Function to handle microphone access
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        console.log("Microphone access granted");
        // Perform actions with the microphone stream
      })
      .catch(function (error) {
        console.error("Error accessing microphone:", error);
      });
  }

  const speech = true;
  window.SpeechRecognition =
    window.webkitSpeechRecognition || window.SpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.continuous = false;

  let timeout;
  let inputs = [];
  let inputCount = 0;
  const maxInputs = 3;
  let sourceLanguage = "en-US"; // Default to English

  const prompts = [
    "Could you please specify the source language",
    "the target language",
    "Also, kindly speak the content that needs translation.",
  ];

  // Show .translation and .speechtotext during input
  document.querySelector(".translation").style.display = "flex";
  document.querySelector(".speechtotext").style.display = "block";
  document.querySelector(".container_output").style.display = "none";

  // Update #ask_user content with the current prompt
  const askUserElem = document.getElementById("ask_user");
  if (askUserElem) {
    askUserElem.textContent = prompts[inputCount];
  }

  recognition.addEventListener("result", (e) => {
    clearTimeout(timeout);
    const transcript = Array.from(e.results)
      .map((result) => result[0])
      .map((result) => result.transcript)
      .join("");

    console.log("Transcript:", transcript);
    document.getElementById("convert_text").textContent = transcript;

    timeout = setTimeout(() => {
      inputs.push(transcript);
      inputCount++;

      // Update the prompt for the next input
      if (inputCount < maxInputs && askUserElem) {
        askUserElem.textContent = prompts[inputCount];
      }

      recognition.stop();
    }, 2500);
  });

  recognition.addEventListener("end", () => {
    if (speech && inputCount < maxInputs) {
      if (inputCount === 1) {
        // The first input is the source language
        sourceLanguage = inputs[1];
        recognition.lang = getLanguageCode(sourceLanguage) || "en-US";
      } else if (inputCount === 2) {
        // The second input is the target language
        // The language setting should be left as it is since the target language is not used to set recognition.lang
      }
      recognition.start();
    } else {
      console.log("Final Inputs:", inputs);
      sendToServer(inputs);
    }
  });

  if (speech && inputCount < maxInputs) {
    recognition.start();
  }

  function sendToServer(inputs) {
    if (inputs.length === 3) {
      const [sourceLanguage, targetLanguage, transcribedText] = inputs;
      document.getElementById("translation").style.display = "none";
      document.querySelector(".loader").style.display = "block";
      const backgroundAudio = new Audio("static/audio/pop2.mp3");
      backgroundAudio
        .play()
        .then(() => {
          // Wait for the audio to finish playing
          backgroundAudio.onended = function () {
            // Now, handle microphone access after audio has played
            startMicrophoneAccess();
          };
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });

      function startMicrophoneAccess() {
        // Function to handle microphone access
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(function (stream) {
            console.log("Microphone access granted");
            // Perform actions with the microphone stream
          })
          .catch(function (error) {
            console.error("Error accessing microphone:", error);
          });
      }

      console.log("Sending to server:", {
        sourceLanguage,
        targetLanguage,
        transcribedText,
      });

      // Display sourceLanguage and targetLanguage in their respective elements
      const sourceLangElem = document.querySelector(".suroce_lang");
      const destLangElem = document.querySelector(".dest_lang");
      const userInputGivenElem = document.getElementById("user_input_given");
      const userInputConvertedElem = document.getElementById(
        "user_input_converted"
      );

      if (sourceLangElem) sourceLangElem.textContent = sourceLanguage;
      else console.error("Error: .source_lang element not found.");

      if (destLangElem) destLangElem.textContent = targetLanguage;
      else console.error("Error: .dest_lang element not found.");

      if (userInputGivenElem) userInputGivenElem.textContent = transcribedText;
      else console.error("Error: #user_input_given element not found.");

      const requestPayload = {
        texts: [sourceLanguage, targetLanguage, transcribedText],
      };

      fetch("/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((text) => {
          if (text) {
            return JSON.parse(text);
          } else {
            throw new Error("Empty response");
          }
        })
        .then((data) => {
          console.log("Server response:", data);
          document.querySelector(".loader").style.display = "none";
          if (userInputConvertedElem) {
            if (data.translation) {
              userInputConvertedElem.textContent = data.translation;
              document.getElementById("convert_text").innerText = " ";
              playAudioFromURL("static/audio/output.mp3");
            } else {
              console.error("Translation Error:", data.error);
              userInputConvertedElem.textContent =
                "Translation failed or not supported.";
            }
          } else {
            console.error("Error: #user_input_converted element not found.");
          }

          // Show .container_output and hide .translation
          document.querySelector(".container_output").style.display = "flex";
          document.querySelector(".translation").style.display = "none";
        })
        .catch((error) => {
          console.error("Error:", error);
          if (userInputConvertedElem) {
            userInputConvertedElem.textContent = "Error occurred.";
          }
          // Show .container_output and hide .translation
          document.querySelector(".container_output").style.display = "flex";
          document.querySelector(".translation").style.display = "none";
        });
    } else {
      console.error("Error: Exactly 3 inputs are required.");
      const userInputConvertedElem = document.getElementById(
        "user_input_converted"
      );
      if (userInputConvertedElem) {
        userInputConvertedElem.textContent =
          "Error: Exactly 3 inputs are required.";
      }
      // Show .container_output and hide .translation
      document.querySelector(".container_output").style.display = "flex";
      document.querySelector(".translation").style.display = "none";
    }
  }

  // Helper function to map language names to BCP 47 language codes
  function getLanguageCode(language) {
    const languages = {
      English: "en-US",
      Spanish: "es-ES",
      French: "fr-FR",
      German: "de-DE",
      Chinese: "zh-CN",
      Hindi: "hi-IN",
      Telugu: "te-IN",
      Tamil: "ta-IN",
      Japanese: "ja-JP",
      Urdu: "ur-PK", // Urdu is commonly associated with Pakistan, so I used the 'ur-PK' code
    };

    return languages[language] || "Language not found";
  }
});
function handleTranslationResponse(response) {
  const translationElement = document.getElementById("translation");
  translationElement.textContent = response.translation;

  // If the play_audio flag is set and audio_url is provided, play the audio
  if (response.play_audio && response.audio_url) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = response.audio_url;
    audioPlayer.hidden = false; // Show the audio player
    audioPlayer.play(); // Automatically play the audio once
  }
}
