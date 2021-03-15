import React, { useEffect, useState } from 'react'
import { getMowerPositions } from './MowerPositionsService'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'
import AppConfig from './shared/app.config'
import MowerPin from './images/mower_pin.png'

export const MapView = () => {
  const [positions, setPositions] = useState([])

  useEffect(() => {
    getMowerPositions().then(setPositions)
  }, [])

  return <MapViewDisplay positions={positions} onMapsChange={() => {
    console.log('Maps changed')
    setPositions([...positions])
  }} />
}

const MapViewDisplay = ({ positions, onMapsChange }) => {
  const [center, setCenter] = useState({ lat: 0, lng: 0 })
  const pinWidth = 50

  useEffect(() => {
    if (positions.length > 0) {
      const { latitude, longitude } = positions[0]
      setCenter({ lat: latitude, lng: longitude })
    }
  }, [positions])

  const pinIcon = {
    url: MowerPin,
    scaledSize: { width: 50, height: 55 },
  }

  const polylineOptions = {
    strokeColor: 'red',
    strokeOpacity: 0,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 2,
        strokeWeight: 1,
      },
      offset: '0',
      repeat: '10px',
    }],
  }

  return <div style={{ height: '100%' }}>
    <LoadScript googleMapsApiKey={AppConfig.mapsKey}>
      <GoogleMap
        center={center}
        mapContainerStyle={{ height: '100%' }}
        mapTypeId='satellite'
        zoom={20}
      >
        <Polyline
          path={positions.map(({ latitude, longitude }) => ({ lat: latitude, lng: longitude }))}
          options={polylineOptions} />
        <Marker clickable={false} position={center} icon={pinIcon} />
      </GoogleMap>
    </LoadScript>
  </div>
}