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
    getDate();
    initDateRange();
    getData();
}

function initDateRange() {
    $('#reportTitle').html($('#reportrange span').html());
};

function getDate() {
    $(function () {
        var start = moment().subtract(3, 'month').startOf('month');//moment().subtract(29, 'days');
        var end = moment();

        $('#from').html(start.format('DD-MM-YYYY'));
        $('#to').html(end.format('DD-MM-YYYY'));
console.log($('#from').html());
        console.log($('#to').html());

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

        //console.log($('#from').html());
        //console.log($('#to').html());

        $('#reportTitle').html(picker.startDate.format('MMMM D, YYYY') + ' - ' + picker.endDate.format('MMMM D, YYYY'));

        getData();
    });

    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) { //cancel button onclick event
        $('#reportrange').val('');
    });

}

function getData() {

    var chart1, chart2, chart3;
    var chartdatalist = [];
    var chartdataline, chartdatabar, chartdatapiesales, chartdatapieprofit;
    var branch = [];
    var salestotal = [];
    var profittotal = [];
    var transqty = [];
    var percent = [];
    var salesbycat = [];

    var piedatasale = [];

    var from = $("#from").html();
    var to = $("#to").html();
    var startdate = moment(from, 'DD/MM/YYYY').add(0, 'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    console.log(startdate.format('YYYY-MM-DD').toString());
    console.log(enddate.format('YYYY-MM-DD').toString());

    var uri = "https://localhost:44398/api/branchreport";
    var someJsonString = {
        //"branchId": branchId,
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
            //manage data for bar chart
            for (var i = 0; i < data.length; i++) {
                branch[i] = data[i].BranchName.replace('Auckland','').trim();
                salestotal[i] = (data[i].salesTotal);
                profittotal[i] = data[i].profitTotal;
                transqty[i] = data[i].TransQty;
                percent[i] = data[i].percent;
                salesbycat[i] = JSON.stringify(data[i].salesbycat); //localstorage 只能存字符串， 要先tringify一下 ； 取值的时候要parse一下
                localStorage.setItem(branch[i].toString(), salesbycat[i]);
                //piechart data
                piedatasale[i] = { 'value': salestotal[i], 'name': branch[i], 'percent': percent[i]};
            }
            chartdatabar = {
                branch: branch,
                salesTotal: salestotal,
                profittotal: profittotal
            }
            chartdatapiesales = {
                branch: branch,
                piedatasale:piedatasale
            }
            //manage data for pie chart



            chartdatalist = { chartdatabar,chartdatapiesales }
 //           drawchart(chartdatalist, startdate.format('YYYY-MM-DD'), enddate.format('YYYY-MM-DD'));
            drawchart(chartdatalist);
        },
        error: function (data) {
            //if (data.status == 401)
            //    $("#showloginModal").click();
        }
    });
}

