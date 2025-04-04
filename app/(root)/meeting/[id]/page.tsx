"use client"
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import React, { useState, use } from 'react'

// Add type for MeetingSetup props


const Meeting = ({ params }: { params: Promise<{ id: string }> }) => { 
  const { isLoaded } = useUser();
  // Specify boolean type for the state
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
  
  const { id } = use(params);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
        {!isSetupComplete ? (
          <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
        ) : (
          <MeetingRoom />
        )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;