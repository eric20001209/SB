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


//jQuery(document).ready(function () {
//    jQuery(window).load(function () {  //load函数
//        jQuery("#loading").hide();
//    });
//});



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
        $('#reportTitle').html(picker.startDate.format('MMMM D, YYYY') + ' - ' + picker.endDate.format('MMMM D, YYYY'));

        getData();
    });

    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) { //cancel button onclick event
        $('#reportrange').val('');
    });

}
function getData() {

    var chartdatalist = [];
    var chartdatabar, chartdatapiesales, chartdatapieprofit;
    var salesdatafortable;
    var profitdatafortable;

    var branch = [];
    var salestotal = [];
    var profittotal = [];
    var transqty = [];
    var percent = [];
    var salesbycat = [];

    var piedatasale = [];
    var piedataprofit = [];

    var localstoragedata = [];

    var from = $("#from").html();
    var to = $("#to").html();
    var startdate = moment(from, 'DD/MM/YYYY').add(0, 'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    var overalltotal = '...';
    var overallprofit= '...';
    var overalltrans='...';
    var overallconsumPerTrans= '...';

    //console.log(startdate.format('YYYY-MM-DD').toString());
    //console.log(enddate.format('YYYY-MM-DD').toString());

    var uri = "https://localhost:44398/api/branchreport" + "?start=" + startdate.format('YYYY-MM-DD') + "&end=" + enddate.format('YYYY-MM-DD');
    var someJsonString = {
        //"branchId": branchId,
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

            //manage data for bar chart
            for (var i = 0; i < data.length; i++) {
                branch[i] = data[i].BranchName.replace('Auckland','').trim();
                salestotal[i] = (data[i].salesTotal);
                profittotal[i] = data[i].profitTotal;
                transqty[i] = data[i].TransQty;
                percent[i] = data[i].percent;
                //alert('3333');
                overalltotal = data[i].overallTotal.formatMoney();
                overallprofit = data[i].overallProfit.formatMoney();
                overalltrans = data[i].overallTrans;
                overallconsumPerTrans = data[i].overallConsumPerTrans.formatMoney();


                localstoragedata[i] = JSON.stringify(data[i]);
                localStorage.setItem(branch[i].toString(), localstoragedata[i]);
                //salesbycat[i] = JSON.stringify(data[i].salesbycat); //localstorage 只能存字符串， 要先tringify一下 ； 取值的时候要parse一下
                //localStorage.setItem(branch[i].toString(), salesbycat[i]);

                //piechart data
                piedatasale[i] = { 'value': salestotal[i], 'name': branch[i], 'percent': percent[i] };
                piedataprofit[i] = { 'value': salestotal[i], 'name': branch[i]};
            }
            //manage data for chart
            chartdatabar = {
                branch: branch,
                salesTotal: salestotal,
                profittotal: profittotal
            }
            chartdatapiesales = {
                branch: branch,
                piedatasale:piedatasale
            }
            chartdatapieprofit = {
                branch: branch,
                piedataprofit: piedataprofit
            }

            salesdatafortable = data;
            for (var q = 0; q < salesdatafortable.length; q++) {
                salesdatafortable[q].BranchName = salesdatafortable[q].BranchName.replace('Auckland', '').trim();
                salesdatafortable[q].salesTotal = salesdatafortable[q].salesTotal.formatMoney();
            }

            profitdatafortable = data;
            for (var q = 0; q < profitdatafortable.length; q++) {
                profitdatafortable[q].BranchName = profitdatafortable[q].BranchName;//.replace('Auckland', '').trim();
                profitdatafortable[q].profitTotal = profitdatafortable[q].profitTotal.formatMoney();
            }

            chartdatalist = { chartdatabar, chartdatapiesales, chartdatapieprofit }
            drawchart(chartdatalist);

            document.getElementById("overalltotal").innerHTML = overalltotal;
            document.getElementById("overallprofit").innerHTML = overallprofit;
            document.getElementById("overallconsumPerTrans").innerHTML= overallconsumPerTrans;
            document.getElementById("overalltrans").innerHTML = overalltrans;

            initTable(salesdatafortable, '#salestabledetail', 'salesTotal', 'percent')
            initTable2(profitdatafortable, '#profittabledetail', 'profitTotal', 'profitpercent');
        },
        error: function (data) {
            if (data.status == 401)
                //alert('Token Expired!! Redirect to login page!');
                setTimeout("window.location.href='login.html'", 3000);
            //    $("#showloginModal").click();

        }
    });
}
function righthandshowdata(branchName) {
    var mybranchDetail;
    if (localStorage.getItem(branchName) != null) {
        //alert('1111111');
        mybranchDetail = JSON.parse(localStorage.getItem(branchName));

        $('#branch').html(branchName);
        document.getElementById("sales").innerHTML = "<h2>"+mybranchDetail.salesTotal.formatMoney()+"</h2>";
        $('#profit').html("<h2>" + mybranchDetail.profitTotal.formatMoney() + "</h2>");
        $('#transactions').html("<h2>" +mybranchDetail.TransQty + "</h2>");
        $('#average').html("<h2>" +mybranchDetail.consumPerTrans.formatMoney() + "</h2>");
        //alert(mybranchDetail);
    }

}

