var saleschart, profitchart, transchart;

  $('#datepicker').datepicker({
    format: 'dd/mm/yyyy'
  });

  function loaddata() {
    getBranch2();
    drawBar();
    $(".bartitle").html("Total");
  }

  function getBranch2() {
    var uri = "https://localhost:44367/api/branches";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", uri, true);
    xhr.onload = function() {
      var resp = JSON.parse(xhr.responseText);
      var branch = '';
      var content = "";
      for (var i = 0; i < resp.length; i++) {
        branch = resp[i].Name;
        content = content + "<option value='" + branch + "'  branid='"+resp[i].id+"'>" + branch + "</option>";
      }
      $('#bran').append(content);
    }
    xhr.send(null);
  }

$("#datepicker").val(moment().format('DD/MM/YYYY'));

  function getsales(branch, day_param) {
    var odate = $("#datepicker").val();
    var startdate = moment(odate, 'DD/MM/YYYY').subtract(day_param, "days");
    var enddate = moment(odate, 'DD/MM/YYYY').add(1, 'days');
    var branchId=$("#bran").find("option:selected").attr("branid");
    var data1;
    var uri = "https://www.hpw3.cn/api/salesinvoice/?isList=byDate";
    var total = 0;
    var profit = 0;
    var salesData = [];
    var profitData = [];
    var transData = [];
    var barLabel = [];
    var datetemp = [];
    var someJsonString = {
      "branchId": branchId,
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
        for (var j = 0; j < data.length; j++) {
          barLabel[j] = moment(data[j].startDateTime).format("DD MMM YYYY");
          salesData[j] = (data[j].total * 1.15).toFixed(2);
          profitData[j] = (data[j].profit * 1.15).toFixed(2);
          transData[j] = data[j].invoiceQuantity;
        }
        data1 = {
          Label: barLabel,
          Sales: salesData,
          Profit: profitData,
          Trans: transData
        }
      },
      error: function() {
        console.log('error');
      }

    });
    return data1
  }

  function draw30Bar() {
    var branch = $("#bran").find("option:selected").val();
    if (branch == undefined) {
      branch = "Total";
    }
    //  var saleschart,profitchart,transchart;
    var barData = getsales(branch, 30);


    if (saleschart != null && saleschart != "" && saleschart != undefined) {
      saleschart.dispose();
    }
    if (profitchart != null && profitchart != "" && profitchart != undefined) {
      profitchart.dispose();
    }
    if (transchart != null && transchart != "" && transchart != undefined) {
      transchart.dispose();
    }

    profitchart = echarts.init(document.getElementById('profitBar'));
    transchart = echarts.init(document.getElementById('transBar'));
      saleschart = echarts.init(document.getElementById('salesBar'));

    option = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "axis",
        formatter: function(p) {
          var result = p[0].marker + moment(p[0].name).format("DD/MMM") + "(" + moment(p[0].name).format('dddd') + ")" + " : " + turnToMoney(p[0].data);
          return result;
        }
      },

      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',

        data: barData.Label,
        axisLabel: {
          interval: 4,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Sales,
        triggerEvent: true,
        type: 'line',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    option2 = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "axis",
        formatter: function(p) {
          var result = p[0].marker + moment(p[0].name).format("DD/MMM") + "(" + moment(p[0].name).format('dddd') + ")" + " : " + turnToMoney(p[0].data);
          return result;
        }
      },
      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',
        data: barData.Label,
        triggerEvent: true,
        axisLabel: {
          interval: 4,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Profit,
        type: 'line',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.5)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    option3 = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "axis",
        formatter: function(p) {

          var result = p[0].marker + moment(p[0].name).format("DD/MMM") + "(" + moment(p[0].name).format('dddd') + ")" + " : " + p[0].data;

          return result;
        }
      },

      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',
        data: barData.Label,
        triggerEvent: true,
        axisLabel: {
          interval: 4,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Trans,
        type: 'line',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    saleschart.setOption(option);
    profitchart.setOption(option2);
    transchart.setOption(option3);
    saleschart.on('click', function(params) {
      showAll(params);
    });
  profitchart.on('click', function(params) {
        showAll(params);
      });
      transchart.on('click', function(params) {
          showAll(params);
        });
    $(window).on('resize', function() {
      saleschart.resize();
      profitchart.resize();
      transchart.resize();
    });

  }

  function drawBar() {
    var branch = $("#bran").find("option:selected").val();
    if (branch == undefined) {
      branch = "Total";
    }
    //  var saleschart,profitchart,transchart;
    var barData = getsales(branch, 6);
    if (saleschart != null && saleschart != "" && saleschart != undefined) {
      saleschart.dispose();
    }
    if (profitchart != null && profitchart != "" && profitchart != undefined) {
      profitchart.dispose();
    }
    if (transchart != null && transchart != "" && transchart != undefined) {
      transchart.dispose();
    }
    saleschart = echarts.init(document.getElementById('salesBar'));
    profitchart = echarts.init(document.getElementById('profitBar'));
    transchart = echarts.init(document.getElementById('transBar'));
    option = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "item",
        formatter: function(p) {
          var result = p.marker + moment(p.name).format("DD/MMM") + "(" + moment(p.name).format('dddd') + ")" + " : " + turnToMoney(p.data);

          return result;
        }
      },
      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',
        data: barData.Label,
        triggerEvent: true,
        axisLabel: {
          interval: 0,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Sales,
        barWidth:30,
        type: 'bar',
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    option2 = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "item",
        formatter: function(p) {
          var result = p.marker + moment(p.name).format("DD/MMM") + "(" + moment(p.name).format('dddd') + ")" + " : " + turnToMoney(p.data);

          return result;
        }
      },

      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',
        data: barData.Label,
        triggerEvent: true,
        axisLabel: {
          interval: 0,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Profit,
        type: 'bar',
        barWidth:30,
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    option3 = {
      title: {
        text: branch.replace("Auckland", ""),
        x: 'center'
      },
      tooltip: {
        confine: true,
        trigger: "item",
        formatter: function(p) {
          var result = p.marker + moment(p.name).format("DD/MMM") + "(" + moment(p.name).format('dddd') + ")" + " : " + p.data;

          return result;
        }
      },

      grid: {
        x: 50
      },
      xAxis: {
        type: 'category',
        triggerEvent: true,
        data: barData.Label,
        axisLabel: {
          interval: 0,
          rotate: 40,
          formatter: function(p) {
            var res = moment(p).format("DD/MMM");
            return res;
          }
        }

      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: barData.Trans,
        type: 'bar',
        barWidth:30,
        itemStyle: {
          normal: {
            color: 'rgba(140,201,232, 0.8)',
            barBorderColor: 'rgba(140,201,232)'
          }
        },
        label: {
          normal: {
            show: false,
            position: 'top',
            color: "blue",
            formatter: function(params) {
              if (params.value > 0) {
                return turnToMoney(params.value);
              } else {
                return '';
              }
            }
          }
        }
      }]
    };
    saleschart.setOption(option);
    saleschart.on('click', function(params) {
      showAll(params);
    });
  profitchart.on('click', function(params) {
        showAll(params);
      });
      transchart.on('click', function(params) {
          showAll(params);
        });
    profitchart.setOption(option2);
    transchart.setOption(option3);
    $(window).on('resize', function() {
      saleschart.resize();
      profitchart.resize();
      transchart.resize();
    });

  }

  function showAll(row) {
    var branch = $("#bran").val();
    if (branch == undefined) {
      branch = "Total";
    }
    var branchId=$("#bran").find("option:selected").attr("branid");
    var uri = "http://www.hpw3.cn/api/salesinvoice/?isList=byDate";
    var enddate = moment(row.name).add(1, 'days');
    var someJsonString = {
      "BranchId": branchId,
      "startDateTime": moment(row.name).format('YYYY-MM-DD'),
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
        var date = moment(row.name).format("DD/MMM") + "(" + moment(row.name).format("ddd") + ")";
        var sales = turnToMoney((data[0].total * 1.15).toFixed(2));
        var profit = turnToMoney((data[0].profit * 1.15).toFixed(2));
        var trans = data[0].invoiceQuantity;
        var as = turnToMoney((data[0].total / data[0].invoiceQuantity).toFixed(2));
        var margin =  ((data[0].profit / data[0].total).toFixed(2) * 100).toFixed(2)+"%";
        $(".detail_date").html(date);
        $(".detail_sales").html(sales);
        $(".detail_profit").html(profit);
        $(".detail_trans").html(trans);
        $(".detail_as").html(as);
        $(".detail_margin").html(margin);
      },
      error: function() {
        console.log('error');
      }
    });

  }
