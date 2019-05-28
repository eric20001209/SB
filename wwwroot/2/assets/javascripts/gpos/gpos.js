$.ajaxSetup({
cache: false
});
$(document).ready(function(){
    $("#sidebar").load("sidebar.html #sidebar-left",function(){
      jQuery.getScript("assets/javascripts/theme.js")});
});
function turnToMoney(num) {
    return "$"+num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

}

function chinesename(str) {
  var strs=str.split(" ");
  var res="";

  for(var i=0;i<strs.length;i++){

    if(/.*[\u4e00-\u9fa5]+.*$/.test(strs[i]))
    {
    res=res+" "+ strs[i];
    }
}
return res;
}
