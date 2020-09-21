(function($) {
    "use strict";
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    // $('.validate-form').on('submit',function(){
    //     var check = true;

    //     for(var i=0; i<input.length; i++) {
    //         if(validate(input[i]) == false){
    //             showValidate(input[i]);
    //             check=false;
    //         }
    //     }

    //     return check;
    // });
    var next_to;
    if (window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        next_to = hash;
        // hash found
    } else {
        next_to = "/";
    }

    $("#btn-login").click(function() {
        var email = $("#email").val();
        var password = $("#password").val();
        var check = true;
        if (validate(input[0]) == false) { //false
            showValidate(input[0]);
        } else { // true
            if (validate(input[1]) == false) { //false
                showValidate(input[1]);
            } else {
                $.ajax({
                    url: '../auth/login',
                    type: 'post',
                    dataType: 'html',
                    data: { email: email, password: password },
                    success: function(data) {
                        $("#status-login").html('');
                        window.location.href = next_to;
                    },
                    error: function() {
                        $("#status-login").html("<span style='color: red;'>Email or password is incorrect</span>");
                    }

                });
            }
        }

    });

    $('.validate-form .input100').each(function() {
        $(this).focus(function() {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        } else {
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



})(jQuery);