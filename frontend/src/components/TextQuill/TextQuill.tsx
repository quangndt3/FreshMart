import { LegacyRef, useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
type Props = {
   getValue: (value: string) => void;
   defaultValue?: string;
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

const formats = [
   'header',
   'bold',
   'italic',
   'underline',
   'strike',
   'blockquote',
   'list',
   'bullet',
   'indent',
   'link',
   'image'
];

const TextQuill = ({ getValue, defaultValue }: Props) => {
   const [value, setValue] = useState<string>('');
   const handleGetValue = (value: string) => {
      getValue(value);
      setValue(value);
   };
   useEffect(() => {
      if (defaultValue !== undefined) {
         setValue(defaultValue);
      }
   }, [defaultValue]);
   const quillRef = useRef() as LegacyRef<ReactQuill>;
   const modules = useMemo(
      () => ({
         toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
            ['link'],
            ['clean']
         ]
      }),
      []
   );
   return (
      <ReactQuill
         theme='snow'
         formats={formats}
         modules={modules}
         value={value}
         onChange={(value) => handleGetValue(value)}
         ref={quillRef}
      />
   );
};

export default TextQuill;
