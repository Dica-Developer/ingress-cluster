import React from 'react'
import template from './map.rt';
import GoogleMapsLoader from 'google-maps';
import {contains, find, isEqual} from 'lodash';
import dispatcher from '../../dispatcher/app-dispatcher.js';
import {PORTAL_IMG} from '../../constants';
import googleLoader from '../../services/google';
import getCluster from '../../services/portals-service';


let google, halleLatLng;

export default React.createClass({
    map: null,
    renderMarker: [],
    circles: [],
    shouldGetNewCluster: false,
    shouldRenderPortals: false,
    getInitialState(){
        return {
            portals: [],
            centroids: [],
            selectedPortal: null
        }
    },

    componentWillMount(){
        googleLoader.then(_google => {
            google = _google;
            halleLatLng = new google.maps.LatLng(51.4728826, 11.9723731);
            let mapOptions = {
                zoom: 14,
                center: halleLatLng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            this._getNewCluster();
        });
    },

    componentWillUpdate(nextProps){
        let differentClusterAmount = nextProps.clusterAmmount !== this.props.clusterAmmount;
        let differentSelectedCluster = nextProps.selectedCluster !== this.props.selectedCluster;

        this.shouldGetNewCluster = differentClusterAmount;
        this.shouldRenderPortals = differentSelectedCluster;
    },

    componentDidUpdate(){
        if (this.shouldGetNewCluster) {
            this._getNewCluster()
        }

        if (this.shouldRenderPortals) {
            this._renderPortals();
        }
    },

    render: template,

    _renderPortals(){
        this._paintMarker();
        this._paintRadius();
    },

    _getNewCluster(){
        clearTimeout(this.updateCusterTimeout);
        this.updateCusterTimeout = setTimeout(() => {
            getCluster(this.props.clusterAmmount)
                .then((result) => {
                    this.setState({
                        portals: result.portals,
                        centroids: result.centroids
                    });
                    this._renderPortals();
                });
        }, 200);
    },

    _paintRadius(){
        let centroids = this.state.centroids,
            selectedCluster = this.props.selectedCluster;
        this._clearCircles();
        this.circles = Object.keys(centroids).reduce((initArray, clusterNr) => {
            if (selectedCluster === 'all' || parseInt(clusterNr, 10) === selectedCluster) {
                let centroid = centroids[clusterNr];
                initArray.push(new google.maps.Circle({
                    strokeColor: '#ff0000',
                    strokeOpacity: 0.3,
                    strokeWeight: 2,
                    fillColor: '#ff0000',
                    fillOpacity: centroid.density * 10,
                    map: this.map,
                    center: centroid.center,
                    radius: centroid.distance
                }));
            }
            return initArray;
        }, []);
        this._addCircles();
    },

    _clearCircles(){
        this.circles.forEach(function (circle) {
            circle.setMap(null);
        });
    },

    _addCircles(){
        this.circles.forEach((circle) => {
            circle.setMap(this.map);
        });
    },

    _paintMarker(){
        this._clearAllMarker();
        this.renderMarker = this.state.portals.reduce((initArray, portal) => {
            let portalimg = 'N',
                selectedCluster = this.props.selectedCluster;
            if (portal.team !== 'N') {
                portalimg = portal.team + portal.resCount;
            }

            if (selectedCluster === 'all' || portal.cluster === selectedCluster) {
                initArray.push(new google.maps.Marker({
                    position: portal.point,
                    id: portal.guid,
                    icon: {
                        anchor: new google.maps.Point(8, 8),
                        url: PORTAL_IMG[portalimg],
                        scaledSize: new google.maps.Size(15, 15),
                        size: new google.maps.Size(50, 50)
                    }
                }));
            }
            return initArray;
        }, []);
        this._addMarker()
    },

    _clearAllMarker(){
        this.renderMarker.forEach(function (marker) {
            marker.setMap(null);
        });
        this.renderMarker = [];
    },

    _addMarker(){
        this.renderMarker.forEach((marker) => {
            marker.addListener('click', this._showPortalInfo.bind(this, marker));
            marker.setMap(this.map);
        })
    },

    _showPortalInfo(marker){
        let portal = find(this.state.portals, { 'guid': marker.id });

        let contentString = '<h1>' + portal.title + '</h1>' +
            '<p>Resonators: ' + portal.resCount + '</p>' +
            '<p>Cluster: ' + portal.cluster + '</p>' +
            '<p>Health: ' + portal.health + '</p>';

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        infowindow.open(this.map, marker);
        this.setState({
            selectedPortal: marker.id
        });
    },

    getCentroidOfCurrentCluster(){
        //let selectedCluster = this.props.selectedCluster;
        //if(selectedCluster !== 'all'){
        //    return this.state.centroids[selectedCluster];
        //}
        return null;
    }

});
