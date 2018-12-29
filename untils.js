/**
 * 存储localStorage
 */

function setStore(name, content) {
    if (!name) {
        return;
    }
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

/**
 * 获取localStorage
 */

function getStore(name) {
    if (!name) {
        return;
    }
    return window.localStorage.getItem(name);
}

/**
 * 删除localStorage
 */

function removeStore(name) {
    if (!name) {
        return;
    }
    window.localStorage.removeItem(name);
}

/***
 * 存储sessionStorage
 */

function setData(name, content) {
    if (!name) {
        return;
    }
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.sessionStorage.setItem(name, content);
}

/**
 * 获取sessionStorage
 */

function getData(name) {
    if (!name) {
        return;
    }
    return window.sessionStorage.getItem(name);
}

/**
 * 删除sessionStorage
 */

function removeData(name) {
    if (!name) {
        return;
    }
    window.sessionStorage.removeItem(name);
}
//商品 参数格式化
template.defaults.imports.format = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    var arr = value.split('|');
    var str = '';
    $.each(arr, function (index, value) {
        str += item.split(':')[1] + ' ';
    })

    return str;
};

template.defaults.imports.product = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    var arr = value.split('#');

    return arr[1];
};
template.defaults.imports.order = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    var arr = value.split('#');

    return arr[0];
};

/***
 * 获得对象的长度
 */
function getObjLength(obj) {
    var length;
    if (!Object.keys) {
        Object.keys = function (obj) {
            if (obj !== Object(obj)) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var k = [], p;
            for (p in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, p)) {
                    k.push(p);
                }
            }
            return k;
        }
        length = Object.keys(obj).length;
    } else {
        length = Object.keys(obj).length;
    }
    return length;
}
//判断选中的tab标签页
function isClick(name, key) {
    if (!name) {
        return;
    }
    var isSelect = false;
    if (getStore(name) == key) {
        isSelect = true;
    } else {
        isSelect = false;
    }
    return isSelect;
}
function createNoData() {
    var str = '<div style="width: 981px; margin: 0 auto;border: 1px solid #ccc"><div class="empty-box">'
         + '<i class="empty-icon"></i>'
         + '<div class="e-cont">'
             + '<h6>您目前尚没有操作数据~</h6>'
             + '<div class="op-btns">'
                 + '<h6>请开启您的奇妙应用之旅！</h6>'
                 + '<a href="#" class="">查看帮助</a>'
             + '</div>'
         + '</div>'
     + '</div></div>';
    return str;
}
//图片url地址拼接
template.defaults.imports.src = function (src) {
    if (!src || src.length <= 0) {
        return '/assets/image/common/productimg.png';
    }
    return webConfigs.imageRouting + src;
};
//年月日格式化
template.defaults.imports.date = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    return moment(value).format('YYYY-MM-DD');
};
//数字取整
template.defaults.imports.parse = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    return parseInt(value);
};
//数字货币格式化
template.defaults.imports.money = function (value) {
    if (!value || value.length <= 0) {
        return '';
    }
    return webConfigs.FormatMoney(value);
};
//货币数字相乘
template.defaults.imports.multiply = function (a, b) {
    if (!a || !b) {
        return '';
    }
    return webConfigs.accMul(a, b);
};
//货币数字相加
template.defaults.imports.sum = function (a, b) {
    if (!a || !b) {
        return '';
    }
    return webConfigs.accAdd(a, b);
};
//商品数据重组
template.defaults.imports.goods = formatGoods;


/***
 * 商品td模板
 * element 遍历数据源的标识 value 如$.each(datass,function(index,value){})
 * obj  配置集合 键值对，key不可变 value 接收的字段可变
 * type:2 两行样式 type 3 三行样式 默认三行样式
 * isShowImg 是否显示图片  true 显示 false 隐藏
 */
//使用:
//formatGoods(params.row, {
//    BrandName: 'BrandName',
//    ClassName: 'ClassName',
//    GradeName: 'GradeName',
//    StardName: 'StardName',
//    ModelName: 'ModelName',
//    UnitName: 'UnitName',
//    Pic: 'Pic',
//    type: '3',
//    isShowImg: true
//})

function formatGoods(element, obj) {
    obj.type = obj.type || '3';
    var goodsStr = '';
    var imgStr = '';
    var productStr = '';
    var checkBoxStr = '';
    
    var align = obj.align || 'flex-start';
    var updateImg = '';
    var unitStr = '';
  
    goodsStr = '<div class="mw-table-product" style="justify-content:' + align + '">'
    if (obj.updateImg) {
        updateImg = '<input type="file" style="width:100%;height:100%;position:absolute;left:0;top:0;opacity:0;z-index:10;" />'
    }
    if (obj.isShowImg) {
        var imgUrl = '';
        if (!element[obj.Pic] || element[obj.Pic] == 'undefined' || element[obj.Pic] == '') {
            imgUrl = '../assets/image/common/productimg.png';
        } else {
            imgUrl = webConfigs.imageRouting + element[obj.Pic]
        }
        imgUrl = imgUrl.replace(/\//g, '\\/').replace(/\s/g, '&nbsp;')
        imgStr = '<div class="img_out" style="position:relative" >' + updateImg + '<img onerror="this.src = \'../assets/image/common/productimg.png\'; this.onerror = null"  src="' + imgUrl + '" /></div>'
    }
    if (obj.isShowCheck) {
        checkBoxStr = '<label style="align-self: center;margin-right:10px;">'
                   + '<input type="checkbox" class="ace" data="' + JSON.stringify(element) + '" value="">'
                   + ' <span class="lbl"></span>'
                   + '</label>'
    }

    var proNoStr = '';
    var oneLineStr = '';
    if (obj.type == '4') {
        if (element[obj.BrandName]) {
            proNoStr = '<p class="text_oncealment" >订单编号:' + (element[obj.BrandName]) + '</p>'
        }

    }


    productStr = '<div class="distance_top" style="display:inline-block;text-align:left;">'
             + proNoStr
             + '<p class="text_oncealment" title="' + element[obj.BrandName] + ' ' + element[obj.ClassName] + '">'
             + element[obj.ClassName] + ' ' + element[obj.BrandName]
             + '</p>'
             + '<p class="text_oncealment" title="' + ' ' + element[obj.GradeName] + ' ' + element[obj.StardName] + '">'
             + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.StardName] || '') + (element[obj.ColorName] || '')
             + '</p>'
             + '<p class="text_oncealment" title="' + (element[obj.ModelName] || '') + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName(element[obj.UnitAttrValues]) + '">'
             + (element[obj.ModelName] || '') + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName(element[obj.UnitAttrValues])
             + '</p>'
             + '</div>'

    if (obj.type == '2') {
        productStr = '<div class="distance_top" style="display:inline-block;text-align:left;">'
             + '<div class="text_oncealment" title="' + (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '') + ' ' + (element[obj.StardName] || '') + '">'
             + (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '') + ' ' + (element[obj.StardName] || '')
             + '</div>'
             + '<div class="text_oncealment" title="' + ' ' + (element[obj.ModelName] || '') + ' ' + element[obj.GradeName] + ' ' + (element[obj.UnitName] || '') + '">'
            + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '') + ' ' + element[obj.GradeName] + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName(element[obj.UnitAttrValues])
             + '</div>'

             + '</div>'
    }
    if (obj.type == '1') {
        productStr = (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '')
            + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '')
            + ' ' + (element[obj.ColorName] || '') + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName(element[obj.UnitAttrValues]);
    }
    goodsStr += checkBoxStr + imgStr + productStr + '</div>';
    return goodsStr;
}


