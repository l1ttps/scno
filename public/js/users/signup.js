
(function ($) {
    "use strict";
    var input = $('.validate-input .input100');
    $("#verify-form").hide();

    $("#btn-signup").click(function () {
        var email = $("#email").val().toLowerCase();
        var password = $("#password").val();
        var repassword = $("#repassword").val();
        var display_name = $("#display_name").val().toLowerCase();
        display_name = display_name.charAt(0).toUpperCase() + display_name.slice(1);
        var check = true;
        if (validate(input[0]) == false) { //false
            showValidate(input[0]);
        }
        else { // true
            if (validate(input[1]) == false) { //false
                showValidate(input[1]);
            }
            else {
                if (validate(input[2]) == false) { //false
                    showValidate(input[2]);
                }
                else {
                    if (repassword != password) { //false
                        showValidate(input[3]);
                    }
                    else {
                        $.ajax({
                            url: '../auth/signup',
                            type: 'post',
                            dataType: 'html',
                            data: { email: email },
                            success: function (data) {
                                $("#verify-form").show();
                                $("#email_sended").html("<span style='color: red;'>" + email + "</span>");
                                $("#form").hide();
                                countdown(2);
                            },
                            error: function (data) {
                                if (data.status == 403) {
                                    $("#login-error").html("<span style='color:red;'>This e-mail is already taken</span>");
                                    var email = $("#email").val('');
                                    $("#email").focus();

                                }
                                else {
                                    $("#login-error").html("<span style='color:red;'>You have recently submitted a request but have not confirmed it, try again in a few minutes</span>");
                                }
                            }
                        });
                    }
                }

            }
        }

    });
    $("#btn-verify").click(function () {
        var email = $("#email").val().toLowerCase();
        var password = $("#password").val();
        var repassword = $("#repassword").val();
        var display_name = $("#display_name").val().toLowerCase();
        if (validate(input[4]) == false) { //false
            showValidate(input[4]);
        }
        else {
            var verify_code = $("#verify_code").val();
            $.ajax({
                url: '../auth/verify_code',
                type: 'post',
                dataType: 'html',
                data: { email: email, verify_code: verify_code, password: repassword, display_name: display_name },
                success: function (data) {
                    $("#verify_code_incorect").html('');
                },
                error: function (data) {
                    $("#verify_code").val('');
                    if (data.status == 403) {
                        $("#verify_code_incorect").html("<span style='color:red;'>Verification code has expired.</span>");
                    }
                    else if (data.status == 401) {
                        $("#verify_code_incorect").html("<span style='color:red;'>The verification code is incorrect.</span>");
                    }

                }
            });
        }
    });
    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        var password = $("#password").val();
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else if ($(input).attr('type') == 'password' || $(input).attr('name') == 'pass') {

            if (password.length < 6) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }
    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    function countdown(minutes) {

        // Set the date we're counting down to
        var countDownDate = new Date().getTime() + minutes * 60000;

        // Update the count down every 1 second
        var x = setInterval(function () {

            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = countDownDate - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Output the result in an element with id="demo"
            document.getElementById("expires").innerHTML = "Expires : " + minutes + " m " + seconds + "s ";

            // If the count down is over, write some text 
            if (distance < 0) {
                clearInterval(x);
                $("#expires").hide();
                $("#btn-resend").removeClass("btn-link");
                $("#btn-resend").addClass("btn-success");
                $("#btn-resend").removeAttr("disabled");
            }
        }, 1000);
    }

    $(".btn-cancel").click(function () {
        var email = $("#email").val().toLowerCase();
        if (confirm("Do you want to cancel?")) {
        $.post("../auth/delete_verify_code",{email: email}, function(){
            window.location.reload();
        });
        }

    });
    $("#btn-resend").click(function () {
        var email = $("#email").val().toLowerCase();
        $.ajax({
            url: '../auth/signup',
            type: 'post',
            dataType: 'html',
            data: { email: email },
            success: function (data) {
                countdown(2);
                $("#expires").show(500);
                $("#btn-resend").addClass("btn-link");
                $("#btn-resend").removeClass("btn-success");
                $("#btn-resend").attr('disabled', 'disabled')
            },

        });
    })

})(jQuery);