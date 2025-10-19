import React from "react";
import BackgroundCircles from "./BackgroundCircles";
import LoginPanel from "./LoginPanel";

function Home() {
  return (
    <div className="w-screen h-screen bg-[#0B0B39] overflow-hidden relative">
      {/* Background with translucent circles */}
      <BackgroundCircles
        count={15}
        minSize={100}
        maxSize={400}
        minOpacity={0.1}
        maxOpacity={0.3}
        color="#005A8D"
        animated={true}
      />

      {/* Split screen layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        {/* Donation Panel */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <LoginPanel type="donation" />
        </div>

        {/* Receiving Panel */}
        <div className="flex-1 p-4 flex items-center justify-center">
          <LoginPanel type="receiving" />
        </div>
      </div>
    </div>
  );
}

export default Home;
