﻿

function loaddata() {
    //initTable(null, '#itemList');
}

function getCategoryListC(parentId, currentdom, subdom, subcontainer) {

    if (parentId == undefined)
        parentId = '0';
    var uri = "https://localhost:44398/api/category/catList?parentId=" + parentId ;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        if (resp.length == 0) {
            alert('22222');
        }
        else {
            //$(subcontainer).show();
            //$(subdom).find('option').remove().end();
            resp = resp.map(function (item) {
                return {
                    id: item.Id,
                    text: item.Description,
                    parent_id: item.Parent_Id
                }
            });
            console.log(resp);
            $(currentdom).select2({
                placeholder: "Select a Category",
                allowClear: true,
                data: resp,
                tags: true
            })

            $(currentdom).on('select2:select', function (e) {
                // Do something
                $(subdom).empty();
                //$(subcontainer).show();
                //$(subdom).find('option').remove().end();
                alert(e.params.data.id + ' ' + e.params.data.text + '  ' + e.params.data.parent_id);

                getCategoryListC(e.params.data.id, subdom, '', '');

            });
        }
    }
    xhr.send(null);
}

function getCategoryList() {
    var uri = "https://localhost:44398/api/category/list";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        //resp = resp.map(function (item) {
        //    return {
        //        id: item.Id,
        //        text: item.Description,
        //        inc: item.SubCategories
        //    }
        //});

        replaceKeysDeep(resp, {
            Id: 'id',
            Description: 'text',
            SubCategories: 'inc'
        });
        console.log(resp);
        $("#categorylist").select2ToTree({ treeData: { dataArr: resp }, maximumSelectionLength: 3, placeholder: 'Select a category' });
    }
    xhr.send(null);
}

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
});//货币换算

var prefix = "https://localhost:44398/api";
//       console.log(prefix);
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        selectedMulti: false
    },
    check: {
        enable: true
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    edit: {
        enable: true
    },
    callback: {
        beforeRemove: beforeRemove,  //移除前
        beforeRename: beforeRename,   //重命名前
        onRename: onRename,
        onClick: zTreeOnClick //注册节点的点击事件;
    }
};

//add rootnode
function addRoot() {
    var cat = document.getElementById("rootnode").value;
    cat = cat.trim();
    var parentid = 0;

    var uri = prefix + "/category/add";
    var someJsonString = {
        "parent_id": parentid,
        "cat": cat
    };
    if (cat == "") {//判断catalog不为空（其他判断规则在其输入时已经判断） 
        alert("Root catalog cannot be blank！")
        return false;
    }
    else {
        $.ajax({
            url: uri,//相对应的esb接口地址
            type: 'post',
            data: JSON.stringify(someJsonString),//向服务器（接口）传递的参数
            contentType: "application/json",
            dataType: "json",
            success: function (data) {
                var cat = data.cat;
                alert('Category ' + cat + ' added sucessfully!');
//                self.location = 'index.html';
            },
            error: function (data) {
                console.log('error');
            }
        });
    }
};

