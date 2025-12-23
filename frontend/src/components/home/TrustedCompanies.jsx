import React from 'react';

const companies = [
    { name: 'Google', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/2560px-Google_2015_logo.svg.png' },
    { name: 'Microsoft', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1280px-Microsoft_logo_%282012%29.svg.png' },
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png' },
    { name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { name: 'Meta', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png' },
    { name: 'Airbnb', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Airbnb_Logo_B%C3%A9lo.svg/2560px-Airbnb_Logo_B%C3%A9lo.svg.png' },
    { name: 'Uber', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png' },
];

const TrustedCompanies = () => {
    return (
        <section className="py-12 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 overflow-hidden transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
                <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Trusted by leading companies</h3>
            </div>

            <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll gap-16 w-max">
                    {/* Double the list for infinite scroll effect */}
                    {[...companies, ...companies].map((company, idx) => (
                        <div key={idx} className="flex items-center justify-center w-32 h-12 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 filter dark:brightness-200 dark:contrast-0 dark:hover:contrast-100">
                            <img
                                src={company.logo}
                                alt={company.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
            `}</style>
        </section>
    );
};

export default TrustedCompanies;
h1
<h1>Hello my name is om <h1>
