import axiosInstance from '@/lib/axios.instance';
import { apis } from '../../apis/apis';

export const _get_meeting_details = async (meeting_code: string) => {
  const createMeetings = await axiosInstance({
    method: apis.createMeetings.method,
    url: apis.createMeetings.url + `/${meeting_code}`,
  });

  return createMeetings;
};
