// Example frontend JavaScript
async function generateVideo() {
  const pdfFile = document.getElementById("pdfInput").files[0];
  const apiKey = document.getElementById("apiKey").value;
  const formData = new FormData();
  formData.append("pdf", pdfFile);
  formData.append("api_key", apiKey);

  const response = await fetch("http://localhost:5000/generate", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  document.getElementById("videoLink").href = result.download_url;
}
