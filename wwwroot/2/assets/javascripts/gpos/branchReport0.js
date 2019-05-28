
$('#startdate').datepicker({
    format: 'dd/mm/yyyy'
});
$('#enddate').datepicker({
    format: 'dd/mm/yyyy'
});
$("#startdate").val(moment().format('DD/MM/YYYY'));
$("#enddate").val(moment().format('DD/MM/YYYY'));
function drawBar() {
  var raval=$('input[name="porto_is"]:checked').val();
  morrisBarData=[];
  morrisDonutData=[];
  var showdate="";
  var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=byBranch";
  if(raval=="DateRange"){
  var sdate=$("#startdate").val();
  var edate=$("#enddate").val();
    if(sdate==edate){
      var startdate = moment(sdate,"DD/MM/YYYY");
      var enddate = moment(sdate,"DD/MM/YYYY").add(1, 'days');
      showdate=moment(sdate,"DD/MM/YYYY").format("Do MMM YYYY");
    }else{
      var startdate = moment(sdate,"DD/MM/YYYY");
      var enddate = moment(edate,"DD/MM/YYYY").add(1, 'days');
      var aa=moment(sdate,"DD/MM/YYYY").format("Do MMM");
      var bb=moment(edate,"DD/MM/YYYY").format("Do MMM YYYY");
      showdate=aa+"-"+bb;
    }

    var someJsonString = {
      "startDateTime": startdate.format('YYYY-MM-DD'),
      "endDateTime": enddate.format('YYYY-MM-DD')
    };


  }else{
    var todate=moment();

    datedic = {
      "Today":{
        "startDateTime": moment().format('YYYY-MM-DD'),
        "endDateTime": moment().add(1,"days").format('YYYY-MM-DD')
      },"Yesterday" :{
        "startDateTime": moment().subtract(1,"days").format('YYYY-MM-DD'),
        "endDateTime": moment().format('YYYY-MM-DD')
      },"This Week":{
        "startDateTime": moment().startOf("week").format('YYYY-MM-DD'),
        "endDateTime": moment().endOf("week").add(1,"days").format('YYYY-MM-DD')
      },"This Month":{
        "startDateTime": moment().startOf("month").format('YYYY-MM-DD'),
        "endDateTime": moment().endOf("month").add(1,"days").format('YYYY-MM-DD')
      },"Last Month":{
        "startDateTime": moment().subtract(1,"month").startOf("month").format('YYYY-MM-DD'),
        "endDateTime": moment().subtract(1,"month").endOf("month").add(1,"days").format('YYYY-MM-DD')
      }
    };
    var someJsonString=datedic[raval];
    var s=moment(datedic[raval]["startDateTime"]).format("MMM YYYY");
    var e=moment(datedic[raval]["endDateTime"]).format("MMM Do YYYY");

    if(raval=="Today"||raval=="Yesterday"||raval=="This Week"){
      showdate=raval;
    }else{
      showdate=s;
    }

      console.log(someJsonString);
  };


  $.ajax({
      type: "post",
      url: uri,
      async: true,
      data: JSON.stringify(someJsonString),
      contentType: "application/json",
      dataType: "json",
      success: function(data) {
        for(var j=0;j<data.length;j++){
          var branch = data[j].branchName.replace('Auckland', '')
          morrisBarData[j] = {
            Branch:branch,
            Sales: (data[j].total*1.15).toFixed(2)
      };
        morrisDonutData[j]={
          label:branch,
          value:(data[j].total*1.15).toFixed(2)
        };
    }
    //var showdate=moment(sdate).format("MMM Do YYYY");
    $("#bartitle").html(showdate);
    $("#morrisBar").empty();
    $("#morrisDonut").empty();
    Morris.Bar({
      resize: true,
      element: 'morrisBar',
      data: morrisBarData ,
      xkey: 'Branch',
      ykeys: ['Sales'],
      labels: ['Sales'],
      hideHover: true,
      fillOpacity: 0.4,
      preUnits:"$",
      xLabelAngle: 45,
      padding: 20,
      barColors: ['#0088cc','#2baab1'],

    });
    Morris.Donut({
      resize: true,
      element: 'morrisDonut',
      data: morrisDonutData,
      formatter:function (y, data) {
        return "$"+y.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        //return '$' + result
       },
      colors: ['#0088cc', '#734ba9', '#E36159']
    });
    },

    error: function() {
      console.log('error');
    }
  });
}
function radiopick() {

  $(":radio[name='porto_is'][value='DateRange']").prop("checked", "checked");
}
