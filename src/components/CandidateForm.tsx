import React, { useState } from 'react';

import { Candidate } from "../types";

import { addCandidate } from "../models/candidates";

interface Props {
  candidates: Candidate[];
}

function CandidateForm() {
  const [candidate, setCandidate] = useState<Candidate>({} as Candidate);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    addCandidate(candidate);
  }

  function onChange(event: React.SyntheticEvent) {
    const target = event.target as typeof event.target & {
      value: any;
      name: string;
      type: string;
    };
    setCandidate({
      ...candidate,
      [target.name]: target.type === "number" ? +target.value : target.value
    });
  }

  return (
    <div className="CandidateForm" style={{display:"flex", flexDirection: "column", width: 300}}>
      <h1>Add Candidate</h1>
      <form style={{display:"flex", flexDirection: "column"}} onSubmit={onSubmit}>
        <label>
          First Name
          <input type="text" name="first_name" required onChange={onChange} value={candidate.first_name}/>
        </label>
        <label>
          Last Name
          <input type="text" name="last_name" required onChange={onChange} value={candidate.last_name}/>
        </label>
        <label>
          Email
          <input type="email" name="email" required onChange={onChange} value={candidate.email}/>
        </label>
        <label>
          Age
          <input type="number" name="age" required onChange={onChange} value={candidate.interview_score}/>
        </label>
        <label>
          Interview Score
          <input type="number" name="interview_score" required onChange={onChange} value={candidate.interview_score}/>
        </label>
        <label>
          Technical Score
          <input type="number" name="technical_score" required onChange={onChange} value={candidate.technical_score}/>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default CandidateForm;