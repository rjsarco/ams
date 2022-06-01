import React, { useState } from 'react';

import { SortingConfiguration } from '../models/candidates';
interface Props {
  config: SortingConfiguration;
  onChange: (config: SortingConfiguration) => void;
}

function SortForm({ config, onChange } : Props) {
  return (
    <div className="SortForm" style={{display:"flex", flexDirection: "row"}}>
      <h2>Sorting Config</h2>
      <label>
        Property
        <select value={config.property} onChange={(event: React.SyntheticEvent) => {
          const target = event.target as typeof event.target & {
            value: 'string';
          };
          onChange({
            ...config,
            property: target.value
          });
        }}>
          <option value="first_name">first_name</option>
          <option value="last_name">last_name</option>
          <option value="age">age</option>
          <option value="created_at">created_at</option>
          <option value="interview_score">interview_score</option>
          <option value="technical_score">technical_score</option>
          <option value="score_sum">score_sum</option>
        </select>
      </label>
      <label>
        Direction
        <div
          style={{display:"flex", flexDirection: "row", width: 300}}
          onChange={(event: React.SyntheticEvent) => {
          const target = event.target as typeof event.target & {
            value: 'asc' | 'desc';
          };
          onChange({
            ...config,
            direction: (target.value || config.direction || "asc")!
          });
        }}>
          <input type="radio" value="asc" name="direction" checked={config.direction === 'asc'} /> Ascending
          <input type="radio" value="desc" name="direction" checked={config.direction === 'desc'} /> Descending
        </div>
      </label>
    </div>
  );
}

export default SortForm;