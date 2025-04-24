import {useEffect, useState, useRef} from 'react';
import axios from '../../axios';
import HeroShimmers from '../../shimmers/HeroShimmers';

const Hero = () => {
  const [categories, setCategories] = useState([]);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const {data} = await axios.get('/category');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);
                 
  const scroll = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  const handleCategoryClick = (category) => {
    const normalizedCategory = category.trim().toLowerCase().replace(/\s+/g, '-');
    const newHash = `#category-${normalizedCategory}`;

    if (window.location.hash === newHash) {
      window.history.replaceState(null, null, ' ');
      setTimeout(() => {
        window.location.hash = newHash;
      }, 10);
    } else {
      window.location.hash = newHash;
    }
  };

  return (
    <div className='w-full py-6 px-4 sm:px-12 max-w-[2000px] mx-auto'>

    <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-0 h-fit lg:h-[600px] '>
 
      <div className='col-span- flex flex-col justify-center space-y-6 py-4'>
        <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
          Discover Unique Products
        </h1>
        <p className='text-lg sm:text-xl text-gray-600 max-w-full'>
          Find the best handpicked items curated just for you. Explore our exclusive collection and shop by category!
        </p>
      </div>
 
      <img src='/hero.svg' alt='Hero' className='col-span-1 w-full h-full aspect-video rounded-lg' />
    </div>
  
    <h2 className='text-2xl font-bold text-gray-800 mt-10 mb-4 sm:justify-start justify-center'>Shop by Category</h2>
    <div className='relative w-full px-6 sm:px-8 mt-10'>
      <button
        className='absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 px-[14px] rounded-full shadow-md z-10'
        onClick={() => scroll('left')}>
        ◀
      </button>
  
      <div ref={sliderRef} className='flex overflow-hidden mr-[20px] space-x-2 scrollbar-hide w-full py-2 px-8'>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((category, index) => (
            <span
              key={index}
              className={`px-4 py-2 bg-white rounded-full shadow-md text-gray-700 text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-gray-200 ${
                index === categories.length - 1 ? 'mr-5' : ''
              }`}
              onClick={() => handleCategoryClick(category.name)}>
              {category.name}
            </span>
          ))
        ) : (
          <HeroShimmers />
        )}
      </div>
  
      <button
        className='absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 px-[14px] rounded-full shadow-md z-10'
        onClick={() => scroll('right')}>
        ▶
      </button>
    </div>
  </div>
  
  );
};

export default Hero;
