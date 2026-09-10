import { SelectDropdown } from '@spooder/webui-component-library';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface UpdateScheduleSetProps {
  formKey: string;
}

export default function UpdateScheduleSet({ formKey }: UpdateScheduleSetProps) {
  const { setValue, getValues } = useFormContext();
  const [frequency, setFrequency] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);

  const generateScheduleString = (freq: string, timeValue: string) => {
    const [hour, minute] = timeValue.split(':');

    switch (freq) {
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        return `${minute} ${hour} * * 0`; // Sunday
      case 'monthly':
        return `${minute} ${hour} 1 * *`; // First day of month
      default:
        return `${minute} ${hour} * * *`;
    }
  };

  const decodeScheduleString = (schedule: string) => {
    // Example cron: '00 02 * * *' (daily), '00 02 * * 0' (weekly), '00 02 1 * *' (monthly)
    const parts = schedule.trim().split(/\s+/);
    if (parts.length < 5) return { frequency: 'daily', time: '02:00' };
    const [minute, hour, dayOfMonth, , dayOfWeek] = parts;
    let frequency = 'daily';
    if (dayOfMonth === '1') frequency = 'monthly';
    else if (dayOfWeek === '0') frequency = 'weekly';
    // Pad hour/minute to 2 digits
    const pad = (n: string) => n.padStart(2, '0');
    return { frequency, time: `${pad(hour)}:${pad(minute)}` };
  };

  useEffect(() => {
    if (frequency == null || time == null) {
      const scheduleString = getValues(`${formKey}.schedule`);
      const decoded = decodeScheduleString(scheduleString);
      setFrequency(decoded.frequency);
      setTime(decoded.time);
      return;
    }
    const scheduleString = generateScheduleString(frequency, time);
    setValue(`${formKey}.schedule`, scheduleString);
  }, [frequency, time, setValue, formKey]);

  return (
    <>
      <SelectDropdown
        label='Frequency'
        value={frequency ?? ''}
        onChange={setFrequency}
        options={[
          { label: 'Select Frequency', value: '' },
          { label: 'Daily', value: 'daily' },
          { label: 'Weekly', value: 'weekly' },
          { label: 'Monthly', value: 'monthly' },
        ]}
      />
      <SelectDropdown
        label='Time'
        value={time ?? ''}
        onChange={setTime}
        options={[
          { label: 'Select Time', value: '' },
          { label: '12:00 AM (Midnight)', value: '00:00' },
          { label: '1:00 AM', value: '01:00' },
          { label: '2:00 AM', value: '02:00' },
          { label: '3:00 AM', value: '03:00' },
          { label: '4:00 AM', value: '04:00' },
          { label: '5:00 AM', value: '05:00' },
          { label: '6:00 AM', value: '06:00' },
          { label: '7:00 AM', value: '07:00' },
          { label: '8:00 AM', value: '08:00' },
          { label: '9:00 AM', value: '09:00' },
          { label: '10:00 AM', value: '10:00' },
          { label: '11:00 AM', value: '11:00' },
          { label: '12:00 PM (Noon)', value: '12:00' },
          { label: '1:00 PM', value: '13:00' },
          { label: '2:00 PM', value: '14:00' },
          { label: '3:00 PM', value: '15:00' },
          { label: '4:00 PM', value: '16:00' },
          { label: '5:00 PM', value: '17:00' },
          { label: '6:00 PM', value: '18:00' },
          { label: '7:00 PM', value: '19:00' },
          { label: '8:00 PM', value: '20:00' },
          { label: '9:00 PM', value: '21:00' },
          { label: '10:00 PM', value: '22:00' },
          { label: '11:00 PM', value: '23:00' },
        ]}
      />
    </>
  );
}
