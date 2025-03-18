import 'dotenv/config';
const { CHAT_ID, TELEGRAM_API_URL, TELEGRAM_BOT_TOKEN } = process.env
export async function sendMessageToTelegram(message: string) {
   const url = `${TELEGRAM_API_URL}${TELEGRAM_BOT_TOKEN}/sendMessage`;

   const body = {
      chat_id: CHAT_ID,
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