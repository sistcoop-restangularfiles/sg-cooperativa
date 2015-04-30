# iso3166 - restangular library

Es un api que permite usar restangular models para iso3166.

> Revisar iso3166 para mayor informacion.

### Url rest
Puede cambiar el url de los servicios restfull con 

````javascript
// Change url restful services
app.config(function(sgIso3166Provider){
    sgIso3166Provider.restUrl = 'https://someweb/rest';
});
````

### Factories
* SGCountryCode

| Method        URL                                 | Descripcion                       |
| :-------------------------------------------------|:----------------------------------|
| SGCountryCode.$build()                            | Crea objeto vacio                 |
| SGCountryCode.$saveByAlpha2Code()                 | Guarda segun alpha2Code           |
| SGCountryCode.$saveByAlpha3Code()                 | Guarda segun alpha3Code           |
| SGCountryCode.$saveByNumericCode()                | Guarda segun numericCode          |
| SGCountryCode.$search(params)                     | Buscar segun parametros           |
| SGCountryCode.$findByAlpha2code(alpha2Code)       | Buscar uno segun alpha2Code       |
| SGCountryCode.$findByAlpha3code(alpha3Code)       | Buscar uno segun alpha3Code       |
| SGCountryCode.$findByNumericcode(numericCode)     | Buscar uno segun numericCode      |
| SGCountryCode.$count()                            | Contar size()                     |
| SGCountryCode.$removeByAlpha2Code(alpha2Code)     | Eliminar uno segun alpha2Code     |
| SGCountryCode.$removeByAlpha3Code(alpha3Code)     | Eliminar uno segun alpha3Code     |
| SGCountryCode.$removeByNumericCode(numericCode)   | Eliminar uno segun numericCode    |

Los objetos countryCodes tienen la siguiente estructura:

```json
"countryCode": {
   "alpha2Code": "String",
   "alpha3Code": "String",
   "numericCode": "String",    
   "independent": "Boolean",
   "status": "String",  
   "shortNameEn": "String",
   "shortNameUppercaseEn": "String",
   "fullNameEn": "String"
}
```

### Version
1.0.0

### Tecnologías

Dependences:

* [JavaEE] - javaEE

Este proyecto es mantenido por SistCoop S.A.C.

License
----

MIT