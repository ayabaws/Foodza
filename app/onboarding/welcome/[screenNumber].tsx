import { useLocalSearchParams } from 'expo-router';
import WelcomeScreen from '../WelcomeScreen';

export default function WelcomePage() {
  const { screenNumber } = useLocalSearchParams();
  return <WelcomeScreen screenNumber={parseInt(screenNumber as string) || 1} />;
}
