import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapContainer extends React.Component {
    render() {
        const { lat, lng } = this.props
        return (
            <Map
                google={this.props.google}
                zoom={13}
                initialCenter={{ lat, lng}}
                center={{lat, lng}}
            >
                <Marker position={{lat, lng}}/>
            </Map>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyBLUwYK4ZgRrDerHfghrG9DUoZL13V_dwQ'
})(MapContainer);