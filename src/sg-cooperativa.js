'use strict';

(function(){

    var module = angular.module('sg-cooperativa', ['restangular']);


    module.provider('sgCooperativa', function() {

        this.restUrl = 'http://localhost';

        this.$get = function() {
            var restUrl = this.restUrl;
            return {
                getRestUrl: function() {
                    return restUrl;
                }
            }
        };

        this.setRestUrl = function(restUrl) {
            this.restUrl = restUrl;
        };
    });


    module.factory('CooperativaRestangular', ['Restangular', 'sgCooperativa', function(Restangular, sgCooperativa) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(sgCooperativa.getRestUrl());
        });
    }]);

    module.factory('SGBoveda', ['CooperativaRestangular',  function(CooperativaRestangular) {

        var url = 'bovedas';
        var urlCount = 'bovedas/count';

        var modelMethos = {
            $new: function(id){
                return angular.extend({id: id}, modelMethos);
            },
            $build: function(){
                return angular.extend({id: undefined}, modelMethos, {$save: function(){
                    return CooperativaRestangular.all(url).post(this);
                }});
            },
            $save: function() {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this),'',{},{});
            },

            $find: function(id){
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function(queryParams){
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $count: function(){
                return CooperativaRestangular.one(urlCount).get();
            },

            $disable: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/disable').post();
            },
            $remove: function(id){
                return CooperativaRestangular.one(url, id).remove();
            },

            $abrir: function(denominaciones){
                return CooperativaRestangular.all(url+'/'+this.id+'/abrir').post(denominaciones);
            },
            $cerrar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/cerrar').post();
            },
            $congelar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/congelar').post();
            },
            $descongelar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/descongelar').post();
            },
            $getDetalle: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/detalle').getList();
            }
        };

        CooperativaRestangular.extendModel(url, function(obj) {
            if(angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

    module.factory('SGCaja', ['CooperativaRestangular',  function(CooperativaRestangular) {

        var url = 'cajas';
        var urlCount = 'cajas/count';

        var modelMethos = {
            $new: function(id){
                return angular.extend({id: id}, modelMethos);
            },
            $build: function(){
                return angular.extend({id: undefined}, modelMethos, {$save: function(){
                    return CooperativaRestangular.all(url).post(this);
                }});
            },
            $save: function() {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this),'',{},{});
            },

            $find: function(id){
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function(queryParams){
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $count: function(){
                return CooperativaRestangular.one(urlCount).get();
            },

            $disable: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/disable').post();
            },
            $remove: function(id){
                return CooperativaRestangular.one(url, id).remove();
            },

            $abrir: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/abrir').post();
            },
            $cerrar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/cerrar').post();
            },
            $congelar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/congelar').post();
            },
            $descongelar: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/descongelar').post();
            },
            $getDetalle: function(queryParams){
                return CooperativaRestangular.all(url+'/'+this.id+'/detalle').getList(queryParams);
            },


            $addBovedaCaja: function(bovedaCaja){
                return CooperativaRestangular.all(url+'/'+this.id+'/bovedaCajas').post(bovedaCaja);
            },
            $getBovedaCajas: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/bovedaCajas').getList();
            },
            $addTrabajadorCaja: function(trabajadorCaja){
                return CooperativaRestangular.all(url+'/'+this.id+'/trabajadorCajas').post(trabajadorCaja);
            },
            $getTrabajadorCajas: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/trabajadorCajas').getList();
            }

        };

        CooperativaRestangular.extendModel(url, function(obj) {
            if(angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

    module.factory('SGBovedaCaja', ['CooperativaRestangular',  function(CooperativaRestangular) {

        var url = 'bovedaCajas';

        var modelMethos = {
            $new: function(id){
                return angular.extend({id: id}, modelMethos);
            },
            $build: function(){
                return angular.extend({id: undefined}, modelMethos, {$save: function(){
                    return CooperativaRestangular.all(url).post(this);
                }});
            },
            $save: function() {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this),'',{},{});
            },

            $find: function(id){
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function(queryParams){
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $disable: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/disable').post();
            },
            $remove: function(id){
                return CooperativaRestangular.one(url, id).remove();
            }

        };

        CooperativaRestangular.extendModel(url, function(obj) {
            if(angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

    module.factory('SGTrabajadorCaja', ['CooperativaRestangular',  function(CooperativaRestangular) {

        var url = 'trabajadorCajas';

        var modelMethos = {
            $new: function(id){
                return angular.extend({id: id}, modelMethos);
            },
            $build: function(){
                return angular.extend({id: undefined}, modelMethos, {$save: function(){
                    return CooperativaRestangular.all(url).post(this);
                }});
            },
            $save: function() {
                return CooperativaRestangular.one(url, this.id).customPUT(CooperativaRestangular.copy(this),'',{},{});
            },

            $find: function(id){
                return CooperativaRestangular.one(url, id).get();
            },
            $search: function(queryParams){
                return CooperativaRestangular.all(url).getList(queryParams);
            },

            $disable: function(){
                return CooperativaRestangular.all(url+'/'+this.id+'/disable').post();
            },
            $remove: function(id){
                return CooperativaRestangular.one(url, id).remove();
            }

        };

        CooperativaRestangular.extendModel(url, function(obj) {
            if(angular.isObject(obj)) {
                return angular.extend(obj, modelMethos);
            } else {
                return angular.extend({id: obj}, modelMethos)
            }
        });

        return modelMethos;

    }]);

})();