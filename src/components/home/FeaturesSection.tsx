import React from 'react';
import { FaTruckMoving, FaDollarSign, FaRegEnvelope } from 'react-icons/fa6';
import { IoHeadsetOutline } from 'react-icons/io5';

const FeaturesSection = () => {
  const features = [
    {
      icon: <FaTruckMoving className="text-[40px] stroke-[1px]" />,
      title: "Free delivery",
      description: "Orders from all item"
    },
    {
      icon: <FaDollarSign className="text-[36px] font-light" />,
      title: "Return & refund",
      description: "Money back guarantee"
    },
    {
      icon: <IoHeadsetOutline className="text-[40px]" />,
      title: "Quality support",
      description: "Alway online 24/7"
    },
    {
      icon: <FaRegEnvelope className="text-[38px]" />,
      title: "Join newsletter",
      description: "20% off by subscribing"
    }
  ];

  return (
    <section style={{ backgroundColor: 'var(--color-surface)' }} className="py-8 my-6">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex items-center gap-4 p-4 rounded-lg"
            >
              {/* Icon Container using global primary color variable */}
              <div style={{ color: 'var(--color-primary)' }} className="flex-shrink-0 flex items-center justify-center w-12">
                {feature.icon}
              </div>
              
              {/* Text Content */}
              <div>
                <h3 
                  style={{ color: 'var(--color-text-primary)' }} 
                  className="text-[16px] font-semibold mb-0.5 tracking-wide"
                >
                  {feature.title}
                </h3>
                <p 
                  style={{ color: 'var(--color-text-secondary)' }} 
                  className="text-[14px] font-medium"
                >
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;