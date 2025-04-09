// components/home/property-owner-cta.js
import React from "react";

function PropertyOwnerCTA() {
  return (
    <section className="property-owner-cta">
      <h2>Become a Property Owner</h2>
      <p>List your property and reach thousands of potential buyers.</p>
      <button>Learn More</button>
    </section>
  );
}

export default PropertyOwnerCTA;

// components/home/new-projects-banner.js
import React from "react";

function NewProjectsBanner() {
  return (
    <section className="new-projects-banner">
      <div className="new-launch-box">New Launch</div>
      <div className="content-sections">
        <div className="left-section">
          <h3>Projects</h3>
          <img src="/placeholder-project-icon.png" alt="Projects" />{" "}
          {/* Placeholder image */}
        </div>
        <div className="right-section">
          {/* Placeholder for image grid or carousel */}
          <img src="/placeholder-project-image1.png" alt="Project 1" />
          <img src="/placeholder-project-image2.png" alt="Project 2" />
          <img src="/placeholder-project-image3.png" alt="Project 3" />
        </div>
      </div>
      <button className="view-all-button">View All New Projects</button>
    </section>
  );
}

export default NewProjectsBanner;
