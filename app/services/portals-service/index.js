import GoogleMapsLoader from 'google-maps';
import {PORTALS} from '../../constants';
import kmeans from 'node-kmeans';
import google from '../../services/google';
import AppDispatcher from '../../dispatcher/app-dispatcher.js';

let g,
    LatLng,
    computeDistanceBetween,
    portalsWithGeoPoint,
    clusterAmmount;

function initGoogle(google) {
    return new Promise(function (resolve) {
        g = google;
        LatLng = google.maps.LatLng;
        computeDistanceBetween = google.maps.geometry.spherical.computeDistanceBetween;
        resolve();
    });
}

function gPointFromArray(array) {
    let lat = array[0] / 1000000;
    let lng = array[1] / 1000000;
    return new g.maps.LatLng(lat, lng);
}

function getMaxDistance(center, cluster) {
    let maxDistance = 0;
    cluster.forEach(function (coords) {
        let point = gPointFromArray(coords);
        let distance = computeDistanceBetween(center, point);
        maxDistance = Math.max(maxDistance, distance)
    });
    return maxDistance;
}

function addGeoPointToPortals() {
    return new Promise(function (resolve) {
        portalsWithGeoPoint = PORTALS.map(function (portalData) {
            let lat = portalData.latE6 / 1000000;
            let lng = portalData.lngE6 / 1000000;
            portalData.point = new LatLng(lat, lng);
            return portalData;
        });
        resolve();
    });
}


function clusterLatLng() {
    return new Promise(function (resolve) {
        let vector,
            centroids = {};

        vector = portalsWithGeoPoint.map(function (portal) {
            return [portal.latE6, portal.lngE6];
        });

        kmeans.clusterize(vector, { k: clusterAmmount }, function (err, results) {
            results.forEach(function (result, index) {
                let cluster = result.cluster,
                    numberOfClusters = cluster.length,
                    center = gPointFromArray(result.centroid),
                    maxDistance = getMaxDistance(center, cluster),
                    density = numberOfClusters / maxDistance;

                if (numberOfClusters > 1) {
                    centroids[index] = {
                        center: center,
                        distance: maxDistance,
                        density: density
                    };
                    result.clusterInd.forEach(function (clusterIndex) {
                        portalsWithGeoPoint[clusterIndex].cluster = index
                    });
                }
            });
            AppDispatcher.handleBackendAction({
                'type': 'NR_OF_CLUSTERS_CHANGED',
                'value': results.length
            });
            resolve({ 'portals': portalsWithGeoPoint, 'centroids': centroids });
        });
    });
}


function init() {
    return google
        .then(initGoogle)
        .then(addGeoPointToPortals);
}

export default function getCluster(percent) {
    clusterAmmount = Math.round(PORTALS.length * percent / 100);
    return init()
        .then(clusterLatLng)
};