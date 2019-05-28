$('#datepicker').datepicker({
    format: 'dd/mm/yyyy'
});


function loaddata(){
  getBranch2();
  drawBar();
  $("#bartitle").html("Total");
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

    var prefix = "<select data-plugin-selectTwo class='form-control populate' id='bran'><option value='Total' selected = 'selected'>Total Info</option>";
    content = prefix + content + "</select>";

    $('#comeon').html(content);
  }
  xhr.send(null);
}

$("#datepicker").val(moment().format('DD/MM/YYYY'));
function getsales(branch) {
  var odate = $("#datepicker").val();

  var startdate = moment(odate,'DD/MM/YYYY').subtract(6,"days");
  var enddate = moment(odate,'DD/MM/YYYY').add(1, 'days');
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
  var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=byDate";
      var total=0;
      var profit=0;
      var someJsonString = {
        "branchId":branchId,
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
            for(var j=0;j<7;j++){
              data1[j] = {
                Date: moment(data[j].startDateTime).format("DD MMM YYYY"),
                Sales: (data[j].total*1.15).toFixed(2),
                Profit: (data[j].profit*1.15).toFixed(2),
                trans:data[j].invoiceQuantity,
                Labels: moment(data[j].startDateTime).format("DD/MMM")

          };
            }

        },
        error: function() {
          console.log('error');
        }

    });


  return data1;
}

function drawBar() {
  //ddd=getsales();
  var branch=$("#bran").find("option:selected").val();

  var temp=getsales(branch);
  $("#bartitle").html(branch);
  $("#morrisBar").html("");
  Morris.Bar({
    resize: true,
    element: 'morrisBar',
    data: temp,

    xkey: 'Labels',
    ykeys: ['trans'],
    labels: ["Transactions"],
    hideHover: true,
      xLabelAngle: 45,
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
      "Total":-1,
      "Auckland Albany ":2,
      "Auckland CBD":3,
      "Auckland Newmarket":4,
      "Auckland Howick":5,
      "Auckland Dominion Rd":6,
      "Auckland Botany":7
  };
  var branchId=branchDic[branch];
  var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=byDate";
  var enddate = moment(row.Date).add(1, 'days');
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

          var content="<thead><tr><td colspan='2' style='text-align:center' >"+branch+" on "+row.Date+"</td></tr></thead><tbody><tr><td>Sales :</td><td>"+turnToMoney(row.Sales)+"</td></tr><tr><td>Profit :</td><td>"+turnToMoney(row.Profit)+"</td></tr><tr><td>Trasactions :</td><td>"+data[0].invoiceQuantity+"</td></tr><tr><td>Average Size :</td><td>$"+(row.Sales/data[0].invoiceQuantity).toFixed(2)+"</td></tr></tbody>";
          $("#showdetail").html(content);

            },
        error: function() {
          console.log('error');
            }
          });
}
