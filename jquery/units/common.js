// 公共函数
/*
 *  需要引入Jquery 1.8.0 版本以上
 *  需要引入moment.js
 *
 * https://cdn.bootcss.com/jquery/3.0.0/jquery.min.js
 * https://cdn.bootcss.com/moment.js/2.23.0/moment.min.js
 */

(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.mwUnits = factory());
})(this, function() {
  'use strict';

  // 四舍五入
  function round(val, digits) {
    digits = Math.floor(digits);
    if (isNaN(digits) || digits === 0) {
      return Math.round(val);
    }
    if (digits < 0 || digits > 16) {
      throw 'RangeError: Number.round() digits argument must be between 0 and 16';
    }
    var multiplicator = Math.pow(10, digits);
    return Math.round(val * multiplicator) / multiplicator;
  }

  // 保留多少位小数
  function fixed(val, digits) {
    digits = Math.floor(digits);
    if (isNaN(digits) || digits === 0) {
      return Math.round(val).toString();
    }
    var parts = round(val, digits)
      .toString()
      .split('.');
    var fraction = parts.length === 1 ? '' : parts[1];
    if (digits > fraction.length) {
      fraction += new Array(digits - fraction.length + 1).join('0');
    }
    return parts[0] + '.' + fraction;
  }

  // 格式化货币
  function formatCurrency(val, options) {
    if (!options) {
      options = {};
    }
    var money = val * 1;
    if (isNaN(money)) {
      if (typeof val === 'string') {
        return val;
      }
      return '';
    }
    if (typeof options.fixed === 'undefined') {
      options.fixed = 2;
    }
    return fixed(money, options.fixed);
  }

  // 格式化税率
  function formatPercent(val, options) {
    if (!options) {
      options = {};
    }
    val = val * 1;
    if (isNaN(val)) {
      return '';
    }
    if (typeof options.mult === 'undefined') {
      options.mult = true;
    }
    if (typeof options.fixed === 'undefined') {
      options.fixed = 2;
    }
    if (typeof options.rate === 'undefined') {
      options.rate = '%';
    }
    if (options.mult) {
      val = val * 100;
    }
    return fixed(val, options.fixed) + options.rate;
  }

  // 格式化序号
  function formatSerial(val, options) {
    if (!options) {
      options = {};
    }
    if (!val) {
      return '';
    }
    if (typeof options.bits === 'undefined') {
      options.bits = 3;
    }
    if (typeof options.identifier === 'undefined') {
      options.identifier = '0';
    }
    var value = options.identifier.repeat(options.bits) + val;
    return value.slice(-options.bits);
  }

  // 格式化日期
  function formatDate(val, options) {
    if (!options) {
      options = {};
    }
    if (!val) {
      return '';
    }
    if (typeof options.format === 'undefined') {
      options.format = 'YYYY-MM-DD';
    }
    return moment(val).format(options.format);
  }

  // 请求数据
  function getData(params) {
    var defered = $.Deferred();

    if (!params) {
      params = {};
    }
    if (typeof params.url === 'undefined') {
      defered.reject('url is empty');
      return defered.promise();
    }
    if (typeof params.dataType === 'undefined') {
      params.dataType = 'jsonp';
    }
    if (typeof params.type === 'undefined') {
      params.type = 'GET';
    }
    if (typeof params.data === 'undefined') {
      params.data = {};
    }
    var xhrFields;
    if (params.mode) {
      xhrFields = { withCredentials: true };
    }

    $.ajax({
      url: params.url,
      dataType: params.dataType,
      type: params.type,
      data: params.data,
      xhrFields,
      complete: function(xhr, status) {
        defered.always(status);
      },
      success: function(data) {
        defered.resolve(data);
      },
      error: function(xhr, msg, error) {
        defered.reject(msg);
      }
    });
    return defered.promise();
  }

  // 查找对象
  function replaceHelper(row) {
    return function(all, key) {
      return row[key];
    };
  }

  // 模版替换
  function template(str, row) {
    return str.replace(/\$\{(\w*)\}/g, replaceHelper(row));
  }

  function Format() {}

  var unitsPrototype__proto = Format.prototype;

  unitsPrototype__proto.formatCurrency = formatCurrency;
  unitsPrototype__proto.formatPercent = formatPercent;
  unitsPrototype__proto.formatSerial = formatSerial;
  unitsPrototype__proto.formatDate = formatDate;
  unitsPrototype__proto.getData = getData;
  unitsPrototype__proto.template = template;

  var _units = unitsPrototype__proto;

  return _units;
});
