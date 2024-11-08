/* eslint-disable @typescript-eslint/no-explicit-any */
import { IoSend } from 'react-icons/io5';
import { useGetAllChatQuery, useGetOneChatQuery, useSendMessageMutation } from '../../../services/chat.service';
import { useState, useEffect, useRef } from 'react';
import { adminSocket } from '../../../config/socket';
import { IAuth } from '../../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatStringToDate } from '../../../helper';
import { Badge } from 'antd';
import NotificationSound from '../../../assets/notification-sound.mp3';
import { setState } from '../../../slices/notice';

const ChatAdmin = () => {
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const { data, refetch: getAllRefetch } = useGetAllChatQuery({});
   const [room, setRoom] = useState('0');
   const [sendMessage] = useSendMessageMutation();
   const dispatch = useDispatch();
   const [message, setMesssage] = useState<string>();
   const scrollRef = useRef<HTMLDivElement | null>(null);
   const { data: messagesInARoom, refetch } = useGetOneChatQuery(room, { skip: room == '0' });
   const audioPlayer = useRef<HTMLAudioElement | null>(null)
   const handleRefetch = async () => {
      await refetch();
      await getAllRefetch();
   }
   useEffect(() => {
      if (room != '0') {
         handleRefetch()
      }
   }, [room]);
   useEffect(() => {
      adminSocket.open();
      const handleUpdateChat = async () => {
         if (audioPlayer.current !== null) {
            audioPlayer.current.play()
         }
         dispatch(setState())
         handleRefetch()
      };
      adminSocket.on('updatemess', handleUpdateChat);
   }, [auth]);
   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollIntoView({ block: 'end' });
      }
      getAllRefetch();
      dispatch(setState())
   }, [messagesInARoom]);
   const handleChangeMessage = (e: any) => {
      setMesssage(e.target.value);
   };
   const handleSubmitChat = async (e: React.FormEvent) => {
      e.preventDefault();
      const data = {
         roomChatId: messagesInARoom?.body?.data.roomChatId._id,
         content: message,
         sender: 'admin'
      };
      await sendMessage(data);
      const jsonData = JSON.stringify(data);
      adminSocket.emit('AdminSendMessage', jsonData);
      setMesssage('');
   };
   return (
      <>
         <section className='list-Chat bg-white flex w-full items-start'>
            <audio ref={audioPlayer} src={NotificationSound} />
            <div className='left overflow-scroll max-h-[580px] min-h-[580px] pt-[10~px] border-[#E5E5E5] border-[1px] px-[5px] w-[30%] sm:w-[50%] relative'>
               {data?.body.data.map((item: any) => {
                  if (item.roomChatId?.role == 'member') {
                     return (
                        <>
                           <button
                              onClick={async () => {
                                 setRoom(item.roomChatId._id);
                              }}
                              style={{
                                 backgroundColor: room == item.roomChatId._id ? '#F5F5F5' : ''
                              }}
                              className='chat flex gap-x-[10px] p-[10px] w-[100%] rounded-[10px]'
                           >
                              <img className='w-[48px] h-[48px] rounded-[100%]' src={item.roomChatId.avatar} alt='' />
                              <div className='userName flex flex-col justify-start items-start flex-1'>
                                 <strong className='text-black'>{item.roomChatId.userName}</strong>
                                {item.messages.length> 0&&  <p className='message flex justify-between  w-[100%]'>
                                    <div
                                       className='flex-1 text-left'
                                       style={{
                                          WebkitLineClamp: '1',
                                          wordBreak: 'break-word',
                                          overflowWrap: 'break-word',
                                          textOverflow: 'ellipsis',
                                          overflow: 'hidden',
                                          display: '-webkit-box',
                                          WebkitBoxOrient: 'vertical'
                                       }}
                                    >
                                       {item.messages[item.messages.length - 1]?.sender == 'admin'
                                          ? 'Bạn:' + item.messages[item.messages.length - 1].content.trim()
                                          :item.roomChatId.userName + ": " + item.messages[item.messages.length - 1]?.content.trim()}
                                    </div>
                                    <div className='flex items-center gap-x-[5px]'>
                                       <Badge
                                          color='red'
                                          count={
                                             item.messages.filter((item: any) => {
                                                if (item.isRead == false && item?.sender == 'client') {
                                                   return item;
                                                }
                                             }).length
                                          }
                                          showZero={false}
                                          offset={[-15, 0]}
                                       >
                                          <></>
                                       </Badge>
                                       {formatStringToDate(item.messages[item.messages.length - 1]?.day)}
                                    </div>
                                 </p>}
                              </div>
                           </button>
                        </>
                     );
                  }
               })}
            </div>
            
            {messagesInARoom && (
               <div className='right w-[70%] max-h-[600px] relative  overflow-scroll'>
                  <div className='header-right sticky top-[0] pl-[10px] flex items-center gap-x-[10px] shadow-[0_0_4px_rgba(0,0,0,0.2)] py-[5px]'>
                     <img
                        className='avatar w-[48px] h-[48px] rounded-[100%]'
                        src={messagesInARoom?.body?.data.roomChatId.avatar}
                        alt=''
                     />
                     <span className='user-name text-black font-bold '>
                        {messagesInARoom?.body?.data.roomChatId.userName}
                     </span>
                  </div>
                  <div className='content-right px-[10px] pt-[10px]'>
                     <div className='list-chat overflow-scroll h-[480px] '>
                        {messagesInARoom?.body?.data.messages.map((item: any) => {
                           return (
                              <>
                                 {item.sender == 'client' ? (
                                    <div className='use-message flex items-center mb-[6px]'>
                                       <img
                                          className='avatar w-[38px] h-[38px] rounded-[100%]'
                                          src={messagesInARoom?.body?.data.roomChatId.avatar}
                                          alt=''
                                       />
                                       <div className='content-user ml-[10px] bg-[#E5E5E5] max-w-[60%] rounded-[15px] px-[12px] py-[8px] text-center'>
                                          <span className='user-name text-black  font-[400] text-left  block break-words'>
                                             {item.content.trim()}
                                          </span>
                                       </div>
                                    </div>
                                 ) : (
                                    <div className='admin-message flex justify-end items-center mb-[6px]  '>
                                       <div className='content-admin ml-[10px] bg-[#0A7CFF] max-w-[60%] rounded-[15px] px-[12px] py-[8px] text-center'>
                                          <span className='admin-name text-white  font-[400] text-left block break-words'>
                                             {item.content.trim()}
                                          </span>
                                       </div>
                                    </div>
                                 )}
                              </>
                           );
                        })}
                        <div ref={scrollRef!}></div>
                     </div>
                  </div>
                  <div className='h-[20px]'></div>
                  <div className='right-footer absolute w-[100%] px-[5px]  bottom-[0px]  bg-white'>
                     <form action='' className='flex w-full' onSubmit={handleSubmitChat}>
                        <input
                           onChange={handleChangeMessage}
                           value={message}
                           placeholder='Aa'
                           className=' pl-[15px] outline-none bg-[#E5E5E5] w-[95%] h-[36px] rounded-[20px]'
                           type='text'
                        />
                        <div className='p-[8px]  hover:bg-[E5E5E5] w-[5%] rounded-[50%] justify-center flex items-center'>
                           <button className='text-[#0A7CFF] ml-[3px]'>
                              <IoSend className='text-[20px]'></IoSend>
                           </button>
                        </div>
                     </form>
                  </div>
               </div>
            )}
         </section>
      </>
   );
};
export default ChatAdmin;
