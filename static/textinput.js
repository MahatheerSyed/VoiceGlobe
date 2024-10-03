document
  .getElementById("buttontranslate")
  .addEventListener("click", function () {
    console.log("clicked");
    // Show .translation and .speechtotext during input
    document.querySelector(".text-input").style.display = "flex";
    document.querySelector(".speechtotext").style.display = "none";
    document.querySelector(".container_output").style.display = "none";

    // Update #ask_user content with the current prompt
    const sourceLanguage1 = document.getElementById("sourceLanguage").value;
    const targetLanguage1 = document.getElementById("targetLanguage").value;
    const transcribedText1 = document.getElementById("transcribedText").value;

    // Store the values in the array
    let inputs = [sourceLanguage1, targetLanguage1, transcribedText1];

    // Call the sendToServer function with inputs
    sendToServer(inputs);

    function sendToServer(inputs) {
      if (inputs.length === 3) {
        const [sourceLanguage1, targetLanguage1, transcribedText1] = inputs;
        document.getElementById("text-input").style.display = "none";
        document.querySelector(".loader").style.display = "block";
        console.log("Sending to server:", {
          sourceLanguage1,
          targetLanguage1,
          transcribedText1,
        });

        // Display sourceLanguage and targetLanguage in their respective elements
        const sourceLangElem = document.querySelector(".suroce_lang");
        const destLangElem = document.querySelector(".dest_lang");
        const userInputGivenElem = document.getElementById("user_input_given");
        const userInputConvertedElem = document.getElementById(
          "user_input_converted"
        );

        if (sourceLangElem) sourceLangElem.textContent = sourceLanguage1;
        else console.error("Error: .source_lang element not found.");

        if (destLangElem) destLangElem.textContent = targetLanguage1;
        else console.error("Error: .dest_lang element not found.");

        if (userInputGivenElem)
          userInputGivenElem.textContent = transcribedText1;
        else console.error("Error: #user_input_given element not found.");

        const requestPayload = {
          texts: [sourceLanguage1, targetLanguage1, transcribedText1],
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
            return response.json();
          })
          .then((data) => {
            console.log("Server response:", data);
            document.querySelector(".loader").style.display = "none";
            if (userInputConvertedElem) {
              if (data.translation) {
                userInputConvertedElem.textContent = data.translation;
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
            document.querySelector(".text-input").style.display = "none";
          })
          .catch((error) => {
            console.error("Error:", error);
            if (userInputConvertedElem) {
              userInputConvertedElem.textContent = "Error occurred.";
            }
            // Show .container_output and hide .translation
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
        // Show .container_output and hide .translation
        document.querySelector(".container_output").style.display = "flex";
        document.querySelector(".text-input").style.display = "none";
      }
    }
  });
