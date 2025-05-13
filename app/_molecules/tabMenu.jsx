"use client";
import { useState } from 'react';
import { TabButton } from '../_atoms/buttons';

const TabMenu = ({ tabs }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      {tabs && tabs.length > 0 ? (
      <div className="flex border-b border-gray-300">
        {tabs.map((tab, index) => (

            <TabButton key={index} label={tab.title}
                onClick={() => setActiveIndex(index)} className={`px-4 py-2 -mb-px text-sm border-b-2 transition-colors duration-300
               ${activeIndex === index
                 ? 'border-primary text-black font-bold'
                : ''}`}
            />

        ))}
      </div>

      ) : <div>
        <p className="text-gray-500 text-sm">Please add tabs</p>
      </div>}

      {/* Tab Content */}
      <div className="mt-4">
        {tabs[activeIndex] && (
          <div className="text-gray-700 text-sm">
            {tabs[activeIndex].content}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabMenu;
