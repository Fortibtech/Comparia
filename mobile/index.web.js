// Web entry point - bypasses gesture-handler which can cause issues on web
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
