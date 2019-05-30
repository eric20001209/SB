var saleschartLine;

$(function () {
    $(document).ajaxStart(function () {
        $("body").addClass("loading");
    })
        .ajaxStop(function () {
            $("body").removeClass("loading");
        });
}); //loading effect。。。

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


function loaddata() {
   getdata();
}
function getDate() {//即日起之前12个月 e.g. today is 24/03/2019, begin date will be 01/02/2018, end date will be 31/01/2019

    var last_year_month = function () {
        var d = new Date();
        var result = [];
        for (var i = 0; i < 12; i++) {
            d.setMonth(d.getMonth() - 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            //在这里可以自定义输出的日期格式
            //result.push(d.getFullYear() + "-" + m);
            //result.push(d.getFullYear() + "年" + m + '月');
            result.push('01/' + m + '/' + d.getFullYear());
        }
        return result;
    }
    console.log(last_year_month());

    var start = last_year_month()[11];
    var end = last_year_month()[0];

    console.log(start); //get start date
    console.log(end);//get end date

    //function sDate(AddDayCount) {
    //    var dd = new Date();
    //    dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
    //    var y = dd.getFullYear();
    //    var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
    //    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
    //    return d + "/" + m + "/" + y;
    //}
    //$("#datefrom").val(moment().format('DD/MM/YYYY'));
    //$('#datefrom').datepicker('setDate', sDate(-365));
    //$("#dateto").val(moment().format('DD/MM/YYYY'));
}
function getBranchList() {
    var uri = "https://localhost:44398/api/SalesInvoice/Branches";
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
        prefix += "<option value = 'Total' selected = 'selected' branid='-1' >Total</option> ";
        content = prefix + content + "</select>";
        $('#branchlist').html(content);
    }
    xhr.send(null);
}

