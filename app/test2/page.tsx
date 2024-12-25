'use client';
import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { PageWrapper } from '../../components/page-wrapper';

interface pageProps {}

const page: FC<pageProps> = ({}) => { 
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null); 
    const handlePlay = () => { videoRef.current!.play(); };
    useEffect(() => { 
        const fileId = '1BZ8qWSytiG4_3RsDFuEBD3UTtO4o9RoV'; // Replace with your actual file ID 
        const fetchFileContent = async () => { 
            try { 
                  fetch(`/api/music2play?file_id=${fileId}`).then(response => response.json()
                    .then(data => {
                        console.log(data);
                        setFileUrl(data.fileUrl);
                    }));
                
                    const iframe = document.getElementById('video-iframe') as HTMLIFrameElement; if (iframe) { iframe.onload = () => { const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document; if (iframeDocument) { const video = iframeDocument.querySelector('video'); if (video) { video.play(); } } }; }
            } catch (error) { 
                const errorMessage = (error as Error).message; 
                setError(errorMessage); 
            } 
        }; 
        fetchFileContent(); 
    }, []);

    return (
        <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
            <div className="blurFilter border-0 rounded-md p-4 shadow-2xl w-fit  md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70">
                <h2 className="text-center font-bold uppercase" style={{ letterSpacing: '1px' }}>
                    Test
                </h2>
                <div>
                    <h1>Google Drive File Content</h1>
                    {error ? (
                        <p>Error: {error}</p>
                    ) : fileUrl ? (
                        <audio controls>
                            <source src={fileUrl} type="audio/mpeg" /> 
                            Your browser does not support the audio element. 
                        </audio>
                    ) : (
                        <p>Loading file content...</p>
                    )}
                </div>
                <button onClick={handlePlay}>Play Video</button>
                <video ref={videoRef} width="640" height="350" controls muted autoPlay> <source src="https://drive.google.com/file/d/12RDsL12LCUR-LugtydalC_E4YHaK64Db/preview?&autoplay=1" type="video/mp4" /> Your browser does not support the video tag. </video>
                <iframe id="video-iframe" src="https://drive.google.com/file/d/12RDsL12LCUR-LugtydalC_E4YHaK64Db/preview?autoplay=1" width="640" height="350" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe>
            </div>
        </PageWrapper>
    );
};

export default page;
