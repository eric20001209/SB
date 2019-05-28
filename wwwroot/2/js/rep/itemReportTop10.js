var saleschartLine, saleschartPie, saleschartBar, saleschart1, saleschart2;

    $(function () {
        $(document).ajaxStart(function () {
            $("body").addClass("loading");
        })
            .ajaxStop(function () {
                $("body").removeClass("loading");
            });
    });

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

//var loadingTicket;
//var effectIndex = -1;
////var effect = ['spin', 'bar', 'ring', 'whirling', 'dynamicLine', 'bubble'];
//var effect = ['spin'];

function refresh(isBtnRefresh) {
    //(new function (editor.doc.getValue()))();
    if (myChart && myChart.dispose) {
        myChart.dispose();
    }
    myChart = echarts.init(domMain, curTheme);
    (new Function(editor.doc.getValue()))();
    domMessage.innerHTML = '';
}

function checklogin() {
    console.log(sessionStorage.userID.toString());
    if (sessionStorage.userId == null || sessionStorage.userId == '')
    {
        self.location = 'index.html';  
    }
}

function loaddata() {
    //$("#navbarbar").load("sidebar.html");
    getBranchList();
    getDate();  
    getdata();
    //drawchart();
}

function getDate() {
    $('#datefrom').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    $('#dateto').datepicker({
        autoclose: true,
        format: 'dd/mm/yyyy'
    });
    function sDate(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        //return y + "-" + m + "-" + d; 
        return d + "/" + m + "/" + y;
    }
    $("#datefrom").val(moment().format('DD/MM/YYYY'));
    $('#datefrom').datepicker('setDate', sDate(-730));
    $("#dateto").val(moment().format('DD/MM/YYYY'));
}
function getDate2()
{
    function sDate(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1);//获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();//获取当前几号，不足10补0
        //return y + "-" + m + "-" + d; 
        return d + "/" + m + "/" + y;
    }
    $('#startdate').datepicker('setDate', sDate(-180));
    $('#enddate').datepicker('setDate', moment().format('DD/MM/YYYY'));
}
function getBranchList() {
    var uri = "https://localhost:44367/api/SalesInvoice/Branches";
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
        var prefix  = "<select data-plugin-selectTwo class='form-control populate' id='bran'>";
        prefix += "<option value = 'Total' selected = 'selected' branid='-1' >Total</option> ";
        content = prefix + content + "</select>";
        $('#branchlist').html(content);
    }
    xhr.send(null);
}
function getdata()
{
    var from = $("#datefrom").val();
    var to = $("#dateto").val();
    var startdate = moment(from, 'DD/MM/YYYY').add(0,'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');
    var branchId = $("#bran").find("option:selected").attr("branid");
    var chartdataDayofWeek;
    var chartdataMonth;
    var chartdatalist = [];
    var uri = "https://localhost:44367/api/itemreport10/byDay";
    var finalList;
    var reportDayofWeek;
    var newReportMonth

    var dataForTable;

    var day = [];
    var month = [];
    var salesTotal = [];
    var salesbycat = [];

    var dayPie = [];
    var monthPie = [];
    var salesTotalPie = [];
    var valueForPieChart = [];

    var someJsonString = {
        "branchId": branchId,
        "start": startdate.format('YYYY-MM-DD'),
        "end": enddate.format('YYYY-MM-DD')
    };

    $.ajax({
        type: "post",
        url: uri,
        async: true,
        data: JSON.stringify(someJsonString),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            finalList = data["myFinalList"];
            reportDayofWeek = data.reportDayofWeek;
            newReportMonth = data.newReportMonth;

            for (var q = 0; q < reportDayofWeek.length; q++) {
                day[q] = reportDayofWeek[q].day;
                month[q] = reportDayofWeek[q].month;
                salesTotal[q] = reportDayofWeek[q].salesTotal;//.formatMoney();
                console.log(salesTotal[q]);
                reportDayofWeek[q].salesbycat.total = reportDayofWeek[q].salesbycat.total;
                salesbycat[q] = JSON.stringify(reportDayofWeek[q].salesbycat); //localstorage 只能存字符串， 要先tringify一下 ； 取值的时候要parse一下

                localStorage.setItem(day[q].toString(), salesbycat[q]);
            }
            chartdataDayofWeek = {
                day: day,
                month: month,
                salesTotal: salesTotal
            }

            for (var q = 0; q < newReportMonth.length; q++) {
                dayPie[q] = newReportMonth[q].day;
                monthPie[q] = newReportMonth[q].month;
                salesTotalPie[q] = newReportMonth[q].salesTotal;
                valueForPieChart[q] = {
                    name: newReportMonth[q].month,
                    value: newReportMonth[q].salesTotal
                };
            }
            chartdataMonth = {
                day: dayPie,
                month: monthPie,
                salesTotal: salesTotalPie,
                valueForPieChart: valueForPieChart
            }

            chartdatalist = { chartdataDayofWeek, chartdataMonth }
            drawchart(chartdatalist);
        },
        error: function (data) {
            //console.log(data.responseText);
            if (data.status == 401)
                $("#showloginModal").click();
        }
    });

    //chartdatalist = { chartdataDayofWeek, chartdataMonth }
    //return chartdatalist 
}
function drawchart(data)
{
    //var branch = $("#bran").find("option:selected").val();
    //if (branch == undefined) {
    //    branch = "Total";
    //}

    var mychartdata = data.chartdataDayofWeek;//getdata(branch, 'bar').chartdataDayofWeek;
    var mychartdataLine = data.chartdataDayofWeek; // getdata(branch, 'bar').chartdataDayofWeek;
    var myChartdataPie = data.chartdataMonth; //getdata(branch, 'bar').chartdataMonth;

    if (saleschartBar != null && saleschartBar != "" && saleschartBar != undefined) {
        saleschartBar.dispose();
    }
    if (saleschartLine != null && saleschartLine != "" && saleschartLine != undefined) {
        saleschartLine.dispose();
    }
    if (saleschartPie != null && saleschartPie != "" && saleschartPie != undefined) {
        saleschartPie.dispose();
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
            saleschartBar = ec.init(document.getElementById('myBarChart'));
            saleschartLine = ec.init(document.getElementById('myLineChart'));
            saleschartPie = ec.init(document.getElementById('myPieChart'));

            var optionreportDayofWeek = '';
            optionreportDayofWeek = {
                tooltip: {
                    trigger: 'axis',
                    left: '10px'
                },
                legend: {
                    show: false,
                    data: ['Sales']
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
                        axisLabel: {
                            /********echart click event start**********************/
                            clickable: true,
                            formatter: function (params) {
                                var newParamsName = "";
                                var paramsNameNumber = params.length;
                                var provideNumber = 9;
                                //                            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
                                if (paramsNameNumber > provideNumber) {
                                    var tempStr = "";

                                    tempStr = params.substring(0, provideNumber);
                                    newParamsName = tempStr + "..."
                                } else {
                                    newParamsName = params;
                                }
                                return newParamsName
                            },
                            /********echart click event ends***************************************/
                            interval: 0,
                            rotate: 20
                        },
                        //boundaryGap: false,
                        data: mychartdata.day
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        nameTextStyle: {
                            size:'6px'
                        }
                    }
                ],
                series: [
                    {
                        name: 'Sales',
                        type: 'bar',
                        stack: '总量',
                        itemStyle: {
                            normal: {
                                color: 'rgba(5,125,255, 0.8)',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'insideTop'
                                    }
                                }
                                //areaStyle: { type: 'default' }
                            }
                        },
                        data: mychartdata.salesTotal 
                    }
                ]
            };

            var optionreportDayofWeekLine = '';
            optionreportDayofWeekLine = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    show: false,
                    data: ['Sales'] //['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
                        axisLabel: {rotate:20},
                        data: mychartdataLine.day //['周一', '周二', '周三', '周四', '周五', '周六', '周日']
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
                        stack: '总量',
                        itemStyle: { normal: { areaStyle: { type: 'default' }, color: 'rgba(5,125,255, 0.8)' } },
                        data: mychartdataLine.salesTotal //[120, 132, 101, 134, 90, 230, 210]
                    }
                    //,
                    //{
                    //    name: '联盟广告',
                    //    type: 'line',
                    //    stack: '总量',
                    //    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    //    data: [220, 182, 191, 234, 290, 330, 310]
                    //},
                    //{
                    //    name: '视频广告',
                    //    type: 'line',
                    //    stack: '总量',
                    //    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    //    data: [150, 232, 201, 154, 190, 330, 410]
                    //},
                    //{
                    //    name: '直接访问',
                    //    type: 'line',
                    //    stack: '总量',
                    //    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    //    data: [320, 332, 301, 334, 390, 330, 320]
                    //},
                    //{
                    //    name: '搜索引擎',
                    //    type: 'line',
                    //    stack: '总量',
                    //    itemStyle: { normal: { areaStyle: { type: 'default' } } },
                    //    data: [820, 932, 901, 934, 1290, 1330, 1320]
                    //}
                ]
            };

            var optionreportMonth = '';
            optionreportMonth = {
                title: {
                    show: false,
                    text: 'Sales Invoice Report',
                    subtext: '',
                    x: 'right'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                color: ['#f6da22', '#bbe2e8', '#6cacde', '#ff7f50','#6495ed',
                    '#ff69b4', '#ba55d3', '#cd5c5c', '#ffa500', '#40e0d0',
                    '#1e90ff', '#ff6347', '#7b68ee', '#00fa9a', '#ffd700',
                    '#6b8e23', '#ff00ff', '#3cb371', '#b8860b', '#30e0e0' ],
                legend: {
                    show: true,
                    orient: 'horizontal', //'vertical', //
                    x: 'left',
                    y: 28,
                    data: myChartdataPie.month
                },
                toolbox: {
                    show: false,
                    //x: "right",
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: true },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                series: [
                    {
                        name: 'Sales Amount',
                        type: 'pie',
                        radius: '72%',
                        center: ['50%', '58%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true
                                    //,position: 'inner'
                                },
                                labelLine: {
                                    show: true
                                },
                               
                            },
                            emphasis: {
                                label: {
                                    show: false,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        },
                        data: myChartdataPie.valueForPieChart
                    }
                ]

            };

            saleschartBar.on('click', function (params) {
                if (params.value) {
                    $("#mycatbtn").click();
                    initTable(params.name);
                } else {
                    alert("单击了" + params.name + "x轴标签");
                }
            });


            saleschartLine.setOption(optionreportDayofWeekLine);
            saleschartBar.setOption(optionreportDayofWeek);
            saleschartPie.setOption(optionreportMonth);

            window.addEventListener("resize", ()=> {
                saleschartLine.resize();
                saleschartBar.resize();
                saleschartPie.resize();
            });
            //setTimeout(function () {
            //window.onresize = function () {
            //    saleschartLine.resize;
            //    saleschartBar.resize;
            //    saleschartPie.resize;
            //    }
            //}, 200)
        });
}

