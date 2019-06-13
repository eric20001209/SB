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
});


$(function () {
    $('.input-daterange input').each(function () {
        $(this).datepicker('clearDates');
    });
    
    var today = new Date();

    var date = today.getDate();
    var year = today.getFullYear();
    var month = today.getMonth();

    today = date + '/' + month + '/' + year;

    $('#start').val(today);
    $('#end').val(today);

});

function loaddata() {
    getBranchList();
    getDate();
    getCategoryList();
    //getData();
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
        prefix += "<option value = 'Total' selected = 'selected' branid='' >Total</option> ";
        content = prefix + content + "</select>";
        $('#categorylist').html(content);
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

function getDate1() {

}

function getData() {
    var chartdatalist = [];
    var chartdataline, chartdatabar, chartdatapie, chartdataqty, chartdatasales, chartdataprofit;

    var des = [];
    var quantity = [];
    var sales = [];
    var profit = [];

    var from = $("#from").html();
    var to = $("#to").html();
    var startdate = moment(from, 'DD/MM/YYYY').add(0, 'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    var branchId = $("#bran").find("option:selected").attr("branid");
    var branchName = $("#bran").find("option:selected").attr("value");

    if (branchId == undefined)
        branchId = '';
    if (branchName == undefined)
        branchName = 'All Branches';

    var daterange = '';
    if (from == to)
        daterange = startdate.format('DD/MM/YYYY').toString();
    else
        daterange = startdate.format('DD/MM/YYYY').toString() + " - " + moment(to, 'DD/MM/YYYY').add(0, 'days').format('DD/MM/YYYY').toString();
    var uri = prefix + "/Itemtop10" + "?start=" + startdate.format('YYYY-MM-DD') + "&end=" + enddate.format('YYYY-MM-DD') + "&branch=" + branchId;
 //   alert(uri);
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

            var returnListqty = data[0];
            var returnListsales = data[1];
            var returnListprofit = data[2];
  
            //manage data for chart
            for (var i = 0; i < returnListqty.length; i++) {
                des[i] = returnListqty[i].description;
                quantity[i] = returnListqty[i].quantity;
            }
            //manage data sorted by qty for barchart
            chartdataqty = {
                des: des,
                value: quantity,
            }

            //manage data for chart
            for (var i = 0; i < returnListsales.length; i++) {
                des[i] = returnListsales[i].description;
                sales[i] = returnListsales[i].sales;
            }
            //manage data sorted by sales for barchart
            chartdatasales = {
                des: des,
                value: sales,
            }
            for (var i = 0; i < returnListprofit.length; i++) {
                des[i] = returnListprofit[i].description;
                profit[i] = returnListprofit[i].profit;
            }
            //manage data sorted by profit for barchart
            chartdataprofit = {
                des: des,
                value: profit,
            }
            chartdatalist = { chartdataqty, chartdatasales, chartdataprofit }

            //alert(JSON.stringify(chartdataqty));
            //alert(JSON.stringify(chartdatasales));
            //alert(JSON.stringify(chartdataprofit));

            //drawchart(chartdatalist, daterange, branchName);
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
                setTimeout("window.location.href='login.html'", 1000);
            //    $("#showloginModal").click();
        }
    });
}

function drawchart(data, daterange, branch) {

    //get data for chart
    var mychartdataqty, mychartdatasales, mychartdataprofit;

    mychartdataqty = data.chartdataqty;
    mychartdatasales = data.chartdatasales;
    mychartdataprofit = data.chartdataprofit;

    //alert(JSON.stringify(mychartdataqty));
    //alert(JSON.stringify(mychartdatasales));
    //alert(JSON.stringify(mychartdataprofit));

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
    chartBarQty = echarts.init(document.getElementById('myBarChartQty'));
    chartBarSales = echarts.init(document.getElementById('myBarChartRevenue'));
    chartBarProfit = echarts.init(document.getElementById('myBarChartProfit'));


    chartBarQty.on('mouseover', function (params) {
        if (params.name) {
            console.log(JSON.stringify(params.name));
        }
    });

        var optiongoupbyqty = {
            title: {
            show:true,
            text: branch,
                subtext: daterange
            },
        color: ['rgba(5,125,255, 0.8)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '0%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: mychartdataqty.des,
//               ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                name: 'Quantity',
                type: 'bar',
                barWidth: '60%',
                label: {
                    normal: {
                        position: 'right',
                        show: true
                            }
                },
                data: 
                    mychartdataqty.value
//              [10, 52, 200, 334, 390, 330, 220]
            }
        ]
    };
        var optiongoupbysales = {
        title: {
            show: true,
            text: branch,
            subtext: daterange
        },
        color: ['rgba(5,125,255, 0.8)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '0%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: mychartdatasales.des,
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
                name: 'Sales',
                type: 'bar',
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
        color: ['rgba(5,125,255, 0.8)'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '0%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'category',
                data: mychartdataprofit.des,
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
                type: 'bar',
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
    $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
        for (var i = 0; i < charts.length; i++) {
            charts[i].resize();
        }
    });

}


