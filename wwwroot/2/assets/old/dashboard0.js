
function showToday(){
  // getTotalSales("today");
  // getTotalProfit("today");
  // getTotalTrans("today");
  // getMargin("today");
  getinfo("today");
  getinfo2("today");
  getBranch("today");

  //loadSidebar();
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
    }
});

  getinfo(val);
  getinfo2(val);
  getBranch(val);
});

$('#branchdatesel a').on('click', function( ev ) {
  ev.preventDefault();
  var val = $(this).data("val"),
    selector = $(this).parent(),
    items = selector.find('a');
  items.removeClass('active');
  $(this).addClass('active');
  $('#meter').liquidMeter('set', 100);
  getinfo2(val);
  getBranch(val);
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
function getinfo2(date){
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
    document.getElementById("tablesales").innerHTML=result1;
    document.getElementById("tableprofit").innerHTML=result2;
    document.getElementById("tabletrans").innerHTML=result3;
    document.getElementById("tableAS").innerHTML="$"+(totalsales/totaltrans).toFixed(2);
  }
  xhr.send(null);
}
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



function getBranch(date) {

  var uri = "http://www.hpw3.cn/api/salesinvoice?period="+date;
  var xhr= new XMLHttpRequest();
  xhr.open("GET", uri, true);
  xhr.onload= function() {
    var resp= JSON.parse(xhr.responseText);
    var branch;
    var margin;
    var total=0;
    var trans=0;
    var profit=0;
    var content="";
    for (var i = 0; i < resp.length; i++) {
      total=total+resp[i].total*1.15;
      trans=trans+resp[i].invoiceQuantity;
      profit=profit+resp[i].profit*1.15;
    }
    for (var i = 0; i < resp.length; i++) {
      branch = resp[i].branchName;
      //$("#salesSelector").append("<option value='"+branch+"'>"+branch+"</option>");
      content=content+"<option value='"+branch+"'trans='"+resp[i].invoiceQuantity+"'sales='"+(resp[i].total*1.15).toFixed(2)+"'profit='"+(resp[i].profit*1.15).toFixed(2)+"'totalsales='"+total+"'>Branch : "+branch+"</option>";
    }
      var prefix="<select class='form-control' id='branchSelector' onchange='getMeter()' ><option value='Total' sales='"+total.toFixed(2)+"'  totalsales='"+total.toFixed(2)+"'  trans='"+trans+"' profit='"+profit.toFixed(2)+"'selected>Total info</option>";
    content=prefix+content+'</select>';
    $('#selectorContainner').html(content);


  }
  xhr.send(null);
}






function getMeter(){

// alert($("#branchSelector").data("margin"));
// var obj=document.getElementsById('');
var sales=$("#branchSelector").find("option:selected").attr("sales");
var totalsales=$("#branchSelector").find("option:selected").attr("totalsales");
var profit=$("#branchSelector").find("option:selected").attr("profit");
var trans=$("#branchSelector").find("option:selected").attr("trans");
var margin=sales/totalsales*100;

$('#meter').liquidMeter('set', margin);
document.getElementById("tablesales").innerHTML=turnToMoney(sales);
document.getElementById("tableprofit").innerHTML=turnToMoney(profit);
document.getElementById("tabletrans").innerHTML=trans;
document.getElementById("tableAS").innerHTML="$"+(sales/trans).toFixed(2);
}
