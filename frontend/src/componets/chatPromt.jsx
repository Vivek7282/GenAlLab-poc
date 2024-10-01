import React from 'react';

function App() {
  return (
    <>
    <div className="flex mb-8 md:mb-12 px-3 justify-center">
    <div className="w-16 h-1 rounded-full bg-teal-500 inline-flex"></div>
  </div>
  <div className="text-gray-600 body-font w-full">
    <div className=" w-full p-1 hover:text-white">
      <div className="border-2 border-gray-200 p-2 h-full rounded-2xl bg-stone-50 hover:bg-gray-400 shadow-inner ">
        <h1 className="md:text-3xl text-2xl font-medium title-font text-gray-900 title-font mb-2 text-center italic ">
          Welcome to GenAI Lab
        </h1>
        <p className="leading-relaxed p-4 md:p-8 lg:p-12 font-base md:font-medium text-center hover:text-stone-100 sm:text-xl text-base">
          
        </p>
      </div>
    </div>
  </div>
  </>
  );
}

export default App;
