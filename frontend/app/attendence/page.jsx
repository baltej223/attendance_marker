"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/comps/navbar";
import { redirect } from "next/navigation";

const dayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const AttendanceForm = ({ className }) => {
  const [link, setLink] = useState("");
  const [time, setTime] = useState("");
  const [day, setDay] = useState(null);

  const [questions, setQuestions] = useState([
    { id: crypto.randomUUID(), question: "", answer: "" },
  ]);

  const handleQuestionChange = (id, field, value) => {
    setQuestions(qs =>
      qs.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const addQuestion = () => {
    setQuestions(qs => [
      ...qs,
      { id: crypto.randomUUID(), question: "", answer: "" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const req = {
      link,
      time,
      day,
      cookie: document.cookie,
      questions,
    };

    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });

    const json = await res.json();
    alert(json._status);
  };

  return (
    <div className={`w-full flex justify-center ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="max-w-md p-6 bg-white rounded-lg shadow-md w-[400px]"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Submit a Link
        </h2>

        {/* Link */}
        <input
          value={link}
          onChange={e => setLink(e.target.value)}
          placeholder="https://example.com"
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        {/* Time */}
        <input
          value={time}
          onChange={e => setTime(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        {/* Day */}
        <div className="mb-4 space-y-1">
          {Object.entries(dayMap).map(([name, value]) => (
            <label key={name} className="flex gap-2">
              <input
                type="radio"
                checked={day === value}
                onChange={() => setDay(value)}
              />
              {name}
            </label>
          ))}
        </div>

        {/* Questions */}
        {questions.map(q => (
          <div key={q.id} className="mb-4">
            <input
              value={q.question}
              onChange={e =>
                handleQuestionChange(q.id, "question", e.target.value)
              }
              placeholder="Question"
              required
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <input
              value={q.answer}
              onChange={e =>
                handleQuestionChange(q.id, "answer", e.target.value)
              }
              placeholder="Answer"
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full bg-gray-500 text-white py-2 rounded"
        >
          Add Question
        </button>

        <button
          type="submit"
          className="mt-4 w-full bg-gray-700 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

function Home() {
  useEffect(() => {
    if (!document.cookie) redirect("/login");
  }, []);

  return (
    <>
      <Navbar />
      <AttendanceForm />
    </>
  );
}

export default Home;
