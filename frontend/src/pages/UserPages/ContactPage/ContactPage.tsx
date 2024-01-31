import { ClockCircleOutlined, EnvironmentOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';
import TextArea from 'antd/es/input/TextArea';

const ContactPage = () => {
   return (
      <>
         <div className='main'>
            <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                  <span>
                     <Link to='/'>Trang chủ </Link> / Liên hệ
                  </span>
               </div>
            </section>
            <section className=' lg:py-[100px] md:py-[80px] max-md:py-[60px]'>
               <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] '>
                  <div className=''>
                     <div className='contact-main flex gap-7 flex-wrap  lg:flex-nowrap'>
                        <div className='contact   bg-cover w-[50%] max-lg:w-full'>
                           <div
                              style={{ borderRadius: `5px`, padding: `15px` }}
                              className='infor-contact bg-lime-200 mb-5 '
                           >
                              <Title className=' text-start' level={2}>
                                 Cửa hàng Fresh mart
                              </Title>
                              <ul style={{ padding: `10px` }} className='flex text-4xl flex-wrap gap-1 w-[100%]  '>
                                 <li className='w-[100%] gap-3 flex items-center  '>
                                    <div>
                                       <EnvironmentOutlined />
                                    </div>
                                    <div className='text-sm'>
                                       <Title level={5}>Địa chỉ</Title>
                                       <p>
                                          Lô A2, CN5, Cụm Công nghiệp Từ Liêm, Phường Phương Canh, Quận Nam Từ Liêm,
                                          TP.Hà Nội.
                                       </p>
                                    </div>
                                 </li>

                                 <li className='w-[100%] gap-3 flex items-center'>
                                    <div>
                                       <PhoneOutlined />
                                    </div>
                                    <div className='text-sm'>
                                       <Title level={5}>Số điện thoại</Title>

                                       <p>0888 888 888</p>
                                    </div>
                                 </li>

                                 <li className='w-[100%] gap-3 flex items-center'>
                                    <div>
                                       <MailOutlined />
                                    </div>
                                    <div className='text-sm'>
                                       <Title level={4}>Email</Title>
                                       <p>freshmart@gmail.com</p>
                                    </div>
                                 </li>

                                 <li className='w-[100%] gap-3 flex items-center'>
                                    <div>
                                       <ClockCircleOutlined />
                                    </div>
                                    <div className='text-sm'>
                                       <Title level={5}>Giờ làm việc</Title>
                                       <p>8h - 22h</p>
                                       <p>Từ thứ 2 đến chủ nhật</p>
                                    </div>
                                 </li>
                              </ul>
                           </div>

                           <div
                              style={{ borderRadius: `5px`, padding: `15px` }}
                              className='form-contact  bg-lime-200 mt-5'
                           >
                              <Title className='text-start' level={2}>
                                 Gửi yêu cầu của bạn
                              </Title>
                              <h2>
                                 Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng tôi sẽ liên lạc lại
                                 với bạn sớm nhất có thể .
                              </h2>
                              <Form className='mt-5'>
                                 <Form.Item
                                    name='name'
                                    rules={[{ required: true, message: 'Vui lòng điền họ và tên!' }]}
                                 >
                                    <Input placeholder='Họ và tên' />
                                 </Form.Item>
                                 <Form.Item name='email' rules={[{ required: true, message: 'Vui lòng nhập email!' }]}>
                                    <Input type='email' placeholder='Email' />
                                 </Form.Item>
                                 <Form.Item
                                    name='phone'
                                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                                 >
                                    <Input type='number' placeholder='Số điện thoại' />
                                 </Form.Item>
                                 <Form.Item>
                                    <TextArea placeholder='Nội dung'></TextArea>
                                 </Form.Item>
                                 <Button className='bg-lime-600 text-white'>Gửi thông tin</Button>
                              </Form>
                           </div>
                        </div>
                        <div className='address-contact w-[60%]  max-lg:w-full'>
                           <iframe
                              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.58759984635!2d105.73858977517705!3d21.049180980605303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313454f6b55a43cd%3A0xdeb662d7e24fb561!2zS2h1IEPDtG5nIG5naGnhu4dwIFbhu6thICYgTmjhu48gVOG7qyBMacOqbQ!5e0!3m2!1svi!2s!4v1700899966652!5m2!1svi!2s'
                              width='100%'
                              height='500'
                              loading='lazy'
                           ></iframe>
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};

export default ContactPage;
