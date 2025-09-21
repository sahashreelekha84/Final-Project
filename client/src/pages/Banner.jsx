import React from "react";

const Banner = () => {
  // Background image
  const background = {
    image: "images/index.jpg",
    overlay: true,
  };

  // Video section
  const video = {
    href: "https://player.vimeo.com/video/99340873?autoplay=1&loop=1&title=0&autopause=0",
    text: "See Workout Video",
    iconClass: "fa fa-play",
  };

  // Title & subtitle
  const title = "Get fit with us";
  const subtitle = "Pilates, Yoga, Fitness, Spinning & many more";

  // Join button
  const joinButton = {
    text: "Join Now",
    href: "/signup",
  };

  // Boxes data
  const boxes = [
    {
      icon: "images/icon_1.png",
      title: "Pilates with trainer",
      text: "Even comfort should be balanced with purposeful effort. Move forward with confidence, carrying determination and focus.",
      link: "#",
    },
    {
      icon: "images/icon_2.png",
      title: "Swimming Pool",
      text: "“Move forward with strength and determination, carrying responsibility with confidence. Live with balance and variety, not weighed down by difficulties. Stay focused and steady in your efforts.”",
      link: "#",
    },
    {
      icon: "images/icon_3.png",
      title: "Healthy diet plan",
      text: "Live with variety and balance, without being burdened by troubles. Stay strong with confidence, moving forward with focus and harmony.",
      link: "#",
    },
  ];

  return (
    <div>
      {/* Home Section */}
      <div className="home">
        <div
          className="background_image"
          style={{ backgroundImage: `url(${background.image})` }}
        ></div>
        {background.overlay && <div className="overlay"></div>}

        <div className="home_container">
          <div className="container">
            <div className="row">
              <div className="col">
                <div className="home_content text-center">
                  {/* Video */}
                  <div className="video_link">
                    <a
                      className="vimeo video_button d-flex flex-column align-items-center justify-content-center"
                      href={video.href}
                    >
                      <div className="video_link_content d-flex flex-row align-items-center justify-content-start">
                        <div className="video_icon d-flex flex-column align-items-center justify-content-center">
                          <i className={video.iconClass} aria-hidden="true"></i>
                        </div>
                        <span className="video_text">{video.text}</span>
                      </div>
                    </a>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="home_title">{title}</div>
                  <div className="home_subtitle">{subtitle}</div>

                  {/* Join Button */}
                  <div className="button home_button ml-auto mr-auto">
                    <a href={joinButton.href}>{joinButton.text}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Boxes Section */}
      <div className="boxes">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="boxes_container d-flex flex-lg-row flex-column align-items-start justify-content-start">
                {boxes.map((box, index) => (
                  <div className="box" key={index}>
                    <div className="box_icon d-flex flex-column align-items-center justify-content-center">
                      <img src={box.icon} alt={box.title} />
                    </div>
                    <div className="box_title">{box.title}</div>
                    <div className="box_text">
                      <p>{box.text}</p>
                    </div>
                    <div className="box_link_container">
                      <a href={box.link}>
                        <div className="box_link d-flex flex-column align-items-center justify-content-center trans_200">
                          <div>+</div>
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
