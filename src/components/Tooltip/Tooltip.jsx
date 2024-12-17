// src/Tooltip.js
import React from 'react';
import ReactTooltip from 'react-tooltip';

const Tooltip = ({ children, tooltipText }) => {
  return (
    <>
      <span data-tip={tooltipText}>
        {children}
      </span>
      <ReactTooltip />
    </>
  );
};

export default Tooltip;
