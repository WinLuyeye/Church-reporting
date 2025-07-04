'use client'
import { useState } from 'react'
import {
  LoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
  Polyline,
} from '@react-google-maps/api'
import { Row, Col } from 'react-bootstrap'
import ComponentContainerCard from '@/components/ComponentContainerCard'
import UIExamplesList from '@/components/UIExamplesList'

const API_KEY = 'AIzaSyDsucrEdmswqYrw0f6ej3bf4M4suDeRgNA'

const containerStyle = {
  width: '100%',
  height: '400px',
}

const center = { lat: 21.569874, lng: 71.5893798 }

const polylinePath = [
  { lat: 37.789411, lng: -122.422116 },
  { lat: 37.785757, lng: -122.421333 },
  { lat: 37.789352, lng: -122.415346 },
]

const mapStylesLight = [
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#e9e9e9' }, { lightness: 17 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 20 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }, { lightness: 17 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { lightness: 18 }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }, { lightness: 16 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#f5f5f5' }, { lightness: 21 }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#dedede' }, { lightness: 21 }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }],
  },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#f2f2f2' }, { lightness: 19 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#fefefe' }, { lightness: 20 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }],
  },
]

const mapStylesDark = [
  {
    featureType: 'all',
    elementType: 'labels',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.fill',
    stylers: [{ saturation: 36 }, { color: '#000000' }, { lightness: 40 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#000000' }, { lightness: 16 }],
  },
  {
    featureType: 'all',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [{ color: '#000000' }, { lightness: 20 }],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#000000' }, { lightness: 17 }, { weight: 1.2 }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 20 }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 21 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#e5c163' }, { lightness: '0' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 18 }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 16 }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 19 }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#000000' }, { lightness: 17 }],
  },
]

const AllGoogleMaps = () => {
  const [selectedPlace, setSelectedPlace] = useState<any>(null)

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <Row>
        <Col xl={9}>
          {/* Basic Map */}
          <ComponentContainerCard id="basic_google_map" title="Basic Example" description="Carte Google Maps basique.">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14} />
          </ComponentContainerCard>

          {/* Markers Map */}
          <ComponentContainerCard id="google_map" title="Markers Google Map" description="Carte avec des marqueurs.">
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={18}>
              <Marker
                position={center}
                title="Home sweet home"
                onClick={() => alert('You clicked on the marker!')}
              />
              <Marker
                position={{ lat: 21.56969, lng: 71.5893798 }}
                title="InfoWindow Marker"
                onClick={() =>
                  setSelectedPlace({ position: { lat: 21.56969, lng: 71.5893798 }, name: 'Current Location' })
                }
              />
              {selectedPlace && (
                <InfoWindow
                  position={selectedPlace.position}
                  onCloseClick={() => setSelectedPlace(null)}
                >
                  <div>
                    <p>{selectedPlace.name}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </ComponentContainerCard>

          {/* PolyLine Map */}
          <ComponentContainerCard id="poly_line" title="Polyline Map" description="Carte avec une polyline.">
            <GoogleMap mapContainerStyle={containerStyle} center={polylinePath[0]} zoom={14}>
              <Polyline
                path={polylinePath}
                options={{
                  strokeColor: '#0000FF',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
            </GoogleMap>
          </ComponentContainerCard>

          {/* Light Styled Map */}
          <ComponentContainerCard id="ultra_light" title="Ultra Light With Labels" description="Carte stylisée claire.">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: -12.043333, lng: -77.028333 }}
              zoom={14}
              options={{ styles: mapStylesLight }}
            />
          </ComponentContainerCard>

          {/* Dark Styled Map */}
          <ComponentContainerCard id="dark_view" title="Dark" description="Carte stylisée sombre.">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={{ lat: -12.043333, lng: -77.028333 }}
              zoom={14}
              options={{ styles: mapStylesDark }}
            />
          </ComponentContainerCard>
        </Col>

        <Col xl={3}>
          <UIExamplesList
            examples={[
              { link: '#basic_google_map', label: 'Basic' },
              { link: '#google_map', label: 'Markers Google Map' },
              { link: '#poly_line', label: 'PolyLine Google Map' },
              { link: '#ultra_light', label: 'Ultra Light With Labels' },
              { link: '#dark_view', label: 'Dark' },
            ]}
          />
        </Col>
      </Row>
    </LoadScript>
  )
}

export default AllGoogleMaps
