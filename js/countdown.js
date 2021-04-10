document.querySelector('html').classList.remove('no-js');

const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minsEl = document.getElementById('mins');
const secondsEl = document.getElementById('seconds');

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const deathDay = randomDate(new Date(new Date().getFullYear() + 5, 0, 1), new Date());

function countdown() {
    const deathDayDate = new Date(deathDay);
    const currentDate = new Date();

    const totalSeconds = (deathDayDate - currentDate) / 1000;

    const days = Math.floor(totalSeconds / 3600 / 24);
    const hours = Math.floor(totalSeconds / 3600) % 24;
    const mins = Math.floor(totalSeconds / 60) % 60;
    const seconds = Math.floor(totalSeconds) % 60;

    daysEl.innerHTML = days;
    hoursEl.innerHTML = formatTime(hours);
    minsEl.innerHTML = formatTime(mins);
    secondsEl.innerHTML = formatTime(seconds);
}

function formatTime(time) {

    return time < 10 ? `0${time}` : time;
}

jQuery(document).ready(function($) {
    $(window).load(function() {
        $('#preloader').fadeOut('slow', function() {
            $(this).remove();
        });
    });
});

countdown();

setInterval(countdown, 1000);
