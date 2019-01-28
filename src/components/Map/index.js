import React, { Component, Fragment } from 'react';
import MapView, {Marker} from 'react-native-maps';
import { ToastAndroid, View, Image, Container, Text, TouchableOpacity } from 'react-native';
import Search from '../Search';
import Directions from '../Directions';
import {getPixelSize} from '../../utils';
import markerImage from '../../assets/marker.png';
import Geocoder from 'react-native-geocoding';
import {Back,
    LocationBox, 
    LocationText, 
    LocationTimeBox, 
    LocationTimeText, 
    LocationTimeTextSmall,
} from './styles';
import Details from '../Details';
import backImage from '../../assets/back.png';
import Republica from '../Markers';
import InfoEstacao from '../Estacoes';

Geocoder.init("AIzaSyCOoEL3HEIbsrcdyvc3NRcbbNOAMgO0M_A");

export default class Map extends Component {

    state = {
        region: null,
        destination: null,
        duration: null,
        location: null,
        mostraInfo: null,
    };

    async componentDidMount(){
        navigator.geolocation.getCurrentPosition(
            async({coords: {latitude, longitude}}) => {
                const response = await Geocoder.from({ latitude, longitude});
                const address = response.results[0].formatted_address;
                const location = address.substring(0, address.indexOf(','));
                console.log(location);
                this.setState({
                    location,
                    region: {   
                        latitude,  
                        longitude,  
                        latitudeDelta: 0.0143, 
                        longitudeDelta: 0.0134
                    },
                    rep: {lat: "-23.5391515",
                            long: '-46.651456'}
                });
            },
            () => {},
            {
                timeout: 2000,
                enableHighAccuracy: true,
                maximumAge: 1000,
            }
        );
    }

    handleLocationSelected = (data, {geometry}) => {
        const { location: {lat: latitude, lng: longitude } } = geometry;
        this.setState({
            destination:{
                latitude,
                longitude,
                title: data.structured_formatting.main_text,
            },
        })
    }

    showToast = () => {
        // this.setState({mostraInfo: true});
        ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
       }

    handleBack = () => {
        this.setState({destination:null});
    }


  render() {
      const {region, destination, duration, location, mostraInfo} = this.state;
    return (
          
        <View style={{flex: 1}}>
     
        <MapView
            style={{flex: 1}}
            region={region}
            showsUserLocation
            loadingEnabled
            ref={el => this.mapView = el}
        >
        <Republica
                 onPress={() => {console.log('aaa')}}
        />
        
            {destination && (
                <Fragment>
                <Directions
                origin={region}
                destination={destination}
                onReady={result => {
                    console.log(result.duration);
                    this.setState({ duration: Math.floor(result.duration)});

                    this.mapView.fitToCoordinates(result.coordinates, {
                        edgePadding: {
                            right: getPixelSize(50),
                            left: getPixelSize(50),
                            top: getPixelSize(50),
                            bottom: getPixelSize(350),
                        }
                    });
                }}
            
            />
            <Marker 
                coordinate={destination} 
                anchor={{ x:0, y:0 }} 
                image={markerImage} 
                icon={markerImage} 
                >
                <LocationBox>
                    <LocationText>
                        {destination.title}
                    </LocationText>
                </LocationBox>
                </Marker>
                <Marker 
                coordinate={region} 
                anchor={{ x:0, y:0 }} 
                >
                <LocationBox>
                    <LocationTimeBox>
                        <LocationTimeText>{duration}</LocationTimeText>
                        <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                    </LocationTimeBox>
                    <LocationText>{location}</LocationText>
                </LocationBox>
                </Marker>
                
               
            </Fragment>
            )}
 
        </MapView>
               

                {destination ? (
                    <Fragment>
                    <Back onPress={this.handleBack}>
                        <Image source={backImage}></Image>
                    </Back>
                    <Details />
                    </Fragment>
                ) : (
                    
                    <Search onLocationSelected={this.handleLocationSelected}/>

                )}

              

               
    </View>)
  }
}
