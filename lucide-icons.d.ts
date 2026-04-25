// Type declarations for individual lucide-react icon paths
declare module 'lucide-react/dist/esm/icons/*' {
  import { FC, SVGProps } from 'react'
  const icon: FC<SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number; absoluteStrokeWidth?: boolean }>
  export default icon
}
