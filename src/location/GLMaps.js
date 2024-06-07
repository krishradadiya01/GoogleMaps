// Library imports
import {
  Image,
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {
  Callout,
  Circle,
  Marker,
  PROVIDER_GOOGLE,
  Polygon,
} from 'react-native-maps';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import MapViewDirections from 'react-native-maps-directions';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

// Local imports
import {API_KEY} from '../utils/apikey';

export default function GLMaps() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);

  const fromInputRef = useRef(null);
  const toInputRef = useRef(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // const markerList = [
  //   {
  //     id: 1,
  //     title: 'Marker 1',
  //     description: 'This is Marker 1',
  //     lat: 21.2323026,
  //     long: 72.8285685,
  //   },
  //   {
  //     id: 2,
  //     title: 'Marker 2',
  //     description: 'This is Marker 2',
  //     lat: 21.2337099,
  //     long: 72.849346,
  //   },
  // ];

  const requestLocationPermission = async () => {
    let status;
    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (status !== RESULTS.GRANTED) {
      console.log('Location permission denied');
    }
  };

  const CommonInputPlaces = ({
    placeholder,
    styles,
    onPress,
    value,
    onChangeText,
    ref,
  }) => {
    return (
      <GooglePlacesAutocomplete
        ref={ref}
        textInputProps={{
          value: value,
          onChangeText: onChangeText,
        }}
        placeholder={placeholder}
        currentLocationLabel="Current location"
        onPress={onPress}
        fetchDetails={true}
        query={{
          key: API_KEY,
          language: 'en',
        }}
        styles={{
          container: styles,
          textInputContainer: localStyles.textInputContainer,
          textInput: localStyles.textInput,
          predefinedPlacesDescription: localStyles.predefinedPlacesDescription,
        }}
      />
    );
  };

  const CommonMarkerComponent = ({marker}) => {
    return (
      <Marker
        key={marker?.id}
        draggable={true}
        coordinate={{
          latitude: marker?.latitude,
          longitude: marker?.longitude,
        }}
        title={marker?.title}
        description={marker?.description}
        pinColor="red"
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <CommonInputPlaces
        placeholder={'From'}
        ref={fromInputRef}
        value={selectedLocation?.description}
        onPress={(data, details = null) => {
          console.log(data, details);
          if (details) {
            const {lat, lng} = details.geometry.location;
            setSelectedLocation({
              latitude: lat,
              longitude: lng,
              title: data?.structured_formatting?.main_text,
              description: data?.description,
            });
            fromInputRef.current?.clear();
          }
        }}
        styles={localStyles.autocompleteContainer}
      />

      <CommonInputPlaces
        placeholder={'To'}
        ref={toInputRef}
        value={destinationLocation?.description}
        onPress={(data, details = null) => {
          console.log(data, details);
          if (details) {
            const {lat, lng} = details.geometry.location;
            setDestinationLocation({
              latitude: lat,
              longitude: lng,
              title: data?.structured_formatting?.main_text,
              description: data?.description,
            });
            toInputRef.current?.clear();
          }
        }}
        styles={localStyles.destinationCompleteContainer}
      />

      <MapView
        provider={PROVIDER_GOOGLE}
        style={localStyles.map}
        region={
          selectedLocation
            ? {
                latitude: selectedLocation?.latitude,
                longitude: selectedLocation?.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }>
        {selectedLocation || destinationLocation ? (
          <>
            <CommonMarkerComponent marker={selectedLocation} />
            <CommonMarkerComponent marker={destinationLocation} />
          </>
        ) : null}

        <MapViewDirections
          origin={{
            latitude: selectedLocation?.latitude,
            longitude: selectedLocation?.longitude,
          }}
          destination={{
            latitude: destinationLocation?.latitude,
            longitude: destinationLocation?.longitude,
          }}
          apikey={API_KEY}
          strokeWidth={3}
          strokeColor="hotpink"
        />

        <Circle
          center={{
            latitude: 21.2499393,
            longitude: 72.865801,
          }}
          radius={1000}
          fillColor={'rgba(255,0,0,0.2)'}
          strokeColor={'rgba(255,0,0,0.5)'}
        />

        <Polygon
          strokeWidth={2}
          coordinates={[
            {latitude: 21.259392, longitude: 72.908705},
            {latitude: 21.2694393, longitude: 72.863775},
            {latitude: 21.289963, longitude: 72.907205},
          ]}
          fillColor={'rgba(0,255,0,0.2)'}
          strokeColor={'rgba(0,255,0,0.5)'}
        />
      </MapView>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  inputContainer: {
    position: 'absolute',
    flex: 1,
    top: 70,
    left: 10,
    right: 10,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    gap: 10,
  },
  placesAutocomplete: {
    textInputContainer: {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderTopWidth: 0,
      borderBottomWidth: 0,
    },
    textInput: {
      height: 38,
      color: '#5d5d5d',
      fontSize: 16,
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
  },
  imageStyle: {
    width: 40,
    height: 40,
  },
  callOutStyle: {
    width: '100%',
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 65,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  destinationCompleteContainer: {
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  predefinedPlacesDescription: {
    color: 'lightblue',
  },
});
