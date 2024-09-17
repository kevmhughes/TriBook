document.addEventListener("DOMContentLoaded", () => {
  const changeViewButton = document.getElementById("changeViewButton");
  const bookingsView = document.getElementById("bookings-view");
  const apartmentsView = document.getElementById("apartments-view");

  // Load the saved view from local storage
  const savedView = localStorage.getItem("currentView");
  if (savedView === "apartments") {
    bookingsView.classList.add("hidden");
    apartmentsView.classList.remove("hidden");
  } else {
    bookingsView.classList.remove("hidden");
    apartmentsView.classList.add("hidden");
  }

  // Add event listener to the button
  changeViewButton.addEventListener("click", () => {
    if (bookingsView.classList.contains("hidden")) {
      bookingsView.classList.remove("hidden");
      apartmentsView.classList.add("hidden");
      localStorage.setItem("currentView", "bookings");
    } else {
      bookingsView.classList.add("hidden");
      apartmentsView.classList.remove("hidden");
      localStorage.setItem("currentView", "apartments");
    }
  });
});