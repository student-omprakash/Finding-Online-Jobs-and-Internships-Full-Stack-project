import React from 'react';
import { Link } from 'react-router-dom';
import { FiCode, FiDatabase, FiPenTool, FiTrendingUp, FiMonitor, FiPhone, FiCpu, FiDollarSign } from 'react-icons/fi';
import Card from '../ui/Card';

const categories = [
    { name: 'Software Dev', icon: <FiCode />, count: '1.2k', keyword: 'software' },
    { name: 'Data Science', icon: <FiDatabase />, count: '850', keyword: 'data' },
    { name: 'Product Design', icon: <FiPenTool />, count: '450', keyword: 'design' },
    { name: 'Marketing', icon: <FiTrendingUp />, count: '600', keyword: 'marketing' },
    { name: 'IT Support', icon: <FiMonitor />, count: '300', keyword: 'it' },
    { name: 'Sales', icon: <FiPhone />, count: '900', keyword: 'sales' },
    { name: 'Engineering', icon: <FiCpu />, count: '550', keyword: 'engineering' },
    { name: 'Finance', icon: <FiDollarSign />, count: '400', keyword: 'finance' },
];

const CategoryGrid = () => {
    return (
        <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Explore by Category</h2>
                     <h1 className="Text-4xl">Hello</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Find jobs that match your skills and interests</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {categories.map((cat, idx) => (
                        <Link key={idx} to={`/jobs?keyword=${cat.keyword}`}>
                            <Card hoverEffect className="h-full flex flex-col items-center justify-center p-6 text-center border shadow-sm hover:shadow-md transition-shadow group dark:border-slate-700">
                                <div className="w-16 h-16 bg-primary-50 dark:bg-slate-800 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    {cat.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-1">{cat.name}</h3>
                                <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    {cat.count} Jobs <span className="text-primary-500">&rarr;</span>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CategoryGrid;
