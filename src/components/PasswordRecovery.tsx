import React from "react";
import BackgroundCircles from "./BackgroundCircles";
import PasswordRecoveryPanel from "./PasswordRecoveryPanel";

function PasswordRecovery() {
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

      {/* Single card layout */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <div className="p-4 flex items-center justify-center">
          <PasswordRecoveryPanel />
        </div>
      </div>
    </div>
  );
}

export default PasswordRecovery;
