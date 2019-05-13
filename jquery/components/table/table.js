// 列表组件
/*

  columns: [
    {title: '', key: '', width:''}
  ]
  data: []
 
 */

var mwTable = function(id) {
  this.id = id;
  // 初始化
  this.init = function(columns) {
    this.id = id;
    this.columns = columns;
    return this.renderTable();
  };

  // 渲染表头
  this.renderHeader = function(headRows) {
    var header =
      '<div class="mw-table-header"><table cellspacing="0" cellpadding="0" border="0"><thead><tr>';
    $.each(headRows, function(i, v) {
      header +=
        '<th><div class="mw-table-cell"><span>' + v.title + '</span></div>';
    });
    header += '</tr></thead></table></div>';
    return header;
  };

  // 渲染行
  this.renderTr = function(td) {
    var tr = '<tr class="mw-table-row">' + td + '</tr>';
    return tr;
  };

  // 渲染内容
  this.renderBody = function(data) {
    var _this = this;
    var body =
      '<div class="mw-table-body"><table cellspacing="0" cellpadding="0" border="0"><tbody class="mw-table-tbody">';
    $.each(data, function(i, v) {
      var td = '';
      $.each(v, function(index, val) {
        td +=
          '<td><div class="mw-table-cell"><span>' + val + '</span></div></td>';
      });
      body += _this.renderTr(td);
    });
    body += '</tbody></table></div>';
    return body;
  };

  // 渲染表格
  this.renderTable = function(data) {
    var id = this.id;
    var columns = this.columns;
    if (!id) {
      return false;
    }
    if (!columns) {
      return $('#' + id).html('init fail!');
    }
    var list = [];
    if (data) {
      list = new Array(data.length);
      $.each(data, function(i, v) {
        list[i] = {};
        $.each(columns, function(index, val) {
          if (val.render) {
            list[i].render = val.render({ row: v, index: i });
          } else {
            if (val.key) {
              list[i][val.key] = v[val.key] || '';
            }
          }
        });
      });
    }
    var header = this.renderHeader(columns);
    var body = this.renderBody(list);
    var table =
      '<div class="mw-table-wrapper"><div class="mw-table">' +
      header +
      body +
      '</div></div>';
    return $('#' + id).html(table);
  };
};
