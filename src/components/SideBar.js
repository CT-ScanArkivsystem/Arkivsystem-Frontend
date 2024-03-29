import React from "react";
import "./SideBar.css";


export default function SideBar ({
    className = "sideBar",
    ...props
}) {

  return (
      <div className={className} {...props}>
      </div>
  );
}
