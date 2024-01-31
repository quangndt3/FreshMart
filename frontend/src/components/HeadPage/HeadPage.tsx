import { PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
type Props = {
   title: string;
   linkButton: string;
   titleButton: string;
};

function HeadPage({ title, titleButton, linkButton }: Props) {
   return (
      <div className='flex justify-between items-center w-[100%]'>
         <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>{title}</h1>
         <Link to={linkButton}>
            <button className='bg-greenPrimary duration-100 hover:bg-greenPri600 text-white text-lg p-2 font-semibold rounded-lg flex justify-start items-center gap-2'>
               <PlusCircleOutlined style={{ color: 'white' }} />
               {titleButton}
            </button>
         </Link>
      </div>
   );
}

export default HeadPage;
