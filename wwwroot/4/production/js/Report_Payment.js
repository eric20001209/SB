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
    getBranchList();
    getDate();
    getData();
}
function getBranchList() {
    var uri = "https://localhost:44398/api/payment/Branches";
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
    var chartdataline, chartdatabar, chartdatapie, chartdatapieprofit;

    var payment_method = [];
    var payment_class = [];
    var paymentbymethod_amount = [];
    var paymentbyclass_amount = [];

    var payment = [];
    var salesamount = [];
    var percent = [];

    var piedataouter = [];
    var piedatainner = [];

    var from = $("#from").html();
    var to = $("#to").html();
    var startdate = moment(from, 'DD/MM/YYYY').add(0, 'days');
    var enddate = moment(to, 'DD/MM/YYYY').add(1, 'days');

    var branchId = $("#bran").find("option:selected").attr("branid");
    var branchName = $("#bran").find("option:selected").attr("value");

    var total = 0;

    if (branchId == undefined)
        branchId = '';
    if (branchName == undefined)
        branchName = 'All Branches';

    var daterange = '';
    if (from == to)
        daterange = startdate.format('DD/MM/YYYY').toString();
    else
        daterange = startdate.format('DD/MM/YYYY').toString() + " - " + moment(to, 'DD/MM/YYYY').add(0, 'days').format('DD/MM/YYYY').toString();

    var uri = prefix + "/payment" + "?start=" + startdate.format('YYYY-MM-DD') + "&end=" + enddate.format('YYYY-MM-DD') + "&branch=" + branchId;
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

            var bypayment = data[0];
            var byclass = data[1];

            //manage data for pie chart

            for (var i = 0; i < byclass.length; i++) {

                payment_class[i] = byclass[i].payment_method;
                paymentbyclass_amount[i] = byclass[i].amount;
                total += byclass[i].amount;
                //inner piechart data - payment_class
                if (i == 0)
                    piedatainner[i] = { 'value': paymentbyclass_amount[i], 'name': payment_class[i], selected:true };
                else
                    piedatainner[i] = { 'value': paymentbyclass_amount[i], 'name': payment_class[i] };
            }

            console.log(total.toString());
            for (var i = 0; i < bypayment.length; i++) {

                payment_method[i] = bypayment[i].payment_method;
                paymentbymethod_amount[i] = bypayment[i].amount;
                percent[i] = (bypayment[i].amount / total * 100).toFixed(2); 
                //outer piechart data - payment_method 
                piedataouter[i] = { 'value': paymentbymethod_amount[i], 'name': payment_method[i] };

            }

            payment = payment_method.concat(payment_class);
            salesamount = paymentbymethod_amount.concat(paymentbyclass_amount);

            //console.log(payment);
            //console.log(salesamount);

            //manage data for chart
            chartdatapie = {
                payment:payment,
                piedataouter: piedataouter,
                piedatainner: piedatainner,
            }
            chartdatalist = {chartdatapie}
            drawchart(chartdatalist, daterange, branchName);

            //manage data for table
            payment = payment_method.concat('Total');
            salesamount = paymentbymethod_amount.concat(total);//.concat(paymentbyclass_amount);
            
            var datafortable = {payment, salesamount, percent};

            drawtable(datafortable);
            //initTable(salesdatafortable, '#salestabledetail', 'salesTotal', 'percent')
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
    var mydata = data.chartdatapie;
    //renew container
    var chart;
    if (chart != null && chart != "" && chart != undefined) {
        chart.dispose();
    }
    chart = echarts.init(document.getElementById('myPieChart'));

    chart.on('mouseover', function (params) {
        //if (params.name) {
        if (params.name) {
        }
    });

    var optionPayment = '';
    optionPayment = {
        title: {
            show: true,
            x: 'right',
            text: branch,
            subtext: daterange
        },
        tooltip: {
            trigger: 'item',
            formatter:
                "{a} <br/>{b}: {c} ({d}%)"
                //function (params) {
                //    var res = ''
                //    res += '<p>' + 'Avg amount per trans' + ': ' + params[0].formatMoney() + '</p>'
                //    //res += '<p>' + 'Avg trans' + ': ' + params[1].data + '</p>'
                //    //console.log(params[0].name)
                //    return res;
                //}
        },
        legend: {
            show: true,

            orient:
            //    'horizontal',
            'vertical',
            x: 'left',
            data:
                mydata.payment
             //['直达', '营销广告', '搜索引擎', '邮件营销', '联盟广告', '视频广告', '百度', '谷歌', '必应', '其他']
        },
        series: [
            {
                name: 'payment type',
                type: 'pie',
                center: ['55%', '60%'],
                selectedMode: 'single',
                radius: [0, '30%'],
                label: {
                    normal: {
                        position: 'inner'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:
                    mydata.piedatainner
                //[
                //    { value: 335, name: '直达', selected: true },
                //    { value: 679, name: '营销广告' },
                //    { value: 1548, name: '搜索引擎' }
                //]
            },

            {
                name: 'payment method',
                type: 'pie',
                center: ['55%', '60%'],
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                        backgroundColor: '#eee',
                        borderColor: '#aaa',
                        borderWidth: 1,
                        borderRadius: 4,
                        // shadowBlur:3,
                        // shadowOffsetX: 2,
                        // shadowOffsetY: 2,
                        // shadowColor: '#999',
                        // padding: [0, 7],
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 22,
                                align: 'center'
                            },
                            // abg: {
                            //     backgroundColor: '#333',
                            //     width: '100%',
                            //     align: 'right',
                            //     height: 22,
                            //     borderRadius: [4, 4, 0, 0]
                            // },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                fontSize: 16,
                                lineHeight: 33
                            },
                            per: {
                                color: '#eee',
                                backgroundColor: '#334455',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    }
                },
                data:
                    mydata.piedataouter
                //[
                //    { value: 335, name: '直达' },
                //    { value: 310, name: '邮件营销' },
                //    { value: 234, name: '联盟广告' },
                //    { value: 135, name: '视频广告' },
                //    { value: 1048, name: '百度' },
                //    { value: 251, name: '谷歌' },
                //    { value: 147, name: '必应' },
                //    { value: 102, name: '其他' }
                //]
            }
        ]
    };
    chart.setOption(optionPayment);
    window.addEventListener("resize", () => {
        chart.resize();
    });
}
function drawtable(data) {
    var table = $('#tablepayment');
    if (table != null && table != "" && table != undefined) {
        
    }

    var mytable = '<tr width=100%>';
    var mydtheader = data.payment;
    var mydata = data.salesamount;
    var mypercent = data.percent;

    console.log(mydtheader);
    console.log(mydata);

    for (var i = 0; i < mydtheader.length; i++) {
        mytable += '<th>' + mydtheader[i] + '</th>';
    }
    mytable += "</tr><tr>";

    for (var i = 0; i < mydata.length; i++) {
        mytable += '<td>' + mydata[i].formatMoney() + '</td>';
    }
    mytable += "</tr><tr>";

    for (var i = 0; i < mypercent.length; i++) {
        mytable += '<td>';
        //mytable += mypercent[i];
        if (mypercent[i] >= 10 && mypercent[i] <= 20) {
            mytable += "<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + mypercent[i] + "%</div><div class='progress'>"
                + '<div class="progress-bar progress-bar-default" style="width: ' + mypercent[i] + '%"; aria-valuenow :"' + mypercent[i] + '"; aria-valuemax="90">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>";
        }
        else if (mypercent[i] > 20) {
            mytable += "<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + mypercent[i] + "%</div><div class='progress'>"
                + '<div class="progress-bar bg-success progress-bar-success" style="width: ' + mypercent[i] + '%"; aria-valuenow :"' + mypercent[i] + '"; aria-valuemax="90">'
                + '<span class="sr-only">Complete (danger)</span>'
                + '</div>'
                + "</div>";
        }
        else {
            mytable += "<div class='h5 mb-0 mr-3 font-weight-bold text-black-800'>" + mypercent[i] + "%</div><div class='progress'>"
            + '<div class="progress-bar bg-danger progress-bar-danger" style="width: ' + mypercent[i] + '%"; aria-valuenow :"' + mypercent[i] + '"; aria-valuemax="90">'
            + '<span class="sr-only">Complete (danger)</span>'
            + '</div>'
            + "</div>";
    }
        mytable += '</td>';
    }
    mytable += '</tr>';
    mytable += '<br><style>';
    mytable += 'table,th,td {';
    mytable += 'border: 1px solid black; text-align:center;';
    mytable += '#tablepayment{';
    mytable += ' overflow-x: hidden; ';
    mytable += ' overflow-y: auto; ';
    mytable += '} ';
    mytable += '} ';
    mytable += '</style>';
    table.html(mytable);

    //$table.bootstrapTable('destroy').bootstrapTable({
    //    height: '100%',
    //    resizable: true,
    //    columns: [

    //    ],
    //    data: data
    //});
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
