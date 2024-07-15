$(document).ready(function () {
    let angle = 0;
    let spinning = false;
    let spinInterval;

    // local storage key
    const WHEEL_RESULTS_KEY = 'wheel_results_key';
    const WHEEL_BUTTON_OPTION = 'wheel_button_key';

    // default value
    const GIFT_BOTTLE = {
        "id": "bottle",
        "name": "Bình nước LIC",
        "total": 50,
    };
    const GIFT_KEY_BEAR = {
        "id": "key_bear",
        "name": "Móc khoá Gấu LIC",
        "total": 50,
    };
    const GIFT_BACKPACK = {
        "id": "backpack",
        "name": "Cặp sách LIC",
        "total": 50,
    };
    const GIFT_BEAR = {
        "id": "bear",
        "name": "Gấu LIC",
        "total": 50,
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
    const WHEEL_OPTION_ONE_CLICK = 1;
    const WHEEL_OPTION_TWO_CLICK = 2;

    // get value from local storage
    let wheelResult = JSON.parse(localStorage.getItem(WHEEL_RESULTS_KEY)) || [];
    let wheelButtonOption = localStorage.getItem(WHEEL_BUTTON_OPTION) || WHEEL_OPTION_TWO_CLICK;

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
            angle += getRandomDeg();
            $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
            setTimeout(() => {
                // Chia lấy dư cho 360 để lấy lượng quay không hoàn thành một vòng 360deg
                saveGift(angle % 360);
            }, 5000);
        }
    })

    function getRandomDeg() {
        let random, isNearBorderGift, isMissingGift;
        do {
            random = Math.floor((Math.random() * 360) + 720);
            const randomDeg = (angle + random) % 360;

            // check case near border gift
            isNearBorderGift = (25 < randomDeg && randomDeg < 35)
            || (85 < randomDeg && randomDeg < 95)
            || (145 < randomDeg && randomDeg < 155)
            || (205 < randomDeg && randomDeg < 215)
            || (265 < randomDeg && randomDeg < 275)
            || (325 < randomDeg && randomDeg < 335);

            // check case missing gift
            isMissingGift = !caculateGift(randomDeg);
        } while(isNearBorderGift || isMissingGift);

        return random;
    }

    function caculateGift(position) {
        let caculatedGift;
        if (30 <= position && position <= 90) {
            // Case: key bear
            caculatedGift = GIFT_KEY_BEAR;
        } else if (position <= 150) {
            // Case: backpack
            caculatedGift = GIFT_BACKPACK;
        } else if (position <= 210) {
            // Case: bear
            caculatedGift = GIFT_BEAR;
        } else if (position <= 270) {
            // Case: tote
            caculatedGift = GIFT_TOTE_BAG;
        } else if (position <= 330) {
            // Case: t-shirt
            caculatedGift = GIFT_T_SHIRT;
        } else {
            // Case: bottle
            caculatedGift = GIFT_BOTTLE;
        }

        // check exist gift
        if (caculatedGift) {
            const existGift = wheelResult.find(function (result) {
                return result.id === caculatedGift.id;
            });
            if (!existGift || (existGift && existGift.total < caculatedGift.total)) {
                return caculatedGift;
            }
        }

        return null;
    }

    function saveGift(position) {
        let existGift = caculateGift(position);
        const existGiftIndex = wheelResult.findIndex(function (result) {
            return result.id === existGift.id;
        });
        if (existGiftIndex >= 0) {
            // case update
            wheelResult[existGiftIndex].total++;
        } else {
            // case create
            wheelResult.push({
                ...existGift,
                total: 1,
            });
        }
        localStorage.setItem(WHEEL_RESULTS_KEY, JSON.stringify(wheelResult));
    }

    // $('.congratulation').fadeIn();

    $('.congratulation__close').click(function () {
        $('.congratulation').fadeOut();
    })
    $('.congratulation').click(function (event) {
        if (event.target != this)
            return;
        $(this).fadeOut();
    })
});
