var glo_date = "today";
var barChart;
var pieChart;
function showToday() {
  getinfo("today");
  getBranchsale("today");
  //getBranchprofit("today");
  //getBranchtrans("today");

}

$('.datesel a').on('click', function(ev) {
  ev.preventDefault();
  var val = $(this).data("val");
  var items = $('.datesel').find('a');
  items.removeClass('active');
  $.each(items, function(i, item) {
    if ($(item).data("val") == val) {
      $(item).addClass('active');
      glo_date = val;
    };
  });
  var mytab=$("#myTab .active").index();
  //console.log(mytab);
  getinfo(val);

  switch(mytab)
{
case 0:
  getBranchsale();
  break;
case 1:
  getBranchprofit();
  break;
  case 2:
    getBranchtrans();
    break;

}



});


function getinfo(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var totalsales = 0;
    var totalprofit = 0;
    var totaltrans = 0;
    var content = "";
    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total + totalsales;
      totalprofit = resp[i].profit + totalprofit;
      totaltrans = resp[i].invoiceQuantity + totaltrans;
      content = content + "<tr><td>" + resp[i].branchName + "</td><td class='text-right'>" + turnToMoney((resp[i].total*1.15).toFixed(2)) + "</td><td class='text-right'>" + turnToMoney((resp[i].profit*1.15).toFixed(2)) +
        "</td><td class='text-right'>" + resp[i].invoiceQuantity + "</td><td class='text-right'>" + (resp[i].profit * 100 / resp[i].total).toFixed(2) + "%" + "</td><td class='text-right'>" +
        turnToMoney((resp[i].total / resp[i].invoiceQuantity).toFixed(2)) + "</td></tr>";
    }

    $("#branchTable").html(content);
    var result1 = turnToMoney((totalsales * 1.15).toFixed(2));
    var result2 = turnToMoney((totalprofit * 1.15).toFixed(2));
    var result3 = totaltrans;
    var result4 = (totalprofit / totalsales * 100).toFixed(2) + "%";

    document.getElementById("totalsales").innerHTML = result1;
    document.getElementById("totalprofit").innerHTML = result2;
    document.getElementById("totaltrans").innerHTML = result3;
    document.getElementById("margin").innerHTML = result4;


  }
  xhr.send(null);
}

