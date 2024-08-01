'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import thumbnail from '../../Images/thumbnailgen.svg';
import link from '../../Images/link.svg';
import youtube from '../../Images/icons8-youtube-48 1.svg';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import thumbnailPic from '../../Images/photoPreview (1).svg';
import down from '../../Images/down.svg';

const ThumbnailGenerator = () => {
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUploaded, setVideoUploaded] = useState(false);
    const [showNewDiv, setShowNewDiv] = useState(false);
    const [progress, setProgress] = useState(0);
    const [buttonsClicked, setButtonsClicked] = useState(false);
    const [showNextSteps, setShowNextSteps] = useState(false);
    const [modalRevolution, setModalRevolution] = useState(false);
    const [activeImage, setActiveImage] = useState(thumbnailPic);

    const handleThumbnailClick = () => {
        document.getElementById('video-upload')?.click();
    };

    const handleVideoUpload = (file: File) => {
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoFile(file);
            setVideoSrc(url);
            setVideoUploaded(true);
        }
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleVideoUpload(file);
        }
    };

    const handleYoutubeUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                        setVideoUploaded(true);
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

    const validateYoutubeUrl = (url: string) => {
        const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        return youtubeRegex.test(url);
    };

    const getYoutubeVideoId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const handleCaptureImageClick = () => {
        setShowNewDiv(true);
        setButtonsClicked(true);
    };

    const handleAutoGenerateClick = () => {
        setShowNewDiv(true);
        setButtonsClicked(true);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) {
            handleVideoUpload(file);
        }
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (showNewDiv && !showNextSteps) {
            console.log('Starting progress bar');
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev < 100) {
                        console.log('Progress:', prev + 1);
                        return prev + 1;
                    } else {
                        clearInterval(interval!);
                        console.log('Progress complete');
                        setTimeout(() => {
                            setShowNewDiv(false);
                            setProgress(0);
                            setShowNextSteps(true);
                        }, 1000);
                        return prev;
                    }
                });
            }, 50);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [showNewDiv, buttonsClicked]);

    const handleModal = () => {
        setModalRevolution(!modalRevolution);
    };

    const handleImageClick = (image: any) => {
        setActiveImage(image);
    };

    const images = [thumbnailPic, thumbnailPic, thumbnailPic];



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
                        {!buttonsClicked && (
                            <div className='flex justify-center' onDrop={handleDrop} onDragOver={handleDragOver}>
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
                                    onChange={handleFileInputChange}
                                />
                            </div>
                        )}

                        {!videoUploaded && !buttonsClicked && (
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
                                                <div className='loader' />
                                                Loading...
                                            </div>
                                        ) : 'Get Thumbnails'}
                                    </button>
                                </div>
                            </>
                        )}

                        {videoUploaded && !buttonsClicked && (
                            <div className=''>
                                <div className='flex flex-col gap-3'>
                                    <label>Thumbnail title (Optional)</label>
                                    <input
                                        placeholder='Thumbnail title'
                                        className={`focus:outline-none py-5 px-5 rounded-[6px] placeholder:text-[#BABABC] w-full md:placeholder:text-[18px] placeholder:text-[14px] placeholder:font-[400] md:text-[18px] text-[14px] text-[#0E0E10] mb-[2rem] border-[1.5px] ${errorMessage ? 'border-gray-400' : 'border-gray-400'}`}

                                    />
                                </div>
                                <div className='flex justify-between w-full items-center gap-5'>
                                    <button className='border-[#F97316] border-[1.3px] text-[#F97316] w-1/2 rounded-[6px] p-[0.7rem] text-[16px] font-[500]  flex justify-center items-center' onClick={handleCaptureImageClick}>Capture Image</button>
                                    <button className='bg-[#F97316] text-white rounded-[6px] p-[0.7rem] text-[16px] w-1/2 font-[500] flex justify-center items-center' onClick={handleAutoGenerateClick}>Auto Generate</button>
                                </div>
                            </div>
                        )}

                        {showNewDiv && !showNextSteps && (
                            <div className='flex flex-col gap-2 justify-center w-full px-[64px] py-[24px] shadow-md rounded-[20px]'>
                                <div className='flex flex-col gap-2 justify-center w-full items-center'>
                                    <h3 className='md:text-[44px] text-[20px] text-[#09090B] font-[600]'>Generating Thumbnail...</h3>
                                    <i className='md:text-[18.36px] text-[#6A6B6E] text-[12px] font-[400] mb-[1.5rem]'>This might take a few minutes</i>
                                    <h1 className='text-end md:text-[18.36px] text-[#0E0E10] text-[12px] font-[400] w-full'>{progress}%</h1>
                                    <div className='w-full rounded-full bg-[#E9E9E9]'>
                                        <div
                                            className={`bg-[#F97316] text-xs font-medium text-[#F97316] text-right p-0.5 leading-none rounded-full`}
                                            style={{ width: `${progress}%` }}
                                        >
                                            {progress}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {showNextSteps && (
                            <div className='flex flex-col gap-2 justify-center w-full mb-[10rem] relative'>
                                <div className='flex flex-col items-start'>
                                    <Image src={activeImage} alt='' />
                                    <h3 className='md:text-[16px] text-[16px] font-[400] text-[#09090B]'>Choose from Generated Thumbnails</h3>
                                </div>
                                <div className='flex md:flex-row flex-col justify-between w-full items-center'>
                                    <div className='flex items-center gap-2'>
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleImageClick(img)}
                                                className={`cursor-pointer ${activeImage === img ? '' : 'bg-black opacity-50'}`}
                                                style={{ position: 'relative' }}
                                            >
                                                <Image src={img} alt='' width={100} height={100} />
                                                {activeImage === img && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                            opacity: 0.5,
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className='relative'>
                                        <div
                                            className='flex justify-center w-fit md:mt-[0px] mt-[0.5rem] gap-[44px] items-center pt-2.5 pr-2.5 cursor-pointer p-[1rem] rounded truncate bg-[#F1F4F8]'
                                            onClick={handleModal}
                                        >
                                            <h1 className='md:text-[16px] text-[16px] font-[400] text-[#0E0E10]'>Choose Resolution</h1>
                                            <Image src={down} alt='' width={20} height={20} />
                                        </div>
                                        {modalRevolution && (
                                            <div className='absolute flex flex-col gap-2 px-4 py-2 z-40 rounded-bl-md rounded-br-md mt-[0.5rem] w-full items-start shadow-md bg-[#F1F4F8]'>
                                                {['1080p', '720p', '480p', '320p'].map((res, index) => (
                                                    <button
                                                        key={index}
                                                        className='hover:bg-[#FDD4B7] focus:bg-[#FDD4B7] text-[16px] font-[400] text-[#4D4E51] p-[10px] w-full text-start rounded-[10px]'
                                                    >
                                                        {res}
                                                    </button>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                                <div className='flex w-full justify-center items-center mt-[4rem]'>
                                    <button className='bg-[#F97316] text-white rounded-[6px] p-[0.7rem] text-[16px] font-[500] w-1/3 flex justify-center items-center'>Download</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default ThumbnailGenerator;
