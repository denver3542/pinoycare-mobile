import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axiosInstance, { getJWTHeader } from "../../../../utils/axiosConfig";
import { useState } from 'react';

async function getDashboardData() {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};
    const { data } = await axiosInstance.get(`/dashboard`, {
      headers,
      "Content-Type": "application/json;charset=utf-8",
    });
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

const deleteResource = async (url, idField, id) => {
  try {
    const storedUser = await AsyncStorage.getItem("upcare_user");
    const headers = storedUser ? getJWTHeader(JSON.parse(storedUser)) : {};

    const response = await axiosInstance.delete(url, {
      headers,
      data: {
        [idField]: id,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to delete resource');
    }

    return id;
  } catch (error) {
    throw new Error(error.message);
  }
};

export function useDashboard() {
  const queryClient = useQueryClient();
  const dashboardQuery = useQuery(["dashboard"], getDashboardData);
  const [deleteError, setDeleteError] = useState(null);

  const deleteApplication = useMutation(
    (applicationId) => deleteResource('/delete/applications', 'application_id', applicationId),
    {
      onMutate: async (applicationId) => {
        await queryClient.cancelQueries(['dashboard']);
        const previousData = queryClient.getQueryData(['dashboard']);

        queryClient.setQueryData(['dashboard'], (old) => {
          if (!old) return old;
          return {
            ...old,
            applications: old.applications ? old.applications.filter(app => app.id !== applicationId) : []
          };
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        setDeleteError(err.message);
        queryClient.setQueryData(['dashboard'], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['dashboard']);
      }
    }
  );

  const deleteJobOffer = useMutation(
    (jobOfferId) => deleteResource('/delete/job-offers', 'job_offers_id', jobOfferId),
    {
      onMutate: async (jobOfferId) => {
        await queryClient.cancelQueries(['dashboard']);
        const previousData = queryClient.getQueryData(['dashboard']);

        queryClient.setQueryData(['dashboard'], (old) => {
          if (!old) return old;
          return {
            ...old,
            jobOffers: old.jobOffers ? old.jobOffers.filter(offer => offer.id !== jobOfferId) : []
          };
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        setDeleteError(err.message);
        queryClient.setQueryData(['dashboard'], context.previousData);
      },
      onSettled: () => {
        queryClient.invalidateQueries(['dashboard']);
      }
    }
  );

  const deleteSavedJob = useMutation(
    (savedJobId) => deleteResource('/delete/saved-jobs', 'savedjob_id', savedJobId),
    {
      onMutate: async (savedJobId) => {
        await queryClient.cancelQueries(['dashboard']); // Cancel ongoing dashboard queries
        const previousData = queryClient.getQueryData(['dashboard']); // Get previous dashboard data

        // Optimistically update the cache to remove the deleted saved job
        queryClient.setQueryData(['dashboard'], (old) => {
          if (!old) return old;

          return {
            ...old,
            savedJobs: old.savedJobs ? old.savedJobs.filter(job => job.id !== savedJobId) : []
          };
        });

        return { previousData };
      },
      onError: (err, variables, context) => {
        // Handle errors and revert back to previous dashboard data on error
        setDeleteError(err.message);
        queryClient.setQueryData(['dashboard'], context.previousData);
      },
      onSettled: (data, error, savedJobId) => {
        const { job_id: jobId } = data || {};

        if (jobId) {
          queryClient.invalidateQueries(['job', jobId], { exact: true }); // Invalidate job query with exact match on job ID
        }

        queryClient.invalidateQueries(['dashboard']); // Invalidate dashboard query after mutation
      }
    }
  );


  return {
    ...dashboardQuery,
    deleteApplication,
    deleteJobOffer,
    deleteSavedJob,
    deleteError,
  };
}
