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
var $table = $('#itemlist')
var $button = $('#addrow')

$(function () {
    $button.click(function () {
        insertrow()
    })
})
function insertrow() {
    var uri = prefix + "/item/add";
    var code = 100 + ~~(Math.random() * 100)
    var someJsonString = {
        "code": code,
        "name": 'new item',
        "name_cn": '新产品',
        "price": 0,
        "cost": 0
    };
    $.ajax({
        url: uri,//相对应的esb接口地址
        type: 'post',
        data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            var id = data.id;
            var code = data.code;
            var name = data.name;
            var name_cn = data.name_cn
            var price = data.price
            var cost= data.cost

//          alert('item ' + id + '/' + code + '/' + name + ' added sucessfully!');

            $table.bootstrapTable('insertRow', {
                index: 0,
                row: {
                    id: id,
                    code: code,
                    name: name,
                    name_cn: name_cn,
                    price: price.formatMoney(),
                    cost: cost.formatMoney(),
                    action: operateFormatter
                }
            })
            //                self.location = 'index.html';
        },
        error: function (data) {
            console.log('error');
        }
    });
}
function removerow(id) {
    $.ajax({
        type: 'delete',
        url: prefix + "/item/remove?id=" + id,
        //data: data,
        timeout: 1000, //超时时间设置，单位毫秒
        dataType: 'json',
        success: function (res) {

            console.log(res)

        },
        error: function (res) {
            console.log('error');
        }
    });
}
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
        $('#itemId').html(' - ' + row.id);

        $('#hiddenindex').html(index);
        $('#hiddenid').html(row.id);
        $('#code').val(row.code);
        $('#description').val(row.name);
        $('#otherdes').val(row.name_cn);
        $('#price').val(row.price)
        $('#cost').val(row.cost)
        $('#category').html(row.categoryid)
        getCategory(row.cat,row.categoryid)
        getBarcodes(row.id)
 //     alert('You click like action, row: ' + JSON.stringify(row))

    },
    'click .remove-row': function (e, value, row, index) {
        var r = confirm('delete this item?');
        if (r == false) { return; }
        else {
            removerow(row.id);
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            })
        }
    }
}
function operateFormatter(value, row, index) {
    return [
        '<a href="#" class="edit-row" data-toggle="modal" data-target="#itemEditModal"><i class="fa fa-pencil"></i></a>',
        '&nbsp;&nbsp;',
        '<a href="#" class="remove-row"><i class="fa fa-trash-o"></i></a>'
    ].join('')
}
function detailFormatter(index, row) {
    var html = []
    $.each(row, function (key, value) {
        var myValue='';
        if (key == 'barcodes') {

            if (value != null) {
                for (var i = 0; i < value.length; i++) {
                    myValue += value[i].barcode + ', ';
        //            alert(JSON.stringify(value));
                }
            }
            else {
                myValue = null;
            }
        }
        else {
            myValue = value;
        }
//      html.push('<p><b>' + key + ':</b> ' + JSON.stringify(value) + '</p>')
        html.push('<p><b>' + key + ':</b> ' + myValue + '</p>')
    })
    return html.join('')
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
                field: 'cat',
                title: 'Category'

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
function updateitem() {

    var $table = $('#itemlist')

    var id = $('#hiddenid').html().trim();
    var code = $('#code').val();
    var name = $('#description').val();
    var name_cn = $('#otherdes').val();
    var price = $('#price').val().replace('$', '');
    var cost = $('#cost').val().replace('$', '');
    var categoryid = $("#category option:selected").val();
    var category = $("#category option:selected").text();
    var index = $('#hiddenindex').html();

  //  alert(id);

    var data = [
        {
            "op": "replace",
            "path": "/code",
            "value": code
        },
        {
            "op": "replace",
            "path": "/name",
            "value": name
        },
        {
            "op": "replace",
            "path": "/name_cn",
            "value": name_cn

        },
        {
            "op": "replace",
            "path": "/price",
            "value": price.replace('$','')
        },
        {
            "op": "replace",
            "path": "/cost",
            "value": cost.replace('$', '')
        },
        {
            "op": "replace",
            "path": "/cat_id",
            "value": categoryid
        }
    ];
    $.ajax({
        type: 'Patch',
        url: prefix + "/item/edit?id=" + id,
        data: JSON.stringify(data),
        timeout: 1000, //超时时间设置，单位毫秒
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            alert('Item update sucessfully!');
            //alert(id);
            //$table.bootstrapTable('updateByUniqueId', {
            //    id: 5,
            //    row: {
            //        code: code,
            //        name: name,
            //        name_cn: name_cn,
            //        price: price,
            //        cost: cost,
            //        cat: category
            //    }
            //})
            $table.bootstrapTable('updateRow', {
                index: index,
                row: {
                    code: code,
                    name: name,
                    name_cn: name_cn,
                    price: price,
                    cost: cost,
                    cat: category
                }
            })
        },
        error: function (data) {
            if (data.status == 400) {
                alert('Sorry, this item update fail !!!');
                return false;
            }
        }
    });



}
function getCategory(text,id)
{
    //var uri = prefix + '/item/item/cat/' + id;
    var uri = prefix + '/category/list';
    var levels = 0;
    $.ajax({
        type: "get",
        url: uri,
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            var mydata = data;

            var option = new Option(text, id, true, true);
            $("#category").append(option).trigger('change');

            //for (var i = 0; i < levels; i++) {
            $("#category").select2ToTree({
                treeData: { dataArr: mydata }  //, templateResult: formatState, templateSelection: formatState
            
                //, maximumSelectionLength: 1
            });

            //function formatState(state) {
            //    //if (state.id >= 1 && state.id <= 3) {
            //    //    return $(
            //    //        //'<span><img src="./' + state.element.value.toLowerCase() + '.png" class="img-flag" /> ' + state.text + '</span>'
            //    //        state.text
            //    //    );
            //    //}
            //    //else
            //        return state.text;
            //};
        },
        error: function (data) {
            if (data.status == 401)
                setTimeout("window.location.href='login.html'", 3000);
        }
    });

    //$("#category").select2ToTree({ treeData: { dataArr: data }, maximumSelectionLength: 3 });
}
function getBarcodes(itemId) {

    var uri = prefix + '/item/barcodeList/' + itemId;
    $('#barcodelist').dataTable({
        "ajax": {
            "url": uri,
            "dataSrc": ""
        },
        "Columns": [

            { "data": "barcode" }
        ]
    });
    //$.ajax({
    //    type: "get",
    //    url: uri,
    //    async: true,
    //    contentType: "application/json",
    //    dataType: "json",
    //    success: function (data) {
    //        for (var i = 0; i < data.length; i++) {

    //        }
    //    },
    //    error: function (data) {
    //        if (data.status == 401)
    //            setTimeout("window.location.href='login.html'", 3000);
    //    }
    //});
}








