/**
 * Created by Ian on 2015/5/20.
 */
///<reference path="../../tsd/typings/jquery/jquery.d.ts" />
var RomanySoftPlugins;
(function (RomanySoftPlugins) {
    var IAP;
    (function (IAP) {
        // 内置购买的插件/商品/通用处理方式
        var Product = (function () {
            function Product() {
                this.enable = true; // 是否可用, 默认可用
                this.inAppStore = true; // 是否在AppStore中已经配置存在
                this.id = ""; // 唯一ID标识
                this.name = ""; // 产品英文名称(缺省)
                this.description = ""; // 产品内置描述(缺省)
                this.type = ""; // 产品类型
                this.quantity = 0; // 产品数量
                this.price = "0.99$"; // 产品单价
                this.imageUrl = ""; // 产品截图
                this.uiShow = true; // 是否在UI上有显示
                this.bundleIds = []; // 打包产品包括, 适用于捆绑销售
                this.comment = ""; // 备注内容
            }
            Product.create = function (cloneObj) {
                var t = new this();
                if (cloneObj instanceof Object) {
                    for (var k in cloneObj) {
                        if (k in t && (typeof t[k] == typeof cloneObj[k])) {
                            t[k] = cloneObj[k];
                        }
                    }
                }
                return t;
            };
            return Product;
        }());
        IAP.Product = Product;
        var IAP$Helper = (function () {
            function IAP$Helper() {
                this.productList = []; // 商品列表
            }
            IAP$Helper.prototype.addProduct = function (product) {
                var find_product = this.getProduct(product.id);
                if (null == find_product) {
                    this.productList.push(product);
                    return true;
                }
                return false;
            };
            IAP$Helper.prototype.removeProduct = function (id) {
                var find_product = this.getProduct(id);
                if (null != find_product) {
                    this.productList.splice($.inArray(find_product, this.productList), 1);
                    return true;
                }
                return false;
            };
            IAP$Helper.prototype.getProduct = function (id) {
                var p = null;
                $.each(this.productList, function (index, product) {
                    if (product.id == id) {
                        p = product;
                        return false;
                    }
                });
                return p;
            };
            IAP$Helper.prototype.getProductName = function (id, cb_delegate) {
                var name = "";
                var product = this.getProduct(id);
                if (null == product)
                    return name;
                name = product.name;
                cb_delegate && (name = cb_delegate(id));
                return name;
            };
            IAP$Helper.prototype.getProductDescription = function (id, cb_delegate) {
                var description = "";
                var product = this.getProduct(id);
                if (null == product)
                    return description;
                description = product.description;
                cb_delegate && (description = cb_delegate(id));
                return description;
            };
            IAP$Helper.prototype.getProductQuantity = function (id, cb_delegate) {
                var _quantity = 0;
                var product = this.getProduct(id);
                if (null == product)
                    return _quantity;
                _quantity = product.quantity;
                cb_delegate && (_quantity = cb_delegate(id));
                return _quantity;
            };
            IAP$Helper.prototype.getAllEnableInAppStoreProducts = function () {
                var list = [];
                $.each(this.productList, function (index, product) {
                    if (product.enable && product.inAppStore) {
                        list.push(product);
                    }
                });
                return list;
            };
            IAP$Helper.prototype.getAllEnableInAppStoreProductIds = function () {
                var idList = [];
                $.each(this.productList, function (index, product) {
                    if (product.enable && product.inAppStore) {
                        idList.push(product.id);
                    }
                });
                return idList;
            };
            IAP$Helper.prototype.getAllEnableProducts = function () {
                var list = [];
                $.each(this.productList, function (index, product) {
                    if (product.enable) {
                        list.push(product);
                    }
                });
                return list;
            };
            IAP$Helper.prototype.getAllEnableProductIds = function () {
                var idList = [];
                $.each(this.productList, function (index, product) {
                    if (product.enable) {
                        idList.push(product.id);
                    }
                });
                return idList;
            };
            IAP$Helper.prototype.getInBundleProductList = function (id) {
                var list = [];
                $.each(this.productList, function (index, product) {
                    if (product.enable) {
                        if ($.inArray(id, product.bundleIds) > -1) {
                            list.push(product);
                        }
                    }
                });
                return list;
            };
            IAP$Helper.prototype.getProductIsPurchased = function (id, cb_delegate) {
                var t = this;
                var b$ = window.BS.b$;
                var b_inAppStore = b$.App.getSandboxEnable();
                var idList = b_inAppStore ? t.getAllEnableInAppStoreProductIds() : t.getAllEnableProductIds();
                if ($.inArray(id, idList) > -1) {
                    var default_fun = function (id) {
                        try {
                            var self_count = b_inAppStore ? b$.IAP.getUseableProductCount(id) : t.getProductQuantity(id, null);
                            if (self_count >= 1) {
                                return true;
                            }
                            var hasPurchased = false;
                            var assBundleProductList = t.getInBundleProductList(id);
                            $.each(assBundleProductList, function (index, product) {
                                if (t.getProductIsPurchased(product.id, null)) {
                                    hasPurchased = true;
                                }
                            });
                            return hasPurchased;
                        }
                        catch (e) {
                            console.error(e);
                        }
                        return false;
                    };
                    var fnc = cb_delegate || default_fun;
                    return fnc(id);
                }
                console.warn(id + " no found.");
                return false;
            };
            IAP$Helper.prototype.getProductPurchasedCount = function (id, cb_delegate) {
                var t = this;
                var idList = t.getAllEnableInAppStoreProductIds();
                if ($.inArray(id, idList) > -1) {
                    var default_fun = function (id) {
                        try {
                            var b$ = window.BS.b$;
                            var self_count = b$.IAP.getUseableProductCount(id);
                            return self_count;
                        }
                        catch (e) {
                            console.error(e);
                        }
                        return 0;
                    };
                    var fnc = cb_delegate || default_fun;
                    return fnc(id);
                }
                console.warn(id + " no found.");
                return 0;
            };
            IAP$Helper.prototype.syncProductWithAppStore = function (id, cb_delegate) {
                var t = this;
                var default_func = function (id) {
                    var product = t.getProduct(id);
                    try {
                        var b$ = window.BS.b$;
                        if (product.enable && product.inAppStore) {
                            product.quantity = b$.IAP.getUseableProductCount(id);
                            product.price = b$.IAP.getPrice(id);
                        }
                    }
                    catch (e) { }
                    cb_delegate && cb_delegate(product);
                };
                default_func(id);
            };
            IAP$Helper.prototype.updateProductByIdWhitAppStore = function (id, info, cb_delegate) {
                var product = this.getProduct(id);
                if (product.enable && product.inAppStore) {
                    product.price = info.price;
                }
                cb_delegate && cb_delegate();
            };
            return IAP$Helper;
        }());
        IAP.IAP$Helper = IAP$Helper;
    })(IAP = RomanySoftPlugins.IAP || (RomanySoftPlugins.IAP = {}));
})(RomanySoftPlugins || (RomanySoftPlugins = {}));
//# sourceMappingURL=plugin.iap.js.map