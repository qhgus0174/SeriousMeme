import React from 'react';
import { DateTime } from 'luxon';

export const nowDay = DateTime.now().toFormat('d');
export const nowDayOfWeek = DateTime.now().toFormat('ccc', { locale: 'kr' });
export const nowDateTime = DateTime.now().toFormat('T');
export const nowDateToMillis = DateTime.now().toMillis();
