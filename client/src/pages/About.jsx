import React from "react";

const About = () => {
  // JSON data (you can also move this to a separate about.json file later)
  const aboutData = {
    subtitle: "welcome to sportfit",
    title: "About Sportfit",
    highlight:
      "	Even though it is convenient and just, it is not a little feugiat. Until a lion wants to want to be a good porttitor, a good porttitor, sollicitudin.",
    text: "Live with variety, not monotony, facing challenges with confidence. Move forward with balance and harmony. Focus on meaningful goals. Success does not come from chance, but from preparation and effort. Strength comes from discipline and resilience. Stay grounded and steady. Opportunities open when you are consistent and purposeful. Stay true to your path, remain calm under pressure, and carry yourself with dignity. Keep moving forward with confidence, even through challenges.",
    button: {
      text: "Join Now",
      link: "/signup",
    },
    image: "images/a1.png",
  };

  const [firstWord, ...rest] = aboutData.title.split(" ");

  return (
    <div className="about">
      <div className="container about_container">
        <div className="row">
          <div className="col-lg-6">
            <div className="about_content">
              <div className="section_title_container">
                <div className="section_subtitle">{aboutData.subtitle}</div>
                <div className="section_title">
                  {firstWord} <span>{rest.join(" ")}</span>
                </div>
              </div>

              <div className="text_highlight">{aboutData.highlight}</div>

              <div className="about_text">
                <p>{aboutData.text}</p>
              </div>

              <div className="button about_button">
                <a href={aboutData.button.link}>{aboutData.button.text}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background with image */}
      <div className="about_background">
        <div className="container fill_height">
          <div className="row fill_height">
            <div className="col-lg-6 offset-lg-6 fill_height">
              <div className="about_image">
                <img src={aboutData.image} alt="About Sportfit" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
