import React from "react";
import { InfinitySpin } from "react-loader-spinner";
import "./loading.css";

const LoadingAnimation = () => {
  return (
      <div className="loading-overlay">
        <div className="loading-backdrop"></div>
        <div className="loading-spinner">
          <InfinitySpin width="200" color="#1f2937"  />
        </div>
      </div>
    
  );
};

export default LoadingAnimation;