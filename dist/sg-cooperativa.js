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
        var urlCount = 'countryCodes/count';

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