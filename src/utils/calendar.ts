import { format, addMinutes, parseISO } from 'date-fns';
import { Appointment } from '../types';

/**
 * Generates a Google Calendar URL to create an event
 * This opens Google Calendar with pre-filled event details
 */
export function generateGoogleCalendarUrl(appointment: Appointment): string {
  const startDate = parseISO(`${appointment.date}T${appointment.time}`);
  const endDate = addMinutes(startDate, appointment.duration);

  const formatGCalDate = (date: Date): string => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${appointment.service} - ${appointment.clientName}`,
    dates: `${formatGCalDate(startDate)}/${formatGCalDate(endDate)}`,
    details: [
      `Cliente: ${appointment.clientName}`,
      `Telefone: ${appointment.clientPhone}`,
      `Serviço: ${appointment.service}`,
      `Duração: ${appointment.duration} minutos`,
      appointment.notes ? `Observações: ${appointment.notes}` : '',
    ].filter(Boolean).join('\n'),
    location: '',
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Opens Google Calendar in a new tab to create the event
 */
export function addToGoogleCalendar(appointment: Appointment): void {
  const url = generateGoogleCalendarUrl(appointment);
  window.open(url, '_blank');
}
