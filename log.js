const usename = "ras";
const password = "ras123";
const uname = document.getElementById("username");
const pass = document.getElementById("password");
const login = document.getElementById("login");

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    if (uname.value === usename && pass.value === password) {
      window.location.href = "exam.html";
    } else {
      alert("Invalid username or password");
    }
  });
