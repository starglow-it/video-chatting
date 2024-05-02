import { CustomGrid } from 'shared-frontend/library/custom/CustomGrid';
import { MeetingTranscribeList } from './MeetingChatList/MeetingTranscribeList';
import { TranscribeStreamingClient } from '@aws-sdk/client-transcribe-streaming';
import LiveTranscriptions, { Transcript } from 'src/store/roomStores/videoChat/sfu/handlers/transcribeHandler';
import { useEffect, useState } from 'react';

export const MeetingTranscribe = () => {
    const [transcriptionClient, setTranscriptionClient] = useState<TranscribeStreamingClient | null>(null);
	const [transcribeStatus, setTranscribeStatus] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<Transcript>();
	const [lines, setLines] = useState<Transcript[]>([]);
	const [currentLine, setCurrentLine] = useState<Transcript[]>([]);
	const [mediaRecorder, setMediaRecorder] = useState<AudioWorkletNode>();
    
    const handleTranscribe = async () => {
		setTranscribeStatus(!transcribeStatus);
		if (transcribeStatus) {
			console.log("Stopping transcription")
		} else {
			console.log("Starting transcription")
		}
		return transcribeStatus;
	};
    
    useEffect(()=> {
        handleTranscribe();
    }, [])
    useEffect(() => {
		if (transcript) {
			setTranscript(transcript);
			if (transcript.partial) {
				setCurrentLine([transcript]);
			} else {
				setLines([...lines, transcript]);
				setCurrentLine([]);
			}
		}
	}, [transcript])

    return (
        <CustomGrid
            display="flex"
            flex={1}
            flexDirection="column"
            height="100%"
        >
            <LiveTranscriptions
                    mediaRecorder={mediaRecorder}
                    setMediaRecorder={setMediaRecorder}
                    setTranscriptionClient={setTranscriptionClient}
                    transcriptionClient={transcriptionClient}
                    transcribeStatus={transcribeStatus}
                    setTranscript={setTranscript}
                />
            <MeetingTranscribeList lines={lines} />
        </CustomGrid>
    );
};
