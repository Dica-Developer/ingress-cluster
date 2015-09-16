import GoogleMapsLoader from 'google-maps';

GoogleMapsLoader.LIBRARIES = ['geometry'];

export default new Promise(function(resolve){
    GoogleMapsLoader.load(function(google){
        resolve(google);
    });
});

