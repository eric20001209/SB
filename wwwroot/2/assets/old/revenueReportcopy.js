//function add0(m){return m<10?'0'+m:m }
// function getb(){
//     var odate=$("#datepicker").val();
//     var test=moment(odate).subtract(7, 'days').format('YYYY-MM-DD');
//     var test1=moment();
//     //moment().subtract(7,'days');
//     alert(test);
// }
function getBranch2() {

  var uri = "http://www.hpw3.cn/api/salesinvoice";
  var xhr = new XMLHttpRequest();
  xhr.open("POST", uri, true);
  var odate = $("#datepicker").val();
  var startdate = moment(odate);
  var enddate = moment(odate).add(1, 'days');

  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  var someJsonString = {
    "startDateTime": startdate.format('YYYY-MM-DD'),
    "endDateTime": enddate.format('YYYY-MM-DD')
  };
  xhr.onload = function() {

    var resp = JSON.parse(xhr.responseText);
    var branch;
    var margin;
    var total = 0;
    var trans = 0;
    var profit = 0;
    var content = "";
    for (var i = 0; i < resp.length; i++) {
      branch = resp[i].branchName;
      //alert(branch);
      //$("#salesSelector").append("<option value='"+branch+"'>"+branch+"</option>");
      content = content + "<option value='" + branch + "'trans='" + resp[i].invoiceQuantity + "'sales='" + (resp[i].total * 1.15).toFixed(2) + "'profit='" + (resp[i].profit * 1.15).toFixed(2) + "'totalsales='" + total + "'>" + branch + "</option>";
    }
    var prefix = "<select data-plugin-selectTwo class='form-control' populate id='bran'><optgroup label='Wucha'><option>ToTal Info</option></optgroup><optgroup label='Bracnch'>";
    content = prefix + content + "</optgroup></select>";

    $('#comeon').html(content);
  }
  xhr.send(JSON.stringify(someJsonString));
}

function getsales(branch) {
  var odate = $("#datepicker").val();
  var startdate = moment(odate);
  var enddate = moment(odate).add(1, 'days');
  var data1 = [];
  var data2 = [];
  var data3 = [];
  var data4 = [];
  var data5 = [];
  var data6 = [];
  var xhr = new XMLHttpRequest();
  var uri = "http://www.hpw3.cn/api/salesinvoice";
  for (var i = 0; i < 7; i++) {
    var someJsonString = {
      "startDateTime": startdate.format('YYYY-MM-DD'),
      "endDateTime": enddate.format('YYYY-MM-DD')
    };
    $.ajax({
        type: "post",
        url: uri,
        async: false,
        data: JSON.stringify(someJsonString),
        contentType: "application/json", //推荐写这个
        dataType: "json",
        success: function(data) {
          for (var j = 0; j < data.length; j++) {
            if (data[j] == branch) {
              data1[i] = {
                y: startdate.format('YYYY-MM-DD'),
                a: data[j].total
              };
            }
          }

        }
      },
      error: function() {
        console.log('error');
      }
    });
  startdate = startdate.subtract(1, "days");
  enddate = enddate.subtract(1, "days");
}
// var branch1={"Auckland Dominion Rd":data1.reverse()};
// var branch2={"Auckland Albany":data2.reverse()};
// var branch3={"Auckland CBD":data3.reverse()};
// var branch4={"Auckland Howick":data4.reverse()};
// var branch5={"Auckland Botany":data5.reverse()};
// var branch6={"Auckland Newmarket":data6.reverse()};
//var ddd=[branch1,branch2,branch3,branch4,branch5,branch6];

return data1;
}

function drawBar() {
  //ddd=getsales();
  //var branch=$("#bran").find("option:selected").val();
  //var temp=getsales(branch);
  alert("temp");
  // Morris.Bar({
  //   resize: true,
  //   element: 'morrisBar',
  //   data: temp,
  //   xkey: 'y',
  //   ykeys: ['a'],
  //   labels: ['Sales Revenue'],
  //   hideHover: true,
  //   barColors: ['#0088cc']
  // });
}


// for(var i=0;i<7;i++){
//   xhr.open("POST", uri, true);

//    startdate=startdate.subtract(1,"days");
//    enddate=enddate.subtract(1,"days");
//    var someJsonString= {"startDateTime":startdate.format('YYYY-MM-DD'),"endDateTime":enddate.format('YYYY-MM-DD')};
//    xhr.onload= function() {// POST succeeds; do something
//        var resp= JSON.parse(xhr.responseText);
//        alert(JSON.stringify(someJsonString));
//        alert(resp[0].total);
//    }
//    xhr.send(JSON.stringify(someJsonString));
//  }







// (function( $ ) {
//
// 	'use strict';
//
// 	(function() {
// 		var plot = $.plot('#flotBars', [flotBarsData], {
// 			colors: ['#8CC9E8'],
// 			series: {
// 				bars: {
// 					show: true,
// 					barWidth: 0.8,
// 					align: 'center'
// 				}
// 			},
// 			xaxis: {
// 				mode: 'categories',
// 				tickLength: 0
// 			},
// 			grid: {
// 				hoverable: true,
// 				clickable: true,
// 				borderColor: 'rgba(0,0,0,0.1)',
// 				borderWidth: 1,
// 				labelMargin: 15,
// 				backgroundColor: 'transparent'
// 			},
// 			tooltip: true,
// 			tooltipOpts: {
// 				content: '%y',
// 				shifts: {
// 					x: -10,
// 					y: 20
// 				},
// 				defaultTheme: false
// 			}
// 		});
// 	})();
// }).apply( this, [ jQuery ]);
