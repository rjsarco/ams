import React, { useState, useEffect } from 'react';
import './App.css';

import { useCandidates, sortCandidates, SortingConfiguration } from './models/candidates';

import CandidatesTable from './components/CandidatesTable';
import CandidateForm from './components/CandidateForm';
import SortForm from './components/SortForm';

import {Candidate} from './types';

function App() {
  const [sortingConfiguration, setSortingConfiguration] = useState<SortingConfiguration>({
    property: 'created_at',
    direction: 'desc'
  });
  const candidates = useCandidates();
  const [sortedCandidated, setSortedCandidates] = useState<Candidate[]>([]);

  useEffect(() => {
    setSortedCandidates(sortCandidates(candidates, sortingConfiguration));
  }, [candidates, sortingConfiguration]);

  return (
    <div className="App" style={{ display:"flex", flexDirection: "row" }}>
      <section>
        <SortForm
          config={sortingConfiguration}
          onChange={(config:SortingConfiguration) => setSortingConfiguration(config)}
        />
        <CandidatesTable candidates={sortedCandidated} />
      </section>
      <CandidateForm />
    </div>
  );
}

export default App;