import cron from 'node-cron';
import { 
  createOpportunityReminders, 
  createEventReminders, 
  sendWeeklyEventDigests,
  createSameDayEventReminders
} from '../controllers/notificationController';

// Schedule tasks to run at specific times
export const startScheduler = (): void => {
  // Run opportunity reminders every day at 9 AM
  cron.schedule('0 9 * * *', async () => {
    console.log('Running scheduled task: Opportunity reminders');
    await createOpportunityReminders();
  });

  // Run event reminders every day at 9 AM (for events happening tomorrow)
  // cron.schedule('0 9 * * *', async () => {
  //   console.log('Running scheduled task: Event reminders for tomorrow');
  //   await createEventReminders();
  // });

  // Run same-day event reminders every day at 7 AM
  cron.schedule('32 6 * * *', async () => {
    console.log('Running scheduled task: Same-day event reminders');
    await createSameDayEventReminders();
  });

  // Send weekly event digest every Monday at 8 AM
  cron.schedule('0 8 * * 1', async () => {
    console.log('Running scheduled task: Weekly event digest');
    await sendWeeklyEventDigests();
  });

  console.log('Scheduler started');
}; 