//添加根节点
$('.addnode').click(function () {
    var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        nodes = zTree.getNodes();
    console.log(nodes)
    var cat = document.getElementById("rootnode").value;
    cat = cat.trim()
    if (cat == '')
    {
        alert("Root catalog cannot be blank！")
        return false;
    }
        
    var name = "New Department" + (newCount++);
    var newNode;
    var parentid = 0;
    var uri = prefix + "/category/add";
    //发送请求保存一个新建的节点，根据返回ID添加新节点
    //var data = {
    //    "code": 0,
    //    "name": name
    //};
    var someJsonString = {
        "parent_id": parentid,
        "cat": cat
    };
    $.ajax({
        type: 'post',
        url: uri,
        data: JSON.stringify(someJsonString),
        timeout: 1000, //超时时间设置，单位毫秒
        dataType: 'json',
        contentType: "application/json",
        success: function (res) {
            console.log(res)
  //        if (res.flag == 0)
            {
                alert('Category ' + cat + ' added sucessfully!');
                var newId = res.id;
                newNode = zTree.addNodes(null, { id: newId, pId: null, name: cat });
 //               zTree.editName(newNode[0]);  //新增后显示编辑状态
            }
        }
        ,
        error: function (data) {
            if (data.status == 400) {
                alert('Sorry, this Category already exists !!!');
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                //setTimeout(function () {
                //    zTree.editName(treeNode)
                //}, 10);
                return false;
            }
        }
    });
});
//add node
function addHoverDom(treeId, treeNode) {
    //          alert(treeNode.id);
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
        return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='Add Node' οnfοcus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    //           alert(111);
    //             判断该部门下是否有人员，用于删除节点时，当节点下有信息，禁止删除。

    //var data1 = {
    //    "id": treeNode.id,
    //    "name": treeNode.name
    //};
    //$.ajax({
    //type: 'POST',
    //url: "",
    //data: data1,
    //timeout: 1000, //超时时间设置，单位毫秒
    //dataType: 'json',
    //    success: function (res) {

    //    var cat = res.cat;
    //    alert('Category '+ cat +' added sucessfully!');
    //    },
    //    error: function (data) {
    //        console.log('error');
    //        }
    //});

    //当点击添加按钮时：
    if (btn) btn.bind("click", function () {
        //               alert(treeNode.level);
        //if (treeNode.level >= 2)
        //    return;
        //                alert(btn.id);
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        //console.log(treeNode.id);
        var name = "New node" + (newCount++);
        var newNode;
        //发送请求保存一个新建的节点，后台返回ID，用返回的ID新增节点
        var data = {
            "parent_id": treeNode.id,
            "cat": name
        };
        $.ajax({
            type: 'post',
            url: prefix + "/category/add",
            data: JSON.stringify(data),
            timeout: 1000, //超时时间设置，单位毫秒
            contentType: "application/json",
            dataType: 'json',
            success: function (data) {
                //alert('111');
                //console.log(data)
                var newId = data.id;
                //alert(newId);
                //在树节点上增加节点
                newNode = zTree.addNodes(treeNode, { id: newId, pId: treeNode.id, name: name });
                zTree.editName(newNode[0]) //新增的节点进入编辑状态
                return false;

                //if (res.flag == 0) {
                //    var newId = res.id;
                //    alert(newId);
                //    //在树节点上增加节点
                //    newNode = zTree.addNodes(treeNode, { id: newId, pId: treeNode.id, name: name });
                //    zTree.editName(newNode[0]) //新增的节点进入编辑状态
                //    return false;
                //}
            }
        });
        return false;
    });
}
function addHoverDom_old(treeId, treeNode) {

    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);

    if (btn) btn.bind("click", function () {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.addNodes(treeNode, { id: (100 + newCount), pId: treeNode.id, name: "new node" + (newCount++) });
        return false;
    });
};

//edit node
function beforeRename(treeId, treeNode, newName) {
    //       alert(treeNode.name + '/' + treeNode.id + '/' + treeNode.level + '/' + treeNode.pId);
    if (newName.length == 0) {
        alert("节点名称不能为空.");
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        setTimeout(function () {
            zTree.editName(treeNode)
        }, 10);
        return false;
    }

    return true;
}

function onRename(event, treeId, treeNode, isCancel) {

    //           return;
    if (isCancel) {
        return;
    }
    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    var onodes = zTree.getNodes()
    console.log(onodes);
    //发送请求修改节点信息
    var data = [
        {
            "op": "replace",
            "path": "/cat",
            "value": treeNode.name,
        }
    ];
    $.ajax({
        type: 'Patch',
        url: prefix + "/category/edit?id=" + treeNode.id,
        data: JSON.stringify(data),
        timeout: 1000, //超时时间设置，单位毫秒
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            alert('Node update sucessfully!');
        },
        error: function (data) {
            if (data.status == 400) {
                alert('Sorry, this Category exists already!!!');
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                setTimeout(function () {
                    zTree.editName(treeNode)
                }, 10);
                return false;
            }
        }
    });
}

//delete node
function beforeRemove(treeId, treeNode) {
    var data = {
        "id": treeNode.id
    };
    //      alert(treeNode.id);
    //className = (className === "dark" ? "" : "dark");

    if (treeNode.isParent) {
        alert('Sorry, this node contains child node(s), cannot delete!');
        return false;
    }
    //if(hasMember){
    //    alert('该部门下有人员，不能删除');
    //    return false;
    //}
    var oFlag = confirm("Delete node -- " + treeNode.name + " ？");
    //            alert(treeNode.id + " , " + treeNode.name);
    if (oFlag) {
        $.ajax({
            type: 'delete',
            url: prefix + "/category/del?id=" + treeNode.id,
            data: data,
            timeout: 1000, //超时时间设置，单位毫秒
            dataType: 'json',
            success: function (res) {

                console.log(res)
                //                  alert('Category "' + res.cat + '" Deleted!!');

            },
            error: function (res) {
                console.log('error');
            }
        });
    }
    else {
        return false
    }
}

