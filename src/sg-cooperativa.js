'use strict';

(function () {

    var module = angular.module('sg-cooperativa', ['restangular']);


    module.provider('sgCooperativa', function () {

        this.restUrl = 'http://localhost';

        this.$get = function () {
            var restUrl = this.restUrl;
            return {
                getRestUrl: function () {
                    return restUrl;
                }
            }
        };

        this.setRestUrl = function (restUrl) {
            this.restUrl = restUrl;
        };
    });


    module.factory('CooperativaRestangular', ['Restangular', 'sgCooperativa', function (Restangular, sgCooperativa) {
        return Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(sgCooperativa.getRestUrl());
        });
    }]);

    var RestObject = function (url, restangular) {
        var modelMethods = {

            $getUrl: function () {
                return restangular.one(url, this.id).getRestangularUrl();
            },
            $getShortUrl: function (subresource) {
                return restangular + '/' + this.id + '/' + subresource;
            },

            $new: function (id) {
                return angular.extend({id: id}, modelMethods);
            },
            $build: function () {
                return angular.extend({id: undefined}, modelMethods, {
                    $save: function () {
                        return restangular.all(url).post(this);
                    }
                });
            },

            $search: function (queryParams) {
                return restangular.all(url).getList(queryParams);
            },

            $find: function (id) {
                return restangular.one(url, id).get();
            },
            $save: function () {
                return restangular.one(url, this.id).customPUT(restangular.copy(this), '', {}, {});
            },

            $enable: function () {
                return restangular.one(url, this.id).all('enable').post();
            },
            $disable: function () {
                return restangular.one(url, this.id).all('disable').post();
            },
            $remove: function () {
                return restangular.one(url, this.id).remove();
            }
        };

        restangular.extendModel(url, function (obj) {
            if (angular.isObject(obj)) {
                return angular.extend(obj, modelMethods);
            } else {
                return angular.extend({id: obj}, modelMethods)
            }
        });

        return modelMethods;
    };

    module.factory('SGBoveda', ['CooperativaRestangular', function (CooperativaRestangular) {

        var bovedaRest = RestObject('bovedas', CooperativaRestangular);

        /**
         * Historiales*
         * */
        var historialesUrl = bovedaRest.$getShortUrl('historiales');
        var historialBovedaRest = RestObject(historialesUrl, CooperativaRestangular);
        historialBovedaRest.$cerrar = function () {
            return CooperativaRestangular.one(historialesUrl, historialBovedaRest.id).all('cerrar').post();
        };
        historialBovedaRest.$congelar = function () {
            return CooperativaRestangular.one(historialesUrl, historialBovedaRest.id).all('congelar').post();
        };
        historialBovedaRest.$descongelar = function () {
            return CooperativaRestangular.one(historialesUrl, historialBovedaRest.id).all('descongelar').post();
        };
        historialBovedaRest.$getDetalle = function () {
            return CooperativaRestangular.one(historialesUrl, historialBovedaRest.id).all('detalle').getList();
        };
        bovedaRest.SGHistorialBoveda = function(){
            return historialBovedaRest;
        };

        /**
         * Transacciones boveda caja*
         * */
        var transaccionesBovedaCajaUrl = historialBovedaRest.$getShortUrl('transaccionesBovedaCaja');
        var transaccionesBovedaCajaRest = RestObject(transaccionesBovedaCajaUrl, CooperativaRestangular);
        transaccionesBovedaCajaRest.$confirmar = function () {
            return CooperativaRestangular.one(transaccionesBovedaCajaUrl, transaccionesBovedaCajaRest.id).all('confirmar').post();
        };
        transaccionesBovedaCajaRest.$cancelar = function () {
            return CooperativaRestangular.one(transaccionesBovedaCajaUrl, transaccionesBovedaCajaRest.id).all('cancelar').post();
        };
        transaccionesBovedaCajaRest.$getDetalle = function () {
            return CooperativaRestangular.one(transaccionesBovedaCajaUrl, transaccionesBovedaCajaRest.id).all('detalle').getList();
        };
        historialBovedaRest.SGTransaccionBovedaCaja = function(){
            return transaccionesBovedaCajaRest;
        };

        return bovedaRest;

    }]);

    module.factory('SGCaja', ['CooperativaRestangular', function (CooperativaRestangular) {

        var url = 'cajas';
        var urlCount = 'cajas/count';

        var modelMethos = {
            $new: function (id) {
                return angular.extend({id: id}, modelMethos);
            },
            $build: function () {
                return angular.extend({id: undefined}, modelMethos, {
                    $save: function () {
                        return CooperativaRestangular.all(url).post(this);
                    }
                });
            },
            $save: function () {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this), '', {}, {});
            },

            $find: function (id) {
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function (queryParams) {
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $count: function () {
                return CooperativaRestangular.one(urlCount).get();
            },

            $disable: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/disable').post();
            },
            $remove: function (id) {
                return CooperativaRestangular.one(url, id).remove();
            },

            $abrir: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/abrir').post();
            },
            $cerrar: function (detalle) {
                return CooperativaRestangular.all(url + '/' + this.id + '/cerrar').post(detalle);
            },
            $congelar: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/congelar').post();
            },
            $descongelar: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/descongelar').post();
            },
            $getDetalle: function (queryParams) {
                return CooperativaRestangular.all(url + '/' + this.id + '/detalle').getList(queryParams);
            },


            $addBovedaCaja: function (obj) {
                return CooperativaRestangular.one(url, this.id).all('bovedaCajas').post(obj);
            },
            $getBovedaCajas: function () {
                return CooperativaRestangular.one(url, this.id).all('bovedaCajas').getList();
            },
            $removeBovedaCaja: function (idBovedaCaja) {
                return CooperativaRestangular.one(url, this.id).one('bovedaCajas', idBovedaCaja).remove();
            },

            $addTrabajadorCaja: function (obj) {
                return CooperativaRestangular.one(url, this.id).all('trabajadorCajas').post(obj);
            },
            $getTrabajadorCajas: function () {
                return CooperativaRestangular.one(url, this.id).all('trabajadorCajas').getList();
            }

        };

        CooperativaRestangular.extendModel(url, function (obj) {
            if (angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

    module.factory('SGBovedaCaja', ['CooperativaRestangular', function (CooperativaRestangular) {

        var url = 'bovedaCajas';

        var modelMethos = {
            $new: function (id) {
                return angular.extend({id: id}, modelMethos);
            },
            $build: function () {
                return angular.extend({id: undefined}, modelMethos, {
                    $save: function () {
                        return CooperativaRestangular.all(url).post(this);
                    }
                });
            },
            $save: function () {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this), '', {}, {});
            },

            $find: function (id) {
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function (queryParams) {
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $disable: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/disable').post();
            },
            $remove: function (id) {
                return CooperativaRestangular.one(url, id).remove();
            }

        };

        CooperativaRestangular.extendModel(url, function (obj) {
            if (angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

    module.factory('SGTrabajadorCaja', ['CooperativaRestangular', function (CooperativaRestangular) {

        var url = 'trabajadorCajas';

        var modelMethos = {
            $new: function (id) {
                return angular.extend({id: id}, modelMethos);
            },
            $build: function () {
                return angular.extend({id: undefined}, modelMethos, {
                    $save: function () {
                        return CooperativaRestangular.all(url).post(this);
                    }
                });
            },
            $save: function () {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this), '', {}, {});
            },

            $find: function (id) {
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function (queryParams) {
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $disable: function () {
                return CooperativaRestangular.all(url + '/' + this.id + '/disable').post();
            },
            $remove: function (id) {
                return CooperativaRestangular.one(url, id).remove();
            },

            $findByTipoNumeroDocumento: function (tipodocumento, numeroDocumento) {
                return CooperativaRestangular.one(url + '/tipoDocumento/' + tipodocumento + '/numeroDocumento/' + numeroDocumento).get();
            }
        };

        CooperativaRestangular.extendModel(url, function (obj) {
            if (angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

})();
