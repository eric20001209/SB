var saleschartLine, saleschartPie, saleschartBar, saleschart1, saleschart2;
$(function () {
    $(document).ajaxStart(function () {
        $("body").addClass("loading");
    })
        .ajaxStop(function () {
            $("body").removeClass("loading");
        });
});

var loadingTicket;
var effectIndex = -1;
//var effect = ['spin', 'bar', 'ring', 'whirling', 'dynamicLine', 'bubble'];
var effect = ['spin'];
function refresh(isBtnRefresh) {
    if (myChart && myChart.dispose) {
        myChart.dispose();
    }
    myChart = echarts.init(domMain, curTheme);
    (new Function(editor.doc.getValue()))();
    domMessage.innerHTML = '';
}

function loaddata() {
    $("#navbarbar").load("sidebar.html");
    getBranchList1();
    getDate();  
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
    $('#datefrom').datepicker('setDate', sDate(-365));
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

function getBranchList1() {
    var uri = "https://localhost:44367/api/SalesInvoice/Branches";
    //var resp = JSON.parse(xhr.responseText);
    var branch = '';
    var id = '';
    var content = "";
        $(document).ajaxStart(function () {
        $("body").addClass("loading");
    })
        .ajaxStop(function () {
            $("body").removeClass("loading");
        });
    $.ajax({
        url: uri,
        type: "get",
        dataType: "json",
        success: function (resp) {
            //console.log("success");
            for (var i = 0; i < resp.length; i++) {
                branch = resp[i].Name;
                id = resp[i].Id;
                content = content + "<option value='" + branch + "'  branid='" + id + "'>" + branch + "</option>";
            }
            var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'>";
            prefix += "<option value = 'Total' selected = 'selected' branid='-1' >Total</option> ";
            content = prefix + content + "</select>";
            $('#branchlist').html(content);
        },
        error: function (e) {
            console.log("error")
        },
    });
}


function getdata()
{
    var from = $("#datefrom").val();
    var to = $("#dateto").val();
    var startdate = moment(from, 'DD/MM/YYYY').add(0,'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');
    var branchId = $("#bran").find("option:selected").attr("branid");
    //alert(branchId);
    var chartdataDayofWeek;
    var chartdataMonth;
    var chartdatalist = [];
  //  var uri = "https://localhost:44367/api/itemreport10/byDay/" + branchId + "/" + startdate.format('YYYY-MM-DD') + "/" + enddate.format('YYYY-MM-DD');
    var uri = "https://localhost:44367/api/itemreport10/byDay";
    console.log(uri);
    var finalList;
    var reportDayofWeek;
    var newReportMonth

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
            //beforeSend: function () {        },
            //      complete: function (data) {
            success: function (data) {
                finalList = data["myFinalList"];
                reportDayofWeek = data.reportDayofWeek;
                newReportMonth = data.newReportMonth;

                for (var q = 0; q < reportDayofWeek.length; q++) {
                    day[q] = reportDayofWeek[q].day;
                    month[q] = reportDayofWeek[q].month;
                    salesTotal[q] = reportDayofWeek[q].salesTotal;
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


    chartdatalist = { chartdataDayofWeek, chartdataMonth }
    //drawchart(chartdatalist);
    return chartdatalist 
}

function drawchart(data)
{
    var branch = $("#bran").find("option:selected").val();
    if (branch == undefined) {
        branch = "Total";
    }

    var mychartdata = data.chartdataDayofWeek; //getdata(branch, 'bar').chartdataDayofWeek;
    var mychartdataLine = data.chartdataDayofWeek;// getdata(branch, 'bar').chartdataDayofWeek;
    var myChartdataPie = data.chartdataMonth; // getdata(branch, 'bar').chartdataMonth;
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
        function drawchart(ec) {
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
                            rotate: 0
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
                color: ['#87cefa', '#da70d6', '#32cd32', '#ff7f50','#6495ed',
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

            saleschartBar.setOption(optionreportDayofWeek);
            window.onresize = saleschartBar.resize;
            saleschartBar.on('click', function (params) {
                if (params.value) {
                    $("#mycatbtn").click();
                    initTable(params.name);
                } else {
                    alert("单击了" + params.name + "x轴标签");
                }
            });
            saleschartLine.setOption(optionreportDayofWeekLine);
            //window.onresize = saleschartLine.resize;
            saleschartPie.setOption(optionreportMonth);
          //window.onresize = saleschartPie.resize;
        }
    );
}

function initTable(day) {
    var myTableData;
    if(day=='Monday')
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
            field: 'cat',
            title: 'Category'
        }, {
            field: 'total',
            title: 'Total Amount'
        }, {
                field: 'percent',
                title: '(%)'
        }],
        data: myTableData
    })
}


function radiopick() {
    $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
}
