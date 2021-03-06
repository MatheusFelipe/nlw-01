import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageBackground } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Select from 'react-native-picker-select';
import axios from 'axios';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 12,
  },
  inputAndroid: {
    borderColor: 'purple',
    borderRadius: 8,
    borderWidth: 0.5,
    color: 'black',
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 30,
    paddingVertical: 8,
  },
});

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECityResponse {
  nome: string;
}

const Home = () => {
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState<string>('0');
  const [selectedCity, setSelectedCity] = useState<string>('0');
  const navigation = useNavigation();

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(resp => setUfs(resp.data.map(uf => uf.sigla).sort()));
  }, []);

  useEffect(() => {
    if (selectedUf !== '0')
      axios
        .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
        .then(resp => setCities(resp.data.map(city => city.nome).sort()));
  }, [selectedUf]);

  const handleNavigationToPoints = () => {
    if (selectedUf !== '0' && selectedCity !== '0')
      navigation.navigate('Points', { uf: selectedUf, city: selectedCity });
  };

  const makeSelectItems = (array: string[]) => array.map(label => ({ key: label, label, value: label }));

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ height: 368, width: 274 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>
      <View style={styles.footer}>
        <Select
          style={pickerSelectStyles}
          value={selectedUf}
          onValueChange={value => setSelectedUf(value)}
          placeholder={{ label: 'Selecione o estado', value: '0' }}
          items={makeSelectItems(ufs)}
        />
        {selectedUf !== '0' && (
          <Select
            style={pickerSelectStyles}
            value={selectedCity}
            onValueChange={value => setSelectedCity(value)}
            placeholder={{ label: 'Selecione a cidade', value: '0' }}
            items={makeSelectItems(cities)}
          />
        )}
        <RectButton style={styles.button} onPress={handleNavigationToPoints}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
};

export default Home;