function initTable(day) {
    var myTableData;
    if (day == 'Monday')
        myTableData = JSON.parse(localStorage.Monday);
    else if (day == 'Tuesday')
        myTableData = JSON.parse(localStorage.Tuesday);
    else if (day == 'Wednesday')
        myTableData = JSON.parse(localStorage.Wednesday);
    else if (day == 'Thursday')
        myTableData = JSON.parse(localStorage.Thursday);
    else if (day == 'Friday')
        myTableData = JSON.parse(localStorage.Friday);
    else if (day == 'Saturday')
        myTableData = JSON.parse(localStorage.Saturday);
    else if (day == 'Sunday')
        myTableData = JSON.parse(localStorage.Sunday);

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
            field: 'cat',
            title: 'Category'
        }, {
            field: 'total',
            title: 'Total Amount'
        }, {
                field: '',
                title: '(%)',
                formatter: function (value, row, index) {
                    return progress(index,day);
                }//格式化进度条
        }],
        data: myTableData
    })
}


function progress(index, day) {
    var myTableData;
    if (day == 'Monday')
        myTableData = JSON.parse(localStorage.Monday);
    else if (day == 'Tuesday')
        myTableData = JSON.parse(localStorage.Tuesday);
    else if (day == 'Wednesday')
        myTableData = JSON.parse(localStorage.Wednesday);
    else if (day == 'Thursday')
        myTableData = JSON.parse(localStorage.Thursday);
    else if (day == 'Friday')
        myTableData = JSON.parse(localStorage.Friday);
    else if (day == 'Saturday')
        myTableData = JSON.parse(localStorage.Saturday);
    else if (day == 'Sunday')
        myTableData = JSON.parse(localStorage.Sunday);

    //myTableData.total = myTableData.total.formatMoney();

    //console.log(JSON.parse(localStorage.Sunday));
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
}

//function radiopick() {
//    $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
//}
