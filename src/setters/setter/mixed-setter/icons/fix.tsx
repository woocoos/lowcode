import { SVGIcon, IconProps } from '@alilc/lowcode-utils';

export function IconFix(props: IconProps) {
  return (
    <SVGIcon viewBox="0 0 1024 1024" {...props}>
      <path d="M750.848 28.928l245.248 242.944a66.048 66.048 0 1 1-93.184 93.184l-25.6-19.456-249.6 353.792 78.336 78.336a66.048 66.048 0 0 1-93.184 92.672l-460.8-464.64a66.048 66.048 0 0 1 93.184-93.184l76.8 78.336 354.048-249.856-18.176-18.944a66.048 66.048 0 1 1 93.184-93.184zM380.672 732.416l-91.904-90.88c-74.24 89.6-191.488 219.904-212.736 247.04a419.84 419.84 0 0 0-70.656 128 419.84 419.84 0 0 0 128-70.144c27.136-21.248 157.44-138.496 246.528-214.016z" />
    </SVGIcon>
  );
}

IconFix.displayName = 'Fix';
