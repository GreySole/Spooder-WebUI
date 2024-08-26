import { OscProvider } from "./app/context/OscContext";
import { HotkeysProvider } from "./app/hooks/useHotkeys";
import useServer from "./app/hooks/useServer";
import App from "./React_Components/app/App";
import LoadingCircle from "./React_Components/UI/LoadingCircle";

export default function InitLayer() {

    const { getServerState } = useServer();
    const { data, isLoading, error } = getServerState();

    if (isLoading) {
        return <LoadingCircle />;
    }


    return (
        <OscProvider host={data.host} port={data.port}>
            <App />
        </OscProvider>
    )
}