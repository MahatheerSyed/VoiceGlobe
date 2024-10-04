// let latestAudioURL = ""; // Variable to store the latest audio URL

document
  .getElementById("buttontranslate")
  .addEventListener("click", function () {
    console.log("clicked");

    // Show loader and hide other elements during input
    document.querySelector(".text-input").style.display = "flex";
    document.querySelector(".speechtotext").style.display = "none";
    document.querySelector(".container_output").style.display = "none";

    // Gather input values
    const sourceLanguage1 = document.getElementById("sourceLanguage").value;
    const targetLanguage1 = document.getElementById("targetLanguage").value;
    const transcribedText1 = document.getElementById("transcribedText").value;

    // Store the values in an array
    let inputs = [sourceLanguage1, targetLanguage1, transcribedText1];

    // Call the function to send inputs to the server
    sendToServer(inputs);

    function sendToServer(inputs) {
      if (inputs.length === 3) {
        const [sourceLanguage1, targetLanguage1, transcribedText1] = inputs;

        // Show loader and hide text input
        document.getElementById("text-input").style.display = "none";
        document.querySelector(".loader").style.display = "block";

        // Display the selected languages
        const sourceLangElem = document.querySelector(".suroce_lang");
        const destLangElem = document.querySelector(".dest_lang");
        const userInputGivenElem = document.getElementById("user_input_given");
        const userInputConvertedElem = document.getElementById(
          "user_input_converted"
        );

        if (sourceLangElem) sourceLangElem.textContent = sourceLanguage1;
        if (destLangElem) destLangElem.textContent = targetLanguage1;
        if (userInputGivenElem)
          userInputGivenElem.textContent = transcribedText1;

        const requestPayload = {
          texts: [sourceLanguage1, targetLanguage1, transcribedText1],
        };

        // Send the request to the server
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
            return response.json();
          })
          .then((data) => {
            console.log("Server response:", data);

            // Hide loader after receiving response
            document.querySelector(".loader").style.display = "none";

            if (userInputConvertedElem) {
              if (data.translation) {
                userInputConvertedElem.textContent = data.translation;
              } else {
                console.error("Translation Error:", data.error);
                userInputConvertedElem.textContent =
                  "Translation failed or not supported.";
              }
            }

            // Show the output container
            document.querySelector(".container_output").style.display = "flex";
            document.querySelector(".text-input").style.display = "none";

            // If audio URL is returned, store it for playback and play it immediately
            if (data.audio_url) {
              latestAudioURL = data.audio_url; // Store the latest audio URL
              console.log("Audio URL saved and played:", latestAudioURL);

              // Play the newly created audio
              playAudioFromURL(latestAudioURL);
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            if (userInputConvertedElem) {
              userInputConvertedElem.textContent = "Error occurred.";
            }

            // Show the output container even in case of error
            document.querySelector(".container_output").style.display = "flex";
            document.querySelector(".text-input").style.display = "none";
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
        // Show output container and hide text input
        document.querySelector(".container_output").style.display = "flex";
        document.querySelector(".text-input").style.display = "none";
      }
    }
  });

// Function to play audio from a URL
function playAudioFromURL(url) {
  const audio = new Audio(url);
  audio.play().catch((error) => console.error("Error playing audio:", error));
}
