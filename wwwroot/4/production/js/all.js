$(function () {
    $(document).ajaxStart(function () {
        $("body").addClass("loading");
    })
        .ajaxStop(function () {
            $("body").removeClass("loading");
        });
}); //loading effect。。。