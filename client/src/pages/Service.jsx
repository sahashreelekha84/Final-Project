import React from "react";

const Service = () => {
  const servicesData = [
    {
      icon: "images/icon_4.png",
      title: "Weight Loss Classes",
      text: "Effective weight loss programs designed to help you stay fit and healthy.",
    },
    {
      icon: "images/icon_5.png",
      title: "Yoga Classes",
      text: "Improve flexibility, strength, and relaxation with our yoga sessions.",
    },
    {
      icon: "images/icon_6.png",
      title: "Spinning Classes",
      text: "High-energy spinning workouts to boost stamina and burn calories.",
    },
    {
      icon: "images/icon_7.png",
      title: "Private Fit Classes",
      text: "Personalized one-on-one training sessions with expert coaches.",
    },
    {
      icon: "images/icon_8.png",
      title: "Nutrition Classes",
      text: "Learn about healthy eating and balanced diets for overall wellness.",
    },
    {
      icon: "images/icon_9.png",
      title: "Pilates Classes",
      text: "Strengthen your core and improve posture with pilates training.",
    },
  ];

  return (
    <div className="services">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="section_title_container">
              <div className="section_subtitle">welcome to sportfit</div>
              <div className="section_title">Our Courses</div>
            </div>
          </div>
        </div>

        <div className="row services_row">
          {servicesData.map((service, index) => (
            <div key={index} className="col-xl-4 col-md-6 service_col">
              <div className="service">
                <div className="service_title_container d-flex flex-row align-items-center justify-content-start">
                  <div>
                    <div className="service_icon">
                      <img src={service.icon} alt={service.title} />
                    </div>
                  </div>
                  <div className="service_title">{service.title}</div>
                </div>
                <div className="service_text">
                  <p>{service.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;
