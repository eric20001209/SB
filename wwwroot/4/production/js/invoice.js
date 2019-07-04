$(function () {
    ///货币符号转换
    // Extend the default Number object with a formatMoney() method:
    // usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
    // defaults: (2, "$", ",", ".")
    Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
        places = !isNaN(places = Math.abs(places)) ? places : 2;
        symbol = symbol !== undefined ? symbol : "$";
        thousand = thousand || ",";
        decimal = decimal || ".";
        var number = this,
            negative = number < 0 ? "-" : "",
            i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
    };

    // Default usage and custom precision/symbol :
    var revenue = 12345678;
    //alert(revenue.formatMoney()); // $12,345,678.00
    //alert(revenue.formatMoney(0, "HK$ ")); // HK$ 12,345,678

    // European formatting:
    var price = 4999.99;
    //alert(price.formatMoney(2, "€", ".", ",")); // €4.999,99

    // It works for negative values, too:
    //alert((-500000).formatMoney(0, "£ ")); // £ -500,000

    var price = (12345.99).formatMoney(); // "$12,345.99"

    // Remove non-numeric chars (except decimal point/minus sign):
    //priceVal = parseFloat(price.replace(/[^0-9-.]/g, '')); // 12345.99
});//Currency


//bind print function to button
$(document).on("click", "#windowprint", function () {

    document.getElementById("printArea").style.width = '21cm';
    //go to top of the screen, if not do this, it will result layout issue.
    $('body,html').animate({ scrollTop: 0 }, 0);
    //generate img 
    html2canvas($("#printArea")[0], { scale: 2, logging: false, useCORS: true }).then(function (canvas) {
        var myImage = canvas.toDataURL("image/png");
        //after generating pic call print function
        $("#printContainer")
            .html("<img id='Image' src=" + myImage + " style='width:100%;'></img>")
        $("#Image").print({
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: null,
            doctype: '<!doctype html>'
        });
    });
    document.getElementById("printArea").style.width = '100%';
}); 


$("#convertToPDF").on("click", function () {
    document.getElementById("printArea").style.width = '21cm';
    //go to top of the screen, if not do this, it will result layout issue.
    $('body,html').animate({ scrollTop: 0 }, 0);
    //generate img 
    html2canvas($("#printArea")[0], { scale: 2, logging: false, useCORS: true }).then(function (canvas) {
        var myImage = canvas.toDataURL("image/png");
        //after generating pic call print function
        $("#printContainer")
            .html("<img id='Image' src=" + myImage + " style='width:100%;'></img>")
        $("#Image").print({
            globalStyles: true,
            mediaPrint: false,
            stylesheet: null,
            noPrintSelector: ".no-print",
            iframe: true,
            append: null,
            prepend: null,
            manuallyCopyFormValues: true,
            deferred: $.Deferred(),
            timeout: 750,
            title: null,
            doctype: '<!doctype html>'
        });
    });
    document.getElementById("printArea").style.width = '100%';
});


function loaddata() {
    getData();
}
function getData() {

    var invoiceNumber = "";
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?") 
    str = str.substr(num + 1);
    var arr = str.split("&"); //各个参数放到数组里

    num = arr[0].indexOf("=");
    if (num > 0) {
        name = arr[0].substring(0, num);
        value = arr[0].substr(num + 1);
        //alert(value);
        invoiceNumber = value;
    }

    var commitdate;
    var tax;
    var dtax = 0;
    var subtotal = 0;
    var total = 0;

    var uri = prefix + "/salesinvoice";
    uri += "?invoice_number=" + invoiceNumber;
    //alert(uri);

    $.ajax({
        type: "get",
        url: uri,
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            //alert(JSON.stringify(data));
            //alert(JSON.parse(data));
            commitdate = moment(data.commit_date);
            commitdate = commitdate.format('DD-MM-YYYY');
            dtax = data.tax;
            tax = data.tax.formatMoney();
            total = data.total;
            $('#date').html(commitdate);
            $('#invoicenumber').html('Inv No.  #' + invoiceNumber);

            var sti;
            for (var i = 0; i < data.sales_items.length; i++)
            {
                sti += "<tr>";
                sti += "<td>" + data.sales_items[i].qty + "</td>";
                sti += "<td>" + data.sales_items[i].code + "</td>";
                sti += "<td></td>";
                sti += "<td>" + data.sales_items[i].name + "</td>";
                sti += "<td>" + data.sales_items[i].sales_total.formatMoney() + "</td>";
                //alert(i);
                sti += "</tr>";
            
                subtotal += data.sales_items[i].sales_total;
                //alert(subtotal);
            }
            $('#itemlist').html(sti);
            $('#subtotal').html(subtotal.formatMoney());
            $('#tax').html(tax);
            $('#total').html(total.formatMoney());
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
                setTimeout("window.location.href='login.html'", 1000);
            //    $("#showloginModal").click();
        }
    });
}




