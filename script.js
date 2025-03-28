// Admin Login
document.getElementById("loginBtn").addEventListener("click", function() {
  const userId = prompt("Enter Admin ID:");
  const password = prompt("Enter Password:");

  if (userId === "ANANDKR" && password === "12345@") {
    alert("Login successful! Redirecting to admin panel...");
    window.location.href = "admin/upload.html";
  } else {
    alert("Invalid credentials!");
  }
});

// Load and display papers
async function loadPapers() {
  const response = await fetch("https://raw.githubusercontent.com/shuklaanand95/cutm-question-papers/main/data/papers.json");
  const data = await response.json();
  
  const container = document.getElementById("papers-container");
  data.papers.forEach(paper => {
    container.innerHTML += `
      <div class="paper-card">
        <h3>${paper.title}</h3>
        <p>Subject: ${paper.subject} | Sem: ${paper.semester}</p>
        <a href="${paper.file}" download>Download PDF</a>
      </div>
    `;
  });
}

// Load papers when page opens
loadPapers();
