
function loaddata() {
    getCategoryList();
    //getDate();
    //getData();
}

function getCategoryList1() {
    var uri = "https://localhost:44398/api/category/list";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        var id = '';
        var parent_id = '';
        var description = '';
        var active = '';
        var content = '';
        for (var i = 0; i < resp.length; i++) {
            id = resp[i].id;
            parent_id = resp[i].parent_id;
            description = resp[i].description;
            active = resp[i].active;
            content = content + "<option value='" + description + "'  categoryid='" + id + "'>" + description + "</option>";
        }
        var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'>";
        prefix += "<option value = '' selected = 'selected' categoryid='' >None Selected</option> ";
        content = prefix + content + "</select>";
        $('#categorylist').html(content);
    }
    xhr.send(null);
}

function getCategoryList() {
    var uri = "https://localhost:44398/api/category/list";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        console.log(resp);

        var id = '';
        var parent_id = '';
        var description = '';
        var active = '';
        var content = '';
        for (var i = 0; i < resp.length; i++) {
            id = resp[i].Id;
            parent_id = resp[i].Parent_Id;
            description = resp[i].Description;
            active = resp[i].Active;
            content = content + "<option value='" + description + "'  categoryid='" + id + "'>" + description + "</option>";
        }
        var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'>";
        prefix += "<option value = '' selected = 'selected' categoryid='' >None Selected</option> "; 
        content = prefix + content + "</select>";
        $('#categorylist').html(content);

        //resp = {
        //    1: {
        //        name: '蔬菜',
        //        cell: {
        //            10: { name: '菠菜', price: 4 },
        //            11: { name: '茄子', price: 5 }
        //        }
        //    },
        //    3: {
        //        name: '水果',
        //        cell: {
        //            20: {
        //                name: '苹果',
        //                cell: { 201: { name: '红富士', price: 20 } }
        //            },
        //            21: {
        //                name: '桃',
        //                cell: {
        //                    210: { name: '猕猴桃', price: 30 },
        //                    211: { name: '油桃', price: 31 },
        //                    212: { name: '蟠桃', priece: 32 }
        //                }
        //            }
        //        }
        //    },
        //    9: {
        //        name: '粮食',
        //        cell: {
        //            30: {
        //                name: '水稻',
        //                cell: {
        //                    301: {
        //                        name: '大米',
        //                        cell: { 3001: { name: '五常香米', price: 50 } }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //};
        //var opts = {
        //    data: resp,
        //    select: '#categorylist'
        //};
        //var linkageSel = new LinkageSel(opts);
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

        //console.log($('#from').html());
        //console.log($('#to').html());

        //$('#reportTitle').html(picker.startDate.format('MMMM D, YYYY') + ' - ' + picker.endDate.format('MMMM D, YYYY'));

        getData();
    });

    $('#reportrange').on('cancel.daterangepicker', function (ev, picker) { //cancel button onclick event
        $('#reportrange').val('');
    });

}
function getData() {
    var chartdatalist = [];
    var chartdataline, chartdatabar, chartdatapiesales, chartdatapieprofit;
    var salesdatafortable;
    var profitdatafortable;

    var hour = [];
    var amount = [];
    var transaction = [];
    var total_amount = [];
    var total_transaction = [];


    var branch = [];
    var salestotal = [];
    var profittotal = [];
    var transqty = [];
    var percent = [];

    var piedatasale = [];
    var piedataprofit = [];

    var localstoragedata = [];

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

    var uri = prefix + "/hourly/daterange" + "?start=" + startdate.format('YYYY-MM-DD') + "&end=" + enddate.format('YYYY-MM-DD') + "&branch=" + branchId;
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

            //alert(JSON.stringify(data));

            var returnList = data[0];
            //manage data for line chart
            for (var i = 0; i < returnList.length; i++) {
                hour[i] = returnList[i].hour;
                amount[i] = returnList[i].amount;
                transaction[i] = returnList[i].transaction;
                total_amount[i] = returnList[i].total_amount;
                total_transaction[i] = returnList[i].total_transaction;

                //piechart data
                piedatasale[i] = { 'value': salestotal[i], 'name': branch[i], 'percent': percent[i] };
                piedataprofit[i] = { 'value': salestotal[i], 'name': branch[i] };
            }
            //manage data for chart
            chartdataline = {
                hour: hour,
                amount: amount,
                transaction: transaction,
                total_amount: total_amount,
                total_transaction: total_transaction
            }

            chartdatalist = { chartdataline, chartdatabar, chartdatapiesales, chartdatapieprofit }
            drawchart(chartdatalist, daterange, branchName);
            $('#overalltransperday').html(total_transaction[0]);
            $('#overalltotalperday').html(total_amount[0].formatMoney());

            //initTable(salesdatafortable, '#salestabledetail', 'salesTotal', 'percent')
            //initTable2(profitdatafortable, '#profittabledetail', 'profitTotal', 'profitpercent');
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
            setTimeout("window.location.href='login.html'", 1000);
            //    $("#showloginModal").click();

        }
    });
}

