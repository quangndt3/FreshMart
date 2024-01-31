/** @type {import('tailwindcss').Config} 

 * */ export default {
   content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
   // important: true,
   theme: {
      extend: {
         colors: {
            greenPrimary: '#80b235',
            greenbbf7d0: '#bbf7d0',
            gray300: '#d1d5db',
            greenP800: '#093e1b',
            greenP500: '#6ada92',
            greenP300: '#d8fae4',
            redP300: '#f7b5b3',
            redP500: '#ea3933',
            greenDashboard: '#6a8d92'
         }
      },
      screens: {
         sm: '479px',
         'max-sm': { max: '479px' },
         md: '767px',
         'max-md': { max: '767px' },
         lg: '991px',
         'max-lg': { max: '991px' },
         xl: '1199px',
         'max-xl': { max: '1199px' },
         '2xl': '1399px',
         'max-2xl': { max: '1399px' },
         '3xl': '1499px',
         'max-3xl': { max: '1499px' }
      },
      fontFamily: {
         Quicksand: ['Quicksand', 'Arial']
      },
      keyframes: {
         pulse_icon_contact: {
            '0%': { transform: 'scaleX(1)' },
            '50%': { transform: 'scale3d(1.05,1.05,1.05)' },
            '100%': { transform: 'transform: scaleX(1)' }
         },
         skew_icon_contact: {
            '0%': { transform: 'rotate(0deg)' },
            '10%': { transform: 'rotate(-25deg)' },
            '20%': { transform: 'rotate(25deg)' },
            '30%': { transform: 'rotate(-25deg)' },
            '40%': { transform: 'rotate(25deg)' },
            '50%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(0deg)' }
         },
         euiBeaconPulseSmall: {
            '0%': { transform: 'scale(0)', opacity: '1' },
            '50%': { opacity: '0.6' },
            '100%': { transform: 'scale(1.4)', opacity: '0' }
         }
      },
      animation: {
         pulse_icon_contact: 'pulse_icon_contact 2s infinite',
         skew_icon_contact: 'skew_icon_contact 1s infinite ease-out',
         euiBeaconPulseSmall: 'euiBeaconPulseSmall 2s infinite ease-out 0.4s',
         euiBeaconPulseSmall2: 'euiBeaconPulseSmall 2s infinite ease-out'
      },
      transitionDelay: {
         4000: '4000ms'
      }
   },
   plugins: []
};
