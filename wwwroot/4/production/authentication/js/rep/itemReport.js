var saleschart, profitchart, transchart, saleschart1, saleschart2;

var loadingTicket;
var effectIndex = -1;
//var effect = ['spin', 'bar', 'ring', 'whirling', 'dynamicLine', 'bubble'];
var effect = ['spin'];
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
$('#startdate').datepicker({
    autoclose: true,
    format: 'dd/mm/yyyy'
});
$('#enddate').datepicker({
    autoclose: true,
    format: 'dd/mm/yyyy'
});

function loaddata() {
 // checklogin();
    //getDate2();
    getBranchList();
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
    $("#datefrom").val(moment().format('DD/MM/YYYY'));
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
function getdata(branch,count)
{
    var from = $("#startdate").val();
    var to = $("#enddate").val();
    var startdate = moment(from, 'DD/MM/YYYY').add(0,'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');
    //console.log(startdate.toString());
    //console.log(enddate.toString());
    var mytop = 10;
    var top10 = document.getElementById("Radios10");
    //var top20 = document.getElementById("Radios20");
    var top5 = document.getElementById("Radios5");
    if(top10.checked)
        mytop = top10.value;
    //else if (top20.checked)
    //    mytop = top20.value;
    else if (top5.checked)
        mytop = top5.value;

    var branchId = $("#bran").find("option:selected").attr("branid");
    var chartdata;
    var chartdata1;
    var chartdata2;
    var chartdatalist = [];
    var uri = "https://localhost:44367/api/itemreport/top?count=" + mytop;
    //console.log(uri.toString());
    var codeData = [];
    var desData = [];
    var qtyData = [];
    var profitData = [];
    var sales_amountData = [];

    var codeData1 = [];
    var desData1 = [];
    var qtyData1 = [];
    var profitData1 = [];
    var sales_amountData1 = [];

    var codeData2 = [];
    var desData2 = [];
    var qtyData2 = [];
    var profitData2 = [];
    var sales_amountData2 = [];

    var byqty=[];
    var byprifit ;
    var bysales ;
    //console.log(startdate.toString());
    //console.log(enddate.toString());
    var someJsonString = {
        "branchId": branchId,
        "start": startdate.format('YYYY-MM-DD'),
        "end": enddate.format('YYYY-MM-DD')
    };
    $.ajax({
        type: "post",
        url: uri,
        async: false,
        data: JSON.stringify(someJsonString),
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
                byqty = data["itemTopQtyReport"];
                byprifit = data.itemTopProfitReport;
                bysales = data.itemTopSalesReport;

            for (var q = 0; q < byqty.length; q++) {
                codeData[q] = byqty[q].code;
                desData[q] = byqty[q].des;
                qtyData[q] = byqty[q].qty;
                profitData[q] = byqty[q].profit;
                sales_amountData[q] = byqty[q].sales_amount;
            }
            chartdata = {
                code: codeData,
                des: desData,
                qty: qtyData,
                profit: profitData,
                sales_amount: sales_amountData
            }
            for (var q = 0; q < byprifit.length; q++) {
                codeData1[q] = byprifit[q].code;
                desData1[q] = byprifit[q].des;
                qtyData1[q] = byprifit[q].qty;
                profitData1[q] = byprifit[q].profit;
                sales_amountData1[q] = byprifit[q].sales_amount;
            }
            chartdata1 = {
                code: codeData1,
                des: desData1,
                qty: qtyData1,
                profit: profitData1,
                sales_amount: sales_amountData1
            }
            for (var q = 0; q < bysales.length; q++) {
                codeData2[q] = bysales[q].code;
                desData2[q] = bysales[q].des;
                qtyData2[q] = bysales[q].qty;
                profitData2[q] = bysales[q].profit;
                sales_amountData2[q] = bysales[q].sales_amount;
            }
            chartdata2 = {
                code: codeData2,
                des: desData2,
                qty: qtyData2,
                profit: profitData2,
                sales_amount: sales_amountData2
            }
        },
        error: function () {
            console.log('error');
        }
    });

    chartdatalist = { chartdata, chartdata1, chartdata2 }
    return chartdatalist //chartdata
}
function drawchart()
{
    var branch = $("#bran").find("option:selected").val();
    if (branch == undefined) {
        branch = "Total";
    }
    var mychartdata = getdata(branch, 'bar').chartdata;
    var mychartdata1 = getdata(branch, 'bar').chartdata1;
    var mychartdata2 = getdata(branch, 'bar').chartdata2;
    if (saleschart != null && saleschart != "" && saleschart != undefined) {
        saleschart.dispose();
    }
    if (saleschart1 != null && saleschart1 != "" && saleschart1 != undefined) {
        saleschart1.dispose();
    }
    if (saleschart2 != null && saleschart2 != "" && saleschart2 != undefined) {
        saleschart2.dispose();
    }
    require.config({
        paths: {
            echarts: '/eChart'
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
            saleschart = ec.init(document.getElementById('barchart1'));
            saleschart1 = ec.init(document.getElementById('barchart2'));
            saleschart2 = ec.init(document.getElementById('barchart3'));

            effectIndex = ++effectIndex % effect.length;
            saleschart.showLoading({
                text: effect[effectIndex],
                effect: effect[effectIndex],
                textStyle: {
                    fontSize: 20
                }
            });
            //var mychartdata = getdata(branch, 'bar').chartdata;
            var optionbarqty = '';
                optionbarqty = {
                    title: {
                    x: 'right',
                    text: 'Most Sales by Qty',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                    },
                grid: {
                        x: 120
                    },
                legend: {
                    data: [ '']
                },
                toolbox: {
                    mask: { show: true},
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: [ 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: mychartdata.des
                    }
                ],
                series: [
                    {
                        left: 100,
                        name: 'sales qty',
                        //type: 'bar',
                        type: 'bar',
                        data: mychartdata.qty
                    }
                ]
            };
            clearTimeout(loadingTicket);
            loadingTicket = setTimeout(function () {
                saleschart.hideLoading();
                saleschart.setOption(optionbarqty);
            }, 2200);

            //var mychartdata1 = getdata(branch, 'bar').chartdata1;
            var optionbarprofit = '';
                optionbarprofit = {
                title: {
                    x: 'right',
                    text: 'Most Sales by Profit',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    x: 120
                },
                legend: {
                    data: ['']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: mychartdata1.des
                    }
                ],
                series: [
                    {
                        left: 100,
                        name: 'profit',
                        type: 'bar',
                        data: mychartdata1.profit,
                        itemStyle: {
                            normal: {
                                color: 'rgba(237,125,49, 0.8)'
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideTop'
                                }
                            }

                        }
                    }
                ]
            };
            //var mychartdata2 = getdata(branch, 'bar').chartdata2;
            var optionbarsalesamount = '';
                optionbarsalesamount = {
                title: {
                    x: 'right',
                    text: 'Most Sales by Sales Amount',
                    subtext: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    x: 120
                },
                legend: {
                    data: ['']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: 'value',
                        boundaryGap: [0, 0.01]
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        data: mychartdata2.des
                    }
                ],
                series: [
                    {
                        left: 100,
                        name: 'sales amount',
                        type: 'bar',
                        data: mychartdata2.sales_amount,

                        itemStyle: {
                            normal: {
                                color: '#87cefa'
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideTop'
                                }
                            }

                        }
                    }
                ]
            };
            saleschart.setOption(optionbarqty);
            saleschart1.setOption(optionbarprofit);
            saleschart2.setOption(optionbarsalesamount);
        }
    );
}

function radiopick() {
    $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
}
