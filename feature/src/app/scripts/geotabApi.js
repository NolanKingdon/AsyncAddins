window.generatorTest = window.generatorTest || {};
window.generatorTest.geotabAPI = function() {
    let getDevice = function(api) {
        return new Promise(function(resolve, reject){
            api.call('Get', {'typeName': 'Device',
                'search': {
                    'id': 'b2'
                }
            }, function(result) {
                resolve(result);
             }, function(error) {
                reject(error);
             })
        })
    };

    return {
        getDevice: getDevice
    };
}();

module.exports = window.generatorTest.geotabAPI;
