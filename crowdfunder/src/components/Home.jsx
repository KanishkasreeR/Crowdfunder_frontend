// import React from 'react';
// import '../css/Home.css';
// import { Link } from 'react-router-dom';

// const Home = () => {
//     return (
//         <div className="home-container">
//             <header className="header">
//                 <div className="logo">
//                     <Link to="/">
//                         <span className="crowd">Crowd</span>
//                         <span className="funder">funder</span>
//                     </Link>
//                 </div>
//                 <div className="actions">
//                     <Link to="/login" className="sign-in-btn">Sign in</Link>
//                     <Link to="/register" className="start-btn">Sign up</Link>
//                 </div>
//             </header>

//             <div className="hero-section">
//                 <div className="left-content">
//                     <h1>Empower Ideas, Inspire Change</h1>
//                     <p>Join our platform to kickstart your dreams or support others in making their visions a reality.</p>
//                     <Link to="/explore" className="cta-btn">Explore Campaigns</Link>
//                     <Link to="/createcampaign" className="cta-secondary-btn">Start Your Campaign</Link>
//                 </div>
//                 <div className="right-content">
//                     <img 
//                         src="https://png.pngtree.com/png-clipart/20220429/original/pngtree-love-charity-or-online-giving-donation-via-volunteer-team-worked-together-png-image_7567125.png" 
//                         alt="Crowdfunding" 
//                     />
//                 </div>
//             </div>

            // <section className="features">
            //     <div className="feature">
            //         <i className="fas fa-bullhorn feature-icon"></i>
            //         <h3>Amplify Your Voice</h3>
            //         <p>Get your message out there and attract backers from all over the world.</p>
            //     </div>
            //     <div className="feature">
            //         <i className="fas fa-hand-holding-heart feature-icon"></i>
            //         <h3>Support Meaningful Causes</h3>
            //         <p>Find and fund campaigns that resonate with your values and passions.</p>
            //     </div>
            //     <div className="feature">
            //         <i className="fas fa-globe feature-icon"></i>
            //         <h3>Reach a Global Audience</h3>
            //         <p>Your campaign can reach millions of potential supporters across the globe.</p>
            //     </div>
            // </section>

//             <footer className="footer">
//                 <p>&copy; 2024 Crowdfunder. All rights reserved.</p>
//                 <div className="footer-links">
//                     <Link to="/about">About Us</Link>
//                     <Link to="/contact">Contact</Link>
//                     <Link to="/privacy">Privacy Policy</Link>
//                 </div>
//             </footer>
//         </div>
//     );
// };

// export default Home;

import React from 'react';
import '../css/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <header className="header">
                <div className="logo">
                    <Link to="/">
                        <span className="crowd">Crowd</span>
                        <span className="funder">funder</span>
                    </Link>
                </div>
                <div className="actions">
                    <Link to="/login" className="sign-in-btn">Sign in</Link>
                    <Link to="/register" className="start-btn">Sign up</Link>
                </div>
            </header>

            <div className="hero-section">
                <div className="left-content">
                    <h1>Empower Ideas, Inspire Change</h1>
                    <p>Join our platform to kickstart your dreams or support others in making their visions a reality.</p>
                    <div className="stats">
                        <div className="stat-item">
                            <h2>10,000+</h2>
                            <p>Campaigns Funded</p>
                        </div>
                        <div className="stat-item">
                            <h2>$50M+</h2>
                            <p>Raised</p>
                        </div>
                        <div className="stat-item">
                            <h2>1M+</h2>
                            <p>Backers</p>
                        </div>
                    </div>
                </div>
                <div className="right-content">
                    <img 
                        src="https://png.pngtree.com/png-clipart/20220429/original/pngtree-love-charity-or-online-giving-donation-via-volunteer-team-worked-together-png-image_7567125.png" 
                        alt="Crowdfunding" 
                    />
                </div>
            </div>

            <section className="features">
                <div className="feature">
                    <i className="fas fa-bullhorn feature-icon"></i>
                    <h3>Amplify Your Voice</h3>
                    <p>Get your message out there and attract backers from all over the world.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-hand-holding-heart feature-icon"></i>
                    <h3>Support Meaningful Causes</h3>
                    <p>Find and fund campaigns that resonate with your values and passions.</p>
                </div>
                <div className="feature">
                    <i className="fas fa-globe feature-icon"></i>
                    <h3>Reach a Global Audience</h3>
                    <p>Your campaign can reach millions of potential supporters across the globe.</p>
                </div>
            </section>

            <footer className="footer">
                <p>&copy; 2024 Crowdfunder. All rights reserved.</p>
                <div className="footer-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/privacy">Privacy Policy</Link>
                </div>
            </footer>
        </div>
    );
};

export default Home;


