//$(document).ready(function () {
//    $(function () {
//        $('#datetimepicker6').datetimepicker();
//        $('#datetimepicker7').datetimepicker({
//            useCurrent: false //Important! See issue #1075
//        });
//        $("#datetimepicker6").on("dp.change", function (e) {
//            $('#datetimepicker7').data("DateTimePicker").minDate(e.date);
//        });
//        $("#datetimepicker7").on("dp.change", function (e) {
//            $('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
//        });
//    });
//});
function loaddata() {
    getDate();
}

function getDate() {
    $(function () {

        var start = moment().subtract(29, 'days');
        var end = moment();

        function cb(start, end) {
            $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        }

        $('#reportrange').daterangepicker({
            startDate: start,
            endDate: end,
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);

        cb(start, end);

    });
}

