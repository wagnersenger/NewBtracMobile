// JavaScript Document
function GoogleMaps(){
	this.zoom = 12;
	this.latitude = -25;
	this.longitude = -50;
	this.htmlId = 'map';
	this.map = null;
	this.markers = Array();
	this.markersReference = Array();
	this.dataMarkers = Array();
	this.latLng = Array();
	this.markerIcon = '';
    this.markerSize = { x: 22, y: 40 };
	this.markerCluester;
	this.editable = false;
	
	this.classLabel = 'labels';
	
	GoogleMaps.prototype.initialize = function() {
		var mapOptions = {
			center: new google.maps.LatLng(this.latitude, this.longitude),
			zoom: this.zoom
		};
		
		this.map = new google.maps.Map(document.getElementById(this.htmlId),mapOptions);
	
	}
	
	GoogleMaps.prototype.addMarker = function(p_latitude, p_longitude, p_title){
		if(this.map){
			myLatlng = new google.maps.LatLng(p_latitude,p_longitude);
			myIcon = this.markerIcon == '' ? null : this.markerIcon;
			v_title = p_title? p_title:'';

			var marker = new google.maps.Marker({
				map: this.map,
				position: myLatlng,
				label: '',
				draggable: false,
				icon: myIcon,
				title: v_title
			});
			
			this.markers.push(marker);
			this.latLng.push(myLatlng);
			
			this.dataMarkers.push({marker: marker, latLng: myLatlng, title: p_title});
			
			return marker;
		}
	}
	
	GoogleMaps.prototype.addMarkerLabel = function(p_latitude, p_longitude, p_descricao, p_reference, p_class){	
		if(this.map){

			if(!p_descricao)
				p_descricao = '';
				
			myLatlng = new google.maps.LatLng(p_latitude,p_longitude);
			v_class  = p_class ? p_class : this.classLabel;
			//myIcon = '/imgs/blue_baloon2.png';

			var marker = new MarkerWithLabel({
			   position: myLatlng,
			   draggable: false,
			   map: this.map,
			   labelContent: p_descricao,
			   labelAnchor: new google.maps.Point(32, 29),
			   labelClass: v_class, // the CSS class for the label
			   labelStyle: {opacity: 1},
			   icon: this.markerIcon
			 });
			
			
			this.markers.push(marker);
			this.latLng.push(myLatlng);
			this.markersReference.push( p_reference ? p_reference : null );
			
			return marker;
		}
	}
	
	GoogleMaps.prototype.changePositionMarkerByIndex = function(i, lat, lng){
		vlatLng = new google.maps.LatLng(lat, lng);
		this.markers[i].setPosition(vlatLng);
	}
	
	GoogleMaps.prototype.changePositionMarkerTitle = function(p_title, p_lat, p_lng){
		for(i=0; i<this.dataMarkers.length; i++){
			if( this.dataMarkers[i].title == p_title ){
				vlatLng = new google.maps.LatLng(p_lat, p_lng);
				
				this.dataMarkers[i].marker.setPosition(vlatLng);
				this.latLng[i] = vlatLng;
			}
		}
	}
	
	GoogleMaps.prototype.changePositionMarker = function(marker, lat, lng){
		vlatLng = new google.maps.LatLng(lat, lng);
		marker.setPosition(vlatLng);
	}
	
	GoogleMaps.prototype.removeMarkerByIndex = function(i){
		this.markers[i].setMap(null);
		this.markers[i] = null;
	}
	
	GoogleMaps.prototype.removeMarker = function(marker){
		marker.setMap(null);	
	}
	
	
	
	GoogleMaps.prototype.rebuildMarkerLabel = function(p_reference, p_latitude, p_longitude, p_descricao, p_class){		
		if(this.map){

			if(!p_descricao)
				p_descricao = '';
			
			v_index = null;
			for(i=0; i<this.markersReference.length; i++){
				if( this.markersReference[i] == p_reference ){
					v_index = i;
					this.markers[i].setMap(null);
					break;
				}
			}
		}
	}
	
	GoogleMaps.prototype.fitBounds = function(){
		var latlngbounds = new google.maps.LatLngBounds();
		for(i=0; i<this.latLng.length; i++){
		   latlngbounds.extend(this.latLng[i]);
		};
		this.map.setCenter(latlngbounds.getCenter());
		this.map.fitBounds(latlngbounds); 
	}
	
	GoogleMaps.prototype.clusterize = function(){
		this.markerCluster = new MarkerClusterer(this.map, this.markers);	
	}
	
	GoogleMaps.prototype.setCenterMarkerIndex = function(v_index){
		this.map.panTo( this.latLng[v_index] );
	}
	
	GoogleMaps.prototype.setCenter = function(v_latitude,v_longitude){
		latLng = new google.maps.LatLng( v_latitude, v_longitude );
		this.map.panTo( latLng );
	}
	
	GoogleMaps.prototype.setZoom = function(v_zoom){
		this.zoom = v_zoom;
		this.map.setZoom(v_zoom);
	}
	
	GoogleMaps.prototype.addPolyline = function(points){
		
		var polyline = new google.maps.Polyline({
			path: points,
			geodesic: true,
			strokeColor: '#0000FF',
			strokeOpacity: 1.0,
			strokeWeight: 2,
			editable: this.editable
		  });

		path = polyline.getPath();
		google.maps.event.addListener(path, 'insert_at', getPolylinePath);
		google.maps.event.addListener(path, 'remove_at', getPolylinePath);
		google.maps.event.addListener(path, 'set_at', getPolylinePath);
	    
		polyline.setMap(this.map);
		minLat = 0;
		minLng = 0;
		maxLat = 0;
		maxLng = 0;

		for(i=0; i<points.length; i++){
			lat = points[i].lat();
			lng = points[i].lng();
			
			if( i==0 ){
				minLat = lat;
				maxLat = lat;
				minLng = lng;
				maxLng = lng;
			}else{
				minLat = minLat > lat ? lat : minLat;
				maxLat = maxLat < lat ? lat : maxLat;
				minLng = minLng > lng ? lng : minLng;
				maxLng = maxLng < lng ? lng : maxLng;
			}
		}
		
		var swNew = new google.maps.LatLng( minLat, minLng );
		var neNew = new google.maps.LatLng( maxLat, maxLng );
		var boundsNew = new google.maps.LatLngBounds( swNew, neNew );
		this.map.fitBounds(boundsNew);
		return polyline;
	}
	
		
	
}



function polylineChanged(){}

function getPolylinePath(){
	var len = path.getLength();
	var coordStr = Array();
	
	for (var i=0; i<len; i++) {
		coordStr.push( path.getAt(i).toUrlValue(6).replace(',',' ') );
	}
	setPolylinePath( coordStr.join(',') );
	
}

function setPolylinePath(v_path){}