function righthandshowdata(time) {
    var mybranchDetail;
    if (localStorage.getItem(branchName) != null) {
        mybranchDetail = JSON.parse(localStorage.getItem(branchName));
        $('#branch').html(branchName);
        document.getElementById("sales").innerHTML = "<h2>" + mybranchDetail.salesTotal.formatMoney() + "</h2>";
        $('#profit').html("<h2>" + mybranchDetail.profitTotal.formatMoney() + "</h2>");
        $('#transactions').html("<h2>" + mybranchDetail.TransQty + "</h2>");
        $('#average').html("<h2>" + mybranchDetail.consumPerTrans.formatMoney() + "</h2>");
        //alert(mybranchDetail);
    }

}

function drawchart(data, daterange, branch) {

    //get data for chart
    var mychartdataLine = data.chartdataline;
    //renew container
    var chartLine;
    if (chartLine != null && chartLine != "" && chartLine != undefined) {
        chartLine.dispose();
    }
    chartLine = echarts.init(document.getElementById('myLineChart'));

    chartLine.on('mouseover', function (params) {
        //if (params.name) {
        if (params.name) {

            //righthandshowdata(params.name);
            console.log(JSON.stringify(params.name));
        }
    });

    var optionHoulyLine = '';
    optionHoulyLine = {

        title: {
            show: true,
            text: branch,
            subtext: daterange
        },
        legend: {
            show: true,
            data: ['amount', 'transaction'],
            right: 50
        },
        tooltip: {
            trigger: 'axis',
            formatter:
                function (params) {
                    var res = ''
                    res += '<p>' + 'Avg amount per trans' + ': ' + params[0].data.formatMoney() + '</p>'
                    res += '<p>' + 'Avg trans' + ': ' + params[1].data + '</p>'
                    //console.log(params[0].name)
                    return res;
                },
        }
        ,
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: mychartdataLine.hour// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: [{
            type: 'value'
        },
        {
            type: 'value',
            nameLocation: 'start'
        }],
        series: [{
            name: 'amount',
            data: mychartdataLine.amount, //[820, 932, 901, 934, 1290, 1330, 1320],
            //color: 'rgba(5,125,255, 0.8)',
            //areaStyle: { normal: {}},
            type: 'line'
        }
            ,
        {
            name: 'transaction',
            data: mychartdataLine.transaction, //[125, 96, 556, 9, 415, 987, 654],
            //color: 'rgba(245,125,152, 0.8)',
            yAxisIndex: 1,
            //areaStyle: { normal: {} },
            animation: true,
            type: 'line',
            smooth: false
        }
            //,
            //{
            //    symbolSize: 0, // symbol的大小设置为0
            //    showSymbol: false, // 不显示symbol
            //    lineStyle: {
            //        width: 0, // 线宽是0
            //        color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            //    },

            //    name: 'total_amount',
            //    data: mychartdataLine.total_amount, 
            //    type: 'line'
            //},
            //{
            //    symbolSize: 0, // symbol的大小设置为0
            //    showSymbol: false, // 不显示symbol
            //    lineStyle: {
            //        width: 0, // 线宽是0
            //        color: 'rgba(0, 0, 0, 0)' // 线的颜色是透明的
            //    },

            //    name: 'total_transaction',
            //    data: mychartdataLine.total_transaction,
            //    type: 'line'
            //}
        ]
    };
    chartLine.setOption(optionHoulyLine);
    window.addEventListener("resize", () => {
        chartLine.resize();
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
