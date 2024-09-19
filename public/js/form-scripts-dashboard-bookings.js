window.onload = () => {
  // First part: Admin user's bookings
  const defaultValueTwo = localStorage.getItem("sortByValueTwo") || "startDate";
  
  const sortByElementAdmin = document.getElementById("sortByBookings");
  if (sortByElementAdmin) {
    sortByElementAdmin.value = defaultValueTwo;
  
    sortByElementAdmin.addEventListener("change", function () {
      const sortByValueTwo = this.value;
      localStorage.setItem("sortByValueTwo", sortByValueTwo);
    });
  }

  // Second part: Standard user's bookings
  const defaultValueFour = localStorage.getItem("sortByValueFour") || "startDateUserBookings";
  
  const sortByElementUser = document.getElementById("sortByBookingsUser");
  if (sortByElementUser) {
    sortByElementUser.value = defaultValueFour;
  
    sortByElementUser.addEventListener("change", function () {
      const sortByValueFour = this.value;
      localStorage.setItem("sortByValueFour", sortByValueFour);
    });
  }
};