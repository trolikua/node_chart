(function ($) {
  Drupal.behaviors.node_chart = {
    attach: function(context, settings) {

      if (Drupal.settings.node_chart) {
        var data = Drupal.settings.node_chart.chartData;
        showChartBar (data[0]);
        showChartFewDotted(data[1]);
        showSingleChart(data[2]);
        showSingleChart2(data[3]);
      }
    }
  };

  function showSingleChart2 (data) {
    let chart = c3.generate({
      bindto: '#chart_place4',
      title: {
        text: 'VIEWS Graph (last 30 days)'
      },
      data: {
        json: data,
        x: 'd_field',
        keys: {
          value: ['d_field', 'v_field']
        }
      },
      point: {
        r: 5,
      },
      legend: {
        show: false
      },
      tooltip: {
        format: {
          name: function (name, ratio, id, index) { return 'Views'; }
        }
      },
      axis: {
        x: {
          label: 'Time Axis (last 30 days)',
          type: 'timeseries',
          tick: {
            format: '%m-%d'
          }
        },
        y: {
          label: 'VIEWS',
          tick: {
            format: function (d) {
              return (parseInt(d) == d) ? d : null;
            }
          },
          // padding: {bottom: 0},
        }
      }
    });
  }

  function showSingleChart (simple_data) {

    var _months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    for (var i=0; i < simple_data.length; i++) {
      simple_data[i].m_field = _months[simple_data[i].m_field-1];
    }

    let chart = c3.generate({
      bindto: '#chart_place3',
      title: {
        text: 'VIEWS Graph (12 month)'
      },
      data: {
        json: simple_data,
        x: 'm_field',
        keys: {
          value: ['m_field', 'v_field']
        }
      },
      legend: {
        show: false
      },
      point: {
        r: 5,
      },
      tooltip: {
        format: {
          name: function (name, ratio, id, index) { return 'Views'; }
        }
      },
      axis: {
        x: {
          label: 'Time Axis (last 12 month of the Year)',
          type: 'category',
        },
        y: {
          label: 'VIEWS'
        }
      }
    });
  }

  function showChartFewDotted (newData) {
   function getUniqueVals (array)  {
      var flags = [], output = [], l = array.length, i;
      for( i=0; i<l; i++) {
        if( flags[array[i].a_field]) continue;
        flags[array[i].a_field] = true;
        output.push(array[i].a_field);
      }
      return output;
   }
   var keys = getUniqueVals(newData);

    var result = [];
    newData.forEach(function(e, i) {
      if (!this[e.d_field]) {
        this[e.d_field] = {
          d_field: e.d_field,
          [e.a_field]: e.n_field
        };
        result.push(this[e.d_field]);
      }
      else {
        this[e.d_field][e.a_field] = e.n_field;
      }
    }, {});

    result.forEach(function (value) {
      for (var j=0; j < keys.length; j++) {
        if (!(value.hasOwnProperty(keys[j]))) {
          var currentItem = keys[j];
          value[currentItem] = 0;
        }
      }
    });

    let chart = c3.generate({
      bindto: '#chart_place2',
      title: {
        text: 'ACTIONS Graph (last 30 days)'
      },
      data: {
        json: result,
        labels: true,
        x: 'd_field',
        keys: {
          value: ['d_field', 'web', 'actionlink', 'tel', 'file', 'gps']
        }
      },
      point: {
        r: 5,
      },
      axis: {
        x: {
          show: true,
          type: 'timeseries',
          tick: {
            format: '%m/%d'
          },
          label: 'Time Axis (last 30 days)',
        },
        y: {
          // show: true,
          min: 0,
          tick: {
            format: function (d) {
              return (parseInt(d) == d) ? d : null;
            }
          },
          padding: {bottom: 0},
          label: 'Actions'
        }
      }
    });
  }



  function showChartBar (newData) {
    let unique = {};
    let uniqueA = [];
    let uniqueMonth = [];
    let lastArray = [];

    for (let j in newData) {
      if (typeof(unique[newData[j].a_field]) === "undefined") {

        uniqueA.push(newData[j].a_field);
        if (unique[newData[j].a_field] === '') {
          unique[newData[j].a_field] = 0;
        }
      }
      unique[newData[j].a_field] = 0;
      if (typeof(unique[newData[j].m_field]) === "undefined") {
        uniqueMonth.push(newData[j].m_field);
      }
      unique[newData[j].m_field] = 0;
    }
    ///////////////////////// ALL WORK
    for (let i = 0; i < uniqueA.length; i++) {
      lastArray.push([uniqueA[i]]);
    }

    for (let i = 0; i < lastArray.length; i++) {
      for (let j = 0; j < newData.length; j++) {
        if (lastArray[i][0] === newData[j].a_field) {
          lastArray[i].push(newData[j].n_field);
        }
      }
    }

    let chart = c3.generate({
      title: {
        text: 'ACTIONS Graph (12 month)'
      },
      bindto: '#chart_place1',
      data: {
        columns: lastArray,
        type: 'bar',
        labels: true
      },
      axis: {
        x: {
          show: true,
          type: 'category',
          categories: uniqueMonth,
          label: 'Time Axis (last 12 months of the Year)',
          tick: {
            format: function (x) {
              var _months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
              var index = uniqueMonth[x];
              return _months[index-1];
            }
          }
        },
        y: {
          show: true,
          label: 'Actions',
        }
      }
    });
  }

}(jQuery));