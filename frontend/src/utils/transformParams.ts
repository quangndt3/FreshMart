// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const paramTransformer = (raw:any) => {
   if (typeof raw === 'object' && !Array.isArray(raw)) {
      const rawConverted = { ...raw };
      for (const key in raw) {
         const keyConverted = `_${key}`;
         if (keyConverted && rawConverted) {
            rawConverted[keyConverted] = rawConverted[key];
            rawConverted[key] = undefined;
         }
      }
      return rawConverted;
   }

   return raw;
};