//bootstrap datatable
function initTable(data, id) {
    var myTableData;
    myTableData = data;

    var $table = $(id)
    $table.bootstrapTable('destroy').bootstrapTable({
        //height: '100%',
        resizable: true,
        columns: [
            {
                title: 'Item Code',
                field: 'code',
                //               rowspan: 2,
                //colspan:2,
                align: 'center',
                valign: 'middle',
                sortable: true,
            }, {
                title: 'Description',
                field: 'name',
                //               colspan: 3,
                align: 'center',

            },
            //                    ], [
            {
                field: 'description',
                sortable: true,
                //                   formatter: LinkFormatter,
                title: 'category'

            },
            //{
            //    field: 'scat',
            //    sortable: true,
            //    //                   formatter: LinkFormatter,
            //    align: 'center',
            //    title: 'Sub Category'

            //},
            //{
            //    field: 'sscat',
            //    sortable: true,
            //    //                   formatter: LinkFormatter,
            //    align: 'center',
            //    title: 'S Sub Category'

            //},
            {
                field: 'price',
                sortable: true,
                align: 'center',
                title: 'Price',
                formatter: function (value, row, index) {
                    return currencyP(index);
                }
            },
            {
                field: 'cost',
                sortable: true,
                align: 'center',
                title: 'cost',
                formatter: function (value, row, index) {
                    return currencyC(index);
                }
            }
            //, {
            //    field: '',
            //    title: 'Amount'
            //    ,
            //    formatter: function (value, row, index) {
            //        return currency(index);
            //    }
            //}
        ],

        data: myTableData
    });

    //function LinkFormatter(value, row, index) {
    //var invo = myTableData[index].InvoiceNumber;

    //var st = "";
    //st = "<a href=invoice.html?inv="+ invo + " target='_blank'>" + invo + "</a>";
    //return st;

    //}

    //amount to currency format
    function currencyP(index) {
        var amount = myTableData[index].price,
            amount = amount.formatMoney();
        return amount;
    }
    function currencyC(index) {
        var amount = myTableData[index].cost,
            amount = amount.formatMoney();
        return amount;
    }
}
//click event
function zTreeOnClick(event, treeId, treeNode) {
    //if (treeNode.level > 2)
    //    return;
    var id = treeNode.id;
    var cat = treeNode.name;
    var level = treeNode.level;
    $.ajax({
        type: "get",
        url: prefix + "/category/" + id,
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: function (data) {
            initTable(data, '#itemList')
        },
        error: function (data) {
            if (data.status == 401)
                alert('Token Expired!! Redirect to login page!');
            //                   setTimeout("window.location.href='login.html'", 1000);
        }
    });


    //            alert(treeNode.id + ", " + treeNode.name + ", " + treeNode.level );
    //这里根据节点ID获取对应信息或进行对应的操作
}

var zNodes;

//var origin = request.getHeader("Origin");
//if (StringUtils.hasText(origin)) {
//    resp.addHeader("Access-Control-Allow-Origin", origin);
//}
////允许带有cookie访问
//resp.addHeader("Access-Control-Allow-Credentials", "true");
//resp.addHeader("Access-Control-Allow-Methods", "*");

//var headers = request.getHeader("Access-Control-Request-Headers");
//if (StringUtils.hasText(headers)){
//    resp.addHeader("Access-Control-Allow-Headers", headers);
//}
//resp.addHeader("Access-Control-Max-Age", "3600");

function searchUnitTree() {
    $.ajax({
        url: prefix + '/category',
        async: false,
        dataType: 'json',
        success: function (response) {
            zNodes = response;
            console.log(zNodes);
        },
        error: function () {
            alert("Fatal Error！！！")
        }
    });
}
$(document).ready(function () {
    searchUnitTree();
    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
});
var newCount = 1;
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};








