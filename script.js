$(document).ready(function() {
    const sessions = ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"];
    const maxBookingDays = 7;
    const seatsPerSession = 30;
    const today = new Date();
    const dateFormat = 'YYYY-MM-DD'; // используйте нужный формат даты

    // Инициализация LocalStorage
    if (!localStorage.getItem('bookings')) {
        localStorage.setItem('bookings', JSON.stringify({}));
    }

    function loadBookings() {
        return JSON.parse(localStorage.getItem('bookings'));
    }

    function saveBookings(bookings) {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    }

    function getAvailableDates() {
        const dates = [];
        for (let i = -maxBookingDays; i <= maxBookingDays; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date.toISOString().split('T')[0]);
        }
        return dates;
    }

    function renderSessions(date) {
        const $sessionsContainer = $('#sessions');
        $sessionsContainer.empty();
        sessions.forEach(session => {
            const sessionTime = new Date(`${date}T${session}`);
            const isPast = sessionTime < new Date();
            const $sessionButton = $(`<button>${session}</button>`);
            $sessionButton.prop('disabled', isPast);
            $sessionButton.on('click', function() {
                renderSeats(date, session);
            });
            $sessionsContainer.append($sessionButton);
        });
    }

    function renderSeats(date, session) {
        const bookings = loadBookings();
        const sessionKey = `${date}_${session}`;
        const bookedSeats = bookings[sessionKey] || [];
        const $seatsContainer = $('#seats');
        $seatsContainer.empty();

        for (let i = 0; i < seatsPerSession; i++) {
            const isBooked = bookedSeats.includes(i);
            const $seat = $(`<div class="seat ${isBooked ? 'booked' : 'available'}">${i + 1}</div>`);
            if (!isBooked) {
                $seat.on('click', function() {
                    bookSeat(date, session, i);
                });
            }
            $seatsContainer.append($seat);
        }
        $('#seats-container').removeClass('hidden');
    }

    function bookSeat(date, session, seat) {
        const bookings = loadBookings();
        const sessionKey = `${date}_${session}`;
        if (!bookings[sessionKey]) {
            bookings[sessionKey] = [];
        }
        bookings[sessionKey].push(seat);
        saveBookings(bookings);
        renderSeats(date, session);
    }

    function initializeDatePicker() {
        const availableDates = getAvailableDates();
        const $datePicker = $('#date-picker');
        $datePicker.attr('min', availableDates[0]);
        $datePicker.attr('max', availableDates[availableDates.length - 1]);
        $datePicker.val(today.toISOString().split('T')[0]);

        $datePicker.on('change', function() {
            const selectedDate = $(this).val();
            renderSessions(selectedDate);
            $('#seats-container').addClass('hidden');
        });

        renderSessions($datePicker.val());
    }

    initializeDatePicker();
});
