$(document).ready(function() {
    $(".btn-edit").click(function() {
        $(this).hide();
        var change_name = $(this).attr("value");
        switch (change_name) {
            case 'name':
                {
                    $("#edit-name").show(300);
                    $("#name").css("background-color", "#F5F6F7");
                    $("#display_name").html("<input class='form-control'  placeholder='Q-VINH'>");
                    break;
                }
            case 'password':
                {
                    break;
                }
        }
    });
    $(".btn-cancel").click(function() {
        // $(".show-edit-info").hide(200);
        // $(".account-setting").css("background-color", "");
        window.location.reload();
    });
});