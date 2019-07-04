﻿$(function () {
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
    //getCategoryList();
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

function getCategoryList() {
    var uri = prefix + "/item/cat";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        var cat = '';
        var content = "";
        for (var i = 0; i < resp.length; i++) {
            cat = resp[i].Cat;
            content = content + "<option value='" + cat + "'>" + cat + "</option>";
        }
        var prefix = "<select data-plugin-selectTwo class='form-control populate' id='mycat'>";
        prefix += "<option value = 'Total' selected = 'selected' >Total</option> ";
        content = prefix + content + "</select>";
        $('#categorylist').html(content);
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

function getreporttype() {
    var type = $('#reporttype').prop('checked');
    if (type) {
        //var catValue = $("#categorylist").find("option:selected").attr("value");
        //if (catValue == 'Total') {
            reporttype = 'AllCategory';
        //}
        //else { reporttype ='OneCategory'}
        $('#itemlistcontainer').hide();
    }
    else {
        reporttype = 'CategoryItem';
        getitemlist();
    }


}

function getData() {
    var chartdatalist = [];
    var chartdataline, chartdatabar, chartdatapie,chartdataqty, chartdatasales, chartdataprofit;
    var chartType;

    var type = $('#reporttype').prop('checked');
    var catValue = $("#categorylist").find("option:selected").attr("value");
    var itemValue = $("#itemlist").find("option:selected").attr("value");
    //alert(catValue);
    //get report type

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

function drawchart(data, daterange, branch, chartType) {

    //get data for chart
    var mychartdataqty, mychartdatasales, mychartdataprofit, mychartdataAllCategories, mychartdataOneCategory, mychartdataCategoryItme, mychartdataOneItme;

    mychartdataqty = data.chartdataqty;
    mychartdatasales = data.chartdatasales;
    mychartdataprofit = data.chartdataprofit;

    //renew container
    var chartBarQty, chartBarSales, chartBarProfit;

    if (chartBarQty != null && chartBarQty != "" && chartBarQty != undefined) {
        chartBarQty.dispose();
    }
    if (chartBarSales != null && chartBarSales != "" && chartBarSales != undefined) {
        chartBarSales.dispose();
    }
    if (chartBarProfit != null && chartBarProfit != "" && chartBarProfit != undefined) {
        chartBarProfit.dispose();
    }

    chartBarSales = echarts.init(document.getElementById('chart1'));
    chartBarProfit = echarts.init(document.getElementById('chart2'));
    chartBarQty = echarts.init(document.getElementById('chart3'));

    //chartBarQty.on('mouseover', function (params) {
    //    if (params.name) {
    //        console.log(JSON.stringify(params.name));
    //    }
    //});

    var optiongoupbysales = {
        title: {
            show: true,
            text: branch,
            subtext: daterange
        },
            color: ['rgba(9,135,235, 0.8)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: mychartdatasales.keys,
                axisLabel: {
                    clickable: true,
                    formatter: function (params) {
                        var newParamsName = "";
                        var paramsNameNumber = params.length;
                        var provideNumber = 9;
                        if (paramsNameNumber > provideNumber) {
                            var tempStr = "";

                            tempStr = params.substring(0, provideNumber);
                            newParamsName = tempStr + "..."
                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    },

                    interval: 0,
                    rotate: 45
                },

                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Sales',
                type: chartType, //'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        position: 'top',
                        show: true,
                        rotate: 0,
                        formatter: function (params) {
                            var res = params['value'].formatMoney();
                            return res;
                        }
                    }
                },
                data:
                    mychartdatasales.value
            }
        ]
    };
    var optiongoupbyprofit = {
        title: {
            show: true,
            text: branch,
            subtext: daterange
        },
        color: ['rgba(255,125,6, 0.8)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: mychartdataprofit.keys,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Profit',
                type: chartType , //'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        position: 'right',
                        show: true,
                        formatter: function (params) {
                            var res = params['value'].formatMoney();
                            return res;
                        }
                    }
                },
                data:
                    mychartdataprofit.value
            }
        ]
    };
    var optiongoupbyqty = {
        title: {
            show: true,
            text: branch,
            subtext: daterange
        },
        color: ['rgba(135,5,255, 0.7)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '6%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: mychartdataqty.keys,
                axisLabel: {
                    clickable: true,
                    formatter: function (params) {
                        var newParamsName = "";
                        var paramsNameNumber = params.length;
                        var provideNumber = 9;
                        if (paramsNameNumber > provideNumber) {
                            var tempStr = "";

                            tempStr = params.substring(0, provideNumber);
                            newParamsName = tempStr + "..."
                        } else {
                            newParamsName = params;
                        }
                        return newParamsName
                    },

                    interval: 0,
                    rotate: 45
                },
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'Quantity',
                type: chartType, //'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        position: 'top',
                        show: true,
                        rotate: 0,
                        formatter: function (params) {
                            var res = params['value'];
                            return res;
                        }
                    }
                },
                data:
                    mychartdataqty.value
            }
        ]
    };


    chartBarQty.setOption(optiongoupbyqty);
    chartBarSales.setOption(optiongoupbysales);
    chartBarProfit.setOption(optiongoupbyprofit);

    var charts = [];
    charts.push(chartBarQty);
    charts.push(chartBarSales);
    charts.push(chartBarProfit);

        window.addEventListener("resize", () => {
            chartBarQty.resize();
            chartBarSales.resize();
            chartBarProfit.resize();
        });
    //tab
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        for (var i = 0; i < charts.length; i++) {
            charts[i].resize();
        }
    });

}

function initTable(data, id, datafield) {
    var myTableData;
    myTableData = data;

    var $table = $(id)
    $table.bootstrapTable('destroy').bootstrapTable({
        height: '100%',
        resizable: true,
        columns: [
            {
                //title: 'Index',
                valign: 'middle',
                align: 'center',
                width: 0,
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {

                field: 'BranchName',
                title: 'Branch'

            },
            {

                field: 'InvoiceNumber',
                sortable: true,
                formatter: LinkFormatter,
                title: '#Invoice'

            },
            {

                field: 'CommitDate',
                sortable: true,
                title: 'Date'

            }
            //,
            //{
            //    field: 'Total', //'salesTotal',
            //    title: 'Amount'

            //}
            , {
                field: '',
                title: 'Amount'
                ,
                formatter: function (value, row, index) {
                    return currency(index);
                }//格式化进度条
            }
        ],
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

    function progress(index) {//add progress bar
        var percentage = myTableData[index].percent;
        if (percentage >= 10 && percentage <= 20) {
            return ["<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + percentage + "%</div><div class='progress'>"
                + '<div class="progress-bar progress-bar-default" style="width: ' + percentage + '%"; aria-valuenow :"' + percentage + '"; aria-valuemax="100">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>"];
        }
        else if (percentage > 20) {
            return ["<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + percentage + "%</div><div class='progress'>"
                + '<div class="progress-bar bg-success progress-bar-success" style="width: ' + percentage + '%"; aria-valuenow :"' + percentage + '"; aria-valuemax="100">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>"];
        }
        else {
            return ["<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + percentage + "%</div><div class='progress'>"
                + '<div class="progress-bar bg-danger progress-bar-danger" style="width: ' + percentage + '%"; aria-valuenow :"' + percentage + '"; aria-valuemax="100">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>"];
        }
    }

    $(window).resize(function () {
        $('#invoicelist').bootstrapTable('resetView');
        //$('#profittabledetail').bootstrapTable('resetView');
    });
}

