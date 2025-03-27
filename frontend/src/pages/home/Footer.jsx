
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";


import {Facebook, Instagram, Youtube, Twitter, Mail} from 'lucide-react';

const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  const footerLinks = {
    popular: [
      {name: 'Automotive', href: '#'},
      {name: 'Electronics', href: '#'},
      {name: 'Gardening', href: '#'},
      {name: 'Toys & Games', href: '#'}
    ],
    help: [
      {name: 'Customer Support', href: '/contact'},
      {name: 'Delivery Details', href: '#'},
      {name: 'Terms & Conditions', href: '#'},
      {name: 'Privacy Policy', href: '#'}
    ],
   trending: [
      {name: 'Automotive', href: '#'},
      {name: 'Electronics', href: '#'},
      {name: 'Gardening', href: '#'},
      {name: 'Toys & Games', href: '#'}
    ],
    resources: [
      {name: 'Free eBooks', href: '#'},
      {name: 'Development Tutorial', href: '#'},
      {name: 'How to - Blog', href: '#'},
      {name: 'Youtube Playlist', href: '#'}
    ]
  };
  useEffect(() => {
    setIsClient(true); 
  }, []);
  return (
    <div className='flex w-full flex-col mx-auto justify-center flex-1'>
   
     
      <footer className='bg-[#0f1c3c] pt-16 pb-8 px-4 md:px-25 mt-auto '>
        <div className='mx-auto'>
    
          <div className='grid grid-cols-1 md:grid-cols-5 gap-8 mt-6'>
           
            <div className='md:col-span-1'>
              <h2 className='text-xl font-bold mb-4 text-gray-200'>Sellsgoods</h2>
              <p className='text-gray-600 text-sm mb-6'>
                
              </p>
              <div className='flex space-x-4'>
                <Facebook className='w-5 h-5 text-gray-200' />
                <Instagram className='w-5 h-5 text-gray-200' />
                <Youtube className='w-5 h-5 text-gray-200' />
                <Twitter className='w-5 h-5 text-gray-200' />
              </div>
            </div>

          
            <div className='grid grid-cols-2 md:grid-cols-4 gap-8 md:col-span-4'>
              <div>
                <h3 className='text-sm font-bold text-gray-200 uppercase mb-4'>Popular Searches</h3>
                <ul className='space-y-2'>
                  {footerLinks.popular.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className='text-sm text-gray-300 hover:text-gray-400'>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-200 uppercase mb-4'>Help</h3>
                <ul className='space-y-2'>
                  {footerLinks.help.map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className='text-sm text-gray-300 hover:text-gray-400'>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-200 uppercase mb-4'>Trending Searches</h3>
                <ul className='space-y-2'>
                  {footerLinks.trending.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className='text-sm text-gray-300 hover:text-gray-400'>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className='text-sm font-bold text-gray-200 uppercase mb-4'>Resources</h3>
                <ul className='space-y-2'>
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className='text-sm text-gray-300 hover:text-gray-400'>
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          
          <div className='mt-12 pt-8 border-t border-gray-200'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <p className='text-sm text-gray-200'>Shop.co © 2000-2023. All Rights Reserved</p>
         
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
