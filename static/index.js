// Select necessary elements
const list = document.querySelectorAll(".list");
const activeTab = document.querySelector(".active-tab");
// document.documentElement.requestFullscreen();
// Calculate the positions for the active tab
const calculatePositions = () => {
  const width = document.querySelector(".navigation").offsetWidth;
  const itemWidth = width / list.length;
  const tabWidth = 90; // Adjust this based on your design
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
var typed = new Typed(".typing", {
  strings: [
    "Your Language Assistant",
    "Translate Your Voice",
    "Which language would you like",
    "to translate into ?",
  ],
  typeSpeed: 50,
  backSpeed: 90,
  loop: true, // Optional: To loop the typing effect
  showCursor: false,
});

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

//   // Selectors for different sections
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

document.getElementById("playAudioIcon").addEventListener("click", function () {
  const audio = new Audio("/audio");
  audio.play().catch((error) => console.error("Error playing audio:", error));
});
function playAudioFromURL(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      return audioContext.decodeAudioData(arrayBuffer);
    })
    .then((decodedData) => {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createBufferSource();
      source.buffer = decodedData;
      source.connect(audioContext.destination);
      source.start(0);
    })
    .catch((error) => console.error("Error playing audio:", error));
}
function output_new() {
  const audio = new Audio("static/audio/output.mp3");
  audio.play().catch(function (err) {
    console.log(err);
  });
}

// Function to observe visibility of the container
function observeVisibility() {
  const container = document.getElementById("container_output");

  if (!container) {
    console.error("Container element not found");
    return;
  }

  // Create a new IntersectionObserver
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // The container is visible, play the audio
        output_new();
        // Optionally, stop observing after the first play
        observer.unobserve(entry.target);
      }
    });
  });

  // Start observing the container element
  observer.observe(container);
}

// Call the function to start observing the container
observeVisibility();
