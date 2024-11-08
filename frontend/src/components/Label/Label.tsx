import style from './Label.module.css';
type Props = {
   required?: boolean;
   content: string;
};

const Label = ({ required, content }: Props) => {
   return (
      <div className={` mb-2 ${required ? style.required : ''}`}>
         <span className='text-lg'>{content}</span>
      </div>
   );
};

export default Label;
