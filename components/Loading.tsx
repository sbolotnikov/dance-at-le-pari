'use client'
function Loading() {
  return (
    <div className="absolute w-full h-full inset-0 z-2000  backdrop-blur-md">
      <center className="grid place-items-center h-full">
        <div>
        {/* <img src={'/icons/logo light dark back.svg'} className="w-1/4 mb-2 max-w-lg" /> */}
          <svg className="animate-spin h-1/6 w-1/6 mr-3" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </center>
    </div>
  );
}

export default Loading;
