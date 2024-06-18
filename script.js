$(document).ready(function() {
    const sessionTimes = ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
    const seatsPerSession = 30;
    const storageKey = 'cinemaReservations';
    const maxDays = 7;

    function getStoredData() {
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : {};
    }

    function storeData(data) {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    function initializeStorage() {
        const data = getStoredData();
        const today = new Date();
        const currentDate = today.toISOString().split('T')[0];

        // Удаляем старые записи старше одной недели
        Object.keys(data).forEach(date => {
            if (new Date(date) < new Date(today - maxDays * 24 * 60 * 60 * 1000)) {
                delete data[date];
            }
        });

        // Добавляем новые даты
        for (let i = -maxDays; i <= maxDays; i++) {
            const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
            const dateString = date.toISOString().split('T')[0];
            if (!data[dateString]) {
                data[dateString] = {};
                sessionTimes.forEach(time => {
                    data[dateString][time] = Array(seatsPerSession).fill(false);
                });
            }
        }

        storeData(data);
    }

    function updateSessions(date) {
        const data = getStoredData();
        const today = new Date().toISOString().split('T')[0];
        const $sessions = $('#sessions');
        $sessions.empty();

        sessionTimes.forEach(time => {
            const isArchived = new Date(date) < new Date(today) || (date === today && time < new Date().toTimeString().substr(0, 5));
            const $session = $('<div>')
                .addClass('session')
                .text(time)
                .toggleClass('archived', isArchived)
                .click(function() {
                    if (!isArchived) {
                        $('.session.selected').removeClass('selected');
                        $(this).addClass('selected');
                        updateSeats(date, time);
                    }
                });
            $sessions.append($session);
        });
    }

    function updateSeats(date, time) {
        const data = getStoredData();
        const seats = data[date][time];
        const $seats = $('#seats');
        $seats.empty();

        seats.forEach((reserved, index) => {
            const $seat = $('<div>')
                .addClass('seat')
                .text(index + 1)
                .toggleClass('reserved', reserved)
                .click(function() {
                    if (!reserved) {
                        $(this).toggleClass('selected');
                    }
                });
            $seats.append($seat);
        });
    }

    $('#date-picker').change(function() {
        const selectedDate = $(this).val();
        updateSessions(selectedDate);
    });

    $('#seats').on('click', '.seat', function() {
        const $selectedSession = $('.session.selected');
        if ($selectedSession.length) {
            const selectedDate = $('#date-picker').val();
            const selectedTime = $selectedSession.text();
            const seatIndex = $(this).text() - 1;
            const data = getStoredData();

            if (!$(this).hasClass('reserved')) {
                $(this).toggleClass('selected');
                data[selectedDate][selectedTime][seatIndex] = $(this).hasClass('selected');
                storeData(data);
            }
        }
    });

    initializeStorage();
    $('#date-picker').val(new Date().toISOString().split('T')[0]).trigger('change');
});
