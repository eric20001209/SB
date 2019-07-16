$(function () {
    ///货币符号转换
    // Extend the default Number object with a formatMoney() method:
    // usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
    // defaults: (2, "$", ",", ".")
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
});//货币换算
$(function () {
    $('.input-daterange').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $('#from').datepicker('setDate', moment().add(-3,'months').format('DD/MM/YYYY'));
    $('#to').datepicker('setDate', moment().format('DD/MM/YYYY'));

});

$(function () {
    $('#timepicker').datetimepicker({
        format: 'LT'
    });
});

var reporttype = 'AllCategory';

function loaddata() {
    getBranchList();
    getDate();
    getData();
}

function getBranchList() {
    var uri = prefix + "/Itemtop10/Branches";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        var branch = '';
        var id = '';
        var content = "";
        for (var i = 0; i < resp.length; i++) {
            branch = resp[i].Name;
            id = resp[i].Id;
            content = content + "<option value='" + branch + "'  branid='" + id + "'>" + branch + "</option>";
        }
        var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'>";
        prefix += "<option value = 'Total' selected = 'selected' branid='' >Total</option> ";
        content = prefix + content + "</select>";
        $('#branchlist').html(content);
    }
    xhr.send(null);
}

function getitemlist() {
    var cat = $("#categorylist").find("option:selected").attr("value");
    //alert(cat);
    var type = $('#reporttype').prop('checked');
    if (type) {
        text = 'Category Report';
        $('#itemlistcontainer').hide();
    }
    else {
        $('#itemlistcontainer').show();
    }
    var uri = prefix + "/item/item?cat=" + cat;
    //alert(uri);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        var code = '';
        var name = '';
        var content = "";
        for (var i = 0; i < resp.length; i++) {
            code = resp[i].Code;
            name = resp[i].Name;
            content = content + "<option value='" + name + "' code='" + code + "'>" + name + "</option>";
        }
        var prefix = "<select data-plugin-selectTwo class='form-control populate' id='myitem'>";
        prefix += "<option value = 'ALL' selected = 'selected' code='' >ALL</option> ";
        content = prefix + content + "</select>";
        $('#itemlist').html(content);
        $('#labelitemlist').html('Items:');
    }
    xhr.send(null);
}

function getDate() {
    $(function () {
        var start = moment().subtract(1, 'month').startOf('month');//moment().subtract(29, 'days');
        var end = moment();

        $('#from').html(start.format('DD-MM-YYYY'));
        $('#to').html(end.format('DD-MM-YYYY'));

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
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
                'Last 3 Month': [moment().subtract(3, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            }
        }, cb);
        cb(start, end);
    });

    $('#reportrange').on('apply.daterangepicker', function (ev, picker) { //apply button onclick event

        $('#from').html(picker.startDate.format('DD-MM-YYYY'));
        $('#to').html(picker.endDate.format('DD-MM-YYYY'));

        getData();
    });

    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) { //cancel button onclick event
        $('#reportrange').val('');
    });

}

function getData() {

    var from = $("#from").val();
    var to = $("#to").val();

    var startdate = moment(from, 'DD/MM/YYYY').add(0, 'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    var branchId = $("#bran").find("option:selected").attr("branid");
    var branchName = $("#bran").find("option:selected").attr("value");
    var invoiceNumber = $("#invoice").val();

    var cat = $("#mycat").find("option:selected").attr("value");
    var code = $("#myitem").find("option:selected").attr("code");
    var product = $("#myitem").find("option:selected").attr("value");

    if (branchId == undefined)
        branchId = '';
    if (branchName == undefined)
        branchName = 'All Branches';

    if (cat == undefined || cat == 'Total')
        cat = '';
    if (code == undefined)
        code = '';
    if (product == undefined || product == 'ALL')
        product = '';

    var chartTitle = branchName;
    if(cat != '')
        chartTitle += ' - ' + cat;
    if (product != '')
        chartTitle += ' - ' + product;

    var daterange = '' ;
    if (from == to)
        daterange = startdate.format('DD/MM/YYYY').toString();
    else
        daterange = startdate.format('DD/MM/YYYY').toString() + " - " + moment(to, 'DD/MM/YYYY').add(0, 'days').format('DD/MM/YYYY').toString();

    var uri = prefix + "/salesinvoice/invoicelist?start=" + startdate.format('YYYY-MM-DD') + "&end=" + enddate.format('YYYY-MM-DD') + "&branch=" + branchId;
    uri += "&invoice_number=" + invoiceNumber;
    //alert(uri);

    var someJsonString = {
        "branchId": branchId,
        "start": startdate.format('YYYY-MM-DD'),
        "end": enddate.format('YYYY-MM-DD')
    };
    $.ajax({
        type: "get",
        url: uri,
        async: true,
        //data: JSON.stringify(someJsonString),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            initTable(data,'#invoicelist','')
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
                setTimeout("window.location.href='login.html'", 1000);
            //    $("#showloginModal").click();
        }
    });
}

