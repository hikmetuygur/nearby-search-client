import React, {useState} from 'react';
import axios from 'axios';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';
import './PlaceMap.css';

const mapContainerStyle = {
    height: '500px',
    width: '100%',
};

const PlaceMap = () => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [radius, setRadius] = useState('');
    const [places, setPlaces] = useState([]);
    const [mapCenter, setMapCenter] = useState({lat: 41.008046, lng: 28.974347});
    const [selectedPlace, setSelectedPlace] = useState(null);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:8070/places?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
            setPlaces(response.data);

            // Update map center to the first place in the result
            if (response.data.length > 0) {
                const firstPlace = response.data[0];
                setMapCenter({lat: firstPlace.latitude, lng: firstPlace.longitude});
            }
        } catch (error) {
            console.error('Error fetching places:', error);
        }
    };

    const {isLoaded} = useJsApiLoader({
        id: process.env.REACT_APP_API_KEY_ID,
        googleMapsApiKey: process.env.REACT_APP_API_KEY,
    });

    return (
        <div className="PlaceMap">
            <h2>Google Places Map</h2>
            <div>
                <label>
                    Latitude:
                    <input type="text" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                </label>
                <label>
                    Longitude:
                    <input type="text" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                </label>
                <label>
                    Radius:
                    <input type="text" value={radius} onChange={(e) => setRadius(e.target.value)}/>
                </label>
                <button onClick={handleSearch}>Search</button>
            </div>
            {isLoaded ? (
                <div className="map-container">
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        zoom={15}
                        center={mapCenter}>
                        {places.map((place) => (
                            <Marker
                                key={place.id}
                                position={{lat: place.latitude, lng: place.longitude}}
                                onClick={() => setSelectedPlace(place)}
                            />
                        ))}
                    </GoogleMap>
                </div>
            ) : null}

            {places.length > 0 && (
                <div className="nearby-places">
                    <h2>Nearby Places</h2>
                    <ul>
                        {places.map((place, index) => (
                            <li key={index}>{place.text}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PlaceMap;