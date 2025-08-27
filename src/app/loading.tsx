const Loading = () => {
   return (
      <div className="min-h-[80vh] flex justify-center items-center backdrop-blur saturate-200 ">
         <div
            className="loader border-t-2 rounded-full border-gray-700 dark:border-gray-50 bg-gray-300 dark:bg-gray-700 animate-spin
   aspect-square w-12 flex justify-center items-center text-yellow-700"></div>
      </div>
   );
};

export default Loading;
