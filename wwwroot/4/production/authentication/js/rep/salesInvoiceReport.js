var saleschart, profitchart, transchart, salespie, salesradar;

function loaddata() {
    getDate();
    getBranchList();
    //drawBar();
    //$("#bartitle").html("Total");
    //$("#chart").click(getdata());
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

function getDate2() {

    $('#datefrom').datetimepicker();
    $('#dateto').datetimepicker({
        useCurrent: false //Important! See issue #1075
    });
    $("#datefrom").on("dp.change", function (e) {
        $('#dateto').data("DateTimePicker").minDate(e.date);
    });
    $("#dateto").on("dp.change", function (e) {
        $('#datefrom').data("DateTimePicker").maxDate(e.date);
    });
}

//$('#startdate').datepicker({
//    autoclose: true,
//    format: 'dd/mm/yyyy'
//});
//$('#enddate').datepicker({
//    autoclose: true,
//    format: 'dd/mm/yyyy'
//});
//$('#startdate').datepicker('setDate', moment().format('DD/MM/YYYY'));
//$('#enddate').datepicker('setDate', moment().format('DD/MM/YYYY'));

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
function getdata(branch, type)
{
    $('#mydata1').empty();

    var from = $("#datefrom").val();
    var to = $("#dateto").val();
    //var from = $("#startdate").val();
    //var to = $("#enddate").val();

    var startdate = moment(from, 'DD/MM/YYYY').add(0,'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    //var showdate = "";
    //var sdate = $("#datefrom").val();
    //var edate = $("#dateto").val();
    //if (sdate == edate) {
    //    var startdate = moment(sdate, "DD/MM/YYYY");
    //    var enddate = moment(sdate, "DD/MM/YYYY").add(1, 'days');
    //    showdate = moment(sdate, "DD/MM/YYYY").format("Do MMM YYYY");
    //} else {
    //    var startdate = moment(sdate, "DD/MM/YYYY");
    //    var enddate = moment(edate, "DD/MM/YYYY").add(1, 'days');
    //    var aa = moment(sdate, "DD/MM/YYYY").format("Do MMM");
    //    var bb = moment(edate, "DD/MM/YYYY").format("Do MMM YYYY");
    //    showdate = aa + "-" + bb;
    //}

    var branchId = $("#bran").find("option:selected").attr("branid");
    var chartdata;
    var uri = "https://localhost:44367/api/SalesInvoice/SalesInvoiceReport";
    var branch = [];
    var salesData = [];
    var profitData = [];
    var transQty = [];

    var maxqty = [];
    var maxprofit = [];
    var maxsales = [];

    branchPie = [];
    salesDataPie = [];
    profitDataPie = [];
    transQtyPie = [];

    branchRadar = [];
    salesDataRadar = [];
    profitDataRadar = [];
    transQtyRadar = [];
    var polarRadar = [];

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
            var htm = '<table>';
            for (var j = 0; j < data.length; j++) {
                //barLabel[j] = moment(data[j].startDateTime).format("DD MMM YYYY");
                maxqty[j] = data[j].MaxTransQty;
                maxprofit[j] = data[j].MaxProfit;
                maxsales[j] = data[j].MaxInvoiceTotal;

                branch[j] = data[j].BranchName;
                branchPie[j] = (data[j].BranchName).replace('Auckland', '');
                branchRadar[j] = (data[j].BranchName);

                polarRadar = [
                    {
                        text: 'Profit',
                        max: data[0].MaxProfit * 1.1
                    },
                    {
                        text: 'Sales Amount',
                        max: data[0].MaxInvoiceTotal * 1.1
                    },
                    {
                        text: 'Trans Quantity',
                        max: data[0].MaxTransQty * 1.1
                    },
                ];

                salesData[j] = (data[j].InvoiceTotal);
                salesDataPie[j] = {
                    name: (data[j].BranchName).replace('Auckland',''),
                    value: data[j].InvoiceTotal
                };

                salesDataRadar[j] = {
                    name: data[j].BranchName,
                    value: [data[j].Profit, data[j].InvoiceTotal, data[j].TransQty]
                };

                profitData[j] = (data[j].Profit);
                profitDataPie[j] = {
                    name: (data[j].BranchName).replace('Auckland', ''),
                    value: (data[j].Profit)
                };
                transQty[j] = data[j].TransQty;
                htm += '<tr><td>' + branch[j] + '&nbsp;&nbsp;</td><td>' + salesData[j] + '&nbsp;&nbsp;</td><td>' + profitData[j] + '&nbsp;&nbsp;</td><td>' + transQty[j] + '&nbsp;&nbsp;</td>';
                htm += '<td>' + maxqty[j] + '&nbsp;&nbsp;</td><td>' + maxprofit[j] + '&nbsp;&nbsp;</td><td>' + maxsales[j] +'&nbsp;&nbsp;</td></tr > ';
            }
            htm += "</table>";
            //$('#mydata1').append(htm);

            if (type == 'bar') {
                chartdata = {
                    branch: branch,
                    Sales: salesData,
                    Profit: profitData,
                    Trans: transQty
                }
            }
            else if (type == 'pie'){
                chartdata = {
                    name: branchPie,
                    value: salesDataPie
                }
            }
            else if (type == 'radar') {
                chartdata = {
                    name: branchRadar,
                    polar: polarRadar,
                    value: salesDataRadar
                }
            }
        },
        error: function () {
            console.log('error');
        }
    });
    return chartdata
}
function drawchart()
{
    var branch = $("#bran").find("option:selected").val();
    if (branch == undefined) {
        branch = "Total";
    }
    var mychartdata = getdata(branch, 'bar');
    var myPiedata = getdata(branch, 'pie');
    var myRadardata = getdata(branch, 'radar');

    if (saleschart != null && saleschart != "" && saleschart != undefined) {
        saleschart.dispose();
    }
    if (salespie != null && salespie != "" && salespie != undefined) {
        salespie.dispose();
    }
    if (salesradar != null && salesradar != "" && salesradar != undefined) {
        salesradar.dispose();
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
            saleschart = ec.init(document.getElementById('barchart'));
            salespie = ec.init(document.getElementById('piechart'));
            salesradar = ec.init(document.getElementById('radarchart'));

            var optionbar = '';
            var optionpie = '';
            var optionradar = '';

                optionbar = {
                title: {
                    text: 'Sales Invoice Report',
                    x: 'right',
                    subtext: '',
                    textStyle: {
                        fontSize: 18,
                        fontWeight: 'bolder',
                        color: '#000'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    show: 'false'
                },
                grid: {
                    x: 80,
                    y: 80,

                },
                legend: {
                    data: ['Sales Amount', 'Profit', 'Trans'],
                    x: 'left',
                    y: 10
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
                        type: 'category',
                        data: mychartdata.branch,
                        axisLabel: {
                            interval: 0,
                            rotate: 20
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
                        name: 'Sales Amount',
                        type: 'bar',
                        data: mychartdata.Sales,
                        markPoint: {
                            data: [
                                { type: 'max', name: 'Max' },
                                { type: 'min', name: 'Min' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: 'Average' }
                            ]
                        }
                    },
                    {
                        name: 'Profit',
                        type: 'bar',
                        data: mychartdata.Profit,
                        markPoint: {
                            data: [
                                //{ name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
                                //{ name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                            ]
                        },
                        //markLine: {
                        //    data: [
                        //        { type: 'average', name: 'Average' }
                        //    ]
                        //}
                    },
                    {
                        name: 'Trans',
                        type: 'bar',
                        data: mychartdata.Trans,
                        markPoint: {
                            data: [
                                //{ name: '年最高', value: 182.2, xAxis: 7, yAxis: 183, symbolSize: 18 },
                                //{ name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
                            ]
                        },

                    }
                ]
            },
                optionpie = {
                    title: {
                        text: 'Sales Invoice Report',
                        subtext: '',
                        x: 'right'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        show: true,
                        orient: 'horizontal', //'vertical', //
                        x: 'left',
                        y: 28,
                        //data: ['WuCha Warehouse', 'Auckland CBD', 'Auckland Newmarket', 'Auckland Albany', 'Auckland Dominion Rd', 'Auckland Botany', 'Auckland Howick']
                        data: myPiedata.name
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
                                        show: true,
                                        position: 'inner'
                                    },
                                    labelLine: {
                                        show: false
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

                            data: myPiedata.value
                        }
                    ]

                },
                optionradar = {
                    title: {
                        text: 'Sales Invoice Report',
                        x:'right',
                        subtext: ''
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'vertical', //'horizontal',//
                        x: 'left',
                        y: 28,
                        data: myRadardata.name
                        //data: ['CBD', 'Newmarket','Howick','Albany','Botany','WuCha Warehouse', 'Dominion Rd']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            restore: { show: true },
                            saveAsImage: { show: true }
                        }
                    },
                    polar:
                        [
                        {
                                indicator:
                         //       [
                                myRadardata.polar
                                //{ text: 'Sales Amount', max: 6000 },
                                //{ text: 'Profit', max: 16000 },
                                //{ text: 'Trans Qty', max: 30000 },
                                //{ text: 'Dominion Rd', max: 38000 },
                                //{ text: 'Newmarket', max: 52000 },
                                //{ text: 'CBD', max: 25000 }
                         //   ]
                        }
                    ],
                    calculable: true,
                    series: [
                        {
                            name: 'Sales vs Profit vs Trans Qty',
                            type: 'radar',
                            radius: '100%',
                            center: ['50%', '80%'],
                            data:
                            //    [
                                salesDataRadar
                            //    {
                            //        value: [4300, 10000, 28000],
                            //        name: 'Auckland Howick'
                            //    },
                            //    {
                            //        value: [5000, 14000, 28000],
                            //        name: 'Auckland Albany'
                            //    },
                            //    {
                            //        value: [3500, 12000, 25000],
                            //        name: 'Auckland Newmarket'
                            //    },
                            //    {
                            //        value: [4200, 12090, 22000],
                            //        name: 'Auckland CBD'
                            //    },
                            //    {
                            //        value: [3300, 12090, 22000],
                            //        name: 'WuCha Warehouse'
                            //    },
                            //    {
                            //        value: [4000, 12090, 22000],
                            //        name: 'Auckland Dominion Rd'
                            //    },
                            //    {
                            //        value: [4200, 10000, 15000],
                            //        name: 'Auckland Botany'
                            //    }
                            //]
                        }
                    ]
                }
            saleschart.setOption(optionbar);
            salespie.setOption(optionpie);
            salesradar.setOption(optionradar);
        }
    );
}

function radiopick() {
    $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
}