function formatGoodsStr(element, obj) {
    obj.type = obj.type || '3';
    var goodsStr = '';
    var imgStr = '';
    var productStr = '';
    var checkBoxStr = '';
    var TaxRatsin = '';
    var TaxRatsins = '';
    if (element[obj.TaxRate]) {
        TaxRatsin = '<span style="color:#00bdab;">' + element[obj.TaxRate] + '%</span>';
        TaxRatsins = element[obj.TaxRate] +'%';
    }
    if (obj.isShowImg) {
        var imgUrl = '';
        if (!element[obj.Pic] || element[obj.Pic] == 'undefined' || element[obj.Pic] == '') {
            imgUrl = '../assets/image/common/productimg.png';
        } else {
            imgUrl = webConfigs.imageRouting + element[obj.Pic]
        }

        imgStr = '<div class="img_out"  ><img onerror="this.src = \'../assets/image/common/productimg.png\'; this.onerror = null"  src="' + imgUrl + '" /></div>'
    }
    if (obj.isShowCheck) {
        checkBoxStr = '<label style="align-self: center;margin-right:10px;">'
                   + '<input type="checkbox" class="ace" data="' + JSON.stringify(element) + '" value="">'
                   + ' <span class="lbl"></span>'
                   + '</label>'
    }
    var proNoStr = '';
    var oneLineStr = '';
    if (obj.type == '4') {
        if (element[obj.BrandName]) {
            proNoStr = '<div class="text_oncealment1" >' + (element[obj.orderNo]) + '</p>'
            productStr = '<div class="distance_top1" style="display:inline-block;text-align:left;">'
               + proNoStr
               + '<div class="text_oncealment1" title="' + element[obj.BrandName] + ' ' + element[obj.ClassName] + '">'
               + element[obj.ClassName] + ' ' + element[obj.BrandName]
               + '</div>'
               + '<div class="text_oncealment1" title="' + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '') + '">'
               + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '')
               + '</div>'
               + '<div class="text_oncealment1" title="' + (element[obj.UnitName] || '') + ' ' + formatUnitName((element[obj.PackageValueList] || '')) + ' ' + (TaxRatsins || '') + '">'
                + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName((element[obj.PackageValueList] || '')) + ' ' + TaxRatsin
               + '</div>'
               + '</div>'
        }

    }

   
    if (obj.type == '3') {
        productStr = '<div class="distance_top" style="display:inline-block;text-align:left;">'
                 + '<div class="text_oncealment" title="' + element[obj.BrandName] + ' ' + element[obj.ClassName] + '">'
                 + element[obj.ClassName] + ' ' + element[obj.BrandName]
                 + '</div>'
                 + '<div class="text_oncealment" title="' + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '') + '">'
                 + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '')
                 + '</div>'
                 + '<div class="text_oncealment" title="' + (element[obj.UnitName] || '') + ' ' + formatUnitName((element[obj.PackageValueList] || '')) + ' ' + (TaxRatsins || '') + '">'
                  + ' ' + (element[obj.UnitName] || '') + ' ' + formatUnitName((element[obj.PackageValueList] || '')) + ' ' + TaxRatsin
                 + '</div>'
                 + '</div>'
    }

    if (obj.type == '2') {
        productStr = '<div class="distance_top" style="display:inline-block;text-align:left;">'
             + '<div class="text_oncealment" title="' + (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '') + ' ' + (element[obj.StardName] || '') + '">'
             + (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '') + ' ' + (element[obj.StardName] || '')
             + '</div>'
             + '<div class="text_oncealment" title="' + ' ' + (element[obj.ModelName] || '') + ' ' + element[obj.GradeName] + ' ' + (element[obj.UnitName] || '') + '">'
            + (element[obj.ModelName] || '') + ' ' + (element[obj.ColorName] || '') + ' ' + element[obj.GradeName] + ' ' + (element[obj.UnitName] || '')
             + '</div>'

             + '</div>'
    }
    if (obj.type == '1') {
        productStr = (element[obj.ClassName] || '') + ' ' + (element[obj.BrandName] || '')
            + ' ' + (element[obj.StardName] || '') + ' ' + (element[obj.ModelName] || '')
            + ' ' + (element[obj.ColorName] || '') + ' ' + (element[obj.GradeName] || '') + ' ' + (element[obj.UnitName] || '');
    }
    goodsStr += checkBoxStr + imgStr + productStr;
    return goodsStr;
}


function formatUnitName(str) {

    var label = '';
    if (str) {
        var unitArr = str.split(":");

        var sign = '/';
        var temp = [];
        $.each(unitArr, function (index, item) {
            if (index != 0) {
                var str = item.replace(/\|/g, '');
                temp.push(str)
            } else {
                temp.push(item)
            }

        })
        // console.log(temp);
        $.each(temp, function (i, v) {
            if (i == 1) {
                label +=v + sign + temp[i - 1]
            }
            if (i > 1) {
                if (i == 2 && i != temp.length - 1) {
                    var length = temp[i - 1].length;
                    if (temp[i - 1][length - 1]) {
                        label += '(' + v + sign + temp[i - 1][length - 1] + ',';
                    }
                    
                } else if (i == temp.length - 1 && i == 2) {
                    var length = temp[temp.length - 2].length;
                    if (temp[temp.length - 2][length - 1]) {
                        label += '(' + v + sign + temp[temp.length - 2][length - 1] + ')'
                    }
                   
                } else if (i == temp.length - 1 && i > 2) {
                    var length = temp[temp.length - 2].length;
                    if (temp[temp.length - 2][length - 1]) {
                        label += v + sign + temp[temp.length - 2][length - 1] + ')';
                    }
                    
                } else {
                    var length = temp[i - 1].length;
                    if (temp[i - 1][length - 1]) {
                        label += v + sign + temp[i - 1][length - 1] + ','
                    }
                   
                }
            }
        })
    }
    return label;
}
//数据是否重复
template.defaults.imports.trimArr = function (item) {
    return JSON.parse(getStore('mainorderid')).indexOf(item) == -1 ? false : true;
};
function formatNumber(obj) {
   
    //$(obj).val() = $(obj).val().replace(/^[0]+[0-9]*$/gi, "");
    obj.value = obj.value.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
}

