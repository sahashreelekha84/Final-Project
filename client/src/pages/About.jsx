import React from "react";

const About = () => {
  // JSON data (you can also move this to a separate about.json file later)
  const aboutData = {
    subtitle: "welcome to sportfit",
    title: "About Sportfit",
    highlight:
      "Etiam commodo justo nec aliquam feugiat. Donec a leo eget eget augue porttitor sollicitudin augue porttitor sollicitudin.",
    text: "Morbi sed varius risus, vitae molestie lectus. Donec id hendrerit velit, eu fringilla neque. Etiam id finibus sapien. Donec sollicitudin luctus ex non pharetra. Aenean lobortis ut leo vel porta. Maecenas ac vestibulum lectus. Cras nulla urna, lacinia ut tempor facilisis, congue dignissim tellus. Maecenas ac vestibulum lectus. Cras nulla urna, lacinia ut tempor facilisis, congue dignissim tellus. Phasellus sit amet justo ullamcorper, elementum ipsum nec.",
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
