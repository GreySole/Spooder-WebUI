import { OscProvider } from './app/context/OscContext';
import useServer from './app/hooks/useServer';
import App from './React_Components/app/App';
import LoadingCircle from './React_Components/UI/LoadingCircle';

export default function InitLayer() {
  const { getServerState } = useServer();
  const { data, isLoading, error } = getServerState();

  if (error) {
    return (
      <div className='App'>
        <div className='locals-only'>
          <h1 className='App-title'>/╲/\( ºx ω xº )/\╱\</h1>
          <h1>Can't connect to Spooder. Is it on?</h1>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingCircle />;
  }

  return (
    <OscProvider host={data.host} port={data.port}>
      <App />
    </OscProvider>
  );
}
