import { NavLink } from "react-router-dom";
import React, { useState } from "react";

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    fetch("", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.code === 200) {
          alert("We received your submission, thank you!");
          setName("");
          setEmail("");
          setMessage("");
          setError("");
        } else if (response.code === 422) {
          // Field validation failed
          setError(response.message);
        } else {
          // other error from formcarry
          setError("An error occurred, please try again.");
        }
      })
      .catch((error) => {
        // request-related error
        setError(error.message ? error.message : error);
      });
  }

  return (
    <section className="max_padd_container flexCenter flex-col pt-32 pb-5">
      <form onSubmit={onSubmit}>
        <div className="w-full h-[650px] bg-white m-auto px-14 py-10 rounded-md">
          <h3 className="h3">Contact Us</h3>
          <div className="flex flex-col gap-4 mt-7">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Please Enter Your Name"
              className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              placeholder="Please Enter Your Email"
              className="h-14 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              required
            />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              id="message"
              placeholder="Please Enter Your Message"
              className="h-44 w-full pl-5 bg-slate-900/5 outline-none rounded-xl"
              required
            ></textarea>
            {error && <p className="text-red-500">{error}</p>}
            <button
              className="btn_secondary_rounded my-5 w-full !rounded-md"
              type="submit"
            >
              Submit
            </button>
            <p className="text-slate-700">
              Or you can reach us by phone at <strong>021-792-597</strong> or by email at <strong>nimpressionltd@outlook.com</strong>.
            </p>
          </div>
        </div>
      </form>
    </section>
  );
}
