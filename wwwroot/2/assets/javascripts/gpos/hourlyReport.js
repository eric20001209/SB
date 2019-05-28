
$('#startdate').datepicker({
    format: 'dd/mm/yyyy'
});
$('#enddate').datepicker({
    format: 'dd/mm/yyyy',

});

// function DatePicker(startDateInput, endDateInput) {
//     startDateInput.on('changeDate', function (ev) {
//
//         if (ev.date) {
//             $(endDateInput).datetimepicker('setStartDate', new Date(ev.date.valueOf()));
//         } else {
//             $(endDateInput).datetimepicker('setStartDate', null);
//         }
//     })
//     endDateInput.on('changeDate', function (ev) {
//         if (ev.date) {
//             $(startDateInput).datetimepicker('setEndDate', new Date(ev.date.valueOf()));
//         } else {
//             $(startDateInput).datetimepicker('setEndDate', new Date());
//         }
//     })
//
// }

$("#startdate").val(moment().format('DD/MM/YYYY'));
$("#enddate").val(moment().format('DD/MM/YYYY'));

function getBranch2() {
  var uri = "http://www.hpw3.cn/api/branches";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var branch='';
    var content = "";
    for (var i = 0; i < resp.length; i++) {
      branch = resp[i].name;
      content = content + "<option value='" + branch + "''>" + branch + "</option>";
    }

    var prefix = "<option value='Total' selected = 'selected'>All</option>";
    content = prefix + content ;

    $('#bran').html(content);
  }
  xhr.send(null);
}
function drawBar() {
  var branch=$("#bran").val();
  var branchDic={
      "Total":-1,
      "Auckland Albany ":2,
      "Auckland CBD":3,
      "Auckland Newmarket":4,
      "Auckland Howick":5,
      "Auckland Dominion Rd":6,
      "Auckland Botany":7
  };
  var data1 = [];
var branchId=branchDic[branch];

var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=byhour";

var raval=$('input[name="porto_is"]:checked').val();
var showdate="";
if(raval=="DateRange"){
  var sdate=$("#startdate").val();
  var edate=$("#enddate").val();
  var startdate = moment(sdate,"DD/MM/YYYY");
  var enddate = moment(edate,"DD/MM/YYYY").add(1, 'days');
  var someJsonString = {
        "BranchId":branchId,
        "startDateTime": startdate.format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };
      if(sdate==edate){
        showdate=moment(sdate,"DD/MM/YYYY").format("Do MMM YYYY");
      }else{
        var aa=moment(sdate,"DD/MM/YYYY").format("Do MMM");
        var bb=moment(edate,"DD/MM/YYYY").format("Do MMM YYYY");
        showdate=aa+"-"+bb;
      }

}else{
  var todate=moment();
  datedic = {
    "Today":{
      "BranchId":branchId,
      "startDateTime": moment().format('YYYY-MM-DD'),
      "endDateTime": moment().add(1,"days").format('YYYY-MM-DD')
    },"Yesterday" :{
      "BranchId":branchId,
      "startDateTime": moment().subtract(1,"days").format('YYYY-MM-DD'),
      "endDateTime": moment().format('YYYY-MM-DD')
    },"This Week":{
      "BranchId":branchId,
      "startDateTime": moment().startOf("week").format('YYYY-MM-DD'),
      "endDateTime": moment().endOf("week").add(1,"days").format('YYYY-MM-DD')
    },"This Month":{
      "BranchId":branchId,
      "startDateTime": moment().startOf("month").format('YYYY-MM-DD'),
      "endDateTime": moment().endOf("month").add(1,"days").format('YYYY-MM-DD')
    },"Last Month":{
      "BranchId":branchId,
      "startDateTime": moment().subtract(1,"month").startOf("month").format('YYYY-MM-DD'),
      "endDateTime": moment().subtract(1,"month").endOf("month").add(1,"days").format('YYYY-MM-DD')
    },"Last Three Month":{
      "BranchId":branchId,
      "startDateTime": moment().subtract(3,"month").startOf("month").format('YYYY-MM-DD'),
      "endDateTime": moment().subtract(1,"month").endOf("month").add(1,"days").format('YYYY-MM-DD')
    },"Last Six Month":{
      "BranchId":branchId,
      "startDateTime": moment().subtract(6,"month").startOf("month").format('YYYY-MM-DD'),
      "endDateTime": moment().subtract(1,"month").endOf("month").add(1,"days").format('YYYY-MM-DD')
    }
  };
  var someJsonString=datedic[raval];
  var someJsonString=datedic[raval];
  var s=moment(datedic[raval]["startDateTime"]).format("MMM YYYY");
  var e=moment(datedic[raval]["endDateTime"]).format("MMM YYYY");

  if(raval=="Today"||raval=="Yesterday"||raval=="This Week"){
    showdate=raval;
  }else{
    showdate=s+"-"+e;
  }
}
var diff=moment(someJsonString.endDateTime).diff(moment(someJsonString.startDateTime),"day");



    var date = [];for(var n = 0; n < 24; n++) date[n] = 0
    var trans = [];for(var n = 0; n < 24; n++) trans[n] = 0

  $.ajax({
      type: "post",
      url: uri,
      async: true,
      data: JSON.stringify(someJsonString),
      contentType: "application/json",
      dataType: "json",
      success: function(data) {

        for(var i=0;i<data.length;i++){
          var d=moment(data[i].startDateTime);
          if($("#average").is(':checked')){
            date[d.format("HH")]=data[i].total/diff;
            trans[d.format("HH")]=data[i].invoiceQuantity/diff;
          }else{
            date[d.format("HH")]=data[i].total;
            trans[d.format("HH")]=data[i].invoiceQuantity;
          }

        }
        var check=$("#average").is(':checked');
        var myChart = echarts.init(document.getElementById('hourlychart'));
        var branch=$("#bran").val();
        if(branch==undefined||branch=="Total"){
          branch="ALL";

        }
        var title=branch.replace("Auckland","")+" "+showdate;
  
        var  option = {
            title: {
                text: title
            },
            tooltip: {
              trigger: 'axis',
                confine:true,
              formatter: function (para) {
                var date=(parseInt(para[0].axisValue)-1)+":00-"+para[0].axisValue+":00</br>";
                var result="";
                for(var i=0;i<para.length;i++){
                  if(para[i].seriesName=="Sales"){
                    if(check){
                    result=result+para[i].marker+" Average "+para[i].seriesName+turnToMoney(para[i].data.toFixed(2))+"</br>";
                  }else{
                    result=result+para[i].marker+para[i].seriesName+turnToMoney(para[i].data.toFixed(2))+"</br>";
                  }
                  }else{
                    if(check){
                      result=result+para[i].marker+"Average "+para[i].seriesName+" : "+para[i].data.toFixed(2)+"</br>";
                    }else{
                      result=result+para[i].marker+para[i].seriesName+" : "+para[i].data.toFixed(0)+"</br>";
                    }

                  }

                }

                //console.log(para);

                return (date+result);
                        }
            },

            legend: {
                data:['','','','Sales','Transactions']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },

            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']

                //data: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24']
            },
            yAxis:  [{

          type: 'value',
          axisLabel: {
          formatter: function (v) {
            return turnToMoney(v);
                    }
          }

      }, {

          type: 'value'
      }],
            series: [
                {
                    name:'Sales',
                    type:'line',

                    data:  date

                    // label:{
                    //   normal:{
                    //     show: true,
                    //     position: 'top',
                    //     formatter: function(params) {
                    //         console.log(params);
                    //             if (params.value > 0) {
                    //             return params.value;
                    //             } else {
                    //             return '';
                    //             }
                    //           }
                    //   }
                    // }
                },{
                    name:'Transactions',
                    type:'line',

                    data:trans,
                    yAxisIndex: 1
                }
            ]
        };
        myChart.setOption(option);
        $(window).on('resize',function(){
        myChart.resize();
        });





    },

    error: function() {
      console.log('error');
    }
  });
}
// function drawline(date,trans) {
//   var check=$("#average").is(':checked');
//   var myChart = echarts.init(document.getElementById('hourlychart'));
//   var branch=$("#bran").val();
//   if(branch==undefined||branch=="Total"){
//     branch="ALL";
//   }
//   var title=branch.replace("Auckland","");
//   var  option = {
//       title: {
//           text: title
//       },
//       tooltip: {
//         trigger: 'axis',
//         formatter: function (para) {
//           var date=(parseInt(para[0].axisValue)-1)+":00-"+para[0].axisValue+":00</br>";
//           var result="";
//           for(var i=0;i<para.length;i++){
//             if(para[i].seriesName=="Sales"){
//               if(check){
//               result=result+para[i].marker+" Average "+para[i].seriesName+turnToMoney(para[i].data.toFixed(2))+"</br>";
//             }else{
//               result=result+para[i].marker+para[i].seriesName+turnToMoney(para[i].data.toFixed(2))+"</br>";
//             }
//             }else{
//               if(check){
//                 result=result+para[i].marker+"Average "+para[i].seriesName+" : "+para[i].data.toFixed(2)+"</br>";
//               }else{
//                 result=result+para[i].marker+para[i].seriesName+" : "+para[i].data.toFixed(0)+"</br>";
//               }
//
//             }
//
//           }
//
//           //console.log(para);
//
//           return (date+result);
//                   }
//       },
//
//       legend: {
//           data:['','','','Sales','Transactions']
//       },
//       grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           containLabel: true
//       },
//
//       xAxis: {
//           type: 'category',
//           boundaryGap: false,
//           data: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
//
//           //data: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9','9-10','10-11','11-12','12-13','13-14','14-15','15-16','16-17','17-18','18-19','19-20','20-21','21-22','22-23','23-24']
//       },
//       yAxis:  [{
//     name: 'Sales',
//     type: 'value',
//     axisLabel: {
//     formatter: function (v) {
//       return turnToMoney(v);
//               }
//     }
//
// }, {
//     name: 'Transaction',
//     type: 'value'
// }],
//       series: [
//           {
//               name:'Sales',
//               type:'line',
//
//               data:  date
//
//               // label:{
//               //   normal:{
//               //     show: true,
//               //     position: 'top',
//               //     formatter: function(params) {
//               //         console.log(params);
//               //             if (params.value > 0) {
//               //             return params.value;
//               //             } else {
//               //             return '';
//               //             }
//               //           }
//               //   }
//               // }
//           },{
//               name:'Transactions',
//               type:'line',
//
//               data:trans,
//               yAxisIndex: 1
//           }
//       ]
//   };
//   myChart.setOption(option);
//   $(window).on('resize',function(){
//   myChart.resize();
//   });
// }




function radiopick() {

  $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
}
