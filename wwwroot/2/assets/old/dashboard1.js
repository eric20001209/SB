var glo_date="today";
function showToday(){
  getinfo("today");
  //getinfo2("today");
  getBranchsale("today");

}
$('#meter').liquidMeter({
  shape: 'circle',
  color: '#0088CC',
  background: '#F9F9F9',
  fontSize: '24px',
  fontWeight: '600',
  stroke: '#F2F2F2',
  textColor: '#333',
  liquidOpacity: 0.9,
  liquidPalette: ['#333'],
  speed: 3000,
  animate: !$.browser.mobile
});
$('.datesel a').on('click', function( ev ) {
  //ev.preventDefault();

  var val = $(this).data("val");
  var  items = $('.datesel').find('a');
  items.removeClass('active');
  $.each(items,function(i, item) {
    if($(item).data("val")==val){
      $(item).addClass('active');
      glo_date=val;

    };
});
var branchinfo=$("#branchinfo").find("option:selected").val();
if (branchinfo=="sales"){
  getinfo(val);
  getBranchsale(glo_date);
}else if(branchinfo=="profit"){
  getinfo(val);
  getBranchprofit(glo_date);
}else if(branchinfo=="trans"){
  getinfo(val);
  getBranchtrans(glo_date);
}


  //getinfo2(val);

});

$('#branchdatesel a').on('click', function( ev ) {
  ev.preventDefault();
  var val = $(this).data("val"),
    selector = $(this).parent(),
    items = selector.find('a');
  items.removeClass('active');
  $(this).addClass('active');
  $('#meter').liquidMeter('set', 100);
  //getinfo2(val);
  getBranchsale(val);
});

function getinfo(date){
  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var totalsales=0;
    var totalprofit=0;
    var totaltrans=0;
    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total+totalsales;
      totalprofit = resp[i].profit+totalprofit;
      totaltrans = resp[i].invoiceQuantity+totaltrans;
    }

    var result1=turnToMoney((totalsales*1.15).toFixed(2));
    var result2=turnToMoney((totalprofit*1.15).toFixed(2));
    var result3=totaltrans;
    var result4=(totalprofit/totalsales*100).toFixed(2)+"%";

    document.getElementById("totalsales").innerHTML=result1;
    document.getElementById("totalprofit").innerHTML=result2;
    document.getElementById("totaltrans").innerHTML=result3;
    document.getElementById("margin").innerHTML=result4;
  }
  xhr.send(null);
}
// function getinfo2(date){
//   var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
//   var xhr= new XMLHttpRequest();
//   xhr.open("GET", uri, true);
//   xhr.onload= function() {
//     var resp= JSON.parse(xhr.responseText);
//     var totalsales=0;
//     var totalprofit=0;
//     var totaltrans=0;
//     for (var i = 0; i < resp.length; i++) {
//       totalsales = resp[i].total+totalsales;
//       totalprofit = resp[i].profit+totalprofit;
//       totaltrans = resp[i].invoiceQuantity+totaltrans;
//     }
//
//     var result1=turnToMoney((totalsales*1.15).toFixed(2));
//     var result2=turnToMoney((totalprofit*1.15).toFixed(2));
//     var result3=totaltrans;
//     var result4=(totalprofit/totalsales*100).toFixed(2)+"%";
//     document.getElementById("tablesales").innerHTML=result1;
//     document.getElementById("tableprofit").innerHTML=result2;
//     document.getElementById("tabletrans").innerHTML=result3;
//     document.getElementById("tableAS").innerHTML="$"+(totalsales/totaltrans).toFixed(2);
//   }
//   xhr.send(null);
// }
function getTotalSales(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var totalsales=0;
    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total*1.15+totalsales;
    }
    global_sales=totalsales.toFixed(2);
    var result="$"+totalsales.toFixed(2);
    document.getElementById("totalsales").innerHTML=result;
  }
  xhr.send(null);
}

function getTotalProfit(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  var profit=0;
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var totalprofit=0;
    for (var i = 0; i < resp.length; i++) {
      totalprofit = resp[i].profit*1.15+totalprofit;
    }
    var result="$"+totalprofit.toFixed(2);
    profit=totalprofit.toFixed(2);
    document.getElementById("totalprofit").innerHTML=result;
  }
  xhr.send(null);
}
function getTotalTrans(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var totaltrans=0;
    for (var i = 0; i < resp.length; i++) {
      totaltrans = resp[i].invoiceQuantity+totaltrans;
    }
    var result=totaltrans;
    document.getElementById("totaltrans").innerHTML=result;
  }
  xhr.send(null);
}
function getMargin(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var totalsales=0;
    var totalprofit=0;

    for (var i = 0; i < resp.length; i++) {
      totalsales = resp[i].total+totalsales;
      totalprofit = resp[i].profit+totalprofit;
    }
    var result=(totalprofit/totalsales*100).toFixed(2)+"%";

    document.getElementById("margin").innerHTML=result

  }
  xhr.send(null);
}

