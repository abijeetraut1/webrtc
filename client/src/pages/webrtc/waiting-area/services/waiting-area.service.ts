import axiosInstance from "@/lib/axios.instance"
import { apis } from "../apis/api"

export const _get_meeting_details = async (meeting_code: string) => {
    console.log("Meeting Request code:", apis.createMeetings.method+`/${meeting_code}`);
    const createMeetings = await axiosInstance({
        method: apis.createMeetings.method,
        url: apis.createMeetings.url+`/${meeting_code}`
    })

    return createMeetings;
}