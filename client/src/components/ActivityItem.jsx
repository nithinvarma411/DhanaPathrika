import React from 'react';

const ActivityItem = ({ avatar, title, description, date, amount, isMobile }) => {
  return (
    <div className="flex items-start">
      {/* Only show avatar if isMobile is false */}
      {!isMobile && (
        <div className="bg-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-3 mt-1">
          <span className="text-xl font-bold">{avatar}</span>
        </div>
      )}
      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">{title}</p>
            <p className="text-gray-300">{description}</p>
            <p className="text-gray-400 text-sm">{date}</p>
          </div>
          <p className="text-green-400 font-bold">{amount}</p>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
