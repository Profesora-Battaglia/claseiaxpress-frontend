
import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

interface CardProps {
    title: string;
    description: string;
    Icon: React.FC<{ className?: string }>;
    onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, Icon, onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="bg-base-200 dark:bg-base-dark-200 p-6 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
        >
            <div className="flex items-start justify-between">
                <div className="bg-primary p-3 rounded-lg inline-block">
                    <Icon className="w-7 h-7 text-white" />
                </div>
                <FiArrowRight className="w-6 h-6 text-text-secondary/50 dark:text-text-secondary-dark/50 group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-text-main dark:text-text-main-dark mt-4">{title}</h3>
            <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-1">{description}</p>
        </div>
    );
};

export default Card;