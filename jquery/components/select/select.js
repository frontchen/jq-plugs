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
  this.tmpSelected = []; // 临时选中的值

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
      return this.tmpSelected;
    },
    set: function(value) {
      var _this = this;
      _this.tmpSelected = [];
      if (_this.multiple) {
        $.each(value, function(index, val) {
          $.each(_this.data, function(i, v) {
            if (v.value === val) {
              _this.tmpSelected.push(v);
              return false;
            }
          });
        });
      } else {
        $.each(_this.data, function(i, v) {
          if (v.value === value) {
            _this.tmpSelected[0] = v;
            return false;
          }
        });
      }
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

  // 点击选项触发事件
  this.itemClick = function(item) {
    this.emit('on-change', item);
  };

  // 清除按钮事件
  this.itemClear = function() {
    this.emit('on-clear', '');
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

  this.checkSelected = function(item) {
    var _this = this;
    var isChecked = false;
    $.each(_this.tmpSelected, function(i, v) {
      if (v.label === item.label && v.value === item.value) {
        isChecked = true;
        return false;
      }
    });
    return isChecked;
  };

  this.renderHead = function() {
    var _this = this;

    let values = '';
    if (_this.tmpSelected) {
      if (_this.multiple) {
        // 多选
        var valueList = [];
        $.each(_this.tmpSelected, function(i, v) {
          valueList.push(v.label);
        });
        values = valueList.join('/');
      } else {
        values = _this.tmpSelected.length ? _this.tmpSelected[0].label : '';
      }
    }
    var selected = '';
    if (_this.filterable) {
      selected = mwUnits.template(
        '<input type="text" placeholder="${placeholder}" autocomplete="off" spellcheck="false" class="mw-select-input" ${disabled} value="${value}">',
        {
          placeholder: _this.placeholder,
          disabled: _this.disabled ? ' disabled="disabled"' : '',
          value: values
        }
      );
    } else {
      selected = mwUnits.template(
        '<div><span${selectedCls}>${value}</span></div>',
        {
          selectedCls: values ? ' class="mw-select-selected-value"' : '',
          value: values ? values : _this.placeholder
        }
      );
    }

    var headTmp =
      '<div class="mw-select-selection${disabledCls}" style="width:${width}px" data-toggle="${toggle}">${selected}<span class="mw-select-arrow glyphicon ${icon}"></span></div>';
    var head = mwUnits.template(headTmp, {
      disabledCls: _this.disabled ? ' mw-select-disabled' : '',
      width: _this.width,
      toggle: !_this.disabled ? 'dropdown' : '',
      selected: selected,
      icon: 'glyphicon-menu-down'
    });

    return head;
  };

  this.renderDropItem = function(data, index) {
    var _this = this;
    var list = data;
    if (!list || list.length === 0) {
      return '';
    }
    var dropItem = '';
    if (!index) {
      index = 0;
    }
    $.each(list, function(i, v) {
      dropItem += mwUnits.template(
        '<li${selected}><a class="dropdown-item" data-id="${id}" href="#">${label}</a></li>',
        {
          selected: _this.checkSelected(v)
            ? ' class="mw-select-item-selected"'
            : '',
          id: index + i,
          label: v.label
        }
      );
    });
    return dropItem;
  };

  this.renderDrop = function() {
    var _this = this;
    var drop = mwUnits.template('<ul class="dropdown-menu">${item}</ul>', {
      item: _this.renderDropItem(_this.data)
    });
    return drop;
  };

  this.renderDropList = function(data) {
    var _this = this;
    var index = _this.data.length;
    $.each(data, function(i, v) {
      _this.data.push(v);
    });
    var dropItemDom = _this.renderDropItem(data, index);
    $('.dropdown-menu', '#' + id).append(dropItemDom);
  };

  this.renderSelect = function(data) {
    var _this = this;
    var id = _this.id;
    if (data && !_this.data.length) {
      _this.data = data;
    }

    var select = mwUnits.template(
      '<div class="mw-select dropdown show">${head}${drop}</div>',
      {
        head: _this.renderHead(),
        drop: _this.renderDrop()
      }
    );

    $('#' + id).html(select);

    // 点击事件 off()解决委托事件执行多次的问题
    $('.dropdown-menu', '#' + id)
      .off()
      .on('click', '.dropdown-item', function(e) {
        if (_this.multiple) {
          e.stopPropagation();
          e.preventDefault();
        }
        var index = $(this).attr('data-id');
        var item = _this.data[index];
        var values = _this.getSelected(item);
        var element = $('.mw-select-selection', '#' + id);
        if (_this.multiple) {
          var showValue = [];
          $.each(_this.tmpSelected, function(i, v) {
            showValue.push(v.label);
          });
          showValue = showValue.join('/');
          // 取消完后重置显示数据
          if (!showValue) {
            showValue = _this.placeholder;
          }
          var parentElement = $(this).parent();
          if (parentElement.hasClass('mw-select-item-selected')) {
            parentElement.removeClass('mw-select-item-selected');
          } else {
            parentElement.addClass('mw-select-item-selected');
          }
        } else {
          showValue = _this.tmpSelected.length
            ? _this.tmpSelected[0].label
            : '';
        }
        if (_this.filterable) {
          $('input', element).val(showValue);
        } else {
          $('div > span', element)
            .addClass('mw-select-selected-value')
            .html(showValue);
          if (!_this.tmpSelected.length) {
            $('div > span', element).removeClass('mw-select-selected-value');
          }
        }

        _this.itemClick(values);
      });

    $('.mw-select-selection', '#' + id)
      .off()
      .on('mouseover mouseout', function(e) {
        // 鼠标动作
        var query = $('.mw-select-selected-value', this).html();
        if (_this.filterable) {
          query = $('input', this).val();
        }
        var element = $('.glyphicon', '#' + id);
        if (e.type === 'mouseover') {
          if (query && _this.clearable) {
            element
              .removeClass('glyphicon-menu-down')
              .addClass('glyphicon-remove-circle');
          }
        } else {
          element
            .removeClass('glyphicon-remove-circle')
            .addClass('glyphicon-menu-down');
        }
      })
      .on('click', '.glyphicon-remove-circle', function(e) {
        // 清除记录
        e.stopPropagation();
        e.preventDefault();
        var element = $(this).parent();
        if (_this.filterable) {
          $('input', element).val('');
        } else {
          $('div > span', element)
            .removeClass('mw-select-selected-value')
            .html(_this.placeholder);
        }
        $('.glyphicon', element)
          .removeClass('glyphicon-remove-circle')
          .addClass('glyphicon-menu-down');

        var value = '';
        if (_this.multiple) {
          value = [];
        }

        _this.itemClick(value);
        _this.itemClear();
        // 清除选择的数据
        _this.tmpSelected = [];
        _this.renderSelect();
      })
      .on('input', 'input', function() {
        // input change事件
        var query = $(this).val();
        var element = $(this).parent();
        if (query && _this.clearable && !_this.multiple) {
          $('.glyphicon', element)
            .removeClass('glyphicon-menu-down')
            .addClass('glyphicon-remove-circle');
        } else {
          $('.glyphicon', element)
            .removeClass('glyphicon-remove-circle')
            .addClass('glyphicon-menu-down');
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

  this.getSelected = function(item) {
    var _this = this;
    if (item) {
      if (_this.multiple) {
        var isSelected = false;
        $.each(_this.tmpSelected, function(i, v) {
          if (v.value === item.value && v.label === item.label) {
            isSelected = true;
            _this.tmpSelected.splice(i, 1);
            return false;
          }
        });
        if (!isSelected) {
          _this.tmpSelected.push(item);
        }
        values = _this.tmpSelected;
        if (!_this.labelInValue) {
          var valueList = [];
          $.each(values, function(i, v) {
            valueList.push(v.value);
          });
          values = valueList;
        }
      } else {
        _this.tmpSelected[0] = item;
        values = _this.tmpSelected[0];
        if (!_this.labelInValue) {
          values = values.value;
        }
      }
    } else {
      if (_this.multiple) {
        values = [];
      } else {
        values = '';
      }
    }
    return values;
  };
};
