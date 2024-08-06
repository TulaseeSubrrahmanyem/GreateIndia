// Function to toggle between login and register panels
function toggleForms() {
  var loginPanel = document.getElementById('loginPanel');
  var registerPanel = document.getElementById('registerPanel');
 
  if (loginPanel.classList.contains('hidden')) {
    loginPanel.classList.remove('hidden');
    registerPanel.classList.add('hidden');
  } else {
    loginPanel.classList.add('hidden');
    registerPanel.classList.remove('hidden');
  }
}
 // Function to toggle between login and register forms
function toggleForms() {
  var card3DWrapper = document.querySelector('.card-3d-wrapper');
  card3DWrapper.classList.toggle('flip');
}
// Function to check if email is already registered
function isEmailRegistered(email) {
  var registeredUsers = JSON.parse(localStorage.getItem('userDetails')) || [];
  return registeredUsers.some(function(user) {
    return user.email === email;
  });
}

// Event listener to handle form toggling when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Initially, hide the register panel
  var registerPanel = document.getElementById('registerPanel');
  if (registerPanel) {
    registerPanel.classList.add('hidden');
  }

   // Check if the user is already logged in
   if (localStorage.getItem('loggedIn') === 'true') {
      // Redirect to homepage if already logged in
      window.location.href = "homepage.html";
  }
  // Event listener for login form submission
  document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var email = document.getElementById('loginEmail').value;
    var password = document.getElementById('loginPassword').value;
    var emailErrorMessage = document.getElementById('emailErrorMessage');
    var passwordErrorMessage = document.getElementById('passwordErrorMessage');

    // Reset error messages
    emailErrorMessage.innerText = "";
    passwordErrorMessage.innerText = "";

    // Validate email
    if (!email) {
      emailErrorMessage.innerText = "Email cannot be empty!";
      emailErrorMessage.style.display = 'block';
      return;
    } else if (!email.match(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|.+\.org|.+\.in)$/)) {
      emailErrorMessage.innerText = "Invalid email format!";
      emailErrorMessage.style.display = 'block';
      return;
    }

    // Validate password
    if (!password) {
      passwordErrorMessage.innerText = "Password cannot be empty!";
      passwordErrorMessage.style.display = 'block';
      return;
    } else if (!password.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?/~-])[A-Za-z\d!@#$%^&*()_+{}:;<>,.?/~-]{8,}$/)) {
      passwordErrorMessage.innerText = "Password should be at least 8 characters and contain at least one uppercase letter, one digit, and one special character!";
      passwordErrorMessage.style.display = 'block';
      return;
    }

    // Check if the user exists in local storage
  //   var storedUser = JSON.parse(localStorage.getItem("userDetails"));
  //   console.log(storedUser)
  //   if (storedUser && storedUser.email === email && storedUser.password === password) {
  //     // Reset error messages
  //     emailErrorMessage.innerText = "";
  //     passwordErrorMessage.innerText = "";

  //     // Redirect to homepage after successful login (for demo)
  //     window.location.href = "homepage.html";
  //   } else {
  //     passwordErrorMessage.innerText = "Invalid email or password!";
  //     passwordErrorMessage.style.display = 'block';
  //   }
  // });


  var registeredUsers = JSON.parse(localStorage.getItem("userDetails")) || [];
    var user = registeredUsers.find(function(user) {
      sessionStorage.setItem('loggedIn', 'true');

      return user.Email === email && user.Password === password;
      

    });

    if (user) {
      // Reset error messages
      emailErrorMessage.innerText = "";
      passwordErrorMessage.innerText = "";

      localStorage.setItem('loggedIn', 'true');
      // Redirect to homepage after successful login (for demo)
      window.location.href = "homepage.html";
    } else {
      passwordErrorMessage.innerText = "Invalid email or password!";
      passwordErrorMessage.style.display = 'block';
    }
  });


  // Event listener for register form submission
  document.getElementById('registerForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var name = document.getElementById('registerName').value;
    var email = document.getElementById('registerEmail').value;
    var password = document.getElementById('registerPassword').value;
    var gender = document.querySelector('input[name="gender"]:checked');

    var regisNameErrorMessage = document.getElementById('regisNameErrorMessage');
    var regisEmailErrorMessage = document.getElementById('regisEmailErrorMessage');
    var regisPasswordErrorMessage = document.getElementById('regisPasswordErrorMessage');
    var regisGenderErrorMessage = document.getElementById('regisGenderErrorMessage');

    // Reset error messages
    regisNameErrorMessage.innerText = "";
    regisEmailErrorMessage.innerText = "";
    regisPasswordErrorMessage.innerText = "";
    regisGenderErrorMessage.innerText = "";

    // Validate name
    if (!name) {
      regisNameErrorMessage.innerText = "Name cannot be empty!";
      regisNameErrorMessage.style.display = 'block';
      return;
    } else if (!name.match(/^[A-Za-z\s]{1,16}$/)) {
      regisNameErrorMessage.innerText = "Name should contain only alphabets and spaces, and be 1 to 16 characters long!";
      regisNameErrorMessage.style.display = 'block';
      return;
  }
  
    

    // Validate email
    if (!email) {
      regisEmailErrorMessage.innerText = "Email cannot be empty!";
      regisEmailErrorMessage.style.display = 'block';
      return;
    } else if (!email.match(/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|.+\.org|.+\.in)$/)) {
      regisEmailErrorMessage.innerText = "Invalid email format!";
      regisEmailErrorMessage.style.display = 'block';
      return;
    } else if (isEmailRegistered(email)) {
      regisEmailErrorMessage.innerText = "Email is already registered!";
      regisEmailErrorMessage.style.display = 'block';
      return;
    }

    // Validate password
    if (!password) {
      regisPasswordErrorMessage.innerText = "Password cannot be empty!";
      regisPasswordErrorMessage.style.display = 'block';
      return;
    } else if (!password.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}:;<>,.?/~-])[A-Za-z\d!@#$%^&*()_+{}:;<>,.?/~-]{8,}$/)) {
      regisPasswordErrorMessage.innerText = "Password should be 8 characters with uppercase, digits, and special characters.";
      regisPasswordErrorMessage.style.display = 'block';
      return;
    }

    // Validate gender
    if (!gender) {
      regisGenderErrorMessage.innerText = "Please select a gender!";
      regisGenderErrorMessage.style.display = 'block';
      return;
    }

    // Store the registration details in local storage
    var user = {
      Name: name,
      Email: email,
      Password: password,
      Gender: gender.value
    };
    var registeredUsers = JSON.parse(localStorage.getItem('userDetails')) || [];
    registeredUsers.push(user);
    localStorage.setItem("userDetails", JSON.stringify(registeredUsers));

    // Display success message (popup)
    // showAlert("Registration successful!");

    // Clear input fields
    document.getElementById('registerName').value = "";
    document.getElementById('registerEmail').value = "";
    document.getElementById('registerPassword').value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;

    // Switch to login form after successful registration (for demo)
    toggleForms();
    sendToGoogleSheets(user);
  });
});

