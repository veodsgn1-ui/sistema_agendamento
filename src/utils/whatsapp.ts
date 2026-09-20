import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Appointment } from '../types';

/**
 * Formats phone number to international format (removes non-digits)
 */
export function formatPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '');
}

/**
 * Generates a WhatsApp message for appointment confirmation
 */
export function generateConfirmationMessage(appointment: Appointment): string {
  const date = parseISO(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(date, "HH:mm");

  return `🗓️ *Confirmação de Agendamento*\n\n` +
    `Olá, ${appointment.clientName}! 👋\n\n` +
    `Seu agendamento foi confirmado com os seguintes detalhes:\n\n` +
    `📋 *Serviço:* ${appointment.service}\n` +
    `📅 *Data:* ${formattedDate}\n` +
    `⏰ *Horário:* ${formattedTime}\n` +
    `⏱️ *Duração:* ${appointment.duration} minutos\n` +
    `${appointment.notes ? `📝 *Observações:* ${appointment.notes}\n` : ''}\n` +
    `Por favor, confirme sua presença respondendo esta mensagem.\n\n` +
    `✅ _Mensagem enviada automaticamente pelo AgendaFlow_`;
}

/**
 * Generates a WhatsApp reminder message
 */
export function generateReminderMessage(appointment: Appointment): string {
  const date = parseISO(`${appointment.date}T${appointment.time}`);
  const formattedDate = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  const formattedTime = format(date, "HH:mm");

  return `⏰ *Lembrete de Agendamento*\n\n` +
    `Olá, ${appointment.clientName}!\n\n` +
    `Este é um lembrete do seu agendamento:\n\n` +
    `📋 *Serviço:* ${appointment.service}\n` +
    `📅 *Data:* ${formattedDate}\n` +
    `⏰ *Horário:* ${formattedTime}\n\n` +
    `Estamos te esperando! 😊\n\n` +
    `✅ _Mensagem enviada automaticamente pelo AgendaFlow_`;
}

/**
 * Opens WhatsApp with pre-filled message for the client
 */
export function sendWhatsAppMessage(appointment: Appointment, type: 'confirmation' | 'reminder' = 'confirmation'): void {
  const phone = formatPhoneNumber(appointment.clientPhone);
  const message = type === 'confirmation'
    ? generateConfirmationMessage(appointment)
    : generateReminderMessage(appointment);

  const encodedMessage = encodeURIComponent(message);
  const url = `https://wa.me/${phone}?text=${encodedMessage}`;
  window.open(url, '_blank');
}

/**
 * Opens WhatsApp Web chat with the client
 */
export function openWhatsAppChat(appointment: Appointment): void {
  const phone = formatPhoneNumber(appointment.clientPhone);
  const url = `https://wa.me/${phone}`;
  window.open(url, '_blank');
}
