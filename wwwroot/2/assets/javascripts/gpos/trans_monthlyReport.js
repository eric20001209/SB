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
  drawp12mBar();
  $("#bartitle").html("Total");
}
function getsales(branch) {

  var startdate = moment().startOf('month').subtract(1,"years");
  var enddate = moment().startOf('month').add(1, "months");
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
  var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=bymonth";
      var someJsonString = {
        "BranchId":branchId,
        "startDateTime": startdate.format('YYYY-MM-DD'),
        "endDateTime": enddate.format('YYYY-MM-DD')
      };
  var indi=startdate;
  //console.log(someJsonString);
      var total=0;
      var profit=0;
      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(someJsonString),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {
            for(var j=0;j<12;j++){
              var total=0;
              var profit=0;
              var sddate='';
              total=data[j].total;
              profit=data[j].profit;
              sddate=data[j].startDateTime;
              data1[j] = {
                Date: moment(sddate).format("YYYY-MM-DD"),
                Label:moment(sddate).format("MMM/YYYY"),
                Sales: (total*1.15).toFixed(2),
                Profit: (profit*1.15).toFixed(2),
                Trans:data[j].invoiceQuantity
          };
            }
console.log(data1);
        },
        error: function() {
          console.log('error');
        }
      });

  return data1;
}
function drawp12mBar() {
  //ddd=getsales();
  var branch=$("#bran").find("option:selected").val();
  var temp=getsales(branch);
  $("#bartitle").html(branch);
  $("#morrisBar").empty();
  Morris.Bar({
    resize: true,
    element: 'morrisBar',
    data: temp,
    //preUnits:"$",
    xkey: 'Label',
    ykeys: ['Trans'],
    labels: ["Transactions"],
    //xLabelAngle:45,
    hideHover: true,
    padding: 0,
    barColors: ['#0088cc','#0099cc']
  }).on('click', function (i, row) {
  showDetail(branch,row);
});
}
function showDetail(branch,row) {
  if(branch== undefined){
    branch="Total";
  }
  var branchDic={
      "ToTal":-1,
      "Auckland Albany ":2,
      "Auckland CBD":3,
      "Auckland Newmarket":4,
      "Auckland Howick":5,
      "Auckland Dominion Rd":6,
      "Auckland Botany":7
  };
  var branchId=branchDic[branch];
  var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=bymonth";
  var enddate = moment(row.Date).add(1, 'months');
    var trans=0;
      var someJsonString = {
        "BranchId":branchId,
        "startDateTime":moment(row.Date).startOf("month").format('YYYY-MM-DD'),
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
                var content="<thead><tr><td colspan='2' style='text-align:center' >"+branch+" in "+row.Label+"</td></tr></thead><tbody><tr><td>Sales :</td><td>"+turnToMoney(row.Sales)+"</td></tr><tr><td>Profit :</td><td>"+turnToMoney(row.Profit)+"</td></tr><tr><td>Trasactions :</td><td>"+trans+"</td></tr><tr><td>Average Size :</td><td>$"+(row.Sales/trans).toFixed(2)+"</td></tr></tbody>";

                $("#showdetail").html(content);

            },
        error: function() {
          console.log('error');
            }
          });

}
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
  //console.log(content);
    var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'><option value='Total'>Total Info</option>";
    content = prefix + content + "</select>";

    $('#comeon').html(content);
  }
  xhr.send(null);
}
