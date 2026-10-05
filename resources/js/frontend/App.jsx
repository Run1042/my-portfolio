import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Services from './components/Services';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Reviews from './components/Reviews';
import { getPortfolioData } from './libs/api';

export default function App() {
    const initialData = window.__INITIAL_DATA__ || {};
    const [profile, setProfile] = useState(initialData.profile || null);
    const [about, setAbout] = useState(initialData.about || null);
    const [projects, setProjects] = useState(initialData.projects || []);
    const [skills, setSkills] = useState(initialData.skills || {});
    const [loading, setLoading] = useState(!initialData.projects);

    useEffect(() => {
        if (!initialData.projects || !initialData.profile) {
            getPortfolioData()
                .then(data => {
                    if (data.profile) setProfile(data.profile);
                    if (data.about) setAbout(data.about);
                    setProjects(data.projects || []);
                    setSkills(data.skills || {});
                })
                .catch(err => {
                    console.error('Error fetching portfolio data:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#fcfcfd]">
                <div className="flex-col gap-4 w-full flex items-center justify-center">
                    <div className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                        <div className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#fcfcfd] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 antialiased selection:bg-purple-600 selection:text-white min-h-screen relative overflow-x-hidden font-sans transition-colors duration-300">
            {/* Background Ambient Glows */}
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(224,187,255,0.4)_0%,rgba(243,232,255,0.1)_50%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(130,71,229,0.15)_0%,rgba(0,0,0,0)_50%,transparent_70%)] pointer-events-none z-0 transition-colors duration-300"></div>
            <div className="fixed top-1/4 -right-48 w-96 h-96 bg-purple-300/20 dark:bg-purple-900/20 rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-300"></div>
            <div className="fixed bottom-1/4 -left-48 w-96 h-96 bg-pink-300/20 dark:bg-pink-900/20 rounded-full blur-[140px] pointer-events-none z-0 transition-colors duration-300"></div>

            <div className="relative z-10">
                <Navbar profile={profile} />
                <Hero profile={profile} about={about} />
                <About profile={profile} about={about} />
                <Projects initialProjects={projects} />
                <Services skills={skills} />
                <Skills skills={skills} />
                <Contact profile={profile} />
                <Reviews />
                <Footer profile={profile} />
            </div>
        </div>
    );
}

// Mount when element exists
const container = document.getElementById('frontend-root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
