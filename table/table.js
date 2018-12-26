// 列表组件
/*

  columns: [
    {title: '', key: '', width:''}
  ]
  data: []
 
 */

var mwTable = function (id) {
    this.id = id;
    this.data = [];

    // 初始化
    this.init = function (columns) {
        this.id = id;
        this.columns = columns;
        return this.renderTable();
    };

    this.trClick = function (index) {
        var _this = this;
        _this.emit('on-tr-click', { row: _this.data[index], index: index })
    }
    // 如果事件eventName被触发，则执行callback回调函数
    this.on = function (eventName, callback) {

        if (!this.handles) {
            // this.handles = {};
            Object.defineProperty(this, 'handles', {
                value: {},
                enumerable: false,
                configurable: true,
                writable: true
            });
        }
        if (!this.handles[eventName]) {
            this.handles[eventName] = [];
        }
        this.handles[eventName].push(callback);
    };

    // 触发事件 eventName
    this.emit = function (eventName) {
        if (this.handles) {
            if (this.handles[arguments[0]]) {
                for (var i = 0; i < this.handles[arguments[0]].length; i++) {
                    this.handles[arguments[0]][i](arguments[1]);
                }
            }
        }
    };

    this.renderColgroup = function (columns) {
        var colgroup = '<colgroup>'
        $.each(columns, function (i, v) {
            var width = ''
            if (v.width) {
                width = ' width="' + v.width + '"'
            }
            colgroup += '<col' + width + '></col>'
        })
        colgroup += '</colgroup>'
        return colgroup
    }


    // 渲染表头
    this.renderHeader = function (headRows) {
        var colgroup = this.renderColgroup(headRows)
        var header =
          '<div class="mw-table-header"><table cellspacing="0" cellpadding="0" border="0">' + colgroup + '<thead><tr>';
        $.each(headRows, function (i, v) {
            header +=
              '<th><div class="mw-table-cell"><span>' + v.title + '</span></div>';
        });
        header += '</tr></thead></table></div>';
        return header;
    };

    // 渲染行
    this.renderTr = function (td, index) {
        var id=this.id;
        var tr = '<tr class="mw-table-row '+id+index+'" id="' + index + '">' + td + '</tr>';
        return tr;
    };

    // 渲染内容
    this.renderBody = function (data) {
        var _this = this;
        var colgroup = _this.renderColgroup(_this.columns)
        var body =
          '<div class="mw-table-body"><table  cellspacing="0" cellpadding="0" border="0">' + colgroup + '<tbody class="mw-table-tbody">';
        $.each(data, function (i, v) {
            var td = '';

            $.each(v, function (index, val) {
                var renderVal = val
                if (index.indexOf('render') === -1) {
                    renderVal = '<span>' + val || '' + '</span>'
                }
                td +=
                '<td><div class="mw-table-cell">' + renderVal + '</div></td>';

            });
            body += _this.renderTr(td, i);
        });
        body += '</tbody></table></div>';
        return body;
    };

    // 渲染表格
    this.renderTable = function (data) {
        var _this = this
        var id = _this.id;
        var columns = _this.columns;
        this.data = data || [];
        if (!id) {
            console.log('init fail!');
            return false;
        }

        if (!columns) {
            return $('#' + id).html('init fail!');
        }
        var list = [];

        if (data) {

            list = new Array(data.length);
            $.each(data, function (i, v) {
                list[i] = {};
                $.each(columns, function (index, val) {
                    if (val.render) {
                        list[i]['render' + index] = val.render({ row: v, index: i });
                    } else {
                        if (val.key) {
                            list[i][val.key] = v[val.key] || '';
                        }
                    }
                });
            });

        }
        //console.log(list);
        var header = this.renderHeader(columns);
        var body = this.renderBody(list);
        var table =
          '<div class="mw-table-wrapper"><div class="mw-table">' +
          header +
          body +
          '</div></div>';
        $('#' + id).html(table);

        $('.mw-table-row', '#' + id).on('click', function (e) {
           
            var index = $(this).attr('id')
            _this.trClick(index);
            $(this).css("background",'')
            //console.log('tr');
            //e.stopPropagation();
            //e.preventDefault();
            
        });
    };
};

//var columns = [
//      {
//          title: '时间', key: 'RegDate', width: '120',
//          render: function (params) {
//              return '<div>' + params.row.BrandName + '</div>'
//          }
//      },
//      { title: '政策编号', key: 'BasePolicyName' },
//      { title: '客户信息', key: 'CustomerName' },
//      { title: '商品信息', key: 'BrandName' },
//      { title: '区域', key: 'ZoneLstName' }
//]

//var table1 = new mwTable('mw-table-list')
//table1.init(columns)

//var params = {
//    url: webConfigs.webApiPath() + "BasePolicy/GeBasePolicyByPage",
//    data: {
//        iData: JSON.stringify({
//            iPageIndex: pageIndex,
//            Type: 1,
//            Status: "",
//            IsValid: 0,
//            // CustomerId: SupplierIds,
//            // ClassId: ClassIdtts, 
//            // BrandId: tbrandt,
//            // StartDate: START_DATE, 
//            // EndDate: END_DATE,
//        })
//    }
//}
//mwUnits.getData(params).then(
//    function (res) {
//        console.log(['data', res]);
//        if (res) {
//            let data = JSON.parse(res.Data)
//            table1.renderTable(data)
//        }
//    },
//    function (err) {
//        console.log(['err', err]);
//    }
//);