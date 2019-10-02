$(function () {
    Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "$";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var number = this,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    };
    // Default usage and custom precision/symbol :
    var revenue = 12345678;
    //alert(revenue.formatMoney()); // $12,345,678.00
    //alert(revenue.formatMoney(0, "HK$ ")); // HK$ 12,345,678
    // European formatting:
    var price = 4999.99;
    //alert(price.formatMoney(2, "€", ".", ",")); // €4.999,99
    // It works for negative values, too:
    //alert((-500000).formatMoney(0, "£ ")); // £ -500,000
    var price = (12345.99).formatMoney(); // "$12,345.99"
    // Remove non-numeric chars (except decimal point/minus sign):
    //priceVal = parseFloat(price.replace(/[^0-9-.]/g, '')); // 12345.99
});

//$(document).ready(function () {
//    $('[data-toggle="tooltip"]').tooltip();
//    var actions = $("table td:last-child").html();
//    // Append table with add row form on add new button click
//    $(".add-new").click(function () {
//        $(this).attr("disabled", "disabled");
//        var index = $("table tbody tr:last-child").index();
//        var row = '<tr>' + '<td></td><td></td>'+
//            '<td><input type="text" class="form-control" name="code" id="code"></td>' +
//            '<td><input type="text" class="form-control" name="name" id="name"></td>' +
//            '<td><input type="text" class="form-control" name="name_cn" id="name_cn"></td>' +
//            '<td><input type="text" class="form-control" name="price" id="name_cn"></td>' +
//            '<td><input type="text" class="form-control" name="cost" id="name_cn"></td>' +
//            '<td><a href="#" class="on-editing save-row"><i class="fa fa-save"></i></a>&nbsp;&nbsp;<a href="#" class="on-default remove-row"><i class="fa fa-trash-o"></i></a></td>' +
//            '</tr>';
//        $("table").append(row);
//        $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
//        $('[data-toggle="tooltip"]').tooltip();
//    });
//    // Add row on add button click
//    $(document).on("click", ".add", function () {
//        var empty = false;
//        var input = $(this).parents("tr").find('input[type="text"]');
//        input.each(function () {
//            if (!$(this).val()) {
//                $(this).addClass("error");
//                empty = true;
//            } else {
//                $(this).removeClass("error");
//            }
//        });
//        $(this).parents("tr").find(".error").first().focus();
//        if (!empty) {
//            input.each(function () {
//                $(this).parent("td").html($(this).val());
//            });
//            $(this).parents("tr").find(".add, .edit").toggle();
//            $(".add-new").removeAttr("disabled");
//        }
//    });
//    // Edit row on edit button click
//    $(document).on("click", ".edit", function () {
//        $(this).parents("tr").find("td:not(:last-child)").each(function () {
//            $(this).html('<input type="text" class="form-control" value="' + $(this).text() + '">');
//        });
//        $(this).parents("tr").find(".add, .edit").toggle();
//        $(".add-new").attr("disabled", "disabled");
//    });
//    // Delete row on delete button click
//    $(document).on("click", ".delete", function () {
//        $(this).parents("tr").remove();
//        $(".add-new").removeAttr("disabled");
//    });
//});




var $table = $('#itemlist')
var $button = $('#addrow')
//var $remove = $('#remove')

$(function () {
    $button.click(function () {
        var randomId = 100 + ~~(Math.random() * 100)
        $table.bootstrapTable('insertRow', {
            index: 0,
            row: {
                id: randomId,
                code: randomId,
                name: 'Item ' + randomId,
                name_cn: '新产品',
                price: '$' + randomId,
                cost: '$' + '0.00',
                action: operateFormatter
            }
        })
    })
})

function loaddata()
{
    getdata();
}
function getdata() {
    var uri = prefix + '/item/itemlist';
    var tabledata;
    $.ajax({
        type: "get",
        url: uri,
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            //alert(JSON.stringify(data));

            tabledata = data;
            for (var q = 0; q < tabledata.length; q++) {
                tabledata[q].price = tabledata[q].price.formatMoney();
                tabledata[q].cost = tabledata[q].cost.formatMoney();
            }
            initTable(tabledata, '#itemlist')
        },
        error: function (data) {
            if (data.status == 401)
                //alert('Token Expired!! Redirect to login page!');
                setTimeout("window.location.href='login.html'", 3000);
            //    $("#showloginModal").click();

        }
    });
}
function responseHandler(res) {
    $.each(res.rows, function (i, row) {
        row.state = $.inArray(row.id, selections) !== -1
    })
    return res
}
window.operateEvents = {
    'click .edit-row': function (e, value, row, index) {
        alert('You click like action, row: ' + JSON.stringify(row))
    },
    'click .remove-row': function (e, value, row, index) {
        var r = confirm('delete this item?');
        if (r == false) { return; }
        else {
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            })
        }
    }
}
function operateFormatter(value, row, index) {
    return [
        '<a href="#" class="edit-row"><i class="fa fa-pencil"></i></a>',
        '&nbsp;&nbsp;',
        '<a href="#" class="remove-row"><i class="fa fa-trash-o"></i></a>'
    ].join('')
}
function initTable(data, id) {
    var myTableData;
    myTableData = data;

    var $table = $(id)
    $table.bootstrapTable('destroy').bootstrapTable({
        height: '100%',
        resizable: true,
        columns: [
            {
                valign: 'middle',
                align: 'center',
                width: 0,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'code',
                title: 'Code'

            },
            {
                field: 'name',
                title: 'Des'

            },
            {
                field: 'name_cn',
                title: 'Other Des'

            },
            {
                field: 'price',
                title: 'Price'

            },
            {
                field: 'cost',
                title: 'Cost'

            },
            {
                field: 'id',
                title: 'Action',
                clickToSelect: false,
                events: window.operateEvents,
                formatter: operateFormatter
            }
        ],
        data: myTableData
    });

    $table.on('check.bs.table uncheck.bs.table ' +
        'check-all.bs.table uncheck-all.bs.table',
        function () {
        $remove.prop('disabled', !$table.bootstrapTable('getSelections').length)
        selections = getIdSelections()
            // push or splice the selections if you want to save all data selections
        })
    $table.on('all.bs.table', function (e, name, args) {
        console.log(name, args)
    })

    $(window).resize(function () {
        $('#itemlist').bootstrapTable('resetView');
    });
}



