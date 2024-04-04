import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useEffect, useState } from "react"

export const useGetCalls = () => {
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
                filter_conditions: {
                    starts_at: { $exists: true},
                    $or: [
                        { created_by_user_id: user?.id},
                        {members: {$in: [user?.id]}}
                    ]
                }
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

    const mins30 = 1000 * 60 * 60 * 30;
    const nowAfter30mins = new Date(Date.now() + mins30)
    const endedCalls = calls.filter(({ state: { startsAt, endedAt}} : Call) => {
        return (startsAt && new Date(startsAt) < nowAfter30mins  || !!endedAt)
    })
    const upcomingCalls = calls.filter(({ state: { startsAt }}: Call) => {
        return startsAt && new Date(startsAt) > now
    })
    // const recordings;
    // const nextCall = calls.filter(({ state: { startsAt }}: Call) => {
    //     return startsAt && new Date(startsAt) > now
    // })

    

    return {
        endedCalls,
        upcomingCalls,
        callRecordings: calls,
        isLoading
    }
    
}