function getdata() {
    var last_year_month = function () {
        var d = new Date();
        var result = [];
        for (var i = 0; i < 6; i++) {
            d.setMonth(d.getMonth() - 1);
            var m = d.getMonth() + 1;
            m = m < 10 ? "0" + m : m;
            //在这里可以自定义输出的日期格式
            //result.push(d.getFullYear() + "-" + m);
            //result.push(d.getFullYear() + "年" + m + '月');
            //result.push('01/' + m + '/' + d.getFullYear());
            result.push(d.getFullYear() + '/' + m  + '/01' );
        }
        return result;
    }

    var startdate = last_year_month()[5];
    var enddate = last_year_month()[0];
    var branchId = '-1'; // $("#bran").find("option:selected").attr("branid");

    var chartdataMonth;
    var dataForTable;
    var myReportDat;

    var chartdatalist = [];
    var uri = "https://localhost:44398/api/itemreport10/month?start=" + startdate + "&end=" + enddate;

    var myReport;
    var myReportTable;
    var month = [];
    var salesTotal = [];
    var profitTotal = [];
    var transQty = [];
    var percent = [];
    var salesbycat = [];

    var salesTotalAmount = 0;
    var profitTotalAmount = 0;
    var transQtySum = 0;
    var profitRate = 0;

    var someJsonString = {
        "branchId": branchId,
        "start": startdate,
        "end": enddate
    };
    if (localStorage.getItem('mySbIndexPage') != null) {

    }
    //else
    {
        $.ajax({
      //    type: "post",
            type: "get",
            url: uri,
            async: true,
            data: JSON.stringify(someJsonString),
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                myReport = data;
                myReportTable = data;
                myReportData = JSON.stringify(data);
                localStorage.setItem('mySbIndexPage', myReportData);

                for (var q = 0; q < myReport.length; q++) {
                    month[q] = myReport[q].month;
                    salesTotal[q] = myReport[q].salesTotal;

                    profitTotal[q] = myReport[q].profitTotal;
                    salesbycat[q] = JSON.stringify(myReport[q].salesbycat); //localstorage 只能存字符串， 要先tringify一下 ； 取值的时候要parse一下
                    transQty[q] = myReport[q].TransQty;
                    percent[q] = myReport[q].percent;

                    salesTotalAmount += myReport[q].salesTotal;//salesTotal[q];
                    profitTotalAmount += myReport[q].profitTotal; //profitTotal[q];
                    transQtySum += transQty[q];

                    localStorage.setItem(month[q].toString(), salesbycat[q]);
                }
                chartdataMonth = {
                    month: month,
                    salesTotal: salesTotal,
                    profitTotal: profitTotal,
                    percent: percent,
                    transQty: transQty
                }
                for (var q = 0; q < myReport.length; q++) {
                    myReportTable[q].salesTotal = myReportTable[q].salesTotal.formatMoney();
                }

                dataForTable = myReportTable

                profitRate = (profitTotalAmount / salesTotalAmount * 100).toFixed(2);
                $('#progressbarProfitRate').attr("aria-valuenow", profitRate);
                $('#progressbarProfitRate').attr("style", "width:" + profitRate + "%");
                $('#salesTotalAmount').html(salesTotalAmount.formatMoney());
                $('#profitTotalAmount').html(profitTotalAmount.formatMoney());
                $('#totalTrans').html(transQtySum);
                $('#profitRate').html(profitRate + '%');

                chartdatalist = chartdataMonth
                drawchart(chartdatalist);
                initTable(dataForTable);
            },
            error: function (data) {
                if (data.status == 401)
                    $("#showloginModal").click();
            }
        });
    }
}
function drawchart(data) {
    var mychartdataLine = data; 
    if (saleschartLine != null && saleschartLine != "" && saleschartLine != undefined) {
        saleschartLine.dispose();
    }
    require.config({
        paths: {
            echarts: 'js/rep/eChart'
        }
    });
    require(
        [
            'echarts',
            'echarts/chart/line',
            'echarts/chart/bar',
            'echarts/chart/pie',
            'echarts/chart/radar'
        ]
        ,
        function drawmychart(ec) {
            saleschartLine = ec.init(document.getElementById('myLineChart'));

            var optionreportDayofWeekLine = '';
            optionreportDayofWeekLine = {
                title: {
                    text: 'Sales & Profit',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    show: true,
                    data: ['Sales','profit'] //['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: false,
                        axisLabel: { rotate: 0 },
                        data: mychartdataLine.month //['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
                        type: 'line',
                        //stack: '总量',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' }, color: 'rgba(5,125,255, 0.8)' } },
                        data: mychartdataLine.salesTotal //[120, 132, 101, 134, 90, 230, 210]
                    }
                    ,
                    {
                        name: 'profit',
                        type: 'line',
                        //stack: '总量',
                        smooth: true,
                        itemStyle: { normal: { areaStyle: { type: 'default' } } },
                        data: mychartdataLine.profitTotal // [220, 182, 191, 234, 290, 330, 310]
                    }
                ]
            };

            //saleschartBar.on('click', function (params) {
            //    if (params.value) {
            //        $("#mycatbtn").click();
            //        initTable(params.name);
            //    } else {
            //        alert("单击了" + params.name + "x轴标签");
            //    }
            //});

            saleschartLine.setOption(optionreportDayofWeekLine);

            window.addEventListener("resize", () => {
                saleschartLine.resize();
            });
        });
}
function initTable(data) {
    var myTableData;
    myTableData = data;
    console.log(myTableData);

    var $table = $('#table')
    $('#locale').change(function () {
        $table.bootstrapTable('refreshOptions', {
            locale: $(this).val()
        })
    });
    $table.bootstrapTable('destroy').bootstrapTable({
        height: '100%',
        columns: [{
            title: 'Index',
            valign: 'middle',
            align: 'center',
            width: 5,
            formatter: function (value, row, index) {
                return index + 1;
            }
        }, {

            field: 'month',
                title: 'Month'

        }, {
            field: 'salesTotal',
                title: 'Total Amount'

        }, {
            field: '',
                title: 'Percent(%)',

            formatter: function (value, row, index) {
                return progress(index);
            }//格式化进度条
        }],
        data: myTableData
    });

    function progress(index){
        var percentage = myTableData[index].percent;
        if (percentage >= 10 && percentage <= 20) {
            return ["<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + percentage + "%</div><div class='progress'>"
                + '<div class="progress-bar progress-bar-danger" style="width: ' + percentage + '%"; aria-valuenow :"' + percentage + '"; aria-valuemax="100">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>"];
        }
        else if (percentage > 20) {
            return ["<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + percentage + "%</div><div class='progress'>"
                + '<div class="progress-bar bg-success progress-bar-danger" style="width: ' + percentage + '%"; aria-valuenow :"' + percentage + '"; aria-valuemax="100">'
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



        //<div class="row no-gutters align-items-center">
        //    <div class="col-auto">
        //        <div class="h5 mb-0 mr-3 font-weight-bold text-gray-800">70%</div>
        //    </div>
        //    <div class="col">
        //        <div class="progress progress-sm mr-2">
        //            <div class="progress-bar bg-info" role="progressbar" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
        //        </div>
        //    </div>
        //</div>

    }
    //给table表格中添加进度条
    function progress11(index) {
        var red = phaseInfo[index].red;
        var green = phaseInfo[index].green;
        var yellow = phaseInfo[index].yellow;
        var begin = phaseInfo[index].begin;
        var total = red + green + yellow;

        b = (Math.round(begin / total * 10000) / 100.00 + "%");
        r = (Math.round(red / total * 10000) / 100.00 + "%");
        g = (Math.round(green / total * 10000) / 100.00 + "%");
        y = (Math.round(yellow / total * 10000) / 100.00 + "%");
        return ["<div class='progress'>"
            + '<div class="progress-bar progress-bar-danger" style="width: ' + b + '">'
            + '<span class="sr-only">Complete (danger)</span>'
            + '</div>'
            + '<div class="progress-bar progress-bar-success" style="width: ' + g + '">'
            + '<span class="sr-only">Complete (success)</span>'
            + '</div>'
            + '<div class="progress-bar progress-bar-warning" style="width: ' + y + '">'
            + '<span class="sr-only">Complete (warning)</span>'
            + '</div>'
            + '<div class="progress-bar progress-bar-danger" style="width: ' + r + '">'
            + '<span class="sr-only">Complete (danger)</span>'
            + '</div>'
            + "</div>"];
    }
}

//function radiopick() {
//    $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
//}