function getBranchsale() {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + glo_date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var barData = [];
    var barLabel = [];
    var pieData = [];
    for (var i = 0; i < resp.length; i++) {
      barLabel[i] = (resp[i].branchName).replace("Auckland", '');
      barData[i] = (resp[i].total * 1.15).toFixed(2);
      pieData[i] = {
        name: (resp[i].branchName).replace("Auckland", ''),
        value: (resp[i].total * 1.15).toFixed(2)
      };
    }
    if(barChart!=null&&barChart!=""&&barChart!=undefined){
      barChart.dispose();
    }
    barChart = echarts.init(document.getElementById('salesbar'));
    option = {
      title: {
        text: 'Branch Sales',
        x: 'center'
      },
      grid:{
                   x:50
                   //y:
               },
 //   tooltip:{
 //     position: function(point, params, dom, rect, size){ // point: 鼠标位置
 //             var tipHeight = point[1] + size.contentSize[1]; // contentSize: 提示dom 窗口大小
 //             if(tipHeight > size.viewSize[1] ){              // viewSize: echarts 容器大小
 //                 return [point[0]+40, point[1]-size.contentSize[1]];
 //             } else if(point[1] < size.contentSize[1]){
 //                 return [point[0]+40, point[1]+20];
 //             } else {
 //                 return point;
 //             }
 //
 //   }
 // },
      xAxis: {
        type: 'category',
        data: barLabel,
        axisLabel: {
          interval: 0,
          rotate: 40
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{

        data: barData,
        barWidth:"30",
        type: 'bar',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(0,0,0,0.1)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };

    barChart.setOption(option);
    $(window).on('resize', function() {
      barChart.resize();
    });



    if(pieChart!=null&&pieChart!=""&&pieChart!=undefined){
      pieChart.dispose();
    }
    pieChart = echarts.init(document.getElementById('salespie'));
    option2 = {

    //   tooltip: {
    //     trigger: 'item',
    //     formatter: "{a} <br/>{b} :${c} ({d}%)",
    //     confine:true
    // },
    grid:{
      containLabel:true
    },

      series: [{
        hoverAnimation:false ,
        name: "Sales",
        type: 'pie',
        radius: '100%',
        //center: ['50%', '50%'],
        data: pieData,
        itemStyle: {
          normal: {
            color:function(params) {
                 var colorList=["#df9499","#2ec7c9","#b6a2de","#467190","#ffb980","#8CC9E8"];
                 return colorList[params.dataIndex];
              },
            label: {
              show: true,
              position:"inner",
              formatter: function(params) {

                var res = params.name + " : \n" + params.percent + "%";
                return res;
              }

            },
            labelLine: {
              show: true
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

        }
      }]
    };
    pieChart.clear();
    pieChart.setOption(option2);
    $(window).on('resize', function() {
      pieChart.resize();
    });



  }
  xhr.send(null);
}

function getBranchprofit() {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + glo_date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var barData = [];
    var barLabel = [];
    var pieData = [];
    for (var i = 0; i < resp.length; i++) {
      barLabel[i] = (resp[i].branchName).replace("Auckland", '');
      barData[i] = (resp[i].profit * 1.15).toFixed(2);
      pieData[i] = {
        name: (resp[i].branchName).replace("Auckland", ''),
        value: (resp[i].profit * 1.15).toFixed(2)
      };
    }
    if(barChart!=null&&barChart!=""&&barChart!=undefined){
      barChart.dispose();
    }
  barChart = echarts.init(document.getElementById('profitbar'));
    option = {
      title: {
        text: 'Branch Profit',
        x: 'center'
      },
      grid:{
                   x:50
                   //y:
               },
      xAxis: {
        type: 'category',
        data: barLabel,
        axisLabel: {
          interval: 0,
          rotate: 40
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData,
        barWidth:"30",
        type: 'bar',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(0,0,0,0.1)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };

    barChart.setOption(option);
    $(window).on('resize', function() {
      barChart.resize();
    });

    if(pieChart!=null&&pieChart!=""&&pieChart!=undefined){
      pieChart.dispose();
    }
    pieChart = echarts.init(document.getElementById('profitpie'));
    option2 = {

      // tooltip: {
      //   trigger: 'item',
      //   formatter: "{a} <br/>{b} : ${c} ({d}%)",
      //     confine:true
      // },
      grid:{
        containLabel:true
      },
      series: [{
        hoverAnimation:false ,
        name: "Profit",
        type: 'pie',
        radius: '100%',
        center: ['50%', '50%'],
        data: pieData,
        itemStyle: {
          normal: {
            color:function(params) {
                 var colorList=["#df9499","#2ec7c9","#b6a2de","#467190","#ffb980","#8CC9E8"];
                 return colorList[params.dataIndex];
              },
            label: {
              show: true,
              position:"inner",
              formatter: function(params) {

                var res = params.name + " : \n" + params.percent + "%";
                return res;
              }
            },
            labelLine: {
              show: true
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

        }
      }]
    };

    pieChart.setOption(option2);
    $(window).on('resize', function() {
      pieChart.resize();
    });

  }
  xhr.send(null);
}
function getBranchtrans() {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + glo_date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var barData = [];
    var barLabel = [];
    var pieData = [];
    for (var i = 0; i < resp.length; i++) {
      barLabel[i] = (resp[i].branchName).replace("Auckland", '');
      barData[i] = resp[i].invoiceQuantity;
      pieData[i] = {
        name: (resp[i].branchName).replace("Auckland", ''),
        value: resp[i].invoiceQuantity
      };
    }
    if(barChart!=null&&barChart!=""&&barChart!=undefined){
      barChart.dispose();
    }

   barChart = echarts.init(document.getElementById('transbar'));
    option = {
      title: {
        text: 'Branch Transactions',
        x: 'center'
      },
      grid:{
                   x:50
                   //y:
               },
      xAxis: {
        type: 'category',
        data: barLabel,
        axisLabel: {
          interval: 0,
          rotate: 40
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData,
        barWidth:"30",
        type: 'bar',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(0,0,0,0.1)'
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return params.value;
              } else {
                return '';
              }
            }
          }
        }
      }]
    };

    barChart.setOption(option);
    $(window).on('resize', function() {
      barChart.resize();
    });



    if(pieChart!=null&&pieChart!=""&&pieChart!=undefined){
      pieChart.dispose();
    }
     pieChart = echarts.init(document.getElementById('transpie'));
    option2 = {

      // tooltip: {
      //   trigger: 'item',
      //   formatter: "{a} <br/>{b} : {c} ({d}%)",
      //     confine:true
      // },
      series: [{
        hoverAnimation:false ,
        name: "Transactions",
        type: 'pie',
        radius: '100%',
        center: ['50%', '50%'],
        data: pieData,
        itemStyle: {
          normal: {
            color:function(params) {
                 var colorList=["#df9499","#2ec7c9","#b6a2de","#467190","#ffb980","#8CC9E8"];
                 return colorList[params.dataIndex];
              },
            label: {
              show: true,
              position:"inner",
              formatter: function(params) {
                var res = params.name + " : \n" + params.percent + "%";
                return res;
              }
            },
            labelLine: {
              show: true  ,
                normal: {
                    length: 100
                }
            },
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

        }
      }]
    };

    pieChart.setOption(option2);
    $(window).on('resize', function() {
      pieChart.resize();
    });

  }
  xhr.send(null);
}

function getTotalSales(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var totalsales = 0;
    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total * 1.15 + totalsales;
    }
    global_sales = totalsales.toFixed(2);
    var result = "$" + totalsales.toFixed(2);
    document.getElementById("totalsales").innerHTML = result;
  }
  xhr.send(null);
}
function getTotalProfit(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  var profit = 0;
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var totalprofit = 0;
    for (var i = 0; i < resp.length; i++) {
      totalprofit = resp[i].profit * 1.15 + totalprofit;
    }
    var result = "$" + totalprofit.toFixed(2);
    profit = totalprofit.toFixed(2);
    document.getElementById("totalprofit").innerHTML = result;
  }
  xhr.send(null);
}
function getTotalTrans(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var totaltrans = 0;
    for (var i = 0; i < resp.length; i++) {
      totaltrans = resp[i].invoiceQuantity + totaltrans;
    }
    var result = totaltrans;
    document.getElementById("totaltrans").innerHTML = result;
  }
  xhr.send(null);
}
function getMargin(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period=" + date;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var totalsales = 0;
    var totalprofit = 0;

    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total + totalsales;
      totalprofit = resp[i].profit + totalprofit;
    }
    var result = (totalprofit / totalsales * 100).toFixed(2) + "%";

    document.getElementById("margin").innerHTML = result

  }
  xhr.send(null);
}
