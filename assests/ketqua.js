const WHEEL_RESULTS_KEY = 'wheel_results_key';
const HISTORY_KEY = 'history';
let wheelResult = JSON.parse(localStorage.getItem(WHEEL_RESULTS_KEY)) || [];
let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

$(document).ready(function () {
    let numberClick = 0;
    wheelResult.forEach(function (result, resultIndex) {
        numberClick += result.total;
        $('#thong-ke-sp tbody').append(`<tr id='result-${result.id}'>
            <th>${resultIndex + 1}</th>
            <td>${result.name}</td>
            <td class='result-total'>${result.total}</td>
            <td class='result-con-lai'>${50 - result.total}</td>
            </tr>`);
    });
    $('#numberClick').text(numberClick);

    history.forEach(function (history, historyIndex) {
        $('#thong-ke-luot-quay tbody').prepend(`<tr id='history-${history.id}'>
            <th>${historyIndex + 1}</th>
            <td>${history.name}</td>
            <td>${history.created_at}</td>
            <td><button class='delete-history' data-history_id='${history.id}'>Xoá</button></td>
            </tr>`);
    });
    
    $('.delete-history').click(function () {
        const id = $(this).attr('data-history_id');
        const eHis = history.find(function (historyTmp) {
            return historyTmp.id == id;
        });
        if (eHis) {
            const newHistory = history.filter(function (historyTmp) {
                return historyTmp.id != id;
            });
            localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
            $(`#history-${id}`).remove();
    
            const newWheelResult = wheelResult.map(function (wResult) {
                if (wResult.id == eHis.gift_id) {
                    wResult.total = wResult.total - 1;
                    $(`#result-${eHis.gift_id} .result-total`).text(wResult.total);
                    $(`#result-${eHis.gift_id} .result-con-lai`).text(50 - wResult.total);
                }

                return wResult;
            });
            localStorage.setItem(WHEEL_RESULTS_KEY, JSON.stringify(newWheelResult));
        }
    });

    $('#reset-all').click(function () {
        const resetConfirm = confirm("Are you sure?");
        if (resetConfirm) {
            localStorage.removeItem(HISTORY_KEY);
            localStorage.removeItem(WHEEL_RESULTS_KEY);
            location.reload();
        }
    });
})
