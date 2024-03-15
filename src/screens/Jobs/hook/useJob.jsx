import { useQuery } from "@tanstack/react-query";

async function getJobData() {}

export default function useJob() {
  return useQuery(["job"], () => getJobData());
}
