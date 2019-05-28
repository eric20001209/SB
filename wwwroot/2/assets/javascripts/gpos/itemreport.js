var itemChart;

var jsonStr= {
  "startDateTime": moment().format('YYYY-MM-DD'),
  "endDateTime": moment().add(1,"days").format('YYYY-MM-DD')
};
$('#startdate').datepicker({
    format: 'dd/mm/yyyy'
});
$('#enddate').datepicker({
    format: 'dd/mm/yyyy'
});
$("#startdate").val(moment().format('DD/MM/YYYY'));
$("#enddate").val(moment().format('DD/MM/YYYY'));


function loaddata(){
  getBranch();
  drawBar();
  getCategory()

}
function getBranch() {
  var uri = "http://www.hpw3.cn/api/branches";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var branch='';
    var content = "";
    for (var i = 0; i < resp.length; i++) {
      branch = resp[i].name;
      content = content + "<option value='" + branch + "'branid='"+resp[i].id+"'>" + branch + "</option>";
    }
    $('#bran').append(content);
  }
  xhr.send(null);
}function getCategory() {
  var uri = "http://www.hpw3.cn/api/categories";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload = function() {
    var resp = JSON.parse(xhr.responseText);
    var cate='';
    var content = "";
    for (var i = 0; i < resp.length; i++) {
      cate= resp[i].name;
      content = content + "<option value='" + cate + "'>" + cate + "</option>";
    }
    $('#Category').append(content);
  }
  xhr.send(null);
}
function showDateRange() {
  var sdate=$("#startdate").val();
  var edate=$("#enddate").val();
  var showdate="";
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

  var keyword=$("#itemName").val();

  jsonStr = {

    "keyword":keyword,
    "startDateTime": startdate.format('YYYY-MM-DD'),
    "endDateTime": enddate.format('YYYY-MM-DD')
  };
drawBar();
}
function showToday() {

  var keyword=$("#itemName").val();
  jsonStr = {

    "keyword":keyword,
    "startDateTime": moment().format('YYYY-MM-DD'),
    "endDateTime": moment().add(1,"days").format('YYYY-MM-DD')
  };
drawBar();
}
function showYesterday() {
  var keyword=$("#itemName").val();
  jsonStr = {
    "keyword":keyword,
    "startDateTime": moment().subtract(1,"days").format('YYYY-MM-DD'),
    "endDateTime": moment().format('YYYY-MM-DD')
  };
drawBar();
}
function showUptonow() {

  var keyword=$("#itemName").val();
  jsonStr = {

    "keyword":keyword
  };
drawBar();
}
function showThisMonth() {


  var keyword=$("#itemName").val();

  jsonStr = {

    "keyword":keyword,
    "startDateTime": moment().startOf("month").format('YYYY-MM-DD'),
    "endDateTime": moment().endOf("month").add(1,"days").format('YYYY-MM-DD')
  };
drawBar();
}
function showLastMonth() {


  var keyword=$("#itemName").val();

  jsonStr = {

    "keyword":keyword,
    "startDateTime": moment().subtract(1,"month").startOf("month").format('YYYY-MM-DD'),
    "endDateTime": moment().subtract(1,"month").endOf("month").add(1,"days").format('YYYY-MM-DD')
  };
drawBar();
}
function drawBar() {
  var qtyData=[];
  var itemLabel=[];
  var ic=$("#icode").val();
  var branchId=$("#bran").find("option:selected").attr("branid");


  jsonStr["branchId"]=branchId;
  if(ic){
    jsonStr["itemCode"]=ic;
  }
  var branch=$("#bran").val();
  var cate=$("#Category").val();
  jsonStr["Category"]=cate;
console.log(jsonStr);
  var date;
  if(jsonStr.startDateTime==undefined){
    date="so far";
  }else{
  date=moment(jsonStr.startDateTime).format("DD/MMM")+"-"+moment(jsonStr.endDateTime).subtract(1,"days").format("DD/MMM");
  }
  var uri = "http://www.hpw3.cn/api/salesitem/?isList=top10";
        $.ajax({
            type: "post",
            url: uri,
            async: false,
            data: JSON.stringify(jsonStr),
            contentType: "application/json",
            dataType: "json",
            success: function(data) {
              for(var i=0;i<data.length;i++){
                qtyData[i]=data[i].soldQuantity;
                itemLabel[i]=data[i].description;
              }


              if (itemChart != null && itemChart != "" && itemChart != undefined) {
                itemChart.dispose();
              }
                itemChart = echarts.init(document.getElementById('salesBar'));
              option = {
                title:{
                       text:branch,
                       textStyle:{
                          color:'#777777',
                          fontStyle:'normal',
                          fontWeight:'bold',
                          fontFamily:'sans-serif',
                  　　　　 fontSize:25
                },
                subtext:date,
                subtextStyle:{
                   color:'#777777',
                   fontStyle:'normal',
                   fontWeight:'bold',
                   fontFamily:'sans-serif',
           　　　　 fontSize:18
         }
              },
                tooltip: {
                  confine: true,
                  trigger: "item"

                },
                grid: {
                  left:"70",
                  right:"40",
                  show:false

                },
                yAxis: {
                  type: 'category',
                  data: itemLabel,
                  triggerEvent: true,
                  axisLabel: {
                    interval: 0,
                    margin:5,
                    color:"#777777",
                    fontWeight:'bold',
                    fontSize:12,
                    //rotate:40
                    // formatter:function (p,i) {
                    //   return i+1;
                    // }
                    formatter:function (p) {
                      if(p.length>4){
                        var res="";
                        var l=p.length;
                        var h=(l/2).toFixed(0);
                        res=p.substring(0,h)+'\n'+p.substring(h,l);
                        return res;
                      }else{
                        return p;
                      }


                    }
                  },
                  show:true,
                  inverse:true
                },
                xAxis: {
                  //position:'top',
                  type: 'value',
                  show:true,
                  axisLabel:{
                    formatter:function (p) {
                      return "";
                    }
                  },

                  axisLine:{
                            show:false

                          },
                  splitLine: {
                  show: true,
                  lineStyle:{
                       color: ['black'],
                       width: 1,
                      type: 'dotted'
                  }
        }



                },
                series: [{
                  data: qtyData,
                  barWidth:"20",
                  //barCategoryGap:"10",
                  type: 'bar',
                  itemStyle: {
                    normal: {
                      //barBorderRadius:[0, 30, 30, 0],
                      color: 'rgba(77,164,71, 0.8)',
                      barBorderColor: 'rgba(77,164,71）'
                    }
                  },
                  label: {
                    normal: {
                      //align: 'left',
                      color: 'black',
                      fontSize: 12,
                      //textBorderColor: '#333',
                      //textBorderWidth: 2,
                      show: true,
                      position: 'right',

                      // formatter: function(params) {
                      //
                      //   //var res=params.name.split(" ");
                      //   var res=chinesename(params.name);
                      //   //alert(t);
                      //   //var res =turnToMoney("21423423423");
                      //     return res+" : "+params.value;
                      //     //return params.name+" : "+params.value;
                      //       }
                          }
                        }
                }]
              };

              itemChart.setOption(option);
              itemChart.on('click', function(params) {
                showDetail(params.name);

              });
              $(window).on('resize', function() {
                itemChart.resize();
              });



            },


          error: function() {
            console.log('error');
          }

      });


}
function showDetail(params) {
  var branch=$("#bran").val();

  if(branch== undefined){
    branch="Total";
  }

  var uri = "http://www.hpw3.cn/api/salesitem/?isList=top10";
var branchId=$("#bran").find("option:selected").attr("branid");
      var jsonStr2 = {
        "BranchId":branchId,
        "keyword":params,
        "startDateTime":jsonStr.startDateTime,
        "endDateTime": jsonStr.endDateTime
      };
      $.ajax({
          type: "post",
          url: uri,
          async: false,
          data: JSON.stringify(jsonStr2),
          contentType: "application/json",
          dataType: "json",
          success: function(data) {

            // var name=data[0].description.split(" ");
            // $("#itemname").html(name[name.length-1]);

             $("#itemname").html(data[0].description);
            $("#itemcode").html(data[0].itemCode);
            $("#soldamount").html(turnToMoney(data[0].soldAmountIncGst));
            var date;
            if(jsonStr.startDateTime==undefined){
              date="so far";
            }else{
            date=moment(jsonStr.startDateTime).format("DD/MMM")+"-"+moment(jsonStr.endDateTime).subtract(1,"days").format("DD/MMM");
            }
            $("#daterange").html(date);
            var total=data[0].soldAmountIncGst/data[0].soldQuantity;
            $("#averageprice").html(turnToMoney(total.toFixed(2)));
            $("#soldQuantity").html(data[0].soldQuantity);
            $("#itembranch").html(branch);
            $("#profitExcGst").html(turnToMoney(data[0].profitExcGst));
            $("#soldamountExcGST").html(turnToMoney(data[0].soldAmountExcGst));

            },
        error: function() {
          console.log('error');
            }
          });
}