function drawchart(data) {
    //get data for chart
    var mychartdataBar = data.chartdatabar;
    var mychartdataPieSales = data.chartdatapiesales;
    var mychartdataPieProfit = data.chartdatapieprofit;

    //renew container
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

    ////echarts
    //require.config({
    //    paths: {
    //        echarts: 'js/eChart'
    //    }
    //});
    //require(
    //    [
    //        'echarts',
    //        'echarts/chart/line',
    //        'echarts/chart/bar',
    //        'echarts/chart/pie',
    //        'echarts/chart/radar'
    //    ]
    //    ,
        saleschartBar = echarts.init(document.getElementById('myBarChart'));
        saleschartPieSales = echarts.init(document.getElementById('piechartsales'),'macarons');
        saleschartPieProfit = echarts.init(document.getElementById('piechartprofit'), 'macarons');

            var optionBranchreportBar = '';
            optionBranchreportBar =
                //{
                //    color: ['#3398DB'],
                //    tooltip: {
                //        trigger: 'axis',
                //        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                //            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //        }
                //    },
                //    grid: {
                //        left: '3%',
                //        right: '4%',
                //        bottom: '3%',
                //        containLabel: true
                //    },
                //    xAxis: [
                //        {
                //            type: 'category',
                //            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                //            axisTick: {
                //                alignWithLabel: true
                //            }
                //        }
                //    ],
                //    yAxis: [
                //        {
                //            type: 'value'
                //        }
                //    ],
                //    series: [
                //        {
                //            name: '直接访问',
                //            type: 'bar',
                //            barWidth: '60%',
                //            data: [10, 52, 200, 334, 390, 330, 220]
                //        }
                //    ]
                //};
                {
                tooltip: {
                    show: true,
                    trigger: 'axis',
                    left: '10px',
                    formatter: function (params) {
                        var res = '<div><p>Branch： ' + params[0].name + '</p></div>'
                        res += '<p>' + 'Sales' + ': ' + params[0].data.formatMoney() + '</p>'
                        res += '<p>' + 'Profit' + ': ' + params[1].data.formatMoney() + '</p>'
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
                            /********echart click event ends***************************************/
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
                            rotate: 20
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
                                color: 'rgba(5,105,105, 0.8)',
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
                    //$("#mycatbtn").click();
                    //initTable(params.name);
                } else {
                    alert("单击了" + params.name + "x轴标签");
                }
            });
            saleschartBar.on('mouseover', function (params) {
                if (params.name) {

                    righthandshowdata(params.name);
                    //console.log(JSON.stringify(params.name));
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
                    show: false,
                    trigger: 'item',
                    formatter:
                        function (a) {
                            return ('Branch: ' + a['name']
                                + '</br>'
                                + 'Amount: ' + a['value'].formatMoney()
                                + '(' + a['percent']+'%)'
                              
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
                calculable: true,
                series: [
                    {
                        name: 'Sales',
                        type: 'pie',
                        radius: '90%',
                        center: ['50%', '50%'],
                        data: mychartdataPieSales.piedatasale,
                        label: {
                            normal: {

                                    show: true,
                                    formatter: "{b}",
                                    position: 'inner', //标签的位置
                                textStyle: {
                                    fontSize: '15',
                                    fontWeight: 'bold'
                                }
                                
                            },
                        emphasis: {

                            formatter: "{c}({d}%)",
                            show: true,
                            position: 'inner', //标签的位置
                            textStyle: {
                                fontWeight: 400,
                                fontSize: 12   //文字的字体大小
                            }
                        },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                }

                            }
                    }
                ]
            };

            var optionBranchReportPieProfit = '';
            optionBranchReportPieProfit=
                {
                tooltip: {
                    show:false,
                    trigger: 'item',
                        formatter:
                            "{b}: {c} ({d}%)",
                        textStyle: {
                            //fontWeight: 400
                            ////fontSize: 10    //文字的字体大小
                        }
                },
                legend: {
                    show: false,
                    orient: 'vertical',
                    x: 'left',
                    data:
                        mychartdataPieProfit.branch
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
                //calculable: true,
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: ['50%', '90%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}",
                                position: 'inner',
                                textStyle: {
                                    fontSize: '15',
                                    fontWeight: 'bold'
                                }
              
                            },
                            emphasis: {

                                formatter: "{c}({d}%)",
                                show: true,
                                position: 'center', //标签的位置
                                textStyle: {
                                    fontWeight: 400,
                                    fontSize: 12   //文字的字体大小
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:
                            mychartdataPieProfit.piedataprofit
                    }
                ]
            };

            saleschartBar.setOption(optionBranchreportBar);
            saleschartPieSales.setOption(optionBranchReportPieSales);
            saleschartPieProfit.setOption(optionBranchReportPieProfit);

            window.addEventListener("resize", () => {
                saleschartBar.resize();
                saleschartPieSales.resize();
                saleschartPieProfit.resize();
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
            field: datafield, //'salesTotal',
            title: 'Total Amount'

        }, {
            field: '',
                title: 'Percent(%)'
                ,
            formatter: function (value, row, index) {
                return progress(index);
            }//格式化进度条
        }],
        data: myTableData
    });

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
        $('#salestabledetail').bootstrapTable('resetView');
        //$('#profittabledetail').bootstrapTable('resetView');
    });
}
function initTable2(data, id, datafield) {
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
                field: datafield, //'salesTotal',
                title: 'Total Amount'

            }, {
                field: '',
                title: 'Percent(%)'
                ,
                formatter: function (value, row, index) {
                    return progress(index);
                }//格式化进度条
            }],
        data: myTableData
    });

    function progress(index) {//add progress bar
        var percentage = myTableData[index].profitpercent;//percent;
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
        //$('#salestabledetail').bootstrapTable('resetView');
        $('#profittabledetail').bootstrapTable('resetView');
    });
}
