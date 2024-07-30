import React, { createContext, useContext, useState } from "react";

const UserApplicationsContext = createContext();

export const UserApplicationsProvider = ({ children }) => {
  const [appliedJobs, setAppliedJobs] = useState([]);

  const addAppliedJob = (jobId) => {
    if (!appliedJobs.includes(jobId)) {
      setAppliedJobs((prevJobs) => [...prevJobs, jobId]);
    }
  };

  return (
    <UserApplicationsContext.Provider value={{ appliedJobs, addAppliedJob }}>
      {children}
    </UserApplicationsContext.Provider>
  );
};

export const useUserApplications = () => useContext(UserApplicationsContext);
