import React from "react";

// Sample JSON data
const testimonialData = [
  {
    id: 1,
    name: "Diane Smith",
    title: "Client",
    image: "images/test_1.jpg",
    text: "Etiam nec odio vestibulum est mattis effic iturut magna. Pellentesque sit amet tellus blandit. Etiam nec odio vestibulum est mattis effic iturut magna.",
    rating: 4
  },
  {
    id: 2,
    name: "John Doe",
    title: "Client",
    image: "images/test_2.jpg",
    text: "Etiam nec odio vestibulum est mattis effic iturut magna. Pellentesque sit amet tellus blandit.",
    rating: 5
  },
  {
    id: 3,
    name: "Jane Lee",
    title: "Client",
    image: "images/test_3.jpg",
    text: "Etiam nec odio vestibulum est mattis effic iturut magna. Pellentesque sit amet tellus blandit.",
    rating: 4
  }
];

const galleryImages = [
  "images/gallery_3.jpg",
  "images/gallery_4.jpg",
  "images/gallery_5.jpg",
  "images/gallery_1.jpg",
  "images/gallery_2.jpg"
];

const Testimonial = () => {
  return (
    <div>
      <div className="testimonials">
        <div
          className="parallax_background parallax-window"
          data-parallax="scroll"
          data-image-src="images/testimonials.jpg"
          data-speed="0.8"
        ></div>
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section_title_container">
                <div className="section_subtitle">Welcome to Sportfit</div>
                <div className="section_title">Testimonials</div>
              </div>

              {testimonialData.slice(0, 1).map((t) => (
                <div key={t.id} className="test test_1 d-flex flex-row align-items-start justify-content-start">
                  <div>
                    <div className="test_image">
                      <img src={t.image} alt={t.name} />
                    </div>
                  </div>
                  <div className="test_content">
                    <div className="test_name">
                      <a href="#">{t.name}</a>
                    </div>
                    <div className="test_title">{t.title}</div>
                    <div className="test_text">
                      <p>{t.text}</p>
                    </div>
                    <div className={`rating rating_${t.rating} test_rating`}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < t.rating ? "filled" : ""}></i>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-6">
              {testimonialData.slice(1).map((t) => (
                <div key={t.id} className="test d-flex flex-row align-items-start justify-content-start mb-3">
                  <div>
                    <div className="test_image">
                      <img src={t.image} alt={t.name} />
                    </div>
                  </div>
                  <div className="test_content">
                    <div className="test_name">
                      <a href="#">{t.name}</a>
                    </div>
                    <div className="test_title">{t.title}</div>
                    <div className="test_text">
                      <p>{t.text}</p>
                    </div>
                    <div className={`rating rating_${t.rating} test_rating`}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={i < t.rating ? "filled" : ""}></i>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="row test_button_row">
            <div className="col text-center">
              <div className="button test_button">
                <a href="/signup">Join Now</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gallery">
        <div className="gallery_slider_container">
          <div className="owl-carousel owl-theme gallery_slider">
            {galleryImages.map((img, index) => (
              <div key={index} className="owl-item">
                <img src={img} alt={`Gallery ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