function GetSalesItems(inv) {
    var uri = prefix + "/salesinvoice?invoice_number=" + inv;
    var str = '';
    var subtotal = 0;
    $.ajax({
        type: "get",
        url: uri,
        async: false,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            var sti='';
            for (var i = 0; i < data.sales_items.length; i++) {
                sti += "<tr>";
                sti += "<td>" + data.sales_items[i].qty + "</td>";
                sti += "<td>" + data.sales_items[i].code + "</td>";
                sti += "<td></td>";
                sti += "<td>" + data.sales_items[i].name + "</td>";
                sti += "<td>" + data.sales_items[i].sales_total.formatMoney() + "</td>";
                //alert(i);
                sti += "</tr>";
                str = sti;
                subtotal += data.sales_items[i].sales_total;
                //alert(subtotal);
            }
            //alert(sti);
            return sti;
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
            setTimeout("window.location.href='login.html'", 1000);
        }
    });
    return str;
}

function detailFormatter(index, row) {
    var html = []
    var inv=0;
    var content = '';
    $.each(row, function (key, value) {

        if (key == 'InvoiceNumber') {
            inv = value;
            content = GetSalesItems(inv);
            //alert('1111' + content);
            html.push(content);
        }

        //if (key == 'Total')
        //    html.push('<p><b>' + key + ':</b> ' + value.formatMoney() + '</p>')
        //else
        //    html.push('<p><b>' + key + ':</b> ' + value + '</p>')
    })
    return html.join('')
}

function initTable(data, id) {
    var myTableData;
    myTableData = data;

    var $table = $(id)
    $table.bootstrapTable('destroy').bootstrapTable({
        //height: '100%',
        resizable: true,
        columns:[
            
            [
                //{
                //valign: 'middle',
                //align: 'center',
                //visible: true,
                //width: 0,
                //formatter: function (value, row, index) {
                //    return index + 1;}
                //}
                //,
                {
                title: 'Branch',
                field: 'BranchName',
                rowspan: 2,
                //colspan:2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Invoice Detail',
                colspan: 3,
                align: 'center'
            }],
            [{
                field: 'InvoiceNumber',
                sortable: true,
                formatter: LinkFormatter,
                title: '#Invoice'

            }, {
                field: 'CommitDate',
                sortable: true,
                title: 'Date'
            }, {
                field: '',
                title: 'Amount'
                ,
                formatter: function (value, row, index) {
                    return currency(index);
                }
            }]
        ],


        //    {
        //        //title: 'Index',
        //        valign: 'middle',
        //        align: 'center',
        //        visible: false,

        //        width: 0
        //        ,
        //        formatter: function (value, row, index) {
        //            return index + 1;
        //        }
        //    },

        //    {
        //        field: 'BranchName',
        //        title: 'Branch'
        //    },
        //    {

        //        field: 'InvoiceNumber',
        //        sortable: true,
        //        formatter: LinkFormatter,
        //        title: '#Invoice'

        //    },
        //    {

        //        field: 'CommitDate',
        //        sortable: true,
        //        title: 'Date'

        //    }
        //    , {
        //        field: '',
        //        title: 'Amount'
        //        ,
        //        formatter: function (value, row, index) {
        //            return currency(index);
        //        }
        //    }
        //],
        data: myTableData
    });

    function LinkFormatter(value, row, index) {
        var invo = myTableData[index].InvoiceNumber;
        //return "<a href='" + row.url + "'>" + invo + "</a>";
        var st = "";
        st = "<a href=invoice.html?inv="+ invo + " target='_blank'>" + invo + "</a>";
  //    st = '<a type="button" class="btn btn - primary" data-toggle="modal" data-target="#myinovice" id="mycatbtn" onclick=$("#inv_no").html('+invo+') hidden>' + invo + '</a>';
        //st = '<p><a class="btn btn - primary" data-toggle="collapse" href="#collapseExample_' + invo +'" role="button" aria-expanded="false" aria-controls="collapseExample">';
        //st += invo;
        //st += '</a></p>';
        //st += '<div class="collapse" id="collapseExample_' + invo+'">';
        //st += invo ;
        //st += '</div>';
        return st;
       
    }

    function currency(index) {
        var amount = myTableData[index].Total,
            amount = amount.formatMoney();
        return amount;
    }


    $(window).resize(function () {
        $('#invoicelist').bootstrapTable('resetView');
        //$('#profittabledetail').bootstrapTable('resetView');
    });
}




