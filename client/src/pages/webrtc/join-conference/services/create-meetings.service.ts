import axiosInstance from "@/lib/axios.instance"
import { apis } from "../apis/api"

export const _create_meetings = async () => {
    const createMeetings = await axiosInstance({
        method: apis.createMeetings.method,
        url: apis.createMeetings.url
    })

    return createMeetings;
}

export const _get_meeting_details = async (meetingId: string) => {
    const getMeetingDetails = await axiosInstance({
        method: apis.getMeetingDetails.method,
        url: apis.getMeetingDetails.url.replace(":meetingId", meetingId)
    })
    return getMeetingDetails;
}