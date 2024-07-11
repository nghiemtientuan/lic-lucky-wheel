$(document).ready(function () {
    var countClicked = 0;
    var clicked = false;
    
    let angle = 0;
    let spinning = false;
    let spinInterval;

    // local storage key
    const GIFTS_KEY = 'gifts';
    const WHEEL_RESULTS_KEY = 'wheel_results_key';

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
    ];

    // get value from local storage
    let gifts = localStorage.getItem(GIFTS_KEY) || GIFTS_DEFAULT;
    let wheelResult = localStorage.getItem(WHEEL_RESULTS_KEY) || [];

    // Khoi tao vong quay voi so luong gift dinh truoc
    gifts.map(function (gift) {
        // $('#wheel__inner').append('<div class="wheel__sec"></div>');
    });

    function getPosition(position) {
        if (position <= 30) {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT NHÀ LẦU 4 TẦNG');
        } else if (position <= 90) {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT CHUYẾN DU LỊCH VŨNG TÀU');
        } else if (position <= 150) {
            $('.congratulation__note').text('CHÚC BẠN MAY MẮN LẦN SAU');
        } else if (position <= 210) {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT THẺ CÀO 200K');
        } else if (position <= 270) {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT THẺ CÀO 100K');
        } else if (position <= 330) {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT CHUYẾN DU LỊCH MIỀN TÂY');
        } else {
            $('.congratulation__note').text('CHÚC MỪNG BẠN TRÚNG ĐƯỢC MỘT CĂN NHÀ LẦU 4 TẦNG');
        }
        $('.congratulation').fadeIn();
        clicked = false;
        countClicked = 0;
    }

    $('#wheel_start').click(function () {
        if (!spinning) {
            spinning = true;
            spinInterval = setInterval(function() {
                angle += 77;
                $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
            }, 100);
            $('#wheel_stop').removeClass('d-none');
            $('#wheel_start').addClass('d-none');
        }
    });

    $('#wheel_stop').click(function () {
        if (spinning) {
            spinning = false;
            clearInterval(spinInterval);
            const random = Math.floor((Math.random() * 360) + 720);
            angle += random;
            $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
            setTimeout(() => {
                // Chia lấy dư cho 360 để lấy lượng quay không hoàn thành một vòng 360deg
                getPosition(angle % 360);
                $('#wheel_stop').addClass('d-none');
                $('#wheel_start').removeClass('d-none');
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
