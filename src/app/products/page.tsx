"use client"
import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import thumbnail from '../../Images/thumbnailgen.svg';
import link from '../../Images/link.svg';
import youtube from '../../Images/icons8-youtube-48 1.svg';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const ThumbnailGenerator = () => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUploaded, setVideoUploaded] = useState(false);

    const handleThumbnailClick = () => {
        document.getElementById('video-upload')?.click();
    };

    const handleVideoUpload = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoFile(file);
            setVideoSrc(url);
            setVideoUploaded(true); // Mark video as uploaded
        }
    };

    const handleYoutubeUrlChange = (event: any) => {
        setYoutubeUrl(event.target.value);
        setErrorMessage('');
    };

    const handleYoutubeUrlSubmit = async () => {
        if (youtubeUrl) {
            const isValidYoutubeUrl = validateYoutubeUrl(youtubeUrl);
            if (isValidYoutubeUrl) {
                setIsLoading(true);
                try {
                    const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos`, {
                        params: {
                            part: 'snippet,contentDetails',
                            id: getYoutubeVideoId(youtubeUrl),
                            key: 'AIzaSyDObw8K62WSuipsWp291hNE5AnGRx6Am9I'
                        }
                    });
                    if (response.data.items.length > 0) {
                        const videoData = response.data.items[0];
                        setVideoSrc(`https://www.youtube.com/embed/${videoData.id}`);
                        setVideoUploaded(true); // Mark video as uploaded
                        setIsLoading(false);
                    } else {
                        setErrorMessage('No video found for the provided URL.');
                        setIsLoading(false);
                    }
                } catch (error) {
                    setErrorMessage('Error fetching video details. Please try again.');
                    setIsLoading(false);
                }
            } else {
                setErrorMessage('Please enter a valid YouTube URL.');
            }
        }
    };

    const validateYoutubeUrl = (url: any) => {
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        return youtubeRegex.test(url);
    };

    const getYoutubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    return (
        <main>
            <Navbar />
            <section className='flex justify-center w-full items-center md:px-[8rem] px-2 md:mt-[3rem] mt-[2rem] mb-[4rem]'>
                <div className='flex flex-col gap-3 justify-center w-full'>
                    <h1 className='md:text-[45px] text-[28px] text-[#09090B] font-[700] text-center'>
                        Thumbnail Generator: Generate stunning <span className='text-[#F97316]'>Thumbnails</span> in seconds
                    </h1>
                    <h2 className='md:text-[20px] text-[12px] text-[#09090B] font-[500] text-center'>
                        Instantly generate Thumbnails that attract audiences and drive engagement.
                    </h2>
                    <div className='flex flex-col gap-3 flex-start lg:px-[10rem] px-2 mt-[1.5rem]'>
                        <div className='flex justify-center'>
                            {isLoading ? (
                                <div className='flex justify-center items-center'>
                                    <div className='loadermain'></div>
                                </div>
                            ) : videoSrc ? (
                                <iframe src={videoSrc} className='w-full video-frame' allowFullScreen />
                            ) : (
                                <Image src={thumbnail} alt='thumbnail' className='w-full cursor-pointer' onClick={handleThumbnailClick} />
                            )}
                            <input
                                type="file"
                                accept="video/*"
                                id="video-upload"
                                style={{ display: 'none' }}
                                onChange={handleVideoUpload}
                            />
                        </div>

                        {!videoUploaded ? (
                            <>
                                <h3 className='text-[16px] text-[#09090B] font-[400]'>Or paste a link from YouTube</h3>
                                <div className='relative'>
                                    <input
                                        placeholder='YouTube url link'
                                        className={`focus:outline-none py-5 px-10 rounded-[6px] placeholder:text-[#BABABC] w-full md:placeholder:text-[18px] placeholder:text-[14px] placeholder:font-[400] md:text-[18px] text-[14px] text-[#0E0E10] border-[1.5px] ${errorMessage ? 'border-red-500' : 'border-[#F97316]'}`}
                                        value={youtubeUrl}
                                        onChange={handleYoutubeUrlChange}
                                    />
                                    <Image src={link} alt='link' width={20} height={20} className='absolute top-[35%] left-3 transform pointer-events-none' />
                                </div>
                                {errorMessage && <p className='text-red-500 text-[14px] mt-2'>{errorMessage}</p>}
                                <div className='flex md:gap-3 gap-1 items-center text-[#99999B] font-[400]'>
                                    <h4 className='md:text-[16px] text-[14px]'>Supported Video Links:</h4>
                                    <div className='flex gap-1'>
                                        <Image src={youtube} alt='youtube' width={20} height={20} />
                                        <h5 className='md:text-[14px] text-[12px]'>YouTube Videos</h5>
                                    </div>
                                </div>
                                <div className='flex w-full justify-center items-center'>
                                    <button
                                        className='bg-[#F97316] text-white rounded-[6px] p-[0.7rem] text-[16px] font-[500] w-1/3 flex justify-center items-center'
                                        onClick={handleYoutubeUrlSubmit}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <div className='flex items-center gap-2'>
                                                <div className='loader'></div>
                                                <span className='mr-2'>Uploading video</span>
                                            </div>
                                        ) : (
                                            'Upload'
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className='new-div'>
                                <div className='flex flex-col gap-3'>
                                    <label>Thumbnail title (Optional)</label>
                                    <input
                                        placeholder='Thumbnail title'
                                        className={`focus:outline-none py-5 px-5 rounded-[6px] placeholder:text-[#BABABC] w-full md:placeholder:text-[18px] placeholder:text-[14px] placeholder:font-[400] md:text-[18px] text-[14px] text-[#0E0E10] mb-[2rem] border-[1.5px] ${errorMessage ? 'border-gray-400' : 'border-gray-400'}`}
                                        
                                    />
                                </div>
                                <div className='flex justify-between w-full items-center gap-5'>
                                    <button className='border-[#F97316] border-[1.3px] text-[#F97316] w-1/2 rounded-[6px] p-[0.7rem] text-[16px] font-[500]  flex justify-center items-center'>Capture Image</button>
                                    <button className='bg-[#F97316] text-white rounded-[6px] p-[0.7rem] text-[16px] w-1/2 font-[500] flex justify-center items-center'>Auto Generate</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
            <style jsx>{`
                .loader {
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #F97316;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                }
                .loadermain {
                    border: 7px solid #F97316;
                    border-top: 8px solid #fff;
                    border-radius: 50%;
                    width: 70px;
                    height: 70px;
                    animation: spin 1s linear infinite;
                }
                .video-frame {
                    height: 350px; 
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </main>
    );
};

export default ThumbnailGenerator;