function ifchange() {

  var branchinfo=$("#branchinfo").find("option:selected").val();
  if (branchinfo=="sales"){
    getBranchsale(glo_date);
  }else if(branchinfo=="profit"){
    getBranchprofit(glo_date);
  }else if(branchinfo=="trans"){
    getBranchtrans(glo_date);
  }
}
$("#flotPie").empty();
$("#flotBar").empty();
function getBranchtrans(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var flotBarsData=[];
    var flotPieData=[];
    for (var i = 0; i < resp.length; i++) {
      flotBarsData[i]=[(resp[i].branchName).replace("Auckland",''),resp[i].invoiceQuantity];
      flotPieData[i] = {
        label: (resp[i].branchName).replace("Auckland",''),
        data:  resp[i].invoiceQuantity};
    }
    $("#flotPie").empty();
    $("#flotBar").empty();
    $.plot('#flotPie', flotPieData, {
        series: {
          pie: {
            show: true,
            label: {
           show:true,
           radius: 0.8,
           formatter: function (label, series) {
               return '<div style="border:1px solid grey;font-size:10pt;text-align:center;padding:5px;color:white;">' +
               label + ' : ' +
               Math.round(series.percent) +
               '%</div>';
           }, background: {
                opacity: 0.8,
                color: '#000'
            }
         },
            combine: {
              color: '#999',
              threshold: 0.1
            }
          }

        },

        legend: {
          show: false
        },
        grid: {
          hoverable: true,
          clickable: true
        }
      });

    $.plot('#flotBars', [flotBarsData], {
      colors: ['#8CC9E8'],
      series: {
        bars: {
          show: true,
          barWidth: 0.8,
          align: 'center'
        }
      },
      xaxis: {
        mode: 'categories',
        tickLength: 0
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        labelMargin: 15,
        backgroundColor: 'transparent'
      },
      tooltip: true,
      tooltipOpts: {
        content: function(label, xval, yval) {

          var content = "%s %x" +" "+yval;
          return content;
        },
        shifts: {
          x: -10,
          y: 20
        },
        defaultTheme: false
      }
    });
    $("#flotBars").bind("plotclick", function (event, pos, item) {
      if (item) {
          highlight(item.series, item.datapoint);

      }
  });

  }
  xhr.send(null);
}

function getBranchprofit(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var flotBarsData=[];
    var flotPieData=[];
    for (var i = 0; i < resp.length; i++) {
      flotBarsData[i]=[(resp[i].branchName).replace("Auckland",''),(resp[i].profit*1.15).toFixed(2)];
      flotPieData[i] = {
        label: (resp[i].branchName).replace("Auckland",''),
        data:  (resp[i].profit*1.15).toFixed(2)};
    }
    $("#flotPie").empty();
    $("#flotBar").empty();
    $.plot('#flotPie', flotPieData, {
        series: {
          pie: {
            show: true,
            label: {
           show:true,
           radius: 0.8,
           formatter: function (label, series) {
               return '<div style="border:1px solid grey;font-size:10pt;text-align:center;padding:5px;color:white;">' +
               label + ' : ' +
               Math.round(series.percent) +
               '%</div>';
           }, background: {
                opacity: 0.8,
                color: '#000'
            }
         },
            combine: {
              color: '#999',
              threshold: 0.1
            }
          }

        },

        legend: {
          show: false
        },
        grid: {
          hoverable: true,
          clickable: true
        }
      });

    $.plot('#flotBars', [flotBarsData], {
      colors: ['#8CC9E8'],
      series: {
        bars: {
          show: true,
          barWidth: 0.8,
          align: 'center'
        }
      },
      xaxis: {
        mode: 'categories',
        tickLength: 0
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        labelMargin: 15,
        backgroundColor: 'transparent'
      },
      tooltip: true,
      tooltipOpts: {
        content: function(label, xval, yval) {

          var content = "%s %x" + turnToMoney(yval);
          return content;
        },
        shifts: {
          x: -10,
          y: 20
        },
        defaultTheme: false
      }
    });
    $("#flotBars").bind("plotclick", function (event, pos, item) {
      if (item) {
          highlight(item.series, item.datapoint);

      }
  });

  }
  xhr.send(null);
}

function getBranchsale(date) {
  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var flotBarsData=[];
    var flotPieData=[];
    for (var i = 0; i < resp.length; i++) {
      flotBarsData[i]=[(resp[i].branchName).replace("Auckland",''),(resp[i].total*1.15).toFixed(2)];
      flotPieData[i] = {
        label: (resp[i].branchName).replace("Auckland",''),
        data:  (resp[i].total*1.15).toFixed(2)};
    }
    $("#flotPie").empty();
    $("#flotBar").empty();
    $.plot('#flotPie', flotPieData, {
        series: {
          pie: {
            show: true,
            label: {
           show:true,
           radius: 0.8,
           formatter: function (label, series) {
               return '<div style="border:1px solid grey;font-size:10pt;text-align:center;padding:5px;color:white;">' +
               label + ' : ' +
               Math.round(series.percent) +
               '%</div>';
           }, background: {
                opacity: 0.8,
                color: '#000'
            }
         },
            combine: {
              color: '#999',
              threshold: 0.1
            }
          }

        },

        legend: {
          show: false
        },
        grid: {
          hoverable: true,
          clickable: true
        }
      });

    $.plot('#flotBars', [flotBarsData], {
      colors: ['#8CC9E8'],
      series: {
        bars: {
          show: true,
          barWidth: 0.8,
          align: 'center'
        }
      },
      xaxis: {
        mode: 'categories',
        tickLength: 0
      },
      grid: {
        hoverable: true,
        clickable: true,
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        labelMargin: 15,
        backgroundColor: 'transparent'
      },
      tooltip: true,
      tooltipOpts: {
        content: function(label, xval, yval) {

          var content = "%s %x" + turnToMoney(yval);
          return content;
        },
        shifts: {
          x: -10,
          y: 20
        },
        defaultTheme: false
      }
    });
    $("#flotBars").bind("plotclick", function (event, pos, item) {
      if (item) {

      }
  });

  }
  xhr.send(null);
}
