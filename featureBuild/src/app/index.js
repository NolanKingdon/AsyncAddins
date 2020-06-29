/**
 * This is the entry point for your app
 * Include any assets to be bundled in here
 * (css/images/js/etc)
 */

const regeneratorRuntime = require('regenerator-runtime');

if(!geotab.addin.featureBuild){
    
    require('./scripts/main');
    
}

require('./styles/main.css');
