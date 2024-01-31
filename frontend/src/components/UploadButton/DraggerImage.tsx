import { InboxOutlined } from '@ant-design/icons';
import { message } from 'antd';
import Upload, { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { useState } from 'react';

type Props = {
   multiple: boolean;
   maxCount: number;
   name: string;
   onDataChange: (files: File[]) => void;
};

const DraggerImage = ({ maxCount, multiple, onDataChange, name }: Props) => {
   const [fileList, setFileList] = useState<UploadFile[]>([]);

   const handleFileChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
      setFileList(info.fileList);
      onDataChange([...info.fileList.map((file) => file.originFileObj)] as File[]);
    };
    const handleRemoveFile = (fileRes: UploadFile) => {
       setFileList((prev) => prev.filter((file) => file.uid !== fileRes.uid));
       onDataChange(fileList.filter((file) => file.uid !== fileRes.uid).map((file) => file.originFileObj) as File[]);
    };
   const handleBeforeUpload = (file: RcFile) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
         message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
         message.error('Kích thước hình ảnh không được vượt quá 10MB!');
      }

      return isJpgOrPng && isLt10M;
   };

   return (
      <Upload.Dragger
         customRequest={({ onSuccess }) => {setTimeout(() => onSuccess!('ok'), 500)}}
         name={name}
         fileList={fileList}
         onChange={handleFileChange}
         multiple={multiple}
         onRemove={(file) => handleRemoveFile(file)}
         beforeUpload={handleBeforeUpload}
         showUploadList={true}
         maxCount={maxCount}
         listType="picture-card"
      >
         <p className='ant-upload-drag-icon'>
            <InboxOutlined />
         </p>
         <p className='ant-upload-text'>Click or drag file to this area to upload</p>
         <p className='ant-upload-hint'>
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
         </p>
      </Upload.Dragger>
   );
};

export default DraggerImage;
