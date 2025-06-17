import React from 'react';
import Lottie from 'react-lottie';
import { animationDefaultOptions } from '@/lib/utils';

const EmptyChatContainer = () => {
  return (
    <div className="flex-1 bg-[#1c1d25] flex flex-col justify-center items-center duration-1000 transition-all p-5 md:p-10">
      <Lottie
        isClickToPauseDisabled={true}
        height={150} // Adjust height for smaller screens
        width={150} // Adjust width for smaller screens
        options={animationDefaultOptions}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 text-center">
        <h3 className="poppins-medium text-xl md:text-3xl lg:text-4xl transition-all duration-300">
          Hi <span className="text-purple-500"></span>Welcome to
          <span className="text-purple-500"> Syncronus</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
