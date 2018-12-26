// 分页组件
// 事件传递使用 观察者模式
/*

config = {
  pageIndex: 1,
  pageSize: 20,
  pageTotal: 1,
  pageNumber: 0
}
 */

var mwPage = function(id) {
  this.id = id;
  // 默认分页参数
  this.pageIndex = 1;
  this.pageSize = 20;
  this.pageTotal = 1;
  this.pageNumber = 0;
  this.init = function(config) {
    if (config) {
      this.pageIndex = config.pageIndex || this.pageIndex;
      this.pageSize = config.pageSize || this.pageSize;
      this.pageTotal = config.pageTotal || this.pageTotal;
      this.pageNumber = config.pageNumber || this.pageNumber;
    }
    this.renderPage();
  };
  // 首页
  this.skipFirst = function() {
    this.pageIndex = 1;
    var pageIndex = this.pageIndex;
    this.emit('changePage', pageIndex);
  };
  // 上一页
  this.skipPrev = function() {
    if (this.pageIndex > 1) {
      this.pageIndex--;
    }
    var pageIndex = this.pageIndex;
    this.emit('changePage', pageIndex);
  };
  // 下一页
  this.skipNext = function() {
    if (this.pageIndex < this.pageTotal) {
      this.pageIndex++;
    }
    var pageIndex = this.pageIndex;
    this.emit('changePage', pageIndex);
  };
  // 尾页
  this.skipLast = function() {
    this.pageIndex = this.pageTotal;
    var pageIndex = this.pageIndex;
    this.emit('changePage', pageIndex);
  };
  // 跳转到某一页
  this.skipPage = function() {
    var pageIndex = this.pageIndex;
    if (pageIndex < 1) {
      pageIndex = 1;
    }
    if (pageIndex > this.pageTotal) {
      pageIndex = this.pageTotal;
    }
    this.emit('changePage', pageIndex);
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
  // 渲染分页
  this.renderPage = function() {
    var _this = this;
    var page = '<div class="mw-pages"><div class="page-button">';
    page +=
      '<span title="首页" class="glyphicon glyphicon-step-backward"></span>';
    page +=
      '<span title="上一页" class="glyphicon glyphicon-triangle-left"></span>';
    page += '<span>| 第</span>';
    page +=
      '<input class="on-enter" type="text" value="' + this.pageIndex + '" />';
    page += '<span>/ ' + this.pageTotal + ' 页 |</span>';
    page +=
      '<span title="下一页" class="glyphicon glyphicon-triangle-right"></span>';
    page +=
      '<span title="尾页" class="glyphicon glyphicon-step-forward"></span></div>';
    page +=
      '<div class="page-number">共' + this.pageNumber + '条数据显示</div>';
    page += '</div>';

    $('#' + this.id).html(page);

    $('.glyphicon-step-backward').on('click', function() {
      _this.skipFirst();
    });

    $('.glyphicon-triangle-left').on('click', function() {
      _this.skipPrev();
    });

    $('.glyphicon-triangle-right').on('click', function() {
      _this.skipNext();
    });

    $('.glyphicon-step-forward').on('click', function() {
      _this.skipLast();
    });

    $('.on-enter').on('keydown', function(e) {
      var evt = window.event || e;
      if (evt.keyCode === 13) {
        //回车事件
        _this.skipPage();
      }
    });
  };
};

// var page = new mwPage('mw-page');
// page.init({
//   pageIndex: 1,
//   pageSize: 20,
//   pageTotal: 1,
//   pageNumber: 0
// });
// page.on('changePage', function(page) {
//   console.log(['page', page]);
// });
