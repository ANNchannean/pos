import 'dotenv/config';
import { db } from './db';
const TELEGRAM_API_URL = 'https://api.telegram.org/bot'
export async function sendMessageToTelegram(message: string) {
   const get_company = await db.query.companyInfo.findFirst();
   const url = `${TELEGRAM_API_URL}${get_company?.bot_token}/sendMessage`;

   const body = {
      chat_id: get_company?.chat_id,
      text: message
   };

   try {
      const response = await fetch(url, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.ok) {
         console.log('Message sent successfully');
      } else {
         console.error('Error sending message:', data.description);
      }
   } catch (error) {
      console.error('Error sending message:', error);
   }
}