function drawchart(data) {
    var mychartdataBar = data.chartdatabar;
    var mychartdataPieSales = data.chartdatapiesales;
    var mychartdataPieProfit = ''; //data.chartdatapieprofit;
    var saleschartBar, saleschartPieSales, saleschartPieProfit;
    if (saleschartBar != null && saleschartBar != "" && saleschartBar != undefined) {
        saleschartBar.dispose();
    }
    if (saleschartPieSales != null && saleschartPieSales != "" && saleschartPieSales != undefined) {
        saleschartPieSales.dispose();
    }
    if (saleschartPieProfit != null && saleschartPieProfit != "" && saleschartPieProfit != undefined) {
        saleschartPieProfit.dispose();
    }
    require.config({
        paths: {
            echarts: 'js/eChart'
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
            saleschartPieSales = ec.init(document.getElementById('piechartsales'),'macarons');

            var optionBranchreportBar = '';
            optionBranchreportBar = {
                tooltip: {
                    trigger: 'axis',
                    left: '10px',
                    formatter: function (params) {
                        //var res = params.name + '<br/>';
                        var res = '<div><p>Branch： ' + params[0].name + '</p></div>'
                        res += '<p>' + 'Sales' + ': ' + params[0].data.formatMoney() + '</p>'
                        res += '<p>' + 'Profit' + ': ' + params[1].data.formatMoney() + '</p>'
                        //res += '<p>' + '剂量' + ':' + params[2].data + '</p>'
                        //res += '<p>' + '剂量' + ':' + params[3].data + '</p>'
                        return res;
                    }

                },
                legend: {
                    show: false,
                    data: ['Sales,Profit']
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
                        data: mychartdataBar.branch
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        nameTextStyle: {
                            size: '6px'
                        }
                    }
                ],
                series: [
                    {
                        name: 'Sales',
                        type: 'bar',
                        //stack: '总量',
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
                        data: mychartdataBar.salesTotal
                    },
                    {
                        name: 'profit',
                        type: 'bar',
                        //stack: '总量',
                        itemStyle: {
                            normal: {
                                color: 'rgba(5,105,205, 0.8)',
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'insideTop'
                                    }
                                }
                                //areaStyle: { type: 'default' }
                            }
                        },
                        data: mychartdataBar.profittotal
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

            var optionBranchReportPieSales = '';
            optionBranchReportPieSales = {
                //color: ['#ff7f50', '#87cefa', '#da70d6', '#32cd32', '#6495ed', '#ff69b4','#ff87a6'],
                title: {
                    show: false,
                    text: '某站点用户访问来源',
                    subtext: '纯属虚构',
                    x: 'center'
                },
                tooltip: {
                    show: true,
                    trigger: 'item',
                    formatter:
                        function (a) {
                            return ('Branch: ' + a['name']
                                + '</br>'
                                + 'Amount: ' + a['value'].formatMoney()
                                + '(' + a['percent']+'%)'
                                
                                //+ '<br>free_space:' + a['data'].datas[0]
                                //+ '<br>sum_blocks:' + a['data'].datas[1]
                                //+ '<br>sum_space:' + a['data'].datas[2]
                                //+ '<br>used_space:' + a['data'].datas[3]
                            );
                        }

                  //  "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show:false,
                    orient: 'vertical',
                    x: 'left',
                    data: mychartdataPieSales.branch 
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
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
                        name: 'Sales',
                        type: 'pie',
                        radius: '90%',
                        center: ['50%', '50%'],
                        data: mychartdataPieSales.piedatasale
                            //[
                            //{ value: 335, name: '直接访问' },
                            //{ value: 310, name: '邮件营销' },
                            //{ value: 234, name: '联盟广告' },
                            //{ value: 135, name: '视频广告' },
                            //{ value: 1548, name: '搜索引擎' }
                            //]
                        ,
       
                        itemStyle: {
                 
                            normal: {
                                label: {
                                    show: true,
                                    formatter: "{b}({d}%)",
   
                                    position: 'inner', //标签的位置
                                    textStyle: {
                                        fontWeight: 400,
                                        fontSize: 8    //文字的字体大小
                                    }
                 
                                },
                                labelLine: {    //指示线状态
                                    show: false,
                                    smooth: 0.2,
                                    length: 10,
                                    length2: 20
                                }
                            }
                        }
                    }
                ]
            };


            var optionBranchReportPieProfit = ''
            optionBranchReportPieProfit=
                {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    x: 'left',
                    data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '75%',
                                    funnelAlign: 'center',
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
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        itemStyle: {
                            normal: {
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            },
                            emphasis: {
                                label: {
                                    show: true,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: '30',
                                        fontWeight: 'bold'
                                    }
                                }
                            }
                        },
                        data: [
                            { value: 335, name: '直接访问' },
                            { value: 310, name: '邮件营销' },
                            { value: 234, name: '联盟广告' },
                            { value: 135, name: '视频广告' },
                            { value: 1548, name: '搜索引擎' }
                        ]
                    }
                ]
            };


            saleschartBar.setOption(optionBranchreportBar);
            saleschartPieSales.setOption(optionBranchReportPieSales);

            window.addEventListener("resize", () => {
                saleschartBar.resize();
                saleschartPieSales.resize();
            });
        });
}
