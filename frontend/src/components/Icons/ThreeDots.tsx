import Icon from '@ant-design/icons';
import { CustomIconComponentProps } from '@ant-design/icons/lib/components/Icon';

const svg = () => (
   <svg xmlns='http://www.w3.org/2000/svg' width='1.5em' height='1.5em' viewBox='0 0 24 24' fill='currentColor'>
      <circle cx='18' cy='12' r='1.5' transform='rotate(90 18 12)' fill='#080341' />
      <circle cx='12' cy='12' r='1.5' transform='rotate(90 12 12)' fill='#080341' />
      <circle cx='6' cy='12' r='1.5' transform='rotate(90 6 12)' fill='#080341' />
   </svg>
);

const ThreeDotsIcon = (props: Partial<CustomIconComponentProps>) => <Icon component={svg} {...props} />;

export default ThreeDotsIcon;
