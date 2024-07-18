const HISTORY_KEY = 'history';

// default value
const GIFT_BOTTLE = {
    "id": "bottle",
    "name": "Bình nước LIC",
    "total": 50,
};
const GIFT_KEY_BEAR = {
    "id": "key_bear",
    "name": "Móc khoá Gấu LIC",
    "total": 80,
};
const GIFT_BACKPACK = {
    "id": "backpack",
    "name": "Balo LIC",
    "total": 50,
};
const GIFT_BEAR = {
    "id": "bear",
    "name": "Gấu LIC",
    "total": 20,
};
const GIFT_TOTE_BAG = {
    "id": "tote_bag",
    "name": "Túi tote LIC",
    "total": 50,
};
const GIFT_T_SHIRT = {
    "id": "t_shirt",
    "name": "Áo phông LIC",
    "total": 50,
};

$(document).ready(function () {
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
    [GIFT_BOTTLE, GIFT_KEY_BEAR, GIFT_BACKPACK, GIFT_BEAR, GIFT_TOTE_BAG, GIFT_T_SHIRT].map(function (giftDefaultValue, giftIndex) {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        const giftReceivedNumber = history.filter(function (historyTmp) {
            return historyTmp.gift_id == giftDefaultValue.id;
        });
        
        $('#thong-ke-sp tbody').append(`<tr id='result-${giftDefaultValue.id}'>
            <th>${giftIndex}</th>
            <td>${giftDefaultValue.name}</td>
            <td class='result-total'>${giftReceivedNumber.length}</td>
            <td class='result-con-lai'>${giftDefaultValue.total - giftReceivedNumber.length}</td>
            </tr>`);
    });
    
    $('#numberClick').text(history.length);
    history.forEach(function (history, historyIndex) {
        $('#thong-ke-luot-quay tbody').prepend(`<tr id='history-${history.id}'>
            <th>${historyIndex + 1}</th>
            <td>${history.name}</td>
            <td><input class='input-mssv' data-history_id='${history.id}' value='${history.mssv || ''}'></td>
            <td>${history.created_at}</td>
            <td><button class='delete-history' data-history_id='${history.id}'>Xoá</button></td>
            </tr>`);
    });
    
    $('.delete-history').click(function () {
        const confirmDelete = confirm(`Are you delete this?`);
        if (confirmDelete) {
            const id = $(this).attr('data-history_id');
            let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            const eHis = history.find(function (historyTmp) {
                return historyTmp.id == id;
            });
            if (eHis) {
                history = history.filter(function (historyTmp) {
                    return historyTmp.id != id;
                });
                localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
                $(`#history-${id}`).remove();
    
                const giftDefault = [GIFT_BOTTLE, GIFT_KEY_BEAR, GIFT_BACKPACK, GIFT_BEAR, GIFT_TOTE_BAG, GIFT_T_SHIRT].find(function (giftTmp) {
                    return giftTmp.id == eHis.gift_id;
                });
                if (giftDefault) {
                    const giftReceivedNumber = history.filter(function (historyTmp) {
                        return historyTmp.gift_id == giftDefault.id;
                    }).length;
                    $(`#result-${eHis.gift_id} .result-total`).text(giftReceivedNumber);
                    $(`#result-${eHis.gift_id} .result-con-lai`).text(giftDefault.total - giftReceivedNumber);
                }
            }
        }
    });

    $('#reset-all').click(function () {
        const resetConfirm = confirm("Are you sure?");
        if (resetConfirm) {
            localStorage.removeItem(HISTORY_KEY);
            location.reload();
        }
    });

    $('.input-mssv').keyup(function () {
        const id = $(this).attr('data-history_id');
        const mssv = $(this).val();
        let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        history = history.map(function (historyTmp) {
            if (historyTmp.id == id) {
                historyTmp.mssv = mssv;
            }

            return historyTmp;
        });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    });

    $('#btn-search_mssv').click(function () {
        const mssvSearch = $('#search_mssv').val().trim();
        if (mssvSearch && mssvSearch) {
            let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            historyIndex = history.findIndex(function (historyTmp) {
                return historyTmp.mssv && historyTmp.mssv == mssvSearch;
            });
            if (historyIndex >= 0) {
                $('#search-result').text(`Exist in #${historyIndex + 1}`);
            } else {
                $('#search-result').text(`No Exist`);
            }
            setTimeout(function () {
                $('#search-result').text('');
            }, 3000);
        }
    });
});
