'use client'
import MeetingTypeList from '@/components/MeetingTypeList';
import { useNextCalls } from '@/hooks/useNextCall';
import { useUser } from '@clerk/nextjs';
import { Call } from '@stream-io/video-react-sdk';
import React from 'react'

const Home = () => {

  const now = new Date();
  const { user } = useUser();
  const time = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'});

  const { nextCall } = useNextCalls();

  const date = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full'})).format(now);

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
          {/* {`Welcome! ${user?.fullName}`} */}
          {nextCall && nextCall.length > 0 ? nextCall.map((meeting: Call)=> (
            <h1 key={(meeting as Call).id}>{`Upcoming Meeting at: ${meeting.state.startsAt?.toLocaleTimeString()}`}</h1>
          )) : (
            <h1>{`Welcome! ${user?.fullName}`}</h1>
          )}
          </h2>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>{date}</p>
          </div>

        </div>
      </div>

      <MeetingTypeList />
    </section>
  )
}

export default Home