// 级联组件

var mwCascader = function(id) {
  this.id = id;
  this.prefixCls = 'mw-cascader';

  this.format = ' / '; // 显示格式
  this.disabled = false; // 是否禁用
  this.clearable = false; // 是否可以清空选项
  this.filterable = false; // 是否支持搜索
  this.trigger = 'click'; // 次级菜单展开方式 click 或 hover
  this.placeholder = '请选择'; // 选择框默认文字
  this.labelInValue = false; // 是否全部返回，默认只返回value值
  this.changeOnSelect = false; // 点击每级值都发生变化
  this.isCascader = false; // 是否是级联数据
  this.width = 140; // 宽度

  this.data = []; // 级联数据
  this.tmpSelected = []; //临时选中的值
  this.selected = []; // 选中值

  // 初始化组件配置
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
      this.changeOnSelect = config.changeOnSelect || this.changeOnSelect;
      this.isCascader = config.isCascader || this.isCascader;
    }
    // 可以选择大类时的菜单触发方式
    if (this.changeOnSelect) {
      this.trigger = 'hover';
    }
    this.renderCascader();
  };

  // 禁用状态
  Object.defineProperty(this, 'disable', {
    get: function() {
      return this.disabled;
    },
    set: function(value) {
      this.disabled = value;
      this.renderCascader();
    }
  });

  // 默认值
  Object.defineProperty(this, 'value', {
    get: function() {
      return this.selected;
    },
    set: function(value) {
      this.tmpSelected = value;
      this.selected = value;
      this.renderCascader();
    }
  });

  // 返回选中的值
  this.itemChange = function() {
    var _this = this;
    _this.emit('on-change', _this.selected);
  };

  // 清除按钮事件
  this.itemClear = function() {
    this.emit('on-clear', '');
  };

  // 触发下级菜单【参数 上级id和depth】
  this.itemClick = function(selected) {
    var _this = this;
    _this.emit('on-disable-child', selected);
  };

  // 滚动到底部事件
  this.listScroll = function(element) {
    var _this = this;
    var item = JSON.parse(JSON.stringify(_this.tmpSelected));
    if (_this.trigger === 'hover') {
      item.splice(-1, 1);
    }
    var depth = 1;
    if (item.length) {
      var lastItem = item[item.length - 1];
      depth = lastItem._depth + 1;
    }
    _this.emit('on-scroll', { element, depth });
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

  // filter es5实现方式
  this.filter = function(arr, func) {
    var res = [];
    for (var i = 0; i < arr.length; i++) {
      if (func(arr[i], i, arr)) {
        res.push(arr[i]);
      }
    }
    return res;
  };

  // 递归拼装数据【非级联模式】
  this.setCascaderData = function(item, list) {
    var _this = this;
    function setData(casData) {
      $.each(casData, function(i, v) {
        if (
          v._id === item._id &&
          v._pid === item._pid &&
          v._depth === item._depth
        ) {
          v._children = list;
          return false;
        } else {
          if (v._children && v._children.length) {
            setData(v._children);
          }
        }
      });
    }
    setData(_this.data);
  };

  // 获取当前选中项【id、pid、depth 确定唯一一条数据】
  this.getSelected = function(id, pid, depth) {
    var _this = this;
    var item = '';
    // 递归查找数据
    function querySelected(list) {
      if (item) {
        return false;
      }
      $.each(list, function(i, v) {
        if (v._id + '' == id && v._pid + '' === pid && v._depth === depth * 1) {
          item = v;
          _this.tmpSelected[depth - 1] = v;
          return false;
        } else {
          querySelected(v._children);
        }
      });
    }
    querySelected(_this.data);
    // 删除先前选中下级元素的值
    _this.tmpSelected.splice(depth, _this.tmpSelected.length - depth);
    return item;
  };

  // 格式化初始数据
  this.formatData = function(list) {
    var _this = this;
    if (!_this.data.length) {
      var caslist = JSON.parse(JSON.stringify(list || []));
      _this.data = caslist;
    }
  };

  // 返回选中的显示值
  this.showLabel = function() {
    var _this = this;
    var labels = [];
    $.each(_this.selected, function(i, v) {
      labels.push(v._label);
    });
    return labels.join(_this.format);
  };

  // 渲染显示框
  this.renderHead = function() {
    var _this = this;
    // 初始化显示
    var holdSpan = mwUnits.template('<span>${selectedValue}</span>', {
      selectedValue: _this.placeholder
    });
    // 选择后的显示
    var selectedSpan = mwUnits.template(
      '<span title="${selectedValue}" class="mw-cascader-selected-value">${selectedValue}</span>',
      {
        selectedValue: _this.showLabel()
      }
    );
    var icon =
      '<span class="mw-cascader-arrow glyphicon glyphicon-menu-down"></span>';
    var template =
      '<div class="mw-cascader-selection ${disabled}" style="width:${width}px" data-toggle="${toggle}"><div>${span}</div>${icon}</div>';
    var tempData = {
      toggle: !_this.disabled ? 'dropdown' : '',
      disabled: _this.disabled ? 'mw-cascader-disabled' : '',
      width: _this.width,
      span: _this.selected.length ? selectedSpan : holdSpan,
      icon: !_this.disabled ? icon : ''
    };
    var head = mwUnits.template(template, tempData);

    return head;
  };

  // 渲染某一行数据
  this.casItem = function(item) {
    var _this = this;

    var template =
      '<li class="${prefixCls}-menu-item ${active} ${disabled}" data-id="${id}" data-pid="${pid}" data-depth="${depth}">${label}${arrow}${loading}</li>';
    // 是否有下级
    var arrow =
      ((item._children || []).length || item._count) && !item._loading
        ? '<i class="glyphicon glyphicon-menu-right"></i>'
        : '';
    // 是否正在加载中
    var loading = item._loading
      ? '<i class="glyphicon glyphicon-repeat"></i>'
      : '';
    var tempData = {
      prefixCls: _this.prefixCls,
      active: item._checked ? _this.prefixCls + '-menu-item-active' : '',
      disabled: item._disabled ? _this.prefixCls + '-menu-item-disabled' : '',
      id: item._id,
      pid: item._pid,
      depth: item._depth,
      label: item._label,
      arrow,
      loading
    };
    return mwUnits.template(template, tempData);
  };

  // 渲染下拉菜单
  this.casPanel = function(data) {
    var _this = this;
    // 无数据时直接返回
    if (!data) {
      return false;
    }
    var dropItem = [];
    $.each(data, function(i, v) {
      dropItem.push(_this.casItem(v));
    });
    var template = '<span><ul class="mw-cascader-menu">${casItem}</ul></span>';
    var tempData = {
      casItem: dropItem.join('')
    };
    return mwUnits.template(template, tempData);
  };

  // 滚动底部加载更多
  this.renderList = function(element, data) {
    var _this = this;
    if (!data || !data.length) {
      return false;
    }
    // 渲染当前选项的列表数据
    var dropItem = [];
    $.each(data, function(i, v) {
      dropItem.push(_this.casItem(v));
    });
    element.append(dropItem.join(''));
  };

  // 动态加载下级菜单【预留】
  this.renderChildList = function(item, data) {
    var _this = this;
    if (item._count) {
      // 判断是否当前对象的下级
      if (data.length) {
        if (item._id != data[0]._pid) {
          return false;
        }
      }
      // 替换级联数据节点，重新渲染下拉菜单dom
      _this.setCascaderData(item, data);
      var elementStr = mwUnits.template(
        'li[data-depth="${depth}"][data-id="${id}"][data-pid="${pid}"]',
        {
          depth: item._depth,
          id: item._id,
          pid: item._pid
        }
      );
      var element = $(elementStr, '#' + _this.id);
      // 移除已存在的下级结构
      element
        .parent()
        .siblings('span')
        .remove();
      var childDom;
      // 渲染当前选项的下级结构
      if (item._children && item._children.length) {
        // 存在下级结构
        childDom = _this.casPanel(item._children);
      } else {
        childDom = _this.casPanel(data);
      }
      // 新增新的下级结构
      element.parent().after(childDom);
      // 移除正在加载图标
      if (!_this.isCascader) {
        element
          .find('.glyphicon')
          .removeClass('glyphicon-repeat')
          .addClass('glyphicon-menu-right');
      }
    }
  };

  // 初始化渲染
  this.renderCascader = function(data) {
    var _this = this;
    _this.formatData(data);

    var template =
      '<div class="mw-cascader dropdown">${head}<div class="dropdown-menu">${drop}</div></div>';
    var tempData = {
      head: _this.renderHead(),
      drop: _this.casPanel(_this.data)
    };
    var cascader = mwUnits.template(template, tempData);

    $('#' + _this.id).html(cascader);

    var timer;

    $('#' + _this.id)
      .off()
      .on('click', 'li', function(e) {
        // 点击下拉菜单中的某项
        // 阻止浏览器继续执行默认行为
        e.preventDefault();
        var element = $(this);
        _this.change(element, e);
      })
      .on('mouseover mouseout', 'li', function(e) {
        // 移动鼠标到下拉菜单中的某项
        var element = $(this);
        if (_this.trigger === 'hover') {
          if (e.type === 'mouseover') {
            // 性能考虑，加定时器延迟执行
            timer = setTimeout(function() {
              _this.change(element, e);
            }, 300);
          }
          if (e.type === 'mouseout') {
            if (timer) {
              clearTimeout(timer);
            }
          }
        }
      })
      .on('mouseover mouseout', '.mw-cascader-selection', function(e) {
        // 表头移动标识
        var query = $('.mw-cascader-selected-value', this).html();
        var glyphicon = $('.glyphicon', this);
        if (e.type === 'mouseover') {
          if (query && _this.clearable) {
            glyphicon
              .removeClass('glyphicon-menu-down')
              .addClass('glyphicon-remove-circle');
          }
        } else {
          glyphicon
            .removeClass('glyphicon-remove-circle')
            .addClass('glyphicon-menu-down');
        }
      })
      .on('click', '.glyphicon-remove-circle', function(e) {
        // 清除记录
        e.stopPropagation();
        e.preventDefault();

        var element = $(this).parent();
        $('div > span', element)
          .removeClass('mw-select-selected-value')
          .html(_this.placeholder);
        $('.glyphicon', element)
          .removeClass('glyphicon-remove-circle')
          .addClass('glyphicon-menu-down');

        // 清除选择的数据
        _this.tmpSelected = [];
        _this.selected = _this.tmpSelected;

        _this.itemChange();
        _this.itemClear();
        _this.renderCascader();
      });

    // 滚动事件
    $('.mw-cascader-menu', '#' + _this.id).scroll(function(e) {
      var element = $(this);
      _this.scrollEvent(element);
    });
  };

  // 展开选中项
  this.change = function(element, event) {
    // 阻止事件冒泡
    event.stopPropagation();

    var _this = this;
    var id = element.attr('data-id');
    var pid = element.attr('data-pid');
    var depth = element.attr('data-depth');
    // 获取当前选项的值【包含下级】
    var item = _this.getSelected(id, pid, depth);
    // 移除已存在的下级结构
    element
      .parent()
      .siblings('span')
      .remove();
    // 禁用某项级联数据
    if (item._disabled) {
      return false;
    }
    // 渲染当前选项的下级结构
    var childDom = _this.casPanel(item._children);
    // 新增新的下级结构
    element.parent().after(childDom);
    if (!_this.isCascader && event.type === 'mouseover') {
      element
        .find('.glyphicon')
        .removeClass('glyphicon-menu-right')
        .addClass('glyphicon-repeat');
    }
    // 添加滚动事件监听【动态dom监听不到，需要这里重新设置一次】
    $('.mw-cascader-menu', '#' + _this.id)
      .off()
      .scroll(function(e) {
        var element = $(this);
        _this.scrollEvent(element);
      });

    // 有下级的时候，触发点击事件
    if (item._count || (item._children && item._children.length)) {
      // click模式点击触发、hover模式鼠标移动到当前项上触发
      if (
        _this.trigger === 'click' ||
        (_this.trigger === 'hover' && event.type === 'mouseover')
      ) {
        _this.itemClick(item);
      }
      if (_this.changeOnSelect && event.type === 'click') {
        _this.selected = _this.tmpSelected;
        _this.itemChange();
        var id = element.parents('#' + _this.id);
        _this.reloadHead(id);
        id.find('.mw-cascader-selection').addClass('open');
      }
      return false;
    }
    // 没有下级的时候直接返回【点击返回】
    if (event.type === 'click') {
      _this.selected = _this.tmpSelected;
      _this.itemChange();
      var id = element.parents('#' + _this.id);
      _this.reloadHead(id);
      id.find('.dropdown').removeClass('open');
    }
  };

  // 数据更新后重新渲染header
  this.reloadHead = function(id) {
    var _this = this;
    var head = _this.renderHead();
    id.find('.mw-cascader-selection').remove();
    id.find('.dropdown-menu').before(head);
  };

  // 下拉框滚动事件判断
  this.scrollEvent = function(element) {
    var _this = this;
    // 下拉框可视高度
    var visibleHeight = element.prop('clientHeight');
    // 滚动条当前位置
    var scrollTop = element.prop('scrollTop');
    // 文档高度
    var scrollHeight = element.prop('scrollHeight');

    //console.log([scrollTop, visibleHeight, scrollHeight]);
    // 滚动到底部了
    if (scrollTop + visibleHeight >= scrollHeight) {
      _this.listScroll(element);
    }
  };
};