// Function to display input fields with error messages below each field
function displayInputsWithErrors() {
  var inputFields = document.querySelectorAll('.input-field');
  inputFields.forEach(function (field) {
    var input = field.querySelector('input');
    var errorMessage = field.querySelector('.error-message');
    if (errorMessage.innerText) {
      input.style.borderColor = 'red'; // Optionally highlight the input field
      var errorLabel = document.createElement('div');
      errorLabel.classList.add('error-label');
      errorLabel.innerText = errorMessage.innerText;
      field.appendChild(errorLabel);
    }
  });
}

function sendToGoogleSheets(user) {
  const scriptURL = 'https://sheetdb.io/api/v1/gz42pjm9ptc4c';
  fetch(scriptURL, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('SheetDB Response:', data); // Log SheetDB response for debugging
    if (data && data.created === 1) {
      showAlert("Registration successful!");
      // Additional actions upon successful registration (redirect, clear form, etc.)
    } else {
      throw new Error('Failed to register');
    }
  })
  .catch(error => {
    console.error('Error!', error.message);
    showAlert('Failed to register. Please try again.');
  });
}



// Function to show custom alert message at the middle of the page
// function showAlert(message, alertClass = '') {
//   // Create alert box
//   var alertBox = document.createElement('div');
//   alertBox.classList.add('custom-alert');
//   if (alertClass) {
//     alertBox.classList.add(alertClass); // Add custom CSS class for styling
//   }
//   alertBox.innerText = message;

//   // Append to body
//   document.body.appendChild(alertBox);

//   // Remove after a delay
//   setTimeout(function() {
//     alertBox.remove();
//   }, 3000); // Adjust delay as needed

   


// }

