import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useNextCalls = () => {
    const [calls, setCalls] = useState<Call[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const client = useStreamVideoClient();

    const { user } = useUser()

    useEffect(() => {
      const loadCalls = async () => {
        if(!client || !user?.id) return;

        setIsLoading(true);

        try {
            const { calls } = await client.queryCalls({
                sort: [{field: 'starts_at', direction: -1}],
                limit: 1,
            });

            setCalls(calls);
        } catch (error) {
            console.log(error);
            
        } finally {
            setIsLoading(false);
        }
      }

      loadCalls();
    }, [client, user?.id]);

    const now = new Date();
    // const recordings;
    const nextCall = calls.filter(({ state: { startsAt }}: Call) => {
        return startsAt && new Date(startsAt) > now
    })

    

    return {
        nextCall
    }
    
}