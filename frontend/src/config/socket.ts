import { io } from 'socket.io-client';
import { baseUrl } from '../constants/baseUrl';

export const clientSocket = io(baseUrl);
export const adminSocket = io(baseUrl + '/admin');
