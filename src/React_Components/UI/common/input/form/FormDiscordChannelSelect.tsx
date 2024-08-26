import useDiscord from "../../../../../app/hooks/useDiscord";

export default function FormDiscordChannelSelect(){
    const {getChannels} = useDiscord();
    const {data, isLoading, error} = getChannels();
    if(isLoading || error){
        return null;
    }
    
}