//table 序号分页
function pageNumber(index, pageIndex, pageSize) {
    //页码分页序号

    var pSize = pageSize || 20;
    var num = index + 1;
    num += pSize * (pageIndex - 1);
    return mwUnits.formatSerial(num);
}

$.extend({
    stopEvent: function (event) {
        var e = arguments.callee.caller.arguments[0] || event; //若省略此句，下面的e改为event，IE运行可以，但是其他浏览器就不兼容
        if (e && e.stopPropagation) {
            // this code is for Mozilla and Opera
            e.stopPropagation();
        } else if (window.event) {
            // this code is for IE
            window.event.cancelBubble = true;
        }
    }
})

/******************************Cascader级联选择框Start*******************************/
var Cascader = function (id) {
    this.id = id;

    //初始化
    this.init = function (configs) {
        this.id = id;
        this.configs = configs;
        return this.renderCascader();
    }


}
/******************************Cascader级联选择框End*******************************/

/*************************采购、销售订单详情表格插件Start********************************/
var erpTable = function (id) {
    this.id = id;

    // 初始化
    this.init = function (configs) {
        this.id = id;
        this.configs = configs;
        this.configs.isShowTheader = this.configs.isShowTheader ? this.configs.isShowTheader : true;
        this.configs.isShowTfooter = this.configs.isShowTfooter ? this.configs.isShowTfooter : true;
        return this.renderTable();
    };

    // 渲染表头
    this.renderHeader = function (headRows) {
        var header = '<div class="mw-table-header"><table cellspacing="0" cellpadding="0" border="0">'
            header += '<colgroup>'
            $.each(headRows, function (index,item) {
                header += '<col width="' + (item.width||'') + '"></col>'
            })
            header += '</colgroup>'
            header+='<thead><tr>';
        $.each(headRows, function (i, v) {
            header +=
              '<th><div class="mw-table-cell"><span>' + v.label + '</span></div>';
        });
        header += '</tr></thead></table></div>';
        return header;
    };

    // 渲染行
    this.renderTr = function (td) {
        var tr = '<tr class="mw-table-row">' + td + '</tr>';
        return tr;
    };
    //渲染表第一行
    this.renderFirstTr = function (theader) {
        var colspan = this.configs.columns.length;
        var flex = 1 / colspan;
        var theaderStr = '<tr class="render-first-tr"><td colspan="' + colspan + '">'
        var theaderItemStr = '';
        $.each(theader, function (index, item) {

            theaderItemStr += '<div class="render-first-tr-item" style="flex:' + flex + '">';
            $.each(item, function (key, v) {
                if (key === 'label') {

                    theaderItemStr += '<span>' + (v.length > 0 ? (v + '：') : '') + '</span>'
                } else {
                    theaderItemStr += '<p>' + v || '' + '</p>'
                }

            })
            theaderItemStr += '</div>'

        })

        theaderStr += theaderItemStr + '</td></tr>';
        return theaderStr;
    }
    // 渲染内容
    this.renderBody = function (tbodyData) {
        var _this = this;
        //var table = '';
        //var tHeader = '';
        //var tBody = '';
        //var tBottom = '';
        var body = '<div class="mw-table-body">';
        $.each(tbodyData, function (i, v) {
            body += '<table cellspacing="0" cellpadding="0" border="0">'
            body+='<tbody class="mw-table-tbody">';
            body += '<colgroup>'
            $.each(v.tbody, function (index,item) {
                body += '<col width="' + (item.width || '') + '"></col>'
            })
            body += '</colgroup>'
            var tdItem = '';

            if (v.tbody.length === 0) {
                tdItem += '<tr class="mw-table-row">';
                var len = _this.configs.columns.length;
                for (var i = 0; i < len; i++) {
                    tdItem += '<td><div class="mw-table-cell"></div></td>'
                }
                tdItem += '</tr>';

                body += tdItem;
                body += '</tbody></table>';

            } else {
                $.each(v.tbody, function (index, val) {
                    tdItem += '<tr class="mw-table-row">'
                    $.each(val, function (number, item) {

                        if (number.search('render') != -1) {
                            tdItem += '<td><div class="mw-table-cell">' + item || '' + '</div></td>';

                        } else {
                            tdItem += '<td><div class="mw-table-cell"><span>' + item || '' + '</span></div></td>';
                        }

                    })
                    tdItem += '</tr>'
                });
                if (_this.configs.isShowTheader) {
                    body += _this.renderFirstTr(v.theader);
                }
                body += tdItem;
                body += '</tbody></table>';
                if (_this.configs.isShowTfooter) {
                    body += _this.renderTFotter(v.tbottom);
                }

            }

        });
        body += '</div>';
        return body;
    };

    //渲染表footer
    this.renderTFotter = function (tfooterData) {
        var tbottom = this.configs.tbottom;
        var footer = ' <div class="footer-wrapper">';
        $.each(tfooterData, function (i, v) {

            footer += '<div class="footer-wrapper-item">'
            $.each(v, function (n, item) {
                footer += '<div class="footer-wrapper-list">';

                $.each(item, function (key, value) {

                    if (key == 'label') {
                        footer += '<span class="footer-wrapper-list-title">' + value + '：</span>';
                    } else {
                        footer += '<p class=" footer-wrapper-list-item">' + value + '</p>'

                    }

                })
                footer += '</div>';
            })
            footer += '</div>';
        })
        footer += '</div>'
        return footer;
    }

    // 渲染表格
    this.renderTable = function (data) {
        var id = this.id;
        var Configs = this.configs;
        var theader = Configs.theader;
        var tbody = Configs.tbody;
        var tbottom = Configs.tbottom;
        var columns = Configs.columns;
        if (!id) {
            console.log('init fail!');
            return false;
        }
        if (!Configs) {
            return $('#' + id).html('init fail!');
        }

        var list = [];
        if (data) {
            list = new Array(data.length);

            $.each(data, function (i, v) {

                list[i] = {}
                list[i].theader = [];//填充表格第一行；
                list[i].tbody = [];//填充订单明细
                list[i].tbottom = [];//填充表尾的数据

                // theader
                $.each(theader, function (index, val) {
                    var obj = {};
                    obj.label = val.label || '';
                    if (val.render) {
                        obj['render' + index] = val.render({ row: v, index: i });
                    } else {
                        if (val.key) {
                            obj[val.key] = v[val.key] || '';

                        }
                    }
                    list[i].theader.push(obj);
                });

                // tbody
                $.each(v[tbody.name], function (ti, tval) {
                    // console.log(tval)
                    var obj = {};
                    $.each(tbody.columns, function (index, val) {
                        if (val.render) {
                            obj['render' + index] = val.render({ row: tval, index: ti });
                        } else {
                            if (val.key) {
                                obj[val.key] = tval[val.key] || '';
                            }
                        }
                    })
                    list[i].tbody.push(obj);
                })
                //console.log(list[i])
                // tfooter
                $.each(tbottom, function (index, val) {
                    var bottomArr = [];
                    bottomArr = new Array(val.length)

                    $.each(val, function (ci, cval) {
                        //if (v[cval.key] == '') {
                        //    bottomArr[ci] = {};
                        //} else {

                        //}
                        bottomArr[ci] = {};
                        bottomArr[ci].label = cval.label || '';
                        if (cval.render) {
                            bottomArr[ci]['render' + ci] = cval.render({ row: v, index: i });
                        } else {
                            if (cval.key) {
                                bottomArr[ci][cval.key] = v[cval.key] || '';
                            }

                        }

                    })
                    list[i].tbottom.push(bottomArr);
                })


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
/*************************采购、销售订单详情表格插件End********************************/

/******************************************下拉框Start***********************************/

var erpSelects = function (id) {
    this.id = id;
    this.isLast = null; //是否最后一页
    this.beforeTime = null;//上一次输入时间
    this.width = 135;
    this.init = function (configs) {
        this.id = id;
        this.isSearch = configs.isSearch || false;
        this.pageSize = configs.pageSize || 20;
        this.multiple = configs.multiple || false;
        this.configs = configs;
        this.width = configs.width || this.width;
        $('#' + id).css({
            "pointer-events": "none",
            'width':this.width+'px'
        });
        this.sign = configs.sign || ',';//分隔符
        return this.renderSelect();
    }
    this.multipleData = [];//选中的数据
    this.srcollList = [];//滚动加载的数据
  
    this.renderInput = function (configs) {
        var _This = this;
        var inputStr = '';
        var readonlyStr = '';
        var disabledStr = '';
        if (_This.isSearch == false) {
            readonlyStr = 'readonly="readonly"';

        }
        if (configs.isDisabled == true) {
            disabledStr = 'disabled="disabled"';
        }
        var widthStr = '';
        if (configs.width) {
            widthStr = 'style="width:' + configs.width + 'px" ';
        }
        inputStr = '<input data-toggle="dropdown" class="erp-select-input" ' + widthStr + ' type="text" placeholder="' + (configs.placeholder || '') +
             '" ' + disabledStr + ' ' + readonlyStr + ' />';
        inputStr += '<div class="mw-select-arrow-right">';
        inputStr += '<span class="mw-cascader-arrow glyphicon glyphicon-menu-down"></span>';
        inputStr += '</div>';

        return inputStr;
    }

    this.renderUL = function () {

        return '<ul  class="dropdown-menu erp-select-ul"></ul>';

    }

    this.renderSelect = function () {
        var config = this.configs;
        var inputStr = this.renderInput(config);
        var searchCallback = config.searchCallback;
       
        var scrollData = this.scrollData;
        var id = this.id;
        var _This = this;
        var select = '<div class="dropdown mw-select-box">';
        var nextGetData = config.nextGetData;
        //console.log(data);
        //多选
        var ulStr = this.renderUL();
        select += inputStr + ulStr + '</div>'
        $("#" + id).append(select);

        $("#" + id + ' .dropdown').off().on('shown.bs.dropdown', function () {
            $("#" + id).find('.mw-select-arrow-right .glyphicon')
                    .removeClass('glyphicon-menu-down').addClass('glyphicon-menu-up');

        }).on('hidden.bs.dropdown', function () {
            $("#" + id).find('.mw-select-arrow-right .glyphicon')
             .removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
        })
        var timer;
        //查询事件
        $("#" + id).off().on("input", ".erp-select-input", function () {
            
            _This.beforeTime = new Date().getSeconds();//上一次毫秒数
            var This = this;
            console.log('输入了')
            if ($(this).val().trim() == '') {
                _This.clearProps();
            }
            
            if (_This.beforeTime && new Date().getSeconds() - _This.beforeTime>600) {
                clearTimeout(timer);
            }
            clearTimeout(timer);
            timer = setTimeout(function () {
                searchCallback && searchCallback(config, This);
            }, 600);
            
            

        }).on("mouseover mouseout", ".mw-select-box", function (e) {
            //显示清除按钮
            var query = $(this).find('.erp-select-input').val();
          
            if (e.type === 'mouseover') {
                if (query) {
                    $(".mw-cascader-arrow", '#' + id).removeClass('glyphicon-menu-down');
                    $(".mw-cascader-arrow", '#' + id).addClass('glyphicon-remove-sign');
                 
                }
            } else {
                $(".mw-cascader-arrow", '#' + id).removeClass('glyphicon-remove-sign');
                $(".mw-cascader-arrow", '#' + id).addClass('glyphicon-menu-down');
             
            }
        }).on('click', '.glyphicon-remove-sign', function (e) {
            // 清除记录
              e.stopPropagation();
              e.preventDefault();
              $('.erp-select-input', '#' + id).val('');
              $('.erp-select-input', '#' + id).removeAttr('title');
              $(".erp-select-ul .erp-select-checkbox input", '#' + id).prop("checked", false);
              _This.clearProps();
              if (_This.multiple) {
                  _This.multipleData = [];
                  $('.erp-select-input', '#' + id).data("_value", '');
              }
              
              $(".mw-cascader-arrow", '#' + id).removeClass('glyphicon-remove-sign');
              $(".mw-cascader-arrow", '#' + id).addClass('glyphicon-menu-down');
          }
        ).on('click', 'li', function (e) {
            e.stopPropagation();
            e.preventDefault();

            var This = this;
            if (!_This.multiple) {
                _This.singleClick(config, This);
            } else {

                _This.MultipleClick(config, This);
            }
            nextGetData && nextGetData(this);
            $("#" + id).find('.mw-select-arrow-right .glyphicon')
              .removeClass('glyphicon-menu-up').addClass('glyphicon-menu-down');
        });
        
        if (_This.multiple) {
            $(".erp-select-ul .erp-select-checkbox input", "#" + id).on("change", function () {

                _This.MultipleChange(li);
               
            })
        }
    };

    //获取数据
    /***
     * elid ulid
     * url api地址
     * data 参数
     * resultObj  
     *    {labels:{}自定义属性 values{} 显示的文本}
     *      isTotal   是否绑定全部属性
     *
     */
    this.getData = function () {
        //显示遮罩
        //console.log(this.configs);
        var configs = this.configs;
        var _This = this;
        var id = _This.id;
        _This.isLast = null;//初始化页面状态
        this.multipleData = [];//初始化清除多选数据
        $('#' + id).css("pointer-events", "all");
        if (_This.isLast == null) {
            $('#' + id).find('.erp-select-ul').empty();
        }
        $("#MaskCloud").css("display", "block")
        var datas;
        var url = webConfigs.webApiPath() + configs.url;

        //console.log(configs.data);

        $.ajax({
            url: url,
            type: "GET",
            dataType: 'jsonp',
            data: configs.data,
            async: false,
            success: function (data) {
                $("#MaskCloud").css("display", "none");
                datas = data;
                datas.Data = JSON.parse(data.Data);
                datas.HelperData = JSON.parse(data.HelperData);
               // console.log(datas);
                $('#' + id).find('.erp-select-ul').empty();
                _This.srcollList = [];
                if (datas.Result == 1) {

                    if (datas != null) {
                        var datass = datas.Data;

                        if (datass.length > 0) {

                            _This.srcollList.push(_This.queryString(configs, datass));
                            $.each(_This.srcollList, function (index, item) {
                                $('#' + id).find('.erp-select-ul').append(item)
                            })
                        } else {
                            _This.srcollList = [];
                            $('#' + id).find('.erp-select-ul').html('<li >无匹配数据</li>');

                        }


                        //console.log(_This.srcollList);


                    }

                }

            },
            error: function (data) {
                //隐藏遮罩
                $("#MaskCloud").css("display", "none");
                webConfigs.MessageBox('服务器繁忙，请稍后再试！', '3').Show();
            }
        });
    },

    //拼接html字符串
    this.queryString = function (configs, datass) {
        var $list = [];
        var Multiple = configs.multiple || false;
        var params = configs.data.iData, pageIndex;
        if (typeof params === 'Object') {
            if (params.iPageIndex == 1 && configs.isTotal == true) {
                $list.push($('<li>全部</li>'));
            }

        } else {
            try {
                //console.log(params);
                var Data = JSON.parse(params);
                if (typeof Data == 'object' && Data != null) {
                    if (Data.iPageIndex == 1 && configs.isTotal == true) {
                        $list.push($('<li>全部</li>'));
                    }
                }

            } catch (e) {
                console.log(e);
            }

        }


        $.each(datass, function (index, value) {

            var $li = $('<li></li>');

            var labels = configs.resultObj.labels;
            var querystring = '';
            for (var k in labels) {
                //$li[0].dataset[k] = value[labels[k]] || ''

                $li.data(k, value[labels[k]] || '');
                // querystring += ' ' + k + '=' + (value[labels[k]] || '') + ' ';
            }

            var values = configs.resultObj.values;
            var isTotal = configs.resultObj.isTotal || configs.resultObj.totalProps;
            var names = '';
            if (configs.resultObj.values) {
                for (var k in values) {
                    names += (value[values[k]] || '') + ' ';
                }
            }
            var $span = $('<span style=" margin-right: 20px;"></span>')
            if (configs.resultObj.render) {
                names = configs.resultObj.render(value);
            }
            $span.attr('title', names);
            $span.text(names);
            $li.append($span);
            var itemsdata = '';
            if (isTotal) {

                //  itemsdata = 'totaldata' + '=' + JSON.stringify(value);
                $li.data('total', value);
                // $li[0].dataset.total = JSON.stringify(value) || ''
            }
            var MultipleStr = ''
            MultipleStr = '<label class="erp-select-checkbox">'
                     + '<input type="checkbox" class="ace"  value="">'
                     + ' <span class="lbl"></span>'
                     + '</label>';
            $li.append(MultipleStr);


            $list.push($li);
        })
        return $list;
    }
    // 默认值
    Object.defineProperty(this, 'value', {
        get: function () {
            return this.values;
        },
        set: function (value) {
            this.values = value;
            this.singleClick();
        }
    });
    //滚动加载
    this.scrollData = function () {

        var _This = this;
        var id = this.id;
        var configs = this.configs;

        $('#' + id + ' .erp-select-ul').scroll(function () {
            // 下来框可视高度
            var visibleHeight = $(this).prop('clientHeight');
            // 滚动条当前位置
            var scrollTop = $(this).prop('scrollTop');
            // 文档高度
            var scrollHeight = $(this).prop('scrollHeight');
            if (scrollTop + visibleHeight >= scrollHeight) {
                if (_This.isLast == 'true') {
                    return;
                }
                //显示遮罩
                $("#MaskCloud").css("display", "block");
                if (_This.isLast == null) {
                    var params = configs.data.iData;
                    if (typeof params === 'Object') {
                        if (params.iPageIndex == 1) {
                            params.iPageIndex = 2;
                        }

                    } else {
                        //console.log(params);
                        var Data = JSON.parse(params);
                        if (Data.iPageIndex == 1) {
                            Data.iPageIndex = 2;
                        }
                        params = JSON.stringify(Data);

                    }
                    configs.data = { 'iData': params };
                }

                var datas;

                var url = webConfigs.webApiPath() + configs.url;

                //console.log(configs.data);

                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: 'jsonp',
                    data: configs.data,
                    async: false,
                    success: function (data) {
                        $("#MaskCloud").css("display", "none");
                        datas = data;
                        datas.Data = JSON.parse(data.Data);
                        datas.HelperData = JSON.parse(data.HelperData);
                        //console.log(datas);

                        if (datas.Result == 1) {
                            if (datas != null) {
                                var datass = datas.Data;

                                if (datass.length == _This.pageSize) {
                                    _This.isLast = 'false';

                                    var params = configs.data.iData;
                                    if (typeof params === 'Object') {
                                        params.iPageIndex += 1;
                                    } else {
                                        var Data = JSON.parse(params);

                                        Data.iPageIndex += 1;

                                        params = JSON.stringify(Data);

                                    }
                                    configs.data = { 'iData': params };

                                } else {
                                    _This.isLast = 'true';
                                    _This.srcollList = [];

                                }

                                _This.srcollList = _This.srcollList.concat(_This.srcollList, _This.queryString(configs, datass));

                                $.each(_This.srcollList, function (index, item) {
                                    $('#' + id).find('.erp-select-ul').append(item)
                                })



                            }

                        }
                        //if (datas.Result == 2) {
                        //    webConfigs.MessageBox(datas.Message).Show();
                        //}
                        //if (datas.Result == 3) {
                        //    webConfigs.MessageBox(datas.Message).Show();
                        //}
                    },
                    error: function (data) {
                        //隐藏遮罩
                        $("#MaskCloud").css("display", "none");
                        webConfigs.MessageBox('服务器繁忙，请稍后再试！', '3').Show();
                    }
                });

            }
        })
    },
    /***
     * 单选
     * config 配置
     * obj  指向li元素
     */
    this.singleClick = function (config, obj) {
        var _This = this;
        var id = this.id;
        var parentEl = $('#' + id).find('.mw-select-box');
        var input = $('#' + id).find('.erp-select-input');
        var props = config.resultObj.labels;
        var nextGetData = config.nextGetData;
        var isTotal = config.resultObj.isTotal || config.resultObj.totalProps;
        var checkbox = $(obj).find("input[type='checkbox']");
        //console.log(config);
        if ($(obj).text() == '无匹配数据') {
            _This.clearProps();
            $(input).val('');
            parentEl.removeClass('open');
            return;
        }
        input.val($(obj).text().trim());
        input.attr('title',$(obj).text().trim());
        if (!isTotal) {
            $.each(props, function (key, value) {
                var liprops = $(obj).data(key);
                // input[0].dataset[key] = liprops;
                $(input).data(key, liprops);

            })
        } else {
            $.each($(obj).data('total'), function (key,value) {
                $(input).data(key,value);
            })
           
        }
       
        $("#" + id).find(".erp-select-ul input").prop("checked", false);
        checkbox.prop("checked", true);

        parentEl.removeClass('open');



    }

    //多选
    this.MultipleClick = function (config, obj) {
        var checkbox = $(obj).find("input");
        var input = $('#' + id).find('.erp-select-input');
        var _This = this;
        var props = config.resultObj.labels;
    
        if (checkbox.prop('checked')) {
            checkbox.prop('checked', false);
            _This.MultipleChange(obj);
        } else {
            checkbox.prop('checked', true);
            _This.MultipleChange(obj);
        }
       

    }

    this.MultipleChange = function (li) {
        var _This = this;
        var checkedStr = '';
        var input = $('#' + id).find('.erp-select-input');
        
        if ($('#' + id).find('.erp-select-ul .erp-select-checkbox input:checked').length == 0) {
            _This.multipleData = [];
            for (var k in input.data()) {
                input.data(k, '');
            }
        }
        if ($(li).find('input').prop("checked")) {
            var itemData = $(li).data();
            itemData._name = $(li).text().trim();
            
            _This.multipleData.push(itemData);
         
        } else {
          
            for (var i = 0; i < _This.multipleData.length; i++) {
               
                var mutipleItem = _This.multipleData[i];
                if (mutipleItem._name == $(li).text().trim()) {
                    _This.multipleData.splice(i, 1);
                    return;
                }
            }
           
        }

  
        _This.clearProps();
        $.each(_This.multipleData, function (index, item) {
            if (index != (_This.multipleData.length - 1)) {
                checkedStr += item._name + _This.sign;
            } else {
                checkedStr += item._name;
            }
           
        })
        input.attr('title', checkedStr);
        input.val(checkedStr);
        if (_This.multipleData.length > 0) {
            input.data('_value', _This.multipleData);
        }
    }
    //初始化清除input属性
    this.clearProps = function () {
        var labels = this.configs.resultObj.labels;
        var totalProps = this.configs.resultObj.isTotal || this.configs.resultObj.totalProps;
        var id = this.id;
        var input = $("#" + id).find("input");
        if (labels) {
            $.each(labels, function (key, value) {
                input.data(key, '');
            })
        }
        if (totalProps) {
            var props = input.data();
            $.each(props, function (key, value) {
                input.data(key, '');
            })
        }
      
    }
}

/******************************************下拉框End***********************************/

//var modalConfigs = {
//    width: 542,
//    list: [
//        {
//            title: '厂商名称',
//            type: 'input',
//            col: '6',
//            placeholder: '厂商名称',

//        }
//    ]

//}

//var addModal = new erpModals('addModal');
//addModal.init(modalConfigs);
var erpModals = function (id) {
    this.id = id;
    this.init = function (configs) {
        this.id = id;
        this.configs = configs;
        return this.renderModal();
    }

    this.modalheader = function () {
        var headerText = this.configs.headerText || '新增';
        return ' <div class="modal-header">'
               + ' <button type="button" class="close" data-dismiss="modal" aria-label="close">'
               + ' <span aria-hidden="true">&times;</span></button>'
               + '  <h4 class="modal-title cc_txt" id="mymodallabel" style="font-size:14px;">' + headerText + '</h4>'
               + '</div>'
    }

    //{title:'供应商名称',type:'',col:'',placeholder:'',render:function(){}}
    this.modalbody = function () {
        var bodyData = this.configs.list;
        var bodyStr = '<div class="modal-body row">';
        $.each(bodyData, function (index, item) {
            var itemStr = '';
            var readonlyStr = '';
            var disabledStr = '';
            if (item.isSearch == false) {
                readonlyStr = 'readonly="readonly"';

            }
            if (item.isDisabled == true) {
                disabledStr = 'disabled="disabled"';
            }
            switch (item.type) {
                case 'input':
                    itemStr = ' <input ' + readonlyStr + ' ' + disabledStr + ' placeholder="' + item.placeholder + '" type="text" style="width:135px;text-indent:5px;" class="property-sort" />'
                    break;

            }
            bodyStr += '<div class="modal-item col-md-' + item.col + '">'
               + '<label class="modal-item-label" style="width:70px;">' + item.title + '</label>';
            if (item.render) {

                bodyStr += item.render()

            } else {
                bodyStr += itemStr
            }
            bodyStr += '</div>'
        })
        bodyStr += '</div>'
        return bodyStr
    }

    this.modalfooter = function () {
        var oktext = this.configs.oktext || '确定';
        var canceltext = this.configs.canceltext || '返回';
        return '<div class="btnt  modal-footer">'
               + '   <button class="btn1" onclick="sure()">' + oktext + '</button>'
               + '   <button class="btn2" data-dismiss="modal">' + canceltext + '</button>'
               + ' </div>'
    }

    this.renderModal = function (data) {
        var modalHeader = this.modalheader();
        var modalBody = this.modalbody();
        var modalFooter = this.modalfooter();
        var modal = '<div class="modal fade erp-modal" id="mymodal" tabindex="-1" role="dialog" aria-labelledby="messagemodellabel">'
                 + '   <div class="modal-dialog" role="document" style="width:' + this.configs.width + 'px">'
                 + '     <div class="modal-content ">'
                 + modalHeader
                 + modalBody
                 + modalFooter
                 + '     </div>'
                 + '    </div>'
                 + '  </div>'

        $('#' + id).html(modal);

    }


}

//var CascadersData = {};
//var Cascaders = new addressCascaders('address-cascader'); //初始化
//Cascaders.addressCascader.on('on-change', function (val) {
//    CascadersData = val;    //传值取值
//    console.log(CascadersData);
//});
//Cascaders.render({ _depth: 0 }, function (data) {
//    Cascaders.renderCascader(data); //页面加载
//})

//省市区级联构造函数
function addressCascaders(params) {
    var Cascader = {};
    Cascader = new mwCascader(params);
    //Cascader ajax options
    
    (function () {
        Cascader.cascaderAjax = {
            province: {

                url: webConfigs.webApiPath() + 'Generic/GetProvince',
                data: {},

            },
            city: {

                url: webConfigs.webApiPath() + 'Generic/GetCity',
                data: {},

            },
            area: {

                url: webConfigs.webApiPath() + 'Generic/GetCountry',
                data: {},

            }
        };
        Cascader.init({
            placeholder: '省/市/县',
            trigger: 'hover',
            width: 135
        });
        
        

        Cascader.render = function (obj, cb) {
            var depth = obj._depth + 1
            var options;
            switch (depth) {
                case 1:
                    options = Cascader.cascaderAjax.province;
                    options.data = { "iData": "" }
                    break;
                case 2:
                    options = Cascader.cascaderAjax.city;
                    options.data = { 'iData': obj._id }
                    break;
                case 3:
                    options = Cascader.cascaderAjax.area;
                    options.data = { 'iData': obj._id }
                    break;
            }
          
            if (!options) {
                return;
            }
            mwUnits.getData(options).then(
                
                 function (res) {
                     if (res) {
                         
                         var data = JSON.parse(res.HelperData);
                        
                         $.each(data, function (i, v) {
                             switch (depth) {
                                 case 1:
                                     v._label = v.ProvinceName
                                     v._value = v.ProvinceCode
                                     v._id = v.ProvinceCode
                                     v._depth = depth
                                     v._pid = 0;
                                     v._count = 1
                                     break;
                                 case 2:
                                     v._label = v.CityName
                                     v._value = v.CityCode
                                     v._id = v.CityCode
                                     v._depth = depth
                                     v._pid = obj._id;
                                     v._count = 1
                                     break;
                                 case 3:

                                     v._label = v.CountryName
                                     v._value = v.CountryCode
                                     v._id = v.CountryCode
                                     v._depth = depth
                                     v._pid = obj._id;
                                     v._count = 0
                                     break;
                             }

                         })
                         
                         if (depth == 1) {
                             data.unshift({
                                 _label: '全部',
                                 _value: '0000',
                                 _id: '0000',
                                 _depth: depth,
                                 _pid: 0,
                                 _count: 0
                             })
                         }
                         
                         
                         cb && cb(data)
                     }
                 },
                 function (err) {
                     console.log(['err', err]);
                 }
             )
        }

        Cascader.on('on-disable-child', function (val) {
            //console.log(['on-disable-child', val]);
            Cascader.render(val, function (data) {
                
                Cascader.renderChildList(val, data);
            });
        });

    })()
  

    return Cascader;
}

//商品信息级联
function GoodCascaders(params) {
    var Cascader = {};
    Cascader = new mwCascader(params.id);
   
    Cascader.sendData = params.data || {};
    Cascader.width = params.width || 135
    Cascader.showValueDeep = params.showValueDeep || -1;
    var type = params.Type || 'owner';//默认
    (function () {
        //Cascader ajax options
        //销售管理 商品管理 销售政策（基础授权）
        Cascader.cascaderAjaxOwner = {
            className: {

                url: webConfigs.webApiPath() + 'Purchase/GetPurchasegoodClassNameByPage',
                data: {},

            },
            brandName: {

                url: webConfigs.webApiPath() + 'Purchase/GetPurchasegoodBrandNameByPage',
                data: {},

            },
            goods: {

                url: webConfigs.webApiPath() + 'Purchase/GetPurchasegoodUnit_Pack',
                data: {},

            }
        };
        //采购-商品管理-外购
        Cascader.cascaderAjaxOut = {
            className: {

                url: webConfigs.webApiPath() + 'BasePolicy/GetProductGroupByClass',
                data: {},

            },
            brandName: {

                url: webConfigs.webApiPath() + 'BasePolicy/GetProductGroupByBrand',
                data: {},

            },
            goods: {

                url: webConfigs.webApiPath() + 'BasePolicy/GetProductByBrandAndClass',
                data: {},

            }
        };
        //销售政策（数量政策，积分政策,基础政策）
        Cascader.cascaderAjaxCount = {
            className: {

                url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerClassId',
                data: {},

            },
            brandName: {

                url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerBrandId',
                data: {},

            },
            goods: {

                url: webConfigs.webApiPath() + 'InitialPolicy/GetCustomerProduct',
                data: {},

            }
        };
        Cascader.init({
            placeholder:params.placeholder|| '品名/品牌',
            trigger: params.trigger||'click',
            width: Cascader.width,
            showValueDeep: Cascader.showValueDeep
        });
        


        Cascader.render = function (obj, cb) {
            var depth = obj._depth + 1
            var options;
            var total = params.isTotal || false;
            var cascaderAjax;
            switch (type) {
                case 'owner':
                    cascaderAjax = Cascader.cascaderAjaxOwner;
                    break;
                case 'out':
                    cascaderAjax = Cascader.cascaderAjaxOut;
                    break;
                case 'count':
                    cascaderAjax = Cascader.cascaderAjaxCount;
                    break;
            }
            switch (depth) {
                case 1:
                    options = cascaderAjax.className;
                    var queryString = {};
                    $.each(Cascader.sendData, function (key, value) {
                        if (key != 'Flag') {
                            queryString[key] = value;
                        }
                    })
                    options.data = { 'iData': JSON.stringify(queryString) }
                    break;
                case 2:
                    options = cascaderAjax.brandName;
                    var twoparams = {};
                    $.each(Cascader.sendData, function (key, value) {
                        twoparams[key] = value;
                    })
                    twoparams.ClassId = obj._id;
                    options.data = {
                        'iData': JSON.stringify(twoparams)
                    }
                  
                    break;
                case 3:
                    options = cascaderAjax.goods;
                    var threeParams = {};
                    $.each(Cascader.sendData, function (key, value) {
                        threeParams[key] = value;
                    })
                    threeParams.ClassId = obj._pid;
                    threeParams.BrandId = obj._id;
                    options.data = {
                        'iData': JSON.stringify(threeParams)
                    }
                   
                    break;
            }

            if (!options) {
                return;
            }
            mwUnits.getData(options).then(

                 function (res) {
                     if (res) {
                         var data = JSON.parse(res.Data)
                         $.each(data, function (i, v) {
                             switch (depth) {
                                 case 1:
                                     v._label = v.ClassName
                                     v._value = v.ClassId
                                     v._id = v.ClassId
                                     v._depth = depth
                                     v._pid = 0;
                                     v._count = v.FirstChildCount * 1 || 0
                                     break;
                                 case 2:
                                     v._label = v.BrandName
                                     v._value = v.BrandId
                                     v._id = v.BrandId
                                     v._depth = depth
                                     v._pid = obj._id;
                                     v._count = v.SecondChildCount*1||0
                                     break;
                                 case 3:
                                     var label = mwUnits.template('${stardName} ${modelName} ${gradeName} ${colorName} ${unitName}', {
                                         stardName: v.StardName || '',
                                         modelName: v.ModelName || '',
                                         gradeName: v.GradeName || '',
                                         colorName: v.ColorName || '',
                                         unitName: (v.GoodsUnitName|| (v.UnitName || '')) + ' ' + formatUnitName(v.UnitAttrValues)
                                     })
                                     v._label = label
                                     v._value = v.ProductId
                                     v._id = v.ProductId + (v.UnitAttrValues || '') + (v.UnitId || '')
                                     v._depth = depth
                                     v._pid = obj._id;
                                     v._count = v.ThreeChildCount * 1 || 0
                                     break;
                             }

                         })
                         if (data&&data.length>0) {
                             var totalStr;
                             if (total) {
                                 totalStr = '全部<span style="color:#ccc;font-size:12px;">(品名)</span>'
                             } else {
                                 totalStr = '<span style="color:#ccc;font-size:12px;">品名</span>'
                             }
                             switch (depth) {
                                 case 1:
                                     data.unshift({
                                         _label: totalStr,
                                         _value: '品名',
                                         _id: '品名',
                                         _depth: depth,
                                         _pid: 0,
                                         _count: 0
                                     })
                                     break;
                                 case 2:
                                     data.unshift({
                                         _label: '<span style="color:#ccc;font-size:12px;">品牌</span>',
                                         _value: '品牌',
                                         _id: '品牌',
                                         _depth: depth,
                                         _pid: obj._id,
                                         _count: 0
                                     })
                                     break;
                             }
                         }
                       
                        // console.log(data);

                         cb && cb(data)
                     }
                 },
                 function (err) {
                     console.log(['err', err]);
                 }
             )
        }

        Cascader.on('on-disable-child', function (val) {
            
             if (val._id=='品名'||val._id=='品牌') {
                 return;
             }
            // console.log(['on-disable-child', val]);
            Cascader.render(val, function (data) {

                Cascader.renderChildList(val, data);
            });
        });
     

    })()


    return Cascader;
}

//下拉框
function erpSelect(params) {
    var Select = new mwSelect(params.id);
    Select.setting = {};//select setting
    Select.setting.disabled = params.disabled || false;// 是否禁用
    Select.setting.placeholder = params.placeholder;
    Select.setting.width = params.width||135;
    Select.setting.filterable = params.filterable||false;// 是否支持搜索
    Select.setting.labelInValue = params.labelInValue||true; // 是否全部返回，默认只返回value值
    Select.setting.clearable = params.clearable||true;// 是否可以清空选项，只在单选时有效
    Select.ajaxOptions = {};//select ajax options
    Select.ajaxOptions.url=params.url;//接口地址
    Select.ajaxOptions.sendData = params.data || {};
    Select.ajaxOptions.results = params.results;
    Select.dataList = {};
    Select.dataList.selectPage = 1;
    Select.dataList.selectEnd = false;
    Select.dataList.selectValue = params.selectValue;

    (function () {

        Select.init(Select.setting);
        //客户名称 选中事件
        Select.on('on-change', function (val) {

            Select.change(val);
        })
      
        //Select.on('on-change', function (val) {
        //    Select.dataList.selectValue = val;

        //})
        Select.on("on-scroll", function () {
            Select.scroll();
        })
        Select.on("on-input-change", function (data) {
            Select.input(data);
        })
        Select.getData = function () {

        }
        ////滚动加载
        //Select.on('on-scroll', function () {
        //    Select.dataList.selectPage += 1;

        //    if (!Select.dataList.selectEnd) {
        //        getSelectData(Select.dataList.selectPage, function (data) {
        //            Select.renderDropList(data)
        //        })
        //    }
        //})
        //// 搜索事件
        //Select.on('on-input-change', function (query) {

        //    if (!Select.dataList.selectEnd) {
        //        searchSelectData(1, query, function (data) {
        //            Select.renderSelect(data);
        //        })
        //    }

        //})

        //function searchSelectData(page, query, cb) {
        //    var params = $.extend(Select.ajaxOptions.sendData, { iPageIndex: 1 })
        //    searchReqOptions.customer.data = { "iData": JSON.stringify({ iPageIndex: 1, CustomerName: query }) };
        //    SelectRender(Select.ajaxOptions, cb);
        //}
        //客户名称 初始化加载
        function getSelectData(page, cb) {

            SelectRender(Select.ajaxOptions, cb);
        }
        Select.SelectRender = function (options, cb) {

            mwUnits.getData(options).then(
              function (res) {
                  if (res) {

                      var data = JSON.parse(res.Data)
                      $.each(data, function (i, v) {
                          $.each(options.results, function (key, value) {
                              switch (key) {
                                  case 'render':
                                      v._label = value(v);
                                      break;
                                  case '_label':
                                      v._label = v[value];
                                      break;
                                  case '_value':
                                      v._value = v[value];
                                      v._id = v[value];
                                      break;
                              }

                          })

                      })
                      if (data.length === 0) {
                          Select.dataList.selectEnd = false;
                      }
                      cb && cb(data)
                  }
              },
              function (err) {
                  console.log(['err', err]);
              }
          );
        }
    })()
}

