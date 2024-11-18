document.addEventListener("DOMContentLoaded", function () {
  // Newsletter Signup Form
  var signupForm = document.getElementById("signup-form");
  var signupFormMessage = document.getElementById("signup-form-message");

  signupForm.onsubmit = function (event) {
    event.preventDefault(); // Prevent default submission for the signup form

    var formData = new FormData(signupForm);
    var xhr = new XMLHttpRequest();

    xhr.open("POST", signupForm.action, true);
    xhr.send(formData);

    xhr.onload = function () {
      if (xhr.status === 200) {
        signupFormMessage.classList.remove("hidden");
        signupFormMessage.innerHTML = "Thanks for subscribing!";
        signupForm.reset(); // Clear the input fields after successful submission
        // Hide the message after 3 seconds
        setTimeout(function () {
          signupFormMessage.classList.add("hidden");
        }, 3000);
      } else {
        var response = JSON.parse(xhr.response);
        signupFormMessage.innerHTML = "Error: " + response.error;
      }
    };
  };
});
