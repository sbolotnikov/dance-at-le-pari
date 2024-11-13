'use client';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { PageWrapper } from '../../components/page-wrapper';

interface pageProps {}

const page: FC<pageProps> = ({}) => { 
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => { 
        const fileId = '1BZ8qWSytiG4_3RsDFuEBD3UTtO4o9RoV'; // Replace with your actual file ID 
        const fetchFileContent = async () => { 
            try { 
                  fetch(`/api/music2play?file_id=${fileId}`).then(response => response.json()
                    .then(data => {
                        console.log(data);
                        setFileUrl(data.fileUrl);
                    }));
                
                  



                // if (!response.ok) { 
                //     throw new Error('Failed to fetch file content'); 
                // } 
                
                // const url = await response.text(); 
                // console.log(url);
                // setFileUrl(url); 
            } catch (error) { 
                const errorMessage = (error as Error).message; 
                setError(errorMessage); 
            } 
        }; 
        fetchFileContent(); 
    }, []);

    return (
        <PageWrapper className="absolute top-0 left-0 w-full h-screen flex items-center justify-center">
            <div className="blurFilter border-0 rounded-md p-4 shadow-2xl w-[90%] max-w-[450px] md:w-full bg-lightMainBG/70 dark:bg-darkMainBG/70">
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
            </div>
        </PageWrapper>
    );
};

export default page;
