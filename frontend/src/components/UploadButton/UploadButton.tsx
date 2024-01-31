import { UploadOutlined } from '@ant-design/icons';
import { message, Button, Upload } from 'antd';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { UploadListType } from 'antd/es/upload/interface';
import { useState, useEffect } from 'react';

type Props = {
   multiple: boolean;
   maxCount: number;
   listStyle: UploadListType;
   getListFiles: (files: File[], public_id?: string) => void;
   defaultFiles?: UploadFile[];
};

const UploadButton = ({ maxCount, multiple, listStyle, getListFiles, defaultFiles }: Props) => {
   const [fileList, setFileList] = useState<UploadFile[]>([]);
   const beforeUpload = (file: RcFile) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
         message.error('You can only upload JPG/PNG file!');
      }
      return !isJpgOrPng;
   };
   const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
      if (info.file.percent === 0) {
         return;
      }
      setFileList(info.fileList);
      getListFiles([...info.fileList.map((file) => file.originFileObj)] as File[]);
   };
   const handleRemoveFile = (fileRes: UploadFile) => {
      setFileList((prev) => prev.filter((file) => file.uid !== fileRes.uid));
      getListFiles(
         fileList.filter((file) => file.uid !== fileRes.uid).map((file) => file.originFileObj) as File[],
         fileRes.uid
      );
   };
   useEffect(() => {
      if (!defaultFiles) return;
      setFileList(defaultFiles);
   }, [defaultFiles]);
   const buttonUpload = (
      <Button
         icon={<UploadOutlined className='!text-[2rem]' />}
         className='!bg-greenPri200 hover:!border-[#80b235] !text-greenPri600 flex justify-center items-center !w-[10rem] !h-[100%]'
      ></Button>
   );
   return (
      <Upload
         onRemove={(file) => handleRemoveFile(file)}
         onChange={handleChange}
         listType={listStyle}
         maxCount={maxCount}
         multiple={multiple}
         fileList={fileList}
         beforeUpload={beforeUpload}
      >
         {fileList.length >= maxCount ? null : buttonUpload}
      </Upload>
   );
};

export default UploadButton;
