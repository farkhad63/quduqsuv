(function ($) {
    // Confirmation Code
    const inputElements = [...document.querySelectorAll("input.code-input")];
    let card = localStorage.getItem("paymeCardInfo");
    const cardToken = localStorage.getItem("paymeCardToken");

    if (inputElements) {
        inputElements.forEach((ele, index) => {
            ele.addEventListener("keydown", (e) => {
                $('.confError').addClass('d-none')
                if (e.keyCode === 8 && e.target.value === "")
                    inputElements[Math.max(0, index - 1)].focus();
            });
            ele.addEventListener("input", (e) => {
                const [first, ...rest] = e.target.value;
                e.target.value = first ?? "";
                const lastInputBox = index === inputElements.length - 1;
                const didInsertContent = first !== undefined;
                if (didInsertContent && !lastInputBox) {
                    inputElements[index + 1].focus();
                    inputElements[index + 1].value = rest.join("");
                    inputElements[index + 1].dispatchEvent(new Event("input"));
                }
            });
        });
    }
    $("#confC-form").submit(async(e) => {
        e.preventDefault()
        $('#submitBtn').addClass('disabled')
        var code = "",
        csrf = "";
        var formdata = new FormData(e.target)
        formdata.forEach((val, key) => {
            if(key == "csrfmiddlewaretoken"){
                csrf = val
            }
        })
        inputElements.forEach((ele, index) => {
            code += ele.value;
        });
        $("#confC-input").val(code);
        $(".loader-wrap").removeClass("d-none");
        try {
            var payload = {verification_code: code}
            const response = await axios.post(location.pathname, JSON.stringify(payload), {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf,
                },
            });
            const next_url = location.search.split('=')    
            if(next_url[0].match(/next/gi) && !next_url[1].match(/none/gi)){
                window.location.href = `/refrigerator${next_url[1]}`
            }else{
                window.location.href = response.data.redirect_url 
            }
        } catch (error) {
            if(error.response.data.error){
                $('.loader-wrap').addClass('d-none')
                $('#submitBtn').removeClass('disabled')
                $('.confError').text(error.response.data.error.message)
                $('.confError').removeClass('d-none')
            }
        }
    });

    // Resend Code
    var timer = $(".timer");

    function clearCountdown(interval) {
        clearTimeout(interval);
    }

    function countdown() {
        var countdownBegin = 60;
        timer.html(countdownBegin);
        var count = setInterval(function () {
            if (countdownBegin <= 0) {
                clearCountdown(count);
                $("#resendCodeBtn").removeClass("d-none");
                $(".timerwrap").addClass("d-none");
                countdownBegin = 60;
            } else {
                --countdownBegin;
                timer.html(countdownBegin);
            }
        }, 1000);
    }

    $("#resendCodeBtn").click(async(e) => {
        $("#resendCodeBtn").addClass("d-none");
        $(".timerwrap").removeClass("d-none");
        countdown();
        var csrf = ''
        var formdata = new FormData(document.querySelector("#confC-form"))
        formdata.forEach((val, key) => {
            if(key == 'csrfmiddlewaretoken'){
                csrf = val
            }
        })
        var token = ''
        var pathname = location.pathname.split('/')
        pathname = pathname.filter(p => p != '')
        token = pathname[1] == "confirmation-code" ? '' : pathname[1]
        try {
            const response = await axios.post(`/resend_code/${token}/`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrf,
                },
            });
            if(response.data.message == 'success'){
                location.reload()
            }
        } catch (error) {}
    });
    countdown();

    // Other
    //
    var phone_number = $(".confPhone").text()
    $(".confPhone").text(
        `${phone_number.slice(0, 7)}*****${phone_number.slice(
            phone_number.length - 2,
            phone_number.length
        )}`
    );

})(jQuery);
