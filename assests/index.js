$(document).ready(function () {
    let angle = 0;
    let spinning = false;
    let spinInterval;
    let soundInterval;
    const nhacSoSo = new Audio('./assests/nhacSoSo.mp3');
    const voTay = new Audio('./assests/votay.mp3');

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
            
            // play audio
            nhacSoSo.currentTime = 0;
            nhacSoSo.play();

            spinInterval = setInterval(function() {
                angle += 60;
                $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
                (new Audio('./assests/oneSinger.mp3')).play();
            }, 100);

            return;
        }
        
        if (spinning || wheelButtonOption == WHEEL_OPTION_ONE_CLICK) {
            spinning = false;
            clearInterval(spinInterval);
            angle += getRandomDeg();
            $(".wheel__inner").css("transform", `rotate(${angle}deg)`);

            let rotated = [];
            soundInterval = setInterval(() => {
                const rotationDegess = getCurrentRotation(document.getElementById("wheel__inner")) - 30;
                rotated.push(rotationDegess);
                rotated.forEach((rot) => {
                    if (Math.abs(rotationDegess - rot) > 60) {
                        (new Audio('./assests/oneSinger.mp3')).play();
                        rotated = [];
                    }
                });
            }, 50);

            setTimeout(() => {
                nhacSoSo.pause();
                voTay.play();
                startConfetti();
                stopConfetti();

                // Chia lấy dư cho 360 để lấy lượng quay không hoàn thành một vòng 360deg
                saveGift(angle % 360);
                clearInterval(soundInterval);
            }, 5000);
        }
    });

    function getCurrentRotation(el){
        let st = window.getComputedStyle(el, null);
        let tm = st.getPropertyValue("-webkit-transform") ||
            st.getPropertyValue("-moz-transform") ||
            st.getPropertyValue("-ms-transform") ||
            st.getPropertyValue("-o-transform") ||
            st.getPropertyValue("transform") ||
            "none";
        if (tm != "none") {
            let values = tm.split('(')[1].split(')')[0].split(',');
            let angle = Math.round(Math.atan2(values[1],values[0]) * (180/Math.PI));

          return (angle < 0 ? angle + 360 : angle);
        }

        return 0;
    }

    function getRandomDeg() {
        let random, isNearBorderGift, isMissingGift;
        do {
            if (wheelButtonOption == WHEEL_OPTION_ONE_CLICK) {
                random = Math.floor((Math.random() * 360) + 720);
            } else {
                random = Math.floor((Math.random() * 360));
            }
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
        if (position <= 30) {
            caculatedGift = GIFT_BOTTLE;
        } else if (position <= 90) {
            caculatedGift = GIFT_T_SHIRT;
        } else if (position <= 150) {
            caculatedGift = GIFT_TOTE_BAG;
        } else if (position <= 210) {
            caculatedGift = GIFT_BEAR;
        } else if (position <= 270) {
            caculatedGift = GIFT_BACKPACK;
        } else if (position <= 330) {
            caculatedGift = GIFT_KEY_BEAR;
        } else {
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

        // show gift
        $('.congratulation__note #con_name').text(existGift.name);
        switch (existGift.id) {
            case GIFT_BOTTLE.id:
                $('#con-bottle').removeClass('d-none');
                break;
            case GIFT_KEY_BEAR.id:
                $('#con-key_bear').removeClass('d-none');
                break;
            case GIFT_BACKPACK.id:
                $('#con-backpack').removeClass('d-none');
                break;
            case GIFT_BEAR.id:
                $('#con-bear').removeClass('d-none');
                break;
            case GIFT_TOTE_BAG.id:
                $('#con-tote_bag').removeClass('d-none');
                break;
            case GIFT_T_SHIRT.id:
                $('#con-t_shirt').removeClass('d-none');
                break;
        }
        $('.congratulation').fadeIn();
    }

    $('.congratulation__close').click(function () {
        $('.congratulation').fadeOut();
        $('.congratulation__emotion img').addClass('d-none');
    })
    $('.congratulation').click(function (event) {
        if (event.target != this)
            return;
        $(this).fadeOut();
        $('.congratulation__emotion img').addClass('d-none');
    });
    const startConfetti = () => {
        setTimeout(function() {
            confetti.start()
        }, 1000);
    };
    const stopConfetti = () => {
        setTimeout(function() {
            confetti.stop()
        }, 5000);
    };
});
