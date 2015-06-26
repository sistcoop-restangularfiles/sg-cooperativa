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

    var RestObject = function (path, restangular, extendMethods) {
        var modelMethods = {

            /**
             * Retorna url*/
            $getBasePath: function () {
                return path;
            },
            /**
             * Retorna la url completa del objeto*/
            $getAbsoluteUrl: function () {
                return restangular.one(path, this.id).getRestangularUrl();
            },
            /**
             * Concatena la url de subresource con la url base y la retorna*/
            $concatSubResourcePath: function (subResourcePath) {
                return restangular + '/' + this.id + '/' + subResourcePath;
            },


            $new: function (id) {
                return angular.extend({id: id}, modelMethods);
            },
            $build: function () {
                return angular.extend({id: undefined}, modelMethods, {
                    $save: function () {
                        return restangular.all(path).post(this);
                    }
                });
            },

            $search: function (queryParams) {
                return restangular.all(path).getList(queryParams);
            },

            $find: function (id) {
                return restangular.one(path, id).get();
            },
            $save: function () {
                return restangular.one(path, this.id).customPUT(restangular.copy(this), '', {}, {});
            },

            $enable: function () {
                return restangular.one(path, this.id).all('enable').post();
            },
            $disable: function () {
                return restangular.one(path, this.id).all('disable').post();
            },
            $remove: function () {
                return restangular.one(path, this.id).remove();
            }
        };

        modelMethods = angular.extend(modelMethods, extendMethods);

        restangular.extendModel(path, function (obj) {
            if (angular.isObject(obj)) {
                return angular.extend(obj, modelMethods);
            } else {
                return angular.extend({id: obj}, modelMethods)
            }
        });

        restangular.extendCollection(path, function (collection) {
            angular.forEach(collection, function (row) {
                angular.extend(row, modelMethods);
            });
            return collection;
        });

        return modelMethods;
    };

    module.factory('SGBoveda', ['CooperativaRestangular', function (CooperativaRestangular) {

        var bovedaResource = RestObject('bovedas', CooperativaRestangular);

        /**
         * Historiales*
         * */
        bovedaResource.SGHistorialBoveda = function () {
            var extendMethod = {
                $cerrar: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('cerrar').post();
                },
                $congelar: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('congelar').post();
                },
                $descongelar: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('descongelar').post();
                },
                $getDetalle: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('detalle').getList();
                }
            };
            var historialSubResource = RestObject(bovedaResource.$concatSubResourcePath('historiales'), CooperativaRestangular, extendMethod);

            /**
             * Transacciones boveda caja*
             * */
            historialSubResource.SGTransaccionBovedaCaja = function () {
                var extendMethods = {
                    $confirmar: function () {
                        return CooperativaRestangular.one(this.$getBasePath(), this.id).all('confirmar').post();
                    },
                    $cancelar: function () {
                        return CooperativaRestangular.one(this.$getBasePath(), this.id).all('cancelar').post();
                    },
                    $getDetalle: function () {
                        return CooperativaRestangular.one(this.$getBasePath(), this.id).all('detalle').getList();
                    }
                };
                var transaccionBovedaCajaSubResource = RestObject(historialSubResource.$concatSubResourcePath('transaccionesBovedaCaja'), CooperativaRestangular, extendMethods);
                return transaccionBovedaCajaSubResource;
            };

            return historialSubResource;
        };

        return bovedaResource;
    }]);

    module.factory('SGCaja', ['CooperativaRestangular', function (CooperativaRestangular) {

        var cajaResource = RestObject('cajas', CooperativaRestangular);

        /**
         * BovedaCaja*
         * */
        cajaResource.SGBovedaCaja = function () {
            var bovedaCajaSubResource = RestObject(cajaResource.$concatSubResourcePath('bovedasCaja'), CooperativaRestangular);
            bovedaCajaSubResource = angular.extend(bovedaCajaSubResource, {});

            /**
             * HistorialBovedaCaja*
             * */
            bovedaCajaSubResource.SGHistorialBovedaCaja = function () {
                var historialBovedaCajaSubResource = RestObject(bovedaCajaSubResource.$concatSubResourcePath('historiales'), CooperativaRestangular);
                historialBovedaCajaSubResource = angular.extend(historialBovedaCajaSubResource, {
                    $congelar: function () {
                        return CooperativaRestangular.one(historialBovedaCajaSubResource.$getBasePath(), this.id).all('congelar').post();
                    },
                    $descongelar: function () {
                        return CooperativaRestangular.one(historialBovedaCajaSubResource.$getBasePath(), this.id).all('descongelar').post();
                    },
                    $cerrar: function (detalle) {
                        return CooperativaRestangular.one(historialBovedaCajaSubResource.$getBasePath(), this.id).all('cerrar').post(detalle);
                    },
                    $getDetalle: function () {
                        return CooperativaRestangular.one(historialBovedaCajaSubResource.$getBasePath(), this.id).all('detalle').getList();
                    }
                });

                /**
                 * TransaccionBovedaCaja*
                 * */
                historialBovedaCajaSubResource.SGTransaccionBovedaCaja = function () {
                    var transaccionBovedaCajaSubResource = RestObject(historialBovedaCajaSubResource.$concatSubResourcePath('transaccionesBovedaCaja'), CooperativaRestangular);
                    transaccionBovedaCajaSubResource = angular.extend(transaccionBovedaCajaSubResource, {
                        $confirmar: function () {
                            return CooperativaRestangular.one(transaccionBovedaCajaSubResource.$getBasePath(), this.id).all('confirmar').post();
                        },
                        $cancelar: function () {
                            return CooperativaRestangular.one(transaccionBovedaCajaSubResource.$getBasePath(), this.id).all('cancelar').post();
                        },
                        $getDetalle: function () {
                            return CooperativaRestangular.one(transaccionBovedaCajaSubResource.$getBasePath(), this.id).all('detalle').getList();
                        }
                    });
                    return transaccionBovedaCajaSubResource;
                };

                /**
                 * TransaccionCajaCaja*
                 * */
                historialBovedaCajaSubResource.SGTransaccionCajaCaja = function () {
                    var transaccionCajaCajaSubResource = RestObject(historialBovedaCajaSubResource.$concatSubResourcePath('transaccionesCajaCaja'), CooperativaRestangular);
                    transaccionCajaCajaSubResource = angular.extend(transaccionCajaCajaSubResource, {
                        $confirmar: function () {
                            return CooperativaRestangular.one(transaccionCajaCajaSubResource.$getBasePath(), this.id).all('confirmar').post();
                        },
                        $cancelar: function () {
                            return CooperativaRestangular.one(transaccionCajaCajaSubResource.$getBasePath(), this.id).all('cancelar').post();
                        },
                        $getDetalle: function () {
                            return CooperativaRestangular.one(transaccionCajaCajaSubResource.$getBasePath(), this.id).all('detalle').getList();
                        }
                    });
                    return transaccionCajaCajaSubResource;
                };

                return historialBovedaCajaSubResource;
            };

            return bovedaCajaSubResource;
        };

        /**
         * TrabajadorCaja*
         * */
        cajaResource.SGTrabajadorCaja = function () {
            var trabajadorCajaSubResource = RestObject(cajaResource.$concatSubResourcePath('trabajadoresCaja'), CooperativaRestangular);
            trabajadorCajaSubResource = angular.extend(trabajadorCajaSubResource, {});
            return trabajadorCajaSubResource;
        };

        return cajaResource

    }]);

    module.factory('SGTransaccion', ['CooperativaRestangular', function (CooperativaRestangular) {

        var transaccionResource = RestObject('transacciones', CooperativaRestangular);

        return transaccionResource;
    }]);

})();
