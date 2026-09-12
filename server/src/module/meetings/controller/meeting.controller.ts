import { Request, Response } from 'express';
import Meeting from '../schema/meeting.schema';
import { v4 as uuidv4 } from 'uuid';
import { _create_meeting_cache } from '../../../cache/meetings.cache';

export async function _create_unique_uuid(user_id: string) {
  const uuid = uuidv4();

  const meeting = await Meeting.findOne({
    where: {
      userId: user_id,
      meetingCode: uuid,
    },
  });

  if (meeting) {
    return await _create_unique_uuid(user_id);
  }

  return uuid;
}

export const _create_meetings = async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user) {
    return res
      .status(400)
      .json({ status: 'UNAUTHENTICATED', message: 'PLEASE LOGIN' });
  }

  const _unique_code = await _create_unique_uuid(user.id);
  console.log(_unique_code);

  const meetings = await Meeting.create({
    userId: user.id,
    meetingCode: _unique_code,
    meetingName: 'helloworld',
  });

  _create_meeting_cache(
    meetings.getDataValue('meetingCode'),
    user.id,
    meetings.getDataValue('expiresAt'),
    meetings.getDataValue('autoExpires'),
  );

  return res
    .status(201)
    .json({ status: 'SUCCESS', message: 'MEETING CREATED', data: meetings });
};

export const _get_meeting_details = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const { id } = req.params;

  if (!user) {
    return res
      .status(400)
      .json({ status: 'UNAUTHENTICATED', message: 'PLEASE LOGIN' });
  }

  const meeting = await Meeting.findOne({
    where: {
      meetingCode: id,
    },
    attributes: [
      'userId',
      'meetingCode',
      'meetingName',
      'isPrivate',
      'expiresAt',
    ],
  });

  if (!meeting) {
    return res
      .status(404)
      .json({ status: 'NOT_FOUND', message: 'MEETING NOT FOUND' });
  }

  const meetingData = meeting.get({ plain: true });
  const { userId, ...meetingDetails } = meetingData;
  const isAdmin = String(userId) === String(user.id);

  return res.status(200).json({
    status: 'SUCCESS',
    message: 'MEETING DETAILS',
    data: { ...meetingDetails, isAdmin },
  });
};
