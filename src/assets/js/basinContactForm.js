document.addEventListener("DOMContentLoaded", function() {
  var contactForm = document.getElementById("contact-form");
  var contactFormMessage = document.getElementById("contact-form-message");

  // Only proceed if both elements are found
  if (contactForm && contactFormMessage) {
    contactForm.onsubmit = function(event) {
      event.preventDefault(); // Prevent default submission for the contact form
      
      var formData = new FormData(contactForm);
      var xhr = new XMLHttpRequest();
      
      xhr.open("POST", contactForm.action, true);
      xhr.send(formData);
      
      xhr.onload = function() {
        if (xhr.status === 200) {
          contactFormMessage.classList.remove("hidden");
          contactFormMessage.innerHTML = "Email sent. Thanks!";
          contactForm.reset(); // Clear the input fields after successful submission
          
          // Hide the message after 3 seconds
          setTimeout(function() {
            contactFormMessage.classList.add("hidden");
          }, 3000);
        } else {
          try {
            var response = JSON.parse(xhr.response);
            contactFormMessage.innerHTML = "Error: " + (response.error || "An error occurred.");
          } catch (e) {
            contactFormMessage.innerHTML = "Error: An unexpected error occurred.";
          }
        }
      };
    };
  }
});
