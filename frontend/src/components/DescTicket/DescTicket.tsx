type Props = {
   type: 'error' | 'warning' | 'success';
   label: string;
};

const DescTicket = ({ type, label }: Props) => {
   return (
      <div
         className={`min-w-[100px] max-w-[120px]  rounded-xl p-2 text-center mt-[20px] ${type === 'error' && 'text-red-600 bg-red-100'} ${
            type === 'warning' && 'text-orange-600 bg-orange-100'
         } ${type === 'success' && 'text-green-600 bg-green-100'}`}
      >
         {label}
      </div>
   );
};

export default DescTicket;
