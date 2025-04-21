import React from "react";
import { Link } from "react-router-dom";
// import Navbar from "./Navbar"; 
function Register() {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <section>
          <h2 className="text-center mt-4">Choose Your Account Type</h2>
          <div className="container mt-5 px-4">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="bg-white shadow rounded-3 overflow-hidden">
                  <div className="row g-0">
                    <div className="col-md-6 border-end">
                      <Link
                        to="/registerInternaute"
                        className="p-4 d-block text-decoration-none"
                      >
                        <img
                          src="/Stem-cell research-bro.png"
                          className="img-fluid mx-auto d-block"
                          alt="Internaute"
                          style={{ maxWidth: "400px" }}
                        />
                        <h5 className="text-center mt-3">Internaute</h5>
                      </Link>
                    </div>

                    <div className="col-md-6">
                      <Link
                        to="/registerPatient"
                        className="p-4 d-block text-decoration-none"
                      >
                        <img
                          src="/Oncology patient-bro.png"
                          className="img-fluid mx-auto d-block"
                          alt="Patient"
                          style={{ maxWidth: "400px" }}
                        />
                        <h5 className="text-center mt-3">Patient</h5>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
