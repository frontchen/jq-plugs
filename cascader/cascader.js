// 级联组件

var mwCascader = function(id) {
  this.id = id;

  this.format = '/'; // 显示格式
  this.disabled = false; // 是否禁用
  this.clearable = false; // 是否可以清空选项
  this.filterable = false; // 是否支持搜索
  this.trigger = 'click'; // 次级菜单展开方式 click 或 hover
  this.placeholder = '请选择'; // 选择框默认文字
  this.labelInValue = false; // 是否全部返回，默认只返回value值
  this.width = 140; // 宽度

  this.data = []; // 级联数据
  this.selections = []; // 展开的值
  this.selected = []; // 选中值

  this.init = function(config) {
    if (config) {
      this.format = config.format || this.format;
      this.disabled = config.disabled || this.disabled;
      this.clearable = config.clearable || this.clearable;
      this.filterable = config.filterable || this.filterable;
      this.trigger = config.trigger || this.trigger;
      this.placeholder = config.placeholder || this.placeholder;
      this.labelInValue = config.labelInValue || this.labelInValue;
      this.width = config.width || this.width;
    }
    this.renderCascader();
  };

  // 选中的值
  this.itemChange = function(selected) {
    var _this = this;
    _this.emit('on-change', selected);
  };

  // 触发下级菜单
  // 参数 上级id和depth
  this.itemClick = function(selected) {
    var _this = this;
    _this.emit('on-disable-child', selected);
  };

  // 滚动到底部事件
  this.listScroll = function() {
    var _this = this;
    _this.emit('on-scroll', {});
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

  this.filter = function(arr, func) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
      if (func(arr[i], i, arr)) {
        res.push(arr[i]);
      }
    }
    return res;
  };

  // 递归拼装数据
  this.getData = function(selections) {
    var _this = this;
    var data = [];
    function getDatas(data, pid, depth) {
      $.each(selections, function(i, v) {
        if (v._pid == pid && v._depth == depth) {
          v._children = [];
          if (v._count > 0) {
            getDatas(v._children, v._id, v._depth + 1);
          }
          data.push(v);
        }
      });
    }
    getDatas(data, 0, 1);
    _this.data = data;
  };

  // 获取当前选中项
  this.getSelected = function(id, depth) {
    var _this = this;
    var item = {};
    $.each(_this.selections, function(i, v) {
        if (v._id == id && v._depth == depth) {
        _this.selected[depth - 1] = v;
        item = v;
      }
    });
    // 删除先前选中的值
    _this.selected.splice(depth - 1, _this.selected.length - depth);
    return item;
  };

  this.renderHead = function() {
    var _this = this;

    var icon =
      '<span class="mw-cascader-arrow glyphicon glyphicon-menu-down"></span><span class="mw-cascader-arrow glyphicon glyphicon-remove-sign"></span>';
    var style = mwUnits.template('style="width:${width}px"', {
      width: _this.width
    });
    var template =
      '<div class="mw-cascader-selection ${disabled}" ${style} data-toggle="dropdown">${selectedValue}${icon}</div>';
    var tempData = {
      disabled: _this.disabled ? 'mw-cascader-disabled' : '',
      style: style,
      selectedValue: '<div><span>' + _this.placeholder + '</span></div>',
      icon: !_this.disabled ? icon : ''
    };
    var head = mwUnits.template(template, tempData);

    return head;
  };

  this.renderDropItem = function(data) {
    var _this = this;

    var dropItem = '';
    $.each(data, function(i, v) {
      var template =
        '<li ${submenu} data-depth="${depth}" data-id="${id}"><a class="dropdown-item" href="#">${label}</a>${sublist}</li>';
      var tempData = {
        submenu: v._count ? 'class="dropdown-submenu"' : '',
        depth: v._depth,
        id: v._id,
        label: v._label,
        sublist: v._count ? _this.renderDrop(v._children) : ''
      };
      dropItem += mwUnits.template(template, tempData);
    });

    return dropItem;
  };

  this.renderChildList = function(item, data) {
    var _this = this;
    if (item._count) {
      // 判断是否当前对象的下级
      if (data.length > 0) {
        if (item._id != data[0]._pid) {
          return false;
        }
      }
      $.each(data, function (i, v) {
          var flg =false
          $.each(_this.selections, function (index, val) {
              if (val._id === v._id && val._depth === v._depth) {
                  flg = true
              }
          })
          if (!flg) {
              _this.selections.push(v);
          }
      });
      var dropItemDom = _this.renderDropItem(data);
      var submenu = $(
        '.dropdown-submenu[data-depth="' +
          item._depth +
          '"][data-id="' +
          item._id +
          '"]',
        '#' + _this.id
      ).children('.dropdown-menu');
      submenu.html(dropItemDom);
      submenu.addClass('show');
    }
  };

  this.renderDrop = function(data) {
    var _this = this;

    var template = '<ul class="dropdown-menu">${dropItem}</ul>';
    var tempData = {
      dropItem: _this.renderDropItem(data)
    };
    var drop = mwUnits.template(template, tempData);

    return drop;
  };

  this.renderCascader = function(data) {
    var _this = this;

    if (data) {
      _this.selections = data;
    } else {
        _this.selections = [];
    }
    _this.getData(_this.selections);

    var template =
      '<div class="mw-cascader dropdown show">${head}${drop}</div>';
    var tempData = {
      head: _this.renderHead(),
      drop: _this.renderDrop(_this.data)
    };
    var cascader = mwUnits.template(template, tempData);

    $('#' + _this.id).html(cascader);

    // 关闭级联下拉框后折叠所有下拉框
    $('#' + _this.id).off().on('hidden.bs.dropdown', function (e) {
      var dropdownMenu = $(this).find('.dropdown-menu');
      if (dropdownMenu.hasClass('show')) {
        dropdownMenu.removeClass('show');
      }
    }).on('show.bs.dropdown', function (e) {
        // 重新打开的时候，清除上次选择的值
        _this.selected = []
    });

    var timer;
    // 点击下拉菜单菜单
    $('li', '#' + _this.id)
      .off()
      .on('click', '.dropdown-item', function(e) {
        // 阻止浏览器继续执行默认行为
        e.preventDefault();
        var element = $(this).parent();

        if (_this.trigger === 'hover') {
          var id = element.attr('data-id');
          var depth = element.attr('data-depth');
          var item = _this.getSelected(id, depth);
          _this.itemChange(_this.selected);
          _this.showValue();
        } else {
          _this.change(element, e);
        }
      })
      .on('mouseover mouseout', '.dropdown-item', function(e) {
        if (_this.trigger === 'hover') {
          if (e.type === 'mouseover') {
            var element = $(this).parent();
            // 性能考虑，加定时器延迟执行
            timer = setTimeout(function() {
              _this.change(element, e);
            }, 600);
          }
          if (e.type === 'mouseout') {
            if (timer) {
              clearTimeout(timer);
            }
          }
        }
      });
  };

  this.showValue = function() {
    var _this = this;
    var valueList = [];
    $.each(_this.selected, function(i, v) {
      valueList.push(v._label);
    });
    var format = mwUnits.template(' ${format} ', {
      format: _this.format
    });
    $('.mw-cascader-selection div span', '#' + _this.id)
      .attr('title', valueList.join(format))
      .addClass('mw-cascader-selected-value')
      .html(valueList.join(format));
  };

  // 展开选中项
  this.change = function(element, event) {
    var _this = this;
    var id = element.attr('data-id');
    var depth = element.attr('data-depth');
    var item = _this.getSelected(id, depth);
    if (element.hasClass('dropdown-submenu')) {
      // 阻止事件冒泡
      event.stopPropagation();
      _this.itemClick(item);
    } else {
      if (_this.trigger === 'click') {
        _this.itemChange(_this.selected);
        _this.showValue();
      }
    }
    _this.toggle(element);
  };

  // 控制下级菜单显示隐藏
  this.toggle = function(element) {
    var dropList = element;
    dropList
      .siblings()
      .find('.dropdown-menu')
      .removeClass('show');
    var dropdownMenu = dropList.find('.dropdown-menu');
    if (dropdownMenu.hasClass('show')) {
      dropdownMenu.removeClass('show');
    } else {
      // dropList.children('.dropdown-menu').addClass('show');
    }
  };
};

// var customerCascader = new mwCascader('customer-cascader');
// customerCascader.init({
//   placeholder: '品名',
//   trigger: 'click'
// });
// function getCascader(depth, cb) {
//   var list;
//   setTimeout(function() {
//      list = [];
//{_label:'测试'+depth, _value: 1, _id:1, _depth:1, _pid:0, _count:0},
//     cb && cb(list);
//   }, 1000);
// }
// customerCascader.on('on-change', function(val) {
//   console.log(['on-change', val]);
// });
// customerCascader.on('on-disable-child', function(val) {
//   console.log(['on-disable-child', val]);
//   getCascader(val._depth + 1, function(data) {
//     customerCascader.renderChildList(val, data);
//   });
// });
// customerCascader.on('on-scroll', function(val) {
//   console.log(['on-scroll', val]);
// });
// getCascader(1, function(data) {
//   customerCascader.renderCascader(data);
// });
