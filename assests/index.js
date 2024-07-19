$(document).ready(function () {
    let angle = 0;
    let spinning = false;
    let spinInterval;
    let soundInterval;
    let mssv = '';
    let fullName = '';
    
    const loginUser = {
        password: '********',
    }

    const nhacSoSo = new Audio('./assests/nhacSoSo.mp3');
    const voTay = new Audio('./assests/votay.mp3');
    const timeOutTimeDefault = 1000 * 30 // 1 minute
    let timeOutWheelConstant = null;

    // local storage key
    const WHEEL_BUTTON_OPTION = 'wheel_button_key';
    const HISTORY_KEY = 'history';

    // session storage key
    const LOGIN_KEY = 'password';
    const token = sessionStorage.getItem(LOGIN_KEY);
    if (token && token == loginUser.password) {
        // pass
    } else {
        const getPasswordInput = prompt('Vui lòng nhập mật khẩu');
        if (getPasswordInput == loginUser.password) {
            sessionStorage.setItem(LOGIN_KEY, getPasswordInput);
        } else {
            location.reload();
        }
    }

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
        "name": "Gấu bông LIC",
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
    const WHEEL_OPTION_ONE_CLICK = 1;
    const WHEEL_OPTION_TWO_CLICK = 2;

    // get value from local storage
    let wheelButtonOption = localStorage.getItem(WHEEL_BUTTON_OPTION) || WHEEL_OPTION_TWO_CLICK;
    let history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

    // settup wheel
    let numberClick = history.length;
    if (numberClick >= (GIFT_BOTTLE.total + GIFT_KEY_BEAR.total + GIFT_BACKPACK.total + GIFT_BEAR.total + GIFT_TOTE_BAG.total + GIFT_T_SHIRT.total)) {
        $('#wheel__button').attr('disabled', true);
        $('.disabled-time').fadeIn();
    }

    $('#wheel__button').click(handleClickWheel);
    $(document).keydown(function(event) {
        // ấn phím cách
        if (event.keyCode === 32) {
            handleClickWheel();
        }
    });

    function handleClickWheel() {
        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        let numberClick = history.length;
        if (numberClick >= (GIFT_BOTTLE.total + GIFT_KEY_BEAR.total + GIFT_BACKPACK.total + GIFT_BEAR.total + GIFT_TOTE_BAG.total + GIFT_T_SHIRT.total)) {
            $('#wheel__button').attr('disabled', true);
            $('.disabled-time').fadeIn();
            
            return;
        }

        if (!mssv || !fullName) {
            $('.input-mssv-modal').fadeIn();

            return;
        }

        if (wheelButtonOption == WHEEL_OPTION_TWO_CLICK && !spinning) {
            spinning = true;
            
            // play audio
            nhacSoSo.currentTime = 0;
            nhacSoSo.loop = true;
            nhacSoSo.play();
            $('#wheel__button').attr('disabled', true);
            setTimeout(function () {
                $('#wheel__button').attr('disabled', false);
            }, 2000);
            timeOutWheelConstant = setTimeout(function () {
                console.log('111111111111111');
                handleTwoClick();
            }, timeOutTimeDefault);

            spinInterval = setInterval(function() {
                angle += 60;
                $(".wheel__inner").css("transform", `rotate(${angle}deg)`);
                (new Audio('./assests/oneSinger.mp3')).play();
            }, 100);

            return;
        }
        
        handleTwoClick();
    }

    function handleTwoClick() {
        if (spinning || wheelButtonOption == WHEEL_OPTION_ONE_CLICK) {
            if (wheelButtonOption == WHEEL_OPTION_ONE_CLICK) {
                // play audio
                nhacSoSo.currentTime = 0;
                nhacSoSo.play();
            }
            
            clearTimeout(timeOutWheelConstant);
            spinning = false;
            $('#wheel__button').attr('disabled', true);
            clearInterval(spinInterval);
            angle += getRandomDeg();
            console.log(angle, angle%360);
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
                $('#wheel__button').attr('disabled', false);
            }, 5000);
        }
    }
    
    $('#saveInfoStudent').click(function() {
        const mssvTmp = $('#mssv').val().trim();
        const fullNameTmp = $('#full_name').val().trim();
        if (mssvTmp && fullNameTmp) {
            history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            const mssvExist = history.find(function(historyTmp) {
                return historyTmp.mssv == mssvTmp;
            });
            if (mssvExist) {
                // show error
                $('#search-mssv-error').text('MSSV đã tồn tại!');
            } else {
                $('#search-mssv-error').text('');
                mssv = mssvTmp;
                fullName = fullNameTmp;
                $('.input-mssv-modal').fadeOut();
            }
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
            isNearBorderGift = (20 < randomDeg && randomDeg < 40)
            || (80 < randomDeg && randomDeg < 100)
            || (140 < randomDeg && randomDeg < 160)
            || (200 < randomDeg && randomDeg < 220)
            || (260 < randomDeg && randomDeg < 280)
            || (320 < randomDeg && randomDeg < 340);

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
            caculatedGift = GIFT_BACKPACK;
        } else if (position <= 150) {
            caculatedGift = GIFT_TOTE_BAG;
        } else if (position <= 210) {
            caculatedGift = GIFT_BEAR;
        } else if (position <= 270) {
            caculatedGift = GIFT_T_SHIRT;
        } else if (position <= 330) {
            caculatedGift = GIFT_KEY_BEAR;
        } else {
            caculatedGift = GIFT_BOTTLE;
        }

        // check exist gift
        if (caculatedGift) {
            history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
            const giftRecievedLength = history.filter(function (historyTmp) {
                return historyTmp.gift_id == caculatedGift.id;
            }).length;
            if (giftRecievedLength < caculatedGift.total) {
                return caculatedGift;
            }
        }

        return null;
    }

    function saveGift(position) {
        let existGift = caculateGift(position);
        saveHistory(existGift);

        // show gift
        $('.congratulation__container #con_name').text(existGift.name);
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

    function saveHistory(gift) {
        let d = new Date();

        history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
        history.push({
            ...gift,
            gift_id: gift.id,
            id: new Date().valueOf(),
            mssv: mssv,
            full_name: fullName,
            created_at: `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`,
        });
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        mssv = '';
        fullName = '';
        const mssvTmp = $('#mssv').val('');
        const fullNameTmp = $('#full_name').val('');
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
