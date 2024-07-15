const WHEEL_RESULTS_KEY = 'wheel_results_key';
let wheelResult = JSON.parse(localStorage.getItem(WHEEL_RESULTS_KEY)) || [];
console.log(wheelResult)
const tbody = $('#tbody');

$(document).ready(function () {
    let numberClick = 0;
    wheelResult.forEach(function (result) {
        numberClick += result.total;
        $('#thong-ke').append(`<li>${result.name}: ${result.total} <i>(Còn lại: ${50 - result.total})</i></li>`);
    });
    $('#numberClick').text(numberClick);
})
