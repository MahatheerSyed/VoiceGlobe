// Select necessary elements
const list = document.querySelectorAll(".list");
const activeTab = document.querySelector(".active-tab");
// document.documentElement.requestFullscreen();
// Calculate the positions for the active tab
const calculatePositions = () => {
  const width = document.querySelector(".navigation").offsetWidth;
  const itemWidth = width / list.length;
  const tabWidth = 100; // Adjust this based on your design
  return Array.from(
    { length: list.length },
    (_, i) => i * itemWidth + (itemWidth - tabWidth) / 2
  );
};

// Initial positions and active index
let positions = calculatePositions();
let activeIndex;

// Add click event listeners to the list items
list.forEach((ele, index) => {
  ele.addEventListener("click", function () {
    list.forEach((link) => link.classList.remove("active"));
    this.classList.add("active");
    activeIndex = index;
    moveActiveTab();
  });
});

// Move the active tab to the correct position
function moveActiveTab() {
  let position = positions[activeIndex];
  activeTab.style.left = `${position}px`;
}

// Initialize on page load
window.onload = () => {
  list[0].classList.add("active");
  activeIndex = 0; // Set the initial active index
  moveActiveTab();
};

// Recalculate positions and move the active tab on window resize
window.onresize = () => {
  positions = calculatePositions();
  moveActiveTab();
};

// Typed.js initialization
document.addEventListener("DOMContentLoaded", function () {
  var tl = gsap.timeline();
  tl.from("nav", {
    y: -100,
    duration: 1,
    ease: "power2.out",
  })
    .from(
      ".navigation ul",
      {
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
      },
      "-=0.5"
    )
    .from(
      ".home_text",
      {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.3"
    );
});
// When the page is fully loaded, hide the loader and show the content
document.body.classList.remove("loading");

window.addEventListener("load", function () {
  // Hide the loader once everything (including images) is loaded
  document.querySelector(".loader").style.display = "none";
});
// Selectors for different sections
const home = document.getElementById("home");
const home_text = document.getElementById("home_text");

const mic = document.getElementById("mic");
const translation = document.getElementById("translation");

const info = document.getElementById("info");
const about_page = document.getElementById("about_page");

const feedback_user = document.getElementById("feedback_user1");
const feedback_form = document.getElementById("feedback_form");

const container_output = document.getElementById("container_output");
const textinputlogo = document.getElementById("textinput-logo");
const text_input = document.getElementById("text-input");
const like = document.getElementById("like");
const image_icon_top = document.getElementById("image_icon_top");

home.addEventListener("click", function () {
  translation.style.display = "none";
  home_text.style.display = "flex";
  about_page.style.display = "none";
  feedback_form.style.display = "none";
  container_output.style.display = "none";
  text_input.style.display = "none";
  gsap.from(home_text, {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});
textinputlogo.addEventListener("click", function () {
  translation.style.display = "none";
  home_text.style.display = "none";
  about_page.style.display = "none";
  feedback_form.style.display = "none";
  container_output.style.display = "none";
  text_input.style.display = "flex";
  gsap.from(text_input, {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});
//   // Event listener for info button
info.addEventListener("click", function () {
  home_text.style.display = "none";
  translation.style.display = "none";
  about_page.style.display = "flex";
  feedback_form.style.display = "none";
  container_output.style.display = "none";
  text_input.style.display = "none";
  gsap.from(about_page, {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});
image_icon_top.addEventListener("click", function () {
  home_text.style.display = "none";
  translation.style.display = "none";
  about_page.style.display = "flex";
  feedback_form.style.display = "none";
  container_output.style.display = "none";
  text_input.style.display = "none";
  gsap.from(about_page, {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});

//   // Event listener for feedback button
feedback_user.addEventListener("click", function () {
  console.log("Feedback button clicked");
  feedback_form.style.display = "flex";
  home_text.style.display = "none";
  translation.style.display = "none";
  about_page.style.display = "none";
  container_output.style.display = "none";
  text_input.style.display = "none";
  gsap.from(feedback_form, {
    y: 200,
    duration: 1,
    ease: "power2.out",
  });
});
function opentranslate() {
  document.getElementById("mic").click();
}
mic.addEventListener("click", function () {
  translation.style.display = "flex";
  home_text.style.display = "none";
  about_page.style.display = "none";
  feedback_form.style.display = "none";
  text_input.style.display = "none";
  gsap.from(".translation", {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});
like.addEventListener("click", function () {
  console.log("Feedback button clicked");
  feedback_form.style.display = "flex";
  home_text.style.display = "none";
  translation.style.display = "none";
  about_page.style.display = "none";
  container_output.style.display = "none";

  gsap.from(feedback_form, {
    y: 100,
    duration: 1,
    ease: "power2.out",
  });
});

function copyText() {
  // Get the text from the h1 tag
  var text = document.getElementById("user_input_converted").innerText;

  // Use the Clipboard API to copy the text
  navigator.clipboard
    .writeText(text)
    .then(function () {
      alert("Text copied to clipboard!");
    })
    .catch(function (error) {
      console.error("Failed to copy text: ", error);
    });
}

// ==================remove previous input=========================
document
  .getElementById("textinput-logo")
  .addEventListener("click", function () {
    // Select all elements with the class 'options'
    const optionElements = document.querySelectorAll(".options");

    // Loop through all option elements and deselect all options
    optionElements.forEach(function (options) {
      for (let i = 0; i < options.options.length; i++) {
        options.options[i].selected = false;
      }
    });

    // Clear the text in all text areas with the class 'textArea'
    const textAreas = document.querySelectorAll(".transcribedText");
    textAreas.forEach(function (textArea) {
      textArea.value = "";
    });
  });

const scriptURL =
  "https://script.google.com/macros/s/AKfycbwQxbaiv-SB506TK0mxzVHaDHCX_h_2rEVg8fFHkG8Wpp7smPv2LTSvr83dQZPkIJwu6g/exec";
const form = document.forms["submit-to-google-sheet"];
const loader = document.querySelector(".loader");
const feedbackForm = document.querySelector(".feedback-form");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Show loader and hide the form
  loader.style.display = "block";
  feedbackForm.style.display = "none";

  fetch(scriptURL, { method: "POST", body: new FormData(form) })
    .then((response) => {
      alert("Message Successfully Sent");

      // Hide loader and show form after submission
      loader.style.display = "none";
      feedbackForm.style.display = "block";
    })
    .catch((error) => {
      console.error("Error!", error.message);

      // Hide loader and show form in case of error
      loader.style.display = "none";
      feedbackForm.style.display = "block";
    });

  form.reset();
});

