import axios from 'axios';
import frontendConfig from '../const/config';
import { setUserLocation } from 'src/store/roomStores';

const getLocationInfo = async (): Promise<void> => {
    try {
        const { data } = await axios.get(`https://api.ipgeolocation.io/ipgeo?apiKey=${frontendConfig.geolocationApiKey}`);
        setUserLocation({ country: data.country_name, state: data.state_prov });
    } catch (error) {
        console.error('Error fetching location information:', error);
    }
};

export default getLocationInfo;