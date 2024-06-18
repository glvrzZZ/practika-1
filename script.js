$(document).ready(function() {
    const sessions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    const maxBookingDays = 7;
    const seatsPerSession = 30;
    const today = new Date();

    let selectedSeats = [];

    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify({}));
    }

    function loadBookings() {
        return JSON.parse(localStorage.getItem('bookings
