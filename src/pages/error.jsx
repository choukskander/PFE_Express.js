import React from "react";
import { Link } from "react-router-dom";
import Footer from './Footer';

function Error() {
  return (
    <div>
      <div>
        {/* Header START */}
        <header className="navbar-light header-sticky">
          {/* Logo Nav START */}
          <nav className="navbar navbar-expand-xl">
            <div className="container">
                 
              {/* Logo START */}
            <div className="flex items-center">
                              <Link to="/" className="flex items-center space-x-2">
                                <img src="/SmallSquareLogoJpg.jpg" alt="Logo" className="h-16 w-auto" />
                              </Link>
                            </div>
              {/* Logo END */}
              {/* Responsive navbar toggler */}
              <button
                className="navbar-toggler ms-auto mx-3 me-xl-0 p-0 p-sm-1"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarCollapse"
                aria-controls="navbarCollapse"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-animation">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
              {/* Navbar right side START */}
              <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
                {/* Sign In button */}
                <li className="nav-item ms-2 d-none d-sm-block">
                  <Link
                    to="/login"
                    className="btn btn-sm btn-success-soft mb-0"
                  >
                    <i className="fa-solid fa-right-to-bracket me-2" />
                    Sign in
                  </Link>
                </li>
                {/* Sign Up button */}
                <li className="nav-item ms-2 d-none d-sm-block">
                  <Link
                    to="/register"
                    className="btn btn-sm btn-primary-soft mb-0"
                  >
                    <i className="fa-solid fa-user-plus me-2" />
                    Sign Up
                  </Link>
                </li>
              </ul>
              {/* Navbar right side END */}
            </div>
          </nav>
          {/* Logo Nav END */}
        </header>
        {/* Header END */}
        {/* **************** MAIN CONTENT START **************** */}
        <section>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-10 text-center mx-auto">
                {/* Image */}
                <img
                  src="/404 error with portals-rafiki.png"
                  className="h-lg-400px mb-4"
                />
                {/* Title */}
                <h1 className="display-1 text-primary mb-0">404</h1>
                {/* Subtitle */}
                <h2>Oh no, something went wrong!</h2>
                {/* info */}
                <p className="mb-4">
                  Either something went wrong or this page doesn't exist
                  anymore.
                </p>
                {/* Button */}
                <Link to="/" className="btn btn-light mb-0">
                  Take me to Homepage
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* **************** MAIN CONTENT END **************** */}
        {/* =======================
Footer START */}
        <Footer />
        {/* =======================
Footer END */}
      </div>
    </div>
  );
}

export default Error;
