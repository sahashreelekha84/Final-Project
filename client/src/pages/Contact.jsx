import React from "react";

const Contact = () => {
  return (
    <section className="contact py-5 bg-light mt-5" id="contact">
      <div className="container">
        <div className="row g-5 align-items-start">
          {/* Left Info Section */}
          <div className="col-lg-4 col-md-5 col-sm-12">
            <div className="contact_content text-center text-md-start">
              {/* Logo */}
              <div className="contact_logo mb-4 d-flex justify-content-center justify-content-md-start">
                <div className="logo d-flex align-items-center">
                  <img
                    src="images/dot.png"
                    alt="Sportfit Logo"
                    className="me-2"
                    style={{ width: "30px" }}
                  />
                  <h3 className="fw-bold m-0 text-dark">
                    Sport<span className="text-primary">fit</span>
                  </h3>
                </div>
              </div>

              {/* Text */}
              <p className="text-muted">
                Stay connected with us for fitness tips, membership details, and
                support. We’re here to help you achieve your health goals!
              </p>

              {/* Contact List */}
              <ul className="list-unstyled mt-4">
                <li className="mb-3 d-flex justify-content-center justify-content-md-start">
                  <strong className="me-2">📍</strong>
                  1481 Creekside Lane, Avila Beach, CA 931
                </li>
                <li className="mb-3 d-flex justify-content-center justify-content-md-start">
                  <strong className="me-2">📞</strong>
                  +53 345 7953 32453
                </li>
                <li className="mb-3 d-flex justify-content-center justify-content-md-start">
                  <strong className="me-2">✉️</strong>
                  yourmail@gmail.com
                </li>
              </ul>
            </div>
          </div>

          {/* Right Contact Form */}
          <div className="col-lg-8 col-md-7 col-sm-12 mt-5">
            <div className="card shadow-lg border-0 rounded-3 p-4">
              <h4 className="fw-bold text-dark mb-3 text-center text-md-start">
                Get in Touch
              </h4>
              <p className="text-muted mb-4 text-center text-md-start">
                Fill out the form below and we’ll get back to you as soon as
                possible.
              </p>
              <form id="contact_form" className="contact_form">
                <div className="row g-3">
                  <div className="col-md-6 col-12">
                    <input
                      type="text"
                      className="form-control rounded-3 w-100"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="col-md-6 col-12">
                    <input
                      type="email"
                      className="form-control rounded-3 w-100"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control rounded-3 w-100"
                      rows="5"
                      placeholder="Your Message"
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 text-center text-md-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 w-100 w-md-auto"
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
 
        {/* Google Map - Responsive */}
        <div className="row mt-5">
          <div className="col">
            <div
              className="map shadow rounded-3 overflow-hidden"
              style={{ width: "100%", height: "350px" }}
            >
              <iframe
                title="Google Map - West Bengal"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.847726023859!2d88.36389541496065!3d22.57264698517959!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02763c82b1b2e9%3A0x5a0f7b0b8db8d10a!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1693123456789!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
