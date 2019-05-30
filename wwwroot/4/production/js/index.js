function loaddata() {
    getDate();
    initDateRange();
    //getData();
}

function initDateRange() {
    $('#reportTitle').html($('#reportrange span').html());
};

function getDate() {
    $(function () {
        var start = moment().subtract(29, 'days');
        var end = moment();

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

        console.log($('#from').html());
        console.log($('#to').html());

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
    var chartdataline, chartdatabar, chartdatapie;
    var branch = [];
    var salestotal = [];
    var profittotal = [];
    var transqty = [];
    var salesbycat = [];

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

            for (var i = 0; i < data.length; i++) {
                branch[i] = data[i].BranchName.replace('Auckland','').trim();
                salestotal[i] = data[i].salesTotal;
                profittotal[i] = data[i].profitTotal;
                transqty[i] = data[i].TransQty;

                salesbycat[i] = JSON.stringify(data[i].salesbycat); //localstorage 只能存字符串， 要先tringify一下 ； 取值的时候要parse一下

                localStorage.setItem(branch[i].toString(), salesbycat[i]);
            }
            chartdataline = {
                branch: branch,
                salesTotal: salestotal,
                profittotal: profittotal
            }

            chartdatalist = { chartdataline }
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
    var mychartdataLine = data.chartdataline;

    var saleschartBar;
    if (saleschartBar != null && saleschartBar != "" && saleschartBar != undefined) {
        saleschartBar.dispose();
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
            saleschartBar = ec.init(document.getElementById('myLineChart'));

            var optionBranchreportBar = '';
            optionBranchreportBar = {
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
                        data: mychartdataLine.branch
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
                        data: mychartdataLine.salesTotal
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

            saleschartBar.setOption(optionBranchreportBar);

            window.addEventListener("resize", () => {
                saleschartBar.resize();
            });
        });
}

