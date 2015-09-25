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
            $getModelMethods: function () {
                return modelMethods;
            },

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
                return this.$getBasePath() + '/' + this.id + '/' + subResourcePath;
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
                return restangular.all(path).customGET('search', queryParams);
            },
            $getAll: function (queryParams) {
                return restangular.all(path).getList(queryParams);
            },

            $find: function (id) {
                return restangular.one(path, id).get();
            },
            $save: function () {
                return restangular.one(path, this.id).customPUT(restangular.copy(this), '', {}, {});
            },
            $saveSent: function (obj) {
                return restangular.all(path).post(obj);
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

        function extendObject(obj, modelMethods){
            angular.extend(obj, modelMethods);
        }

        function extendArray(obj, modelMethods){
            angular.forEach(obj, function (row) {
                if (angular.isObject(row)) {
                    if (!angular.isArray(row)) {
                        extendObject(row, modelMethods);
                    }
                }
            });
        }

        function automaticExtend(obj, modelMethods){
            if (angular.isDefined(obj)) {
                if (angular.isObject(obj)) {
                    if (angular.isArray(obj)) {
                        extendArray(obj, modelMethods);
                    } else {
                        if (angular.isDefined(obj.items) && angular.isArray(obj.items)) {
                            extendArray(obj.items, modelMethods);
                        } else {
                            extendObject(obj, modelMethods)
                        }
                    }
                }
            }
        }

        restangular.extendModel(path, function (obj) {
            automaticExtend(obj, modelMethods);
            return obj;
        });

        restangular.extendCollection(path, function (collection) {
            automaticExtend(collection, modelMethods);
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
            var historialSubResource = RestObject(this.$concatSubResourcePath('historiales'), CooperativaRestangular, extendMethod);

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
                var transaccionBovedaCajaSubResource = RestObject(this.$concatSubResourcePath('transaccionesBovedaCaja'), CooperativaRestangular, extendMethods);
                return transaccionBovedaCajaSubResource;
            };

            return historialSubResource;
        };

        /**
         * BovedaCaja*
         * */
        bovedaResource.SGBovedaCaja = function () {
            var extendMethod = {
                $congelar: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('congelar').post();
                },
                $descongelar: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('descongelar').post();
                },
                $cerrar: function (detalle) {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('cerrar').post(detalle);
                },
                $getDetalle: function () {
                    return CooperativaRestangular.one(this.$getBasePath(), this.id).all('detalle').getList();
                }
            };

            var bovedaCajaSubResource = RestObject(this.$concatSubResourcePath('bovedaCajas'), CooperativaRestangular, extendMethod);

            bovedaCajaSubResource.SGHistorialBovedaCaja = function () {
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
                var historialBovedaCajaSubResource = RestObject(this.$concatSubResourcePath('historiales'), CooperativaRestangular, extendMethod);

                /**
                 * Transacciones boveda caja*
                 * */
                historialBovedaCajaSubResource.SGTransaccionBovedaCaja = function () {
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
                    var transaccionBovedaCajaSubResource = RestObject(this.$concatSubResourcePath('transaccionesBovedaCaja'), CooperativaRestangular, extendMethods);
                    return transaccionBovedaCajaSubResource;
                };

                return historialBovedaCajaSubResource;
            };

            return bovedaCajaSubResource;
        };

        return bovedaResource;

    }]);

    module.factory('SGCaja', ['CooperativaRestangular', function (CooperativaRestangular) {

        var cajaResource = RestObject('cajas', CooperativaRestangular);

        /**
         * BovedaCaja*
         * */
        cajaResource.SGBovedaCaja = function () {
            var extendMethod = {};

            var bovedaCajaSubResource = RestObject(this.$concatSubResourcePath('bovedasCaja'), CooperativaRestangular, extendMethod);

            /**
             * HistorialBovedaCaja*
             * */
            bovedaCajaSubResource.SGHistorialBovedaCaja = function () {

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

                var historialBovedaCajaSubResource = RestObject(this.$concatSubResourcePath('historiales'), CooperativaRestangular, extendMethod);

                /**
                 * TransaccionBovedaCaja*
                 * */
                historialBovedaCajaSubResource.SGTransaccionBovedaCaja = function () {

                    var extendMethod = {
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

                    var transaccionBovedaCajaSubResource = RestObject(this.$concatSubResourcePath('transaccionesBovedaCaja'), CooperativaRestangular, extendMethod);

                    return transaccionBovedaCajaSubResource;
                };

                /**
                 * TransaccionCajaCaja*
                 * */
                historialBovedaCajaSubResource.SGTransaccionCajaCaja = function () {
                    var extendMethod = {
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

                    var transaccionCajaCajaSubResource = RestObject(this.$concatSubResourcePath('transaccionesCajaCaja'), CooperativaRestangular, extendMethod);

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

            var extendMethod = {};

            var trabajadorCajaSubResource = RestObject(this.$concatSubResourcePath('trabajadoresCaja'), CooperativaRestangular, extendMethod);

            return trabajadorCajaSubResource;
        };

        return cajaResource

    }]);

    module.factory('SGTransaccion', ['CooperativaRestangular', function (CooperativaRestangular) {

        var transaccionResource = RestObject('transacciones', CooperativaRestangular);

        return transaccionResource;
    }]);

})();
