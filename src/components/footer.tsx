import React from 'react'
import logo from '../Images/footerlogo.svg'
import Image from 'next/image'
import copyR from '../Images/tabler_copyright.svg'

const Footer = () => {
    return (
        <footer className='grid mx-auto bg-[#F1F4F8] gap-2'>
            <div className='flex justify-between md:flex-row flex-col md:gap-0 gap-6 w-full md:px-20 px-10 p-10'>
                <div className='flex flex-col gap-2'>
                    <Image src={logo} alt="logo" width={140} height={40} />
                    <p className='w-[197px] md:text-[16px] text-[14px] font-[400]'>Instantly summarize and transcribe any video with ease.</p>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <h1 className='md:text-[20px] text-[16px] font-[600] text-[#0D010E]'>Product</h1>
                    <ul className='flex flex-col items-start gap-2 md:text-[16px] text-[14px] text-[#0D010E] cursor-pointer'>
                        <li>YouTube Summariser</li>
                        <li>Text-to-Video Generator</li>
                        <li>Audio Transcriber</li>
                        <li>Image-to-Video Generator</li>
                        <li>Podcast Summariser</li>
                        <li>Thumbnail Generator</li>
                        <li>PDF Summariser</li>
                    </ul>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <h1 className='md:text-[20px] text-[16px] font-[600] text-[#0D010E]'>Support</h1>
                    <ul className='flex flex-col items-start gap-2 md:text-[16px] text-[14px] text-[#0D010E] cursor-pointer'>
                        <li>Resources</li>
                        <li>My Account</li>
                        <li>Help & Support</li>
                        <li>Contact Us</li>
                    </ul>
                </div>
                <div className='flex flex-col items-start gap-2'>
                    <h1 className='md:text-[20px] text-[16px] font-[600] text-[#0D010E]'>Legal</h1>
                    <ul className='flex flex-col items-start gap-2 md:text-[16px] text-[14px] text-[#0D010E] cursor-pointer'>
                        <li>Privacy Policy</li>
                        <li>Terms and condition</li>
                    </ul>
                </div>
            </div>
            <hr className='h-1 w-full bg-[#525252]'/>
            <div className='w-full flex justify-between md:items-center items-start p-5 md:px-20 px-10 md:flex-row flex-col md:gap-0 gap-2'>
                <div className='flex items-center'>
                    <Image src={copyR} alt='copyright' />
                    <p>2024 All Rights Reserved </p>
                </div>
                <div className='flex items-center gap-6'>
                    <p>Privacy Policy</p>
                    <p>Terms of Use</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer