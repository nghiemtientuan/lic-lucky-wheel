$(document).ready(function () {
    let countClicked = 0;
    let angle = 0;
    let spinning = false;
    let spinInterval;

    // local storage key
    const GIFTS_KEY = 'gifts';
    const WHEEL_RESULTS_KEY = 'wheel_results_key';
    const WHEEL_BUTTON_OPTION = 'wheel_button_key';

    // default value
    const GIFTS_DEFAULT = [
        {
            "id": 1,
            "name": "Gấu LIC",
            "file": null,
            "total": 50,
        },
        {
            "id": 2,
            "name": "Móc khoá Gấu LIC",
            "file": null,
            "total": 50,
        },
        {
            "id": 3,
            "name": "Bình nước",
            "file": null,
            "total": 50,
        },
        {
            "id": 4,
            "name": "Túi Tote",
            "file": null,
            "total": 50,
        },
        {
            "id": 5,
            "name": "Balo",
            "file": null,
            "total": 50,
        },
        {
            "id": 6,
            "name": "Áo phông",
            "file": null,
            "total": 50,
        },
        {
            "id": 7,
            "name": "Tuỳ chọn",
            "file": null,
            "total": 50,
        },
    ];
    const WHEEL_OPTION_ONE_CLICK = 1;
    const WHEEL_OPTION_TWO_CLICK = 2;

    // get value from local storage
    let gifts = localStorage.getItem(GIFTS_KEY) || GIFTS_DEFAULT;
    let wheelResult = localStorage.getItem(WHEEL_RESULTS_KEY) || [];
    let wheelButtonOption = localStorage.getItem(WHEEL_BUTTON_OPTION) || WHEEL_OPTION_TWO_CLICK;

    // Khoi tao vong quay voi so luong gift dinh truoc
    gifts.map(function (gift) {
        $('#wheel__inner').append('<div class="wheel__sec"></div>');
    });

    function caculateGift(position) {
        countClicked++;
        if (position <= 30) {
        } else if (position <= 90) {
        } else if (position <= 150) {
        } else if (position <= 210) {
        } else if (position <= 270) {
        } else if (position <= 330) {
        } else {
        }
        // $('.congratulation').fadeIn();
    }

    $('#wheel__button').click(function () {
        if (wheelButtonOption == WHEEL_OPTION_TWO_CLICK && !spinning) {
            spinning = true;
            spinInterval = setInterval(function() {
                angle += 77;
                $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
            }, 100);

            return;
        }
        
        if (spinning || wheelButtonOption == WHEEL_OPTION_ONE_CLICK) {
            spinning = false;
            clearInterval(spinInterval);
            const random = Math.floor((Math.random() * 360) + 720);
            angle += random;
            $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
            setTimeout(() => {
                // Chia lấy dư cho 360 để lấy lượng quay không hoàn thành một vòng 360deg
                caculateGift(angle % 360);
            }, 5000);
        }
    })

    $('.congratulation__close').click(function () {
        $('.congratulation').fadeOut();
    })
    $('.congratulation').click(function (event) {
        if (event.target != this)
            return;
        $(this).fadeOut();
    })
});
