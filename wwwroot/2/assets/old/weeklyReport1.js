//function add0(m){return m<10?'0'+m:m }
// function getb(){
//     var odate=$("#datepicker").val();
//     var test=moment(odate).subtract(7, 'days').format('YYYY-MM-DD');
//     var test1=moment();
//     //moment().subtract(7,'days');
//     alert(test);
// }
function loaddata(){
  getBranch2();
}
$("#datepicker").val(moment().format('MM/DD/YYYY'));
function getsales(branch) {
  var odate = $("#datepicker").val();
  var startdate = moment(odate);
  var enddate = moment(odate).add(1, 'days');
  var branchDic={
      "Auckland Albany ":2,
      "Auckland CBD":3,
      "Auckland Newmarket":4,
      "Auckland Howick":5,
      "Auckland Dominion Rd":6,
      "Auckland Botany":7
  };
  var data1 = [];
  var branchId=branchDic[branch];

  var xhr = new XMLHttpRequest();
  var uri = "http://www.hpw3.cn/api/salesinvoice";
  if(branch=="ToTal"){

    for (var i = 0; i < 7; i++) {
      var total=0;
      var profit=0;
      var someJsonString = {
        "startDateTime": startdate.format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };
      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(someJsonString),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {
            for(var j=0;j<data.length;j++){
              total=total+data[j].total;
              profit=profit+data[j].profit;

            }
                data1[i] = {
                  Date: startdate.format('MMM-DD-YYYY'),
                  Sales: (total*1.15).toFixed(2),
                  Profit: (profit*1.15).toFixed(2)
            }
        },
        error: function() {
          console.log('error');
        }

    });
    startdate = startdate.subtract(1, "days");
    enddate = enddate.subtract(1, "days");
  }
  return data1;

  }else{
    for (var i = 0; i < 7; i++) {
      var someJsonString = {
        "BranchId":branchId,
        "startDateTime": startdate.format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };

      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(someJsonString),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {
                data1[i] = {
                  Date: startdate.format('MMM-DD-YYYY'),
                  Sales: (data[0].total*1.15).toFixed(2),
                  Profit: (data[0].profit*1.15).toFixed(2)
            }
        },
        error: function() {
          console.log('error');
        }
      });
    startdate = startdate.subtract(1, "days");
    enddate = enddate.subtract(1, "days");
  }
  return data1;
  }




}

function drawBar() {
  //ddd=getsales();
  var branch=$("#bran").find("option:selected").val();
  //alert(branch);
  var temp=getsales(branch);
  $("#bartitle").html(branch);
  $("#morrisBar").html("");
  Morris.Bar({
    resize: true,
    element: 'morrisBar',
    data: temp.reverse(),
    xkey: 'Date',
    ykeys: ['Sales','Profit'],
    labels: ["Sales","Profit"],
    hideHover: true,
    barColors: ['#0088cc','#0099cc']
  }).on('click', function (i, row) {
  showDetail(branch,row);

});
}
function showDetail(branch,row) {
  var branchDic={
      "Auckland Albany ":2,
      "Auckland CBD":3,
      "Auckland Newmarket":4,
      "Auckland Howick":5,
      "Auckland Dominion Rd":6,
      "Auckland Botany":7
  };
  var branchId=branchDic[branch];
  var uri = "http://www.hpw3.cn/api/salesinvoice";
  var enddate = moment(row.Date).add(1, 'days');
  if(branch=="ToTal"){
      var trans=0;
      var someJsonString = {
        "startDateTime": moment(row.Date).format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };
      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(someJsonString),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {
            for(var j=0;j<data.length;j++){
              trans=trans+data[j].invoiceQuantity;
            }
            var content="<thead><tr><td colspan='2' style='text-align:center' >"+branch+" on "+row.Date+"</td></tr></thead><tbody><tr><td>Sales :</td><td>$"+row.Sales+"</td></tr><tr><td>Profit :</td><td>$"+row.Profit+"</td></tr><tr><td>Trasactions :</td><td>"+trans+"</td></tr><tr><td>Average Size :</td><td>$"+(row.Sales/trans).toFixed(2)+"</td></tr></tbody>";

            $("#showdetail").html(content);
        },
        error: function() {
          console.log('error');
        }

    });
  }else{
      var someJsonString = {
        "BranchId":branchId,
        "startDateTime": moment(row.Date).format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };
      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(someJsonString),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {
                var content="<thead><tr><td colspan='2' style='text-align:center' >"+branch+" on "+row.Date+"</td></tr></thead><tbody><tr><td>Sales :</td><td>$"+row.Sales+"</td></tr><tr><td>Profit :</td><td>$"+row.Profit+"</td></tr><tr><td>Trasactions :</td><td>"+data[0].invoiceQuantity+"</td></tr><tr><td>Average Size :</td><td>$"+(row.Sales/data[0].invoiceQuantity).toFixed(2)+"</td></tr></tbody>";
                $("#showdetail").html(content);

            },
        error: function() {
          console.log('error');
            }
          });
      }

}
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
    var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'><optgroup label='Wucha'><option value='ToTal'>ToTal Info</option></optgroup><optgroup label='Bracnch'>";
    content = prefix + content + "</optgroup></select>";

    $('#comeon').html(content);
  }
  xhr.send(JSON.stringify(someJsonString));
}
