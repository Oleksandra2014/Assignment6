// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD3b05UZcuj3P1ZsIJYsHwqmTulC88olmE",
    authDomain: "assignment6-1d905.firebaseapp.com",
    databaseURL: "https://assignment6-1d905-default-rtdb.firebaseio.com",
    projectId: "assignment6-1d905",
    storageBucket: "assignment6-1d905.firebasestorage.app",
    messagingSenderId: "778511108971",
    appId: "1:778511108971:web:f6abe3d3cb65413fff9a2e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();


// Sign-Up
document.getElementById('signup-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  console.log("Email is", email);
  console.log("Password is", password);
  console.log("Dob is", dob);
  console.log("Name is", name);

  // Convert DOB to a Date object
  const dobDate = new Date(dob);
  const today = new Date();

  // Check if the selected DOB is in the future
  if (dobDate > today) {
      alert("Date of birth cannot be in the future. Please enter a valid date.");
      return; // Stop execution if the date is invalid
  }

  try {
    const userInput = await auth.createUserWithEmailAndPassword(email, password);
    const userId = userInput.user.uid;

    // const newUserRef = db.ref('users').push();
    //     await newUserRef.set({
    //         id: userId,  // Store user ID explicitly
    //         name,
    //         dob
    //     });

    await db.ref('users/' + userId).set({ name, dob });
    alert('Sign-up successful! Log in, please!');
  } catch (error) {
    console.error(error.message);
  }
});

// Login
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Check if fields are empty
//   if (!email || !password) {
//     alert("Please enter both email and password.");
//     return;
// }

  try {
    const userInput = await auth.signInWithEmailAndPassword(email, password);
    const userId = userInput.user.uid;
    const userSnapshot = await db.ref('users/' + userId).get();

    // Check if user data exists in the database
  //   if (!userSnapshot.exists()) {
  //     alert("User not found. Please check your email and try again.");
  //     return;
  // }

    const user = userSnapshot.val();

    document.getElementById('signup-page').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';

    document.getElementById('user-name').textContent = user.name;

    // Birthday Count days
    const today = new Date();
    const birthDate = new Date(user.dob);
    birthDate.setFullYear(today.getFullYear());
    if (birthDate < today) birthDate.setFullYear(today.getFullYear() + 1);
    const daysLeft = Math.ceil((birthDate - today) / (1000 * 60 * 60 * 24));

    if (daysLeft === 365) {
        fetch('https://api.adviceslip.com/advice')
            .then(response => {
               
                return response.json();
            })
            .then(data => {
                const advice = data.slip.advice;
   
      document.getElementById('message').textContent = `Happy Birthday, ${user.name}! "${advice}"`})


    } else {
      document.getElementById('message').textContent = `${daysLeft} days left until your birthday!`;

    }
  } catch (error) {
    console.error(error.message);
    // Handle authentication errors
    if (error.code === 'auth/invalid-login-credentials') {
      alert("Invalid login credentials. Please try again.");
  } else {
      alert("Login failed: " + error.message);
  }
}
  
  }
);

// Logout
document.getElementById('logout').addEventListener('click', () => {
  auth.signOut();
  document.getElementById('dashboard').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
  document.getElementById('signup-page').style.display = 'block';

});