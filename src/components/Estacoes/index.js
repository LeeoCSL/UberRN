import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {Container} from './styles';

export default class InfoEstacao extends Component {
    render(){
        return(
            <Container>
                <Text>Há um problema com essa estação?</Text>
                <TouchableOpacity>
                    <Text>Sim</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>Não</Text>
                </TouchableOpacity>
            </Container>
            )   
    }
}