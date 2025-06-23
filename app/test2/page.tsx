'use client';
import { FC, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { PageWrapper } from '../../components/page-wrapper';
import SkatingSystemCalculator from '@/components/SkatingSystemCalculator';
import SkatingFinalRoundResults from '@/components/SkatingFinalRoundResults';

interface pageProps {}

const page: FC<pageProps> = ({}) => { 
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null); 
    const handlePlay = () => { videoRef.current!.play(); };
    // useEffect(() => { 
    //     const fileId = '1BZ8qWSytiG4_3RsDFuEBD3UTtO4o9RoV'; // Replace with your actual file ID 
    //     const fetchFileContent = async () => { 
    //         try { 
    //               fetch(`/api/music2play?file_id=${fileId}`).then(response => response.json()
    //                 .then(data => {
    //                     console.log(data);
    //                     setFileUrl(data.fileUrl);
    //                 }));
                
    //                 const iframe = document.getElementById('video-iframe') as HTMLIFrameElement; if (iframe) { iframe.onload = () => { const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document; if (iframeDocument) { const video = iframeDocument.querySelector('video'); if (video) { video.play(); } } }; }
    //         } catch (error) { 
    //             const errorMessage = (error as Error).message; 
    //             setError(errorMessage); 
    //         } 
    //     }; 
    //     fetchFileContent(); 
    // }, []);

    return (
        <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
            <div className="blurFilter border-0 rounded-md p-4 shadow-2xl w-full h-full bg-lightMainBG/70 dark:bg-darkMainBG/70 overflow-auto">
            <div className="flex flex-col items-center justify-center space-y-4 absolute p-20 top-0 left-0"> 
                <h2 className="text-center font-bold uppercase" style={{ letterSpacing: '1px' }}>
                    Test
                </h2>
                <div>
                 {/* < SkatingSystemCalculator couplesData={ [{ coupleNumber: 71, judgeMarks: [3,1,6,1,1,2,1] }, { coupleNumber: 72, judgeMarks: [2, 2, 1,5,3,1,3] }, { coupleNumber: 73, judgeMarks: [1,5,4,2,2,6,2]}, { coupleNumber: 74, judgeMarks: [5,4,2,4,6,5,4]}, { coupleNumber: 75, judgeMarks: [4,6,3,3,5,4,6]}, { coupleNumber: 76, judgeMarks: [6,3,5,6,4,3,5]}]} />  */}
                 <SkatingFinalRoundResults  couplePlacements={[[3,1,6,1,1,2,1],[2, 2, 1,5,3,1,3],[1,5,4,2,2,6,2],[5,4,2,4,6,5,4],[4,6,3,3,5,4,6],[6,3,5,6,4,3,5]]} coupleNumbers={[71, 72, 73, 74, 75, 76]} judgeNumbers={[1,2,3,4,5,6,7]} />
                 {/* <SkatingFinalRoundResults  couplePlacements={[[1,2,3,4,5],[2,3,4,5,1],[4,5,1,2,3],[4,5,1,2,3],[5,1,2,3,4]]} coupleNumbers={[71, 72, 73, 74, 75]} judgeNumbers={[1,2,3,4,5]} /> */}

                </div>
                {/* <div>
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
                <video ref={videoRef} width="640" height="350" controls muted autoPlay> <source src="https://drive.google.com/file/d/12RDsL12LCUR-LugtydalC_E4YHaK64Db/preview?&autoplay=1" type="video/mp4" /> Your browser does not support the video tag. </video> */}
                {/* <iframe id="video-iframe" src="https://drive.google.com/file/d/12RDsL12LCUR-LugtydalC_E4YHaK64Db/preview?autoplay=1" width="640" height="350" allowFullScreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ></iframe> */}
            </div>
            </div>
        </PageWrapper>
    );
};

export default page;
