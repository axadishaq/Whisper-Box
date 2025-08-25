const Loading = () => {
   return (
      <div
         className="flex justify-center items-center backdrop-blur saturate-200 "
         style={{ minHeight: "calc(100vh - var(--navbar-height, 68px))" }}>
         <div
            className="loader border-t-2 rounded-full border-gray-700 dark:border-gray-50 bg-gray-300 dark:bg-gray-700 animate-spin
   aspect-square w-12 flex justify-center items-center text-yellow-700"></div>
      </div>
   );
};

export default Loading;
