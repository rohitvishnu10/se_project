import { cn } from '@/lib/utils';
import {
    CallControls,
    CallingState,
    CallParticipantsList,
    CallStatsButton,
    PaginatedGridLayout,
    SpeakerLayout,
    useCallStateHooks
} from '@stream-io/video-react-sdk';
import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, User, Download } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import EndCallButton from './ui/EndCallButton';
import Loader from './Loader';

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right';

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get('personal');
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left');
    const [showParticipants, setShowParticipants] = useState(false);
    const router = useRouter();

    const { useCallCallingState, useParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participants = useParticipants();

    // Add a mounting check to prevent router issues
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    if (!isMounted) return <Loader />;
    if (callingState !== CallingState.JOINED) return <Loader />;

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />;
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />;
            default:
                return <SpeakerLayout participantsBarPosition="right" />;
        }
    };

    const downloadParticipantsList = () => {
        console.log('Download button clicked'); // Debugging
        if (!participants || participants.length === 0) {
            console.warn("No participants to download");
            return;
        }
    
        const participantData = participants.map((participant) => {
            // Proper timestamp handling for Stream Video SDK
            let joinedDate: Date;
            if (participant.joinedAt) {
                if (typeof participant.joinedAt === 'number') {
                    joinedDate = new Date(participant.joinedAt);
                } else if ('toDate' in participant.joinedAt && typeof participant.joinedAt.toDate === 'function') {
                    joinedDate = participant.joinedAt.toDate();
                } else if ('seconds' in participant.joinedAt && typeof participant.joinedAt.seconds === 'number') {
                    joinedDate = new Date(participant.joinedAt.seconds * 1000);
                } else {
                    joinedDate = new Date();
                }
            } else {
                joinedDate = new Date();
            }
    
            return {
                Name: participant.name || participant.userId || 'Unknown',
                ID: participant.userId || 'N/A',
                Role: participant.roles?.join(', ') || 'participant',
                JoinedAt: joinedDate.toLocaleString()
            };
        });
    
        const worksheet = XLSX.utils.json_to_sheet(participantData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
        XLSX.writeFile(workbook, "Meeting_Participants.xlsx");
    };

    return (
        <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
            <div className="relative flex size-full items-center justify-center">
                <div className="flex size-full max-w-[1000px] items-center">
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2 overflow-y-auto pb-4', { 'show-block': showParticipants })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                    <div className="sticky bottom-0 bg-[#19232d] pt-2 pb-2 px-4">
                        <button
                            onClick={downloadParticipantsList}
                            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 shadow-md"
                        >
                            <Download size={16} className="mr-2" />
                            Download Participants
                        </button>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
                <CallControls onLeave={() => router.push('/')} />
                <DropdownMenu>
                    <div className="flex items-center">
                        <DropdownMenuTrigger className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                            <LayoutList size={20} className="text-white" />
                        </DropdownMenuTrigger>
                    </div>

                    <DropdownMenuContent className="border-dark-1 bg-dark-1 text-white">
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => setLayout(item.toLowerCase() as CallLayoutType)}
                                >
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="border-dark-1" />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <CallStatsButton />
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className="cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]">
                        <User size={20} className="text-white" />
                    </div>
                </button>
                {!isPersonalRoom && <EndCallButton />}
            </div>
        </section>
    );
};

export default MeetingRoom;