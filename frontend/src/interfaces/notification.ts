export interface INotification {
   _id: string;
   userId: string | null;
   type: 'client' | 'admin';
   title: string;
   message: string;
   isRead: boolean;
   link: string;
   createdAt: string;
}
