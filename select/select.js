// 下拉组件

var mwSelect = function(id) {
  this.id = id;

  this.multiple = false; // 是否支持多选
  this.disabled = false; // 是否禁用
  this.clearable = false; // 是否可以清空选项，只在单选时有效
  this.filterable = false; // 是否支持搜索
  this.placeholder = '请选择'; // 选择框默认文字
  this.labelInValue = false; // 是否全部返回，默认只返回value值
  this.width = 140; // 宽度

  this.data = []; // 下拉数据
  this.values = ''; // 默认值

  // 禁用状态
  Object.defineProperty(this, 'disable', {
    get: function() {
      return this.disabled;
    },
    set: function(value) {
      this.disabled = value;
      this.renderSelect();
    }
  });
  // 默认值
  Object.defineProperty(this, 'value', {
    get: function() {
      return this.values;
    },
    set: function(value) {
      this.values = value;
      this.renderSelect();
    }
  });

  this.init = function(config) {
    if (config) {
      this.multiple = config.multiple || this.multiple;
      this.disabled = config.disabled || this.disabled;
      this.clearable = config.clearable || this.clearable;
      this.filterable = config.filterable || this.filterable;
      this.placeholder = config.placeholder || this.placeholder;
      this.labelInValue = config.labelInValue || this.labelInValue;
      this.width = config.width || this.width;
    }
    this.renderSelect();
  };

  // 单机选项触发事件
  this.itemClick = function(item) {
    var values = '';
    if (item) {
      values = item;
      if (!this.labelInValue) {
        values = item._value;
      }
    }
    this.emit('on-change', values);
  };

  this.inputChange = function(query) {
    this.emit('on-input-change', query);
  };

  // 滚动到底部触发事件
  this.dropScroll = function() {
    this.emit('on-scroll', {});
  };

  // 如果事件eventName被触发，则执行callback回调函数
  this.on = function(eventName, callback) {
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
  this.emit = function(eventName) {
    if (this.handles) {
      if (this.handles[arguments[0]]) {
        for (var i = 0; i < this.handles[arguments[0]].length; i++) {
          this.handles[arguments[0]][i](arguments[1]);
        }
      }
    }
  };

  this.renderHead = function() {
    var style = 'style="width:' + this.width + 'px"';
    var disabled = '';
    if (!this.disabled) {
      var head =
        '<div class="mw-select-selection" ' +
        style +
        ' data-toggle="dropdown">';
    } else {
      var head =
        '<div class="mw-select-selection mw-select-disabled" ' + style + '>';
      disabled = ' disabled="disabled"';
    }
    var values = '';
    if (this.values) {
      if (this.multiple) {
        // 多选预留
      } else {
        values = this.values;
      }
    }
    if (this.filterable) {
      head +=
        '<input type="text" placeholder="' +
        this.placeholder +
        '" autocomplete="off" spellcheck="false" class="mw-select-input" ' +
        disabled +
        ' value="' +
        values +
        '">';
    } else {
      if (values) {
        head +=
          '<div><span class="mw-select-selected-value">' +
          values +
          '</span></div>';
      } else {
        head += '<div><span>' + this.placeholder + '</span></div>';
      }
    }
    if (!this.disabled) {
      head +=
        '<span class="mw-select-arrow glyphicon glyphicon-menu-down"></span>';
      head +=
        '<span class="mw-select-arrow glyphicon glyphicon-remove-sign"></span>';
    }

    head += '</div>';
    return head;
  };

  this.renderDropItem = function(data) {
    var list = data;
    if (!list || list.length === 0) {
      return '';
    }
    var dropItem = '';
    $.each(list, function(i, v) {
        dropItem += mwUnits.template('<li><a class="dropdown-item"  data-id="${id}" href="#">${label}</a></li>', {id:v._id, label:v._label})
    });
    return dropItem;
  };

  this.renderDrop = function() {
    var drop = '<ul class="dropdown-menu">';
    drop += this.renderDropItem(this.data);
    drop += '</ul>';
    return drop;
  };

  this.renderDropList = function(data) {
    var _this = this;
    $.each(data, function(i, v) {
      _this.data.push(v);
    });
    var dropItemDom = _this.renderDropItem(data);
    $('.dropdown-menu', '#' + id).append(dropItemDom);
  };

  this.renderSelect = function(data) {
      var _this = this;
      _this.data = [];
    var id = _this.id;
    if (data) {
      this.data = data;
    }
    var select = '<div class="mw-select dropdown show">';
    select += this.renderHead();
    select += this.renderDrop();
    select += '</div>';

    $('#' + id).html(select);

    // 点击事件 off()解决委托事件执行多次的问题
    $('.dropdown-menu', '#' + id)
      .off()
      .on('click', '.dropdown-item', function() {
          var _id = $(this).attr('data-id');
          var item = {}
          $.each(_this.data, function (i, v) {
              if (v._id === _id) {
                  item = v
              }
          })
         
        $('.mw-select-selection input', '#' + id).val(item._label);
        $('.mw-select-selection div span', '#' + id)
          .addClass('mw-select-selected-value')
          .html(item._label);

        _this.itemClick(item);
      });

    // 鼠标动作
    $('#' + id)
      .off()
      .on('mouseover mouseout', '.mw-select-selection', function(e) {
        var query = '';
        if (_this.filterable) {
          query = $('input', this).val();
        } else {
          query = $('div span.mw-select-selected-value', this).html();
        }
        if (e.type === 'mouseover') {
          if (query && _this.clearable && !_this.multiple) {
            $('.glyphicon-menu-down', '#' + id).hide();
            $('.glyphicon-remove-sign', '#' + id).show();
          }
        } else {
          $('.glyphicon-menu-down', '#' + id).show();
          $('.glyphicon-remove-sign', '#' + id).hide();
        }
      });

    // 清除记录
    $('.mw-select-selection span.glyphicon-remove-sign', '#' + id).on(
      'click',
      function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (_this.filterable) {
          $('.mw-select-selection input', '#' + id).val('');
        } else {
          $('.mw-select-selection div span', '#' + id)
            .removeClass('mw-select-selected-value')
            .html(_this.placeholder);
        }
        $('.glyphicon-menu-down', '#' + id).show();
        $('.glyphicon-remove-sign', '#' + id).hide();
        _this.itemClick('');
      }
    );

    // input change事件
    $('.mw-select-selection', '#' + id)
      .off()
      .on('input', 'input', function() {
        var query = $(this).val().trim();
        if (query && _this.clearable && !_this.multiple) {
          $('.glyphicon-menu-down', '#' + id).hide();
          $('.glyphicon-remove-sign', '#' + id).show();
        } else {
          $('.glyphicon-menu-down', '#' + id).show();
          $('.glyphicon-remove-sign', '#' + id).hide();
        }
        _this.inputChange(query);
      });

    // 滚动事件
    $('.dropdown-menu', '#' + id).scroll(function() {
      // 下来框可视高度
      var visibleHeight = $(this).prop('clientHeight');
      // 滚动条当前位置
      var scrollTop = $(this).prop('scrollTop');
      // 文档高度
      var scrollHeight = $(this).prop('scrollHeight');

      // console.log([scrollTop, visibleHeight, scrollHeight]);

      // 滚动到底部了
      if (scrollTop + visibleHeight >= scrollHeight) {
        _this.dropScroll();
      }
    });
  };
};

// var customerSelect = new mwSelect('customer-select')
//     customerSelect.init({
//         placeholder: '客户名称',
//         filterable: false,
//         labelInValue: true
//     })
//     var customerParams = {
//         url: webConfigs.webApiPath() + "Customer/GetCustomerInfoByPage",
//         data: {
//             iData: JSON.stringify({iPageIndex: pageIndex})
//         }
//     }
// customerSelect.disable = false
// customerSelect.value = 2
//     customerSelect.on('on-change', function(val){
//         console.log(val)
//     })
// customerSelect.on('on-input-change', function(query) {
//   console.log(query);
// });
//     customerSelect.on('on-scroll', function(){
//         console.log('on-scroll')
//         customerSelect.renderDropList(data)
//     })

//     mwUnits.getData(customerParams).then(
//         function(res) {
//             // console.log(['data', res]);
//             if(res){
//                 var data = JSON.parse(res.Data)
//                 $.each(data, function(i, v){
//                     v.label = v.CustomerName
//                     v.value = v.CustomerId
//                 })
//                 customerSelect.renderSelect(data)
//             }
//         },
//         function(err) {
//             console.log(['err', err]);
//         }
//     );
