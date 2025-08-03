import React from "react";
import "./ContainerFrame.css";

export default function ContainerFrame({ children, className = "", style = {} }) {
  // Debug: Xác nhận component được render
  console.log("ContainerFrame rendered with:", { children, className, style });
  
  return (
    <div 
      className={`container-frame ${className}`}
      style={style}
    >
      {children}
    </div>
  );
} 