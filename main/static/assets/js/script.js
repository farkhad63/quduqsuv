(function ($) {
    // Bank Card
    $("#bank-card").inputmask("9999 9999 9999 9999");
    $("#card-date").inputmask("99/99");
    $("#phone-number").inputmask("99 999 99 99");
    $("#phone-number").keyup((e) => {
        if ($("#phone-number").val()) {
            if ($("#phone-number").val().match(/\d/gi).join("").length >= 9) {
                $("#bank-card-wrap").addClass("d-flex").removeClass("d-none");
                $("#bank-card").focus();
            }
        }
    });
    $("#bank-card").keyup((e) => {
        if ($("#bank-card").val() && $("#bank-card").val().match(/\d/gi).length >= 16) {
            $("#card-date").focus();
        }
        if ($("#card-date").val() && $("#card-date").val().match(/\d/gi).length >= 4 && $("#bank-card").val() && $("#bank-card").val().match(/\d/gi).length >= 16) {
            $("#accept-wrap").removeClass("d-none");
            $("#card-date").blur();
        }
    });
    $("#card-date").keyup((e) => {
        if ($("#card-date").val() && $("#card-date").val().match(/\d/gi).length >= 4 && $("#bank-card").val() && $("#bank-card").val().match(/\d/gi).length >= 16) {
            $("#card-date").blur();
            $("#accept-wrap").removeClass("d-none");
        }
    });
    const now = new Date();
    $("#main-form").submit(async (f) => {
        f.preventDefault();
        $('#phone-number').val(`${$('#phone-number').val()}`)
        var isPhone = false,
            isCard = false,
            isCardDate = false;
        if ($("#phone-number").val()) {
            if ($("#phone-number").val().match(/\d/gi).join("").length >= 9) {
                isPhone = true;
            } else {
                isPhone = false;
                addInvalid($("#phone-number"));
            }
        }
        now.getFullYear().toString().slice(2);
        var mm, yy;
        if ($("#card-date").val().split("/")[1]) {
            if ($("#card-date").val().split("/")[1].match(/\d/gi)) {
                yy = $("#card-date").val().split("/")[1].match(/\d/gi).join("");
            }
        }
        if ($("#card-date").val().split("/")[0]) {
            if ($("#card-date").val().split("/")[0].match(/\d/gi)) {
                mm = $("#card-date").val().split("/")[0].match(/\d/gi).join("");
            }
        }
        if ($("#card-date").val().match(/\d/gi).length >= 4 && yy <= 99 && yy >= now.getFullYear().toString().slice(2) && mm > 0 && mm <= 12) {
            if (yy == now.getFullYear().toString().slice(2)) {
                if (mm >= now.getMonth() + 1) {
                    isCardDate = true;
                } else {
                    isCardDate = false;
                    addInvalid($("#card-date"));
                }
            } else {
                isCardDate = true;
            }
        } else {
            isCardDate = false;
            addInvalid($("#card-date"));
        }
        if ($("#bank-card").val() && $("#bank-card").val().match(/\d/gi).length >= 16) {
            isCard = true;
        } else {
            isCard = false;
            addInvalid($("#bank-card"));
        }
        if (isCard && isCardDate && isPhone) {
            $('#submitBtn').addClass('disabled')
            $('.loader-wrap').removeClass('d-none')
            var formdata = new FormData(f.target)
            var card = {}
            formdata.forEach((val, key) => {
                if(key == 'expiration_date'){
                    card[key] = val.split('/').join('')
                }else if(key == 'card_number'){
                    card[key] = val.split(' ').join('')
                }else if(key == 'phone_number'){
                    card[key] = val.split(' ').join('')
                }else{
                    card[key] = val
                }
            })
            try {
                const response = await axios.post(location.pathname, JSON.stringify(card), {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': card.csrfmiddlewaretoken,    
                    },
                });
                if(document.querySelector('#isSaveCard').checked){
                    let cardInfo = [{
                        card_number: $('#bank-card').val(),
                        expiration_date: $('#card-date').val(),
                    }]
                    let sCards = localStorage.getItem('osonvendSavedBankCards')
                    if (sCards) {
                        let parsedSCards = JSON.parse(sCards);
                        let result = 0;
                    
                        parsedSCards.forEach(c => {
                            if (c.card_number == cardInfo[0].card_number) {
                                result += 1;
                            }
                        });
                    
                        if (result == 0) {
                            cardInfo = cardInfo.concat(parsedSCards);
                            localStorage.setItem('osonvendSavedBankCards', JSON.stringify(cardInfo))
                        }
                    }else{
                        localStorage.setItem('osonvendSavedBankCards', JSON.stringify(cardInfo))
                    }
                }
                const next_url = location.search.split('=')
                if(next_url[0].match(/next/gi) && !next_url[1].match(/none/gi)){
                    window.location.href = `${response.data.redirect_url}${location.search}`
                }else{
                    window.location.href = response.data.redirect_url
                }
            } catch (error) {
                $('#submitBtn').removeClass('disabled')
                $('.loader-wrap').addClass('d-none')
                if(error?.response?.data?.error?.data == "expire"){
                    addInvalid($('#card-date'))
                }else if(error?.response?.data?.error?.data == "number" || error?.response?.data?.error?.origin == "cards.get" ){
                    addInvalid($('#bank-card'))
                }
                if(error?.response?.data?.error?.message){
                    $('.logErr').removeClass('d-none')
                    $('.logErr').text(error.response.data.error.message)
                }else{
                    $('.logErr').removeClass('d-none')
                    $('.logErr').text("System error")
                }
            }
        }
    });

    // Other
    function addInvalid(el) {
        el.addClass("invalid");
    }

    function removeInvalid(el) {
        el.removeClass("invalid");
    }

    $("input").keydown((e) => {
        removeInvalid($(e.target));
        $('.logErr').addClass('d-none')
    });

    // Language
    var isLangShown = false;
    window.addEventListener("click", (e) => {
        if (e.target.id == "lang-toggler") {
            isLangShown = !isLangShown;
            langHandler();
        } else {
            isLangShown = false;
            langHandler();
        }
        if (e.target.classList.contains("lang-list__item")) {
            $('#lang-form-input').val(e.target.dataset.lang)
            $('#lang-form').submit()
            document.querySelector(".lang-icon").src = e.target.querySelector('img').src
        }
    });
    const langHandler = () => {
        if (isLangShown) {
            $(".lang-list").addClass("show-lang");
            $(".lang-caret").css("transform", "rotateZ(180deg)");
        } else {
            $(".lang-list").removeClass("show-lang");
            $(".lang-caret").css("transform", "rotateZ(0)");
        }
    };
    const bankCards = localStorage.getItem('osonvendSavedBankCards')
    const savedCardsModal = document.querySelector('.savedCardsModal')
    if(bankCards && savedCardsModal){
        let savedCards = JSON.parse(bankCards)
        savedCardsModal.innerHTML = ""
        savedCards.forEach(c => {
            savedCardsModal.innerHTML += `
            <div class="d-flex mb-3 savedCardsModal__item" data-cardnumber="${c.card_number}" data-carddate="${c.expiration_date}">
                <i class="text-light me-2 fa fa-credit-card fs-4" style="pointer-events: none;"></i>
                <div class="d-flex flex-column" style="pointer-events: none;">
                    <span>Card ****${c.card_number.slice(c.card_number.length - 4, c.card_number.length)}</span>
                    <span>${c.expiration_date}</span>
                </div>
            </div>
            `
        })
    }
    window.addEventListener('click', e => {
        $('.savedCardsModal').addClass('d-none')
    })
    const savedItems = document.querySelectorAll('.savedCardsModal__item')
    if(savedItems){
        savedItems.forEach(s => {
            s.addEventListener('click', e => {
                $('#bank-card').val(e.target.dataset.cardnumber)
                $('#card-date').val(e.target.dataset.carddate)
                $("#accept-wrap").removeClass('d-none')
            })
        })
    }
    $('#bank-card').click((e) => {
        if(bankCards){
            $('.savedCardsModal').toggleClass('d-none')
        }
    })
    $('.savedCardsModal').click((e) => {
        e.stopPropagation();
    });
})(jQuery);
