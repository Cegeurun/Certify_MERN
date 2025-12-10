// Sort events function
function sortEvents() {
    let sortValue = document.getElementById("sort").value;

    // Save scroll position
    localStorage.setItem("scrollPosition", window.scrollY);

    // Redirect with sort parameter
    window.location.href = "home.html?sort=" + sortValue;
}

// Restore scroll position on page load
window.onload = function () {
    let scrollPosition = localStorage.getItem("scrollPosition");
    if (scrollPosition !== null) {
        window.scrollTo(0, scrollPosition);
        localStorage.removeItem("scrollPosition");
    }
};
