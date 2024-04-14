import { Divider } from '@mui/material';

function SlantingDivider() {
  return (
    <div style={{ position: 'relative' }}>
      <Divider variant="inset" style={{ transform: 'skewX(-45deg)' }} />
      <div style={{ width: '100%', height: '1px', backgroundColor: 'white', position: 'absolute', top: '50%', transform: 'translateY(-50%)' }} />
    </div>
  );
}

export default SlantingDivider;