import { App } from './components/App';

const port = Number(process.env.PORT) || 4000;
const app = new App();
app.